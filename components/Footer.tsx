import Link from "next/link";
import { FFLogo, GoldSwoosh, Icon } from "@/components/BrandIcon";

const columns = [
  {
    title: "Fleet Formal",
    links: [
      { href: "/browse", label: "Find a Ride" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/verification-safety", label: "Verification & Safety" },
      { href: "/for-schools", label: "For Schools" },
    ],
  },
  {
    title: "Get Started",
    links: [
      { href: "/get-started", label: "Create an Account" },
      { href: "/list-your-car", label: "List Your Ride" },
      { href: "/login", label: "Log In" },
    ],
  },
  {
    title: "Portals",
    links: [
      { href: "/school", label: "School / P&C Portal" },
      { href: "/admin", label: "Admin" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

/**
 * Site footer. By default it opens with the "More than a ride" band — the
 * car-and-students shot from the poster — so every page ends on the same
 * image it starts with. Pass cta={false} to drop the band (e.g. dashboards).
 */
export default function Footer({ cta = true }: { cta?: boolean }) {
  return (
    <footer>
      {cta && (
        <section className="relative overflow-hidden bg-midnight text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/hero-formal-night.jpg"
            alt="Students in formal wear beside a black classic Mustang at dusk"
            className="absolute inset-0 w-full h-full object-cover object-[75%_28%]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,19,38,0.97)_0%,rgba(1,19,38,0.85)_40%,rgba(1,19,38,0.2)_75%,rgba(1,19,38,0.1)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-midnight to-transparent" />
          <div className="relative px-6 md:px-14 py-16 md:py-24 max-w-4xl">
            <div className="eyebrow mb-4">Youthful · Luxury · Automotive</div>
            <h2 className="font-display text-[40px] md:text-[60px]">
              More than a ride.
              <br />
              <span className="text-gold">A memory in the making.</span>
            </h2>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/browse" className="btn-gold">
                <Icon name="search" className="w-5 h-5" strokeWidth={2.2} />
                Find a Ride
                <Icon name="arrowRight" className="w-5 h-5 btn-arrow" strokeWidth={2.2} />
              </Link>
              <Link href="/list-your-car" className="btn-outline">
                <Icon name="car" className="w-5 h-5" strokeWidth={2} />
                List Your Ride
                <Icon name="arrowRight" className="w-5 h-5 btn-arrow" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="relative bg-midnight">
        <GoldSwoosh className="-mt-px" />
      </div>

      <div className="bg-midnight text-slate-300 px-6 md:px-14 pt-8 pb-8">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="max-w-xs">
            <FFLogo size="lg" tagline />
            <p className="text-[13px] mt-5 leading-relaxed text-slate-400">
              Connecting verified classic, muscle and show car owners with students who want an
              unforgettable, safe ride to formal night. Starting in Brisbane, QLD.
            </p>
          </div>
          <div className="flex gap-10 md:gap-14 flex-wrap">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-gold text-[12px] uppercase tracking-[0.14em] font-serif font-bold mb-3.5">
                  {col.title}
                </h4>
                <div className="flex flex-col gap-2.5 text-[13.5px]">
                  {col.links.map((l) => (
                    <Link key={l.href} href={l.href} className="hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-6 md:gap-9 text-[11.5px] uppercase tracking-[0.12em] text-white/85 flex-wrap">
            <span className="flex items-center gap-2">
              <Icon name="pin" className="w-6 h-6 text-gold" /> Local vehicles
            </span>
            <span className="flex items-center gap-2">
              <Icon name="star" className="w-6 h-6 text-gold" /> Real owners
            </span>
            <span className="flex items-center gap-2">
              <Icon name="heart" className="w-6 h-6 text-gold" /> Great memories
            </span>
          </div>
          <div className="text-right">
            <div className="text-white font-serif font-bold text-[18px]">fleetformal.com</div>
            <div className="text-gold text-[11px] uppercase tracking-[0.14em] mt-0.5">
              Arrive at formal in something unforgettable.
            </div>
          </div>
        </div>
        <div className="text-[11.5px] text-slate-500 mt-6">
          © {new Date().getFullYear()} Fleet Formal. Currently serving Brisbane North, QLD.
        </div>
      </div>
    </footer>
  );
}
