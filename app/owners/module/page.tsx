"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import OwnerShell, { SignInPrompt, useAcademyData } from "@/components/OwnerShell";
import { supabase } from "@/lib/supabaseClient";
import { moduleBySlug, MODULES, PASS_PERCENT } from "@/lib/academyContent";
import { currentPass, fmtDate, issueCertificate, pingAdminAlerts } from "@/lib/academy";

type Result = { attempt_id: string; score: number; total: number; passed: boolean; correct: boolean[] };

function ModuleInner() {
  const slug = useSearchParams().get("m");
  const mod = moduleBySlug(slug);
  const { userId, profile, attempts, docs, reload, ready } = useAcademyData();
  const [page, setPage] = useState(0); // 0..lessons.length-1 = lessons, lessons.length = quiz
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [da, setDa] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [cert, setCert] = useState<{ url: string; name: string } | null>(null);
  const [certErr, setCertErr] = useState<string | null>(null);

  useEffect(() => {
    setPage(0);
    setResult(null);
    setCert(null);
    setAnswers(mod ? mod.quiz.map(() => null) : []);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prefill the Driver Authorisation number from an uploaded DA, if there is one.
  useEffect(() => {
    const d = docs.find((x) => x.doc_type === "driver_authorisation" && x.doc_number);
    if (d?.doc_number && !da) setDa(d.doc_number);
  }, [docs]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mod) {
    return (
      <div className="bg-white border border-line rounded-2xl p-6">
        <p className="mb-3">We couldn&apos;t find that module.</p>
        <Link href="/owners/training" className="underline font-semibold">Back to training</Link>
      </div>
    );
  }

  const quizPage = mod.lessons.length;
  const pass = currentPass(attempts, mod.slug);
  const idx = MODULES.findIndex((m) => m.slug === mod.slug);
  const nextMod = MODULES[idx + 1];

  async function submit() {
    if (!mod) return;
    if (answers.some((a) => a === null)) return setErr("Answer every question before submitting.");
    setBusy(true);
    setErr(null);
    setCertErr(null);
    const { data, error } = await supabase.rpc("submit_training", {
      p_module: mod.slug,
      p_version: mod.version,
      p_answers: answers,
      p_da_number: da.trim() || null,
    });
    if (error) {
      setBusy(false);
      return setErr(error.message);
    }
    const r = data as Result;
    setResult(r);
    if (r.passed && userId) {
      try {
        const c = await issueCertificate({
          userId,
          attemptId: r.attempt_id,
          name: profile?.name || "",
          module: mod,
          score: r.score,
          total: r.total,
          daNumber: da.trim(),
        });
        setCert({ url: URL.createObjectURL(c.blob), name: c.fileName });
      } catch (e) {
        setCertErr(e instanceof Error ? e.message : "Couldn't save the certificate.");
      }
      pingAdminAlerts();
    }
    setBusy(false);
    reload();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function retry() {
    setResult(null);
    setAnswers(mod!.quiz.map(() => null));
  }

  return (
    <div className="grid lg:grid-cols-[260px_1fr] bg-white border border-line rounded-2xl overflow-hidden">
      <aside className="bg-[#faf7ef] p-5 border-b lg:border-b-0 lg:border-r border-line">
        <Link href="/owners/training" className="text-[12px] text-muted underline">← All training</Link>
        <div className="font-serif font-extrabold text-[15px] mt-3">
          {mod.num}. {mod.title}
        </div>
        <div className="text-[12px] text-muted mt-1">
          {mod.required === "TMR" ? "Required by TMR" : "Fleet Formal standard"} · {mod.minutes} min · version {mod.version}
        </div>
        {pass && (
          <div className="mt-3 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold bg-[#e7f4ec] text-[#2e8b57]">
            ✓ Passed {pass.score}/{pass.total} on {fmtDate(pass.created_at)}
          </div>
        )}
        <ol className="mt-4 text-[13px] grid gap-1">
          {[...mod.lessons.map((l) => l.title), `Quiz (${mod.quiz.length} questions)`].map((t, i) => (
            <li key={t}>
              <button
                onClick={() => setPage(i)}
                className={`w-full text-left px-2.5 py-2 rounded-lg flex gap-2 items-center ${page === i ? "bg-white font-semibold shadow-[0_1px_0_var(--line)]" : ""}`}
              >
                <span className={`w-[18px] h-[18px] shrink-0 rounded-full border-2 ${i < page || (i === quizPage && pass) ? "bg-[#2e8b57] border-[#2e8b57]" : "border-[#cfc8b2]"}`} />
                {t}
              </button>
            </li>
          ))}
        </ol>
      </aside>

      <section className="p-6 md:p-8 min-w-0">
        {page < quizPage ? (
          <>
            <div className="eyebrow !text-gold-dark !text-[11px]">
              Lesson {page + 1} of {mod.lessons.length}
            </div>
            <h2 className="font-display text-[24px] md:text-[28px] mt-1.5 mb-3">{mod.lessons[page].title}</h2>
            <div className="grid gap-3 text-[14.5px] leading-relaxed text-[#3a3f47] max-w-[720px]">
              {mod.lessons[page].body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {mod.lessons[page].list && (
                <div className="bg-[#faf7ef] border border-line rounded-xl p-4">
                  {mod.lessons[page].list_title && (
                    <div className="font-serif font-extrabold text-[12px] uppercase tracking-[0.1em] text-gold-dark mb-2">
                      {mod.lessons[page].list_title}
                    </div>
                  )}
                  <ul className="list-disc pl-5 grid gap-1.5">
                    {mod.lessons[page].list!.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2.5 rounded-lg border border-line font-semibold text-[12.5px] disabled:opacity-40"
              >
                ← Back
              </button>
              <button onClick={() => setPage(page + 1)} className="btn-gold !py-2.5 !px-4 !text-[12px]">
                {page + 1 === quizPage ? "Take the quiz" : "Next lesson"} →
              </button>
            </div>
          </>
        ) : !userId ? (
          ready && <SignInPrompt what="take the quiz and get your certificate" />
        ) : result ? (
          <div>
            <div className={`rounded-2xl p-6 ${result.passed ? "bg-[#e7f4ec]" : "bg-amber-bg"}`}>
              <div className="font-display text-[26px]">{result.passed ? "You passed!" : "Not quite yet"}</div>
              <p className="mt-1 text-[14.5px]">
                You scored <b>{result.score}/{result.total}</b>. {result.passed ? "Your certificate has been saved to your documents and Fleet Formal has been notified." : `You need ${PASS_PERCENT}% to pass. Review the lessons and try again.`}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {result.passed ? (
                  <>
                    {cert && (
                      <a href={cert.url} download={cert.name} className="btn-gold !py-2.5 !px-4 !text-[12px]">
                        ⤓ Download certificate
                      </a>
                    )}
                    {nextMod ? (
                      <Link href={`/owners/module?m=${nextMod.slug}`} className="px-4 py-2.5 rounded-lg border border-line bg-white font-semibold text-[12.5px]">
                        Next: Training {nextMod.num} →
                      </Link>
                    ) : (
                      <Link href="/owners/requirements" className="px-4 py-2.5 rounded-lg border border-line bg-white font-semibold text-[12.5px]">
                        Upload your documents →
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <button onClick={() => setPage(0)} className="px-4 py-2.5 rounded-lg border border-line bg-white font-semibold text-[12.5px]">
                      Review lessons
                    </button>
                    <button onClick={retry} className="btn-gold !py-2.5 !px-4 !text-[12px]">
                      Try again
                    </button>
                  </>
                )}
              </div>
              {certErr && <p className="text-red-600 text-[13px] mt-3">Your pass is recorded, but the certificate didn&apos;t save: {certErr}</p>}
            </div>
            <ol className="mt-6 grid gap-2 text-[13.5px]">
              {mod.quiz.map((q, i) => (
                <li key={i} className="flex gap-2">
                  <span className={result.correct[i] ? "text-[#2e8b57]" : "text-red-600"}>{result.correct[i] ? "✓" : "✕"}</span>
                  <span>{q.q}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div>
            <div className="eyebrow !text-gold-dark !text-[11px]">Quiz · pass mark {PASS_PERCENT}%</div>
            <h2 className="font-display text-[24px] md:text-[28px] mt-1.5 mb-5">{mod.title}</h2>
            <div className="grid gap-4">
              {mod.quiz.map((q, qi) => (
                <fieldset key={qi} className="border border-line rounded-xl p-4">
                  <legend className="px-1 font-semibold text-[14px]">
                    {qi + 1}. {q.q}
                  </legend>
                  <div className="grid gap-2 mt-1">
                    {q.options.map((o, oi) => (
                      <label
                        key={oi}
                        className={`flex gap-3 items-start border-[1.5px] rounded-lg px-3.5 py-2.5 cursor-pointer text-[13.5px] ${answers[qi] === oi ? "border-gold bg-[#fffaf0]" : "border-line"}`}
                      >
                        <input
                          type="radio"
                          name={`q${qi}`}
                          checked={answers[qi] === oi}
                          onChange={() => setAnswers((a) => a.map((x, j) => (j === qi ? oi : x)))}
                          className="mt-1 accent-[var(--gold)]"
                        />
                        {o}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            <label className="block mt-5 text-[13px] font-semibold max-w-[360px]">
              Your Driver Authorisation number <span className="font-normal text-muted">(for your training record, if you have it)</span>
              <input value={da} onChange={(e) => setDa(e.target.value)} className="w-full mt-1 border border-line rounded-lg px-3 py-2 font-normal" />
            </label>
            {err && <p className="text-red-600 text-[13px] mt-3">{err}</p>}
            <button onClick={submit} disabled={busy} className="btn-gold !py-3 !px-5 !text-[13px] mt-5">
              {busy ? "Marking…" : "Submit answers"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function ModulePage() {
  return (
    <OwnerShell>
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <ModuleInner />
      </Suspense>
    </OwnerShell>
  );
}
