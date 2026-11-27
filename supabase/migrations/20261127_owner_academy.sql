-- Fleet Formal Owner Academy (Nov 2026)
-- Training records, driver documents, admin alerts and the (switchable) booking lock.

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- Answer keys: graded server-side, never readable by drivers.
create table if not exists public.training_keys (
  module_slug  text not null,
  version      int  not null,
  title        text not null,
  answer_key   int[] not null,
  pass_percent int  not null default 80,
  created_at   timestamptz not null default now(),
  primary key (module_slug, version)
);
alter table public.training_keys enable row level security;
revoke all on public.training_keys from anon, authenticated;

-- Every quiz attempt (the TMR training record: date, version, answers, score, DA number).
create table if not exists public.training_attempts (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  module_slug    text not null,
  module_version int  not null,
  score          int  not null,
  total          int  not null,
  passed         boolean not null,
  answers        int[] not null default '{}',
  da_number      text,
  created_at     timestamptz not null default now()
);
create index if not exists training_attempts_user_idx on public.training_attempts (user_id, module_slug);
alter table public.training_attempts enable row level security;
revoke all on public.training_attempts from anon, authenticated;
grant select on public.training_attempts to authenticated;
drop policy if exists "attempts: own or admin" on public.training_attempts;
create policy "attempts: own or admin" on public.training_attempts for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- Uploaded proof (blue card, DA, BHSL...) and auto-issued certificates.
create table if not exists public.driver_documents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  doc_type    text not null,
  file_path   text,
  file_name   text,
  doc_number  text,
  expiry_date date,
  status      text not null default 'pending' check (status in ('pending','verified','rejected')),
  admin_note  text,
  verified_by uuid references auth.users(id),
  verified_at timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists driver_documents_user_idx on public.driver_documents (user_id);
alter table public.driver_documents enable row level security;
revoke all on public.driver_documents from anon, authenticated;
grant select, insert, update, delete on public.driver_documents to authenticated;
drop policy if exists "docs: own or admin read" on public.driver_documents;
create policy "docs: own or admin read" on public.driver_documents for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists "docs: own upload" on public.driver_documents;
create policy "docs: own upload" on public.driver_documents for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending' and verified_by is null and doc_type not like 'certificate:%');
drop policy if exists "docs: admin review" on public.driver_documents;
create policy "docs: admin review" on public.driver_documents for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "docs: own delete pending" on public.driver_documents;
create policy "docs: own delete pending" on public.driver_documents for delete to authenticated
  using (user_id = auth.uid() and status = 'pending');

