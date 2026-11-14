import { IconBadge } from "@/components/BrandIcon";
import type { IconName } from "@/components/BrandIcon";

const usps: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "id",
    title: "Every driver is fully checked",
    body: "Blue Card, driver's licence, and insurance are verified before anyone can list a car — no exceptions, no shortcuts.",
  },
  {
    icon: "handshake",
    title: "A respect-first code of conduct",
    body: "Every driver agrees to a code of conduct before joining. Disrespectful behaviour of any kind ends a driver's place on Fleet Formal, permanently.",
  },
  {
    icon: "phone",
    title: "Parents confirm every booking",
    body: "No ride is ever locked in without a parent or guardian's sign-off first. Families stay in control from start to finish.",
  },
  {
    icon: "money",
    title: "Transparent hourly pricing",
    body: "Every ride is booked by the hour, $350 minimum, with no hidden fees. A share of every booking goes straight back to the school and the rest keeps Fleet Formal running — see our Terms for the exact split.",
  },
  {
    icon: "graduate",
    title: "Built with schools, not just around them",
    body: "Fleet Formal partners directly with QLD schools and P&Cs, so committees always have a safer option to point families toward.",
  },
  {
    icon: "pin",
    title: "Proudly Queensland, first",
    body: "Starting in Brisbane North and growing suburb by suburb — a local platform, run by locals, for local formals.",
  },
];

export default function TrustUSPs({ title = "Why families and schools trust Fleet Formal" }: { title?: string }) {
  return (
    <section className="px-14 py-12 bg-white border-y border-line">
      <h2 className="font-serif text-[22px] mb-6 max-w-xl">{title}</h2>
      <div className="grid grid-cols-3 gap-5">
        {usps.map((u) => (
          <div key={u.title} className="flex gap-3.5 bg-cream border border-line rounded-2xl p-5">
            <div className="shrink-0">
              <IconBadge name={u.icon} tone="navy" size="w-10 h-10" iconSize="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-[14.5px] mb-1">{u.title}</h3>
              <p className="text-[13px] text-[#454e60] leading-relaxed">{u.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
