import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-slate-300 px-14 py-10 mt-4">
      <div className="flex flex-wrap justify-between gap-8">
        <div className="max-w-xs">
          <div className="font-serif font-bold text-xl text-white">
            Formal<span className="text-gold-light">Fleet</span>
          </div>
          <p className="text-[13px] mt-3 leading-relaxed text-slate-400">
            Connecting verified classic and show car owners with students and parents who want an
            unforgettable, safe ride to formal night. Starting in Brisbane, QLD.
          </p>
        </div>
        <div className="flex gap-14 flex-wrap">
          <div>
            <h4 className="text-white text-[12.5px] uppercase tracking-wide font-bold mb-3">
              Formal Fleet
            </h4>
            <div className="flex flex-col gap-2 text-[13.5px]">
              <Link href="/browse" className="hover:text-white">Browse Cars</Link>
              <Link href="/how-it-works" className="hover:text-white">How It Works</Link>
              <Link href="/verification-safety" className="hover:text-white">
                Verification &amp; Safety
              </Link>
              <Link href="/for-schools" className="hover:text-white">For Schools</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white text-[12.5px] uppercase tracking-wide font-bold mb-3">
              Get Started
            </h4>
            <div className="flex flex-col gap-2 text-[13.5px]">
              <Link href="/get-started" className="hover:text-white">Create an Account</Link>
              <Link href="/list-your-car" className="hover:text-white">List Your Car</Link>
              <Link href="/login" className="hover:text-white">Log In</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white text-[12.5px] uppercase tracking-wide font-bold mb-3">
              Portals
            </h4>
            <div className="flex flex-col gap-2 text-[13.5px]">
              <Link href="/school" className="hover:text-white">School / P&amp;C Portal</Link>
              <Link href="/founders" className="hover:text-white">Founders Login</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 mt-8 pt-5 text-[12px] text-slate-500">
        © {new Date().getFullYear()} Formal Fleet. Currently serving Brisbane North, QLD.
      </div>
    </footer>
  );
}