-- Alerts shown in /admin and emailed by the owner-alert edge function.
create table if not exists public.admin_alerts (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null,
  user_id    uuid references auth.users(id) on delete cascade,
  title      text not null,
  body       text,
  ref_id     uuid,
  read       boolean not null default false,
  emailed_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.admin_alerts enable row level security;
revoke all on public.admin_alerts from anon, authenticated;
grant select, update on public.admin_alerts to authenticated;
drop policy if exists "alerts: admin read" on public.admin_alerts;
create policy "alerts: admin read" on public.admin_alerts for select to authenticated using (public.is_admin());
drop policy if exists "alerts: admin update" on public.admin_alerts;
create policy "alerts: admin update" on public.admin_alerts for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create table if not exists public.academy_settings (
  id                   int primary key default 1 check (id = 1),
  enforce_booking_lock boolean not null default false,
  alert_email          text not null default 'admin@fleetformal.com.au',
  updated_at           timestamptz not null default now()
);
insert into public.academy_settings (id) values (1) on conflict (id) do nothing;
update public.academy_settings set alert_email = 'admin@fleetformal.com.au' where id = 1;
alter table public.academy_settings enable row level security;
revoke all on public.academy_settings from anon, authenticated;
grant select on public.academy_settings to anon, authenticated;
grant update on public.academy_settings to authenticated;
drop policy if exists "settings: read" on public.academy_settings;
create policy "settings: read" on public.academy_settings for select using (true);
drop policy if exists "settings: admin update" on public.academy_settings;
create policy "settings: admin update" on public.academy_settings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Grade a quiz server-side, record the attempt and alert admins on a pass.
create or replace function public.submit_training(p_module text, p_version int, p_answers int[], p_da_number text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  k public.training_keys;
  v_total int; v_score int := 0; i int;
  v_correct boolean[] := '{}';
  v_passed boolean; v_attempt uuid; v_name text;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  select * into k from public.training_keys where module_slug = p_module and version = p_version;
  if not found then raise exception 'unknown_module_version'; end if;
  v_total := coalesce(array_length(k.answer_key, 1), 0);
  for i in 1..v_total loop
    v_correct := v_correct || (p_answers[i] is not distinct from k.answer_key[i]);
    if p_answers[i] is not distinct from k.answer_key[i] then v_score := v_score + 1; end if;
  end loop;
  v_passed := v_total = 0 or v_score * 100 >= k.pass_percent * v_total;
  insert into public.training_attempts (user_id, module_slug, module_version, score, total, passed, answers, da_number)
  values (auth.uid(), p_module, p_version, v_score, v_total, v_passed, coalesce(p_answers, '{}'), nullif(trim(p_da_number), ''))
  returning id into v_attempt;
  if v_passed then
    select coalesce(nullif(name, ''), email) into v_name from public.profiles where id = auth.uid();
    insert into public.admin_alerts (kind, user_id, title, body, ref_id)
    values ('training_passed', auth.uid(),
            coalesce(v_name, 'A driver') || case when v_total = 0 then ' read ' else ' passed ' end || k.title,
            case when v_total = 0 then null else 'Score ' || v_score || '/' || v_total || ' (version ' || p_version || ')' end,
            v_attempt);
  end if;
  return jsonb_build_object('attempt_id', v_attempt, 'score', v_score, 'total', v_total, 'passed', v_passed, 'correct', to_jsonb(v_correct));
end $$;
revoke all on function public.submit_training(text, int, int[], text) from public, anon;
grant execute on function public.submit_training(text, int, int[], text) to authenticated;

-- Save the generated certificate PDF to the driver's documents (valid 3 years).
create or replace function public.attach_certificate(p_attempt uuid, p_file_path text, p_file_name text)
returns uuid language plpgsql security definer set search_path = public as $$
declare a public.training_attempts; d uuid;
begin
  select * into a from public.training_attempts where id = p_attempt and user_id = auth.uid() and passed;
  if not found then raise exception 'attempt_not_found'; end if;
  if p_file_path not like auth.uid()::text || '/%' then raise exception 'bad_path'; end if;
  insert into public.driver_documents (user_id, doc_type, file_path, file_name, expiry_date, status, verified_at, admin_note)
  values (auth.uid(), 'certificate:' || a.module_slug, p_file_path, p_file_name,
          (a.created_at + interval '3 years')::date, 'verified', now(),
          'Issued automatically on passing (version ' || a.module_version || ')')
  returning id into d;
  return d;
end $$;
revoke all on function public.attach_certificate(uuid, text, text) from public, anon;
grant execute on function public.attach_certificate(uuid, text, text) to authenticated;

-- Alert admins whenever a driver uploads a document.
create or replace function public.alert_on_document() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_name text; v_label text;
begin
  if new.doc_type like 'certificate:%' then return new; end if;
  select coalesce(nullif(name, ''), email) into v_name from public.profiles where id = new.user_id;
  v_label := case new.doc_type
    when 'blue_card' then 'a blue card'
    when 'driver_authorisation' then 'a Driver Authorisation'
    when 'coi' then 'a Certificate of Inspection'
    when 'rego_bkhr' then 'Booked Hire rego + CTP Class 26'
    when 'bhsl' then 'a Booked Hire Service Licence'
    when 'insurance' then 'insurance (certificate of currency)'
    when 'abn_gst' then 'ABN + GST registration'
    when 'operator_consent' then 'F5190 operator consent'
    else replace(new.doc_type, '_', ' ') end;
  insert into public.admin_alerts (kind, user_id, title, body, ref_id)
  values ('document_uploaded', new.user_id, coalesce(v_name, 'A driver') || ' uploaded ' || v_label, 'Ready to verify in Admin > Owner Academy', new.id);
  return new;
end $$;
drop trigger if exists driver_documents_alert on public.driver_documents;
create trigger driver_documents_alert after insert on public.driver_documents
  for each row execute function public.alert_on_document();

-- Compliance: 12 steps. Training counts if passed on the current version within 3 years.
create or replace function public._academy_status(p_user uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  docs text[] := array['blue_card','driver_authorisation','coi','rego_bkhr','bhsl','insurance','abn_gst'];
  mods text[] := array['start-here','anti-discrimination','disability-awareness','respect-privacy','child-safety'];
  done text[] := '{}'; missing text[] := '{}'; s text;
begin
  foreach s in array mods loop
    if exists (
      select 1 from public.training_attempts t
      where t.user_id = p_user and t.module_slug = s and t.passed
        and t.module_version = (select max(version) from public.training_keys where module_slug = s)
        and (s = 'start-here' or t.created_at > now() - interval '3 years')
    ) then done := done || s; else missing := missing || s; end if;
  end loop;
  foreach s in array docs loop
    if exists (
      select 1 from public.driver_documents d
      where d.user_id = p_user and d.doc_type = s and d.status = 'verified'
        and (d.expiry_date is null or d.expiry_date >= current_date)
    ) then done := done || s; else missing := missing || s; end if;
  end loop;
  return jsonb_build_object('done', to_jsonb(done), 'missing', to_jsonb(missing),
    'steps_done', coalesce(array_length(done, 1), 0), 'steps_total', 12,
    'bookable', coalesce(array_length(missing, 1), 0) = 0);
end $$;
revoke all on function public._academy_status(uuid) from public, anon, authenticated;

create or replace function public.academy_status(p_user uuid default null) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare u uuid := coalesce(p_user, auth.uid());
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  if u <> auth.uid() and not public.is_admin() then raise exception 'not_admin'; end if;
  return public._academy_status(u);
end $$;
revoke all on function public.academy_status(uuid) from public, anon;
grant execute on function public.academy_status(uuid) to authenticated;

-- Admin compliance table.
create or replace function public.academy_admin_overview()
returns table (user_id uuid, name text, email text, car text, steps_done int, bookable boolean, pending_docs int, expiring_soon int, last_activity timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  return query
  with people as (
    select pr0.id as uid from public.profiles pr0 where pr0.role = 'driver' and not coalesce(pr0.is_demo, false)
    union select t.user_id from public.training_attempts t
    union select d.user_id from public.driver_documents d
  )
  select p.uid, pr.name, coalesce(pr.email, au.email::text),
         (select c.car from public.car_submissions c where c.driver_id = p.uid order by c.created_at desc limit 1),
         (public._academy_status(p.uid)->>'steps_done')::int,
         (public._academy_status(p.uid)->>'bookable')::boolean,
         (select count(*)::int from public.driver_documents d where d.user_id = p.uid and d.status = 'pending'),
         (select count(*)::int from public.driver_documents d where d.user_id = p.uid and d.status = 'verified'
            and d.expiry_date between current_date and current_date + 30),
         greatest((select max(t.created_at) from public.training_attempts t where t.user_id = p.uid),
                  (select max(d.created_at) from public.driver_documents d where d.user_id = p.uid))
  from people p
  left join public.profiles pr on pr.id = p.uid
  left join auth.users au on au.id = p.uid
  order by 9 desc nulls last, 2;
end $$;
revoke all on function public.academy_admin_overview() from public, anon;
grant execute on function public.academy_admin_overview() to authenticated;

-- Booking lock: when switched on in Admin, a car can only be invited or enquired about
-- if its owner has finished all 12 Owner Academy steps. Off by default.
create or replace function public.enforce_booking_lock() returns trigger
language plpgsql security definer set search_path = public as $$
declare drv uuid;
begin
  if not coalesce((select enforce_booking_lock from public.academy_settings where id = 1), false) then
    return new;
  end if;
  select driver_id into drv from public.car_submissions where id = new.car_id;
  if drv is null or not (public._academy_status(drv)->>'bookable')::boolean then
    raise exception 'This car isn''t bookable yet: its owner hasn''t finished the Fleet Formal Owner Academy.';
  end if;
  return new;
end $$;
drop trigger if exists booking_lock_events on public.event_car_status;
create trigger booking_lock_events before insert on public.event_car_status
  for each row execute function public.enforce_booking_lock();
drop trigger if exists booking_lock_inquiries on public.private_inquiries;
create trigger booking_lock_inquiries before insert on public.private_inquiries
  for each row execute function public.enforce_booking_lock();

-- Private storage for driver documents: drivers use their own folder, admins can read all.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('driver-docs', 'driver-docs', false, 10485760,
        array['application/pdf','image/jpeg','image/png','image/webp','image/heic'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists "driver-docs: own upload" on storage.objects;
create policy "driver-docs: own upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'driver-docs' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "driver-docs: own or admin read" on storage.objects;
create policy "driver-docs: own or admin read" on storage.objects for select to authenticated
  using (bucket_id = 'driver-docs' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
drop policy if exists "driver-docs: own delete" on storage.objects;
create policy "driver-docs: own delete" on storage.objects for delete to authenticated
  using (bucket_id = 'driver-docs' and (storage.foldername(name))[1] = auth.uid()::text);
insert into public.training_keys (module_slug, version, title, answer_key, pass_percent) values
  ('start-here',1,'the Start here guide','{}',0),
  ('anti-discrimination',1,'Training 1: Anti-discrimination & sexual harassment','{1,2,0,1,2,2,1,1,0,1}',80),
  ('disability-awareness',1,'Training 2: Disability awareness','{2,1,2,1,1,2,0,0}',80),
  ('respect-privacy',1,'Training 3: Respect & privacy on every ride','{2,0,1,2,0,1,1,0}',80),
  ('child-safety',1,'Training 4: Child safety on formal night','{1,2,0,1,2,0,1,2}',80)
on conflict (module_slug, version) do update set title = excluded.title, answer_key = excluded.answer_key, pass_percent = excluded.pass_percent;
