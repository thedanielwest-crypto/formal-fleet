import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-navy text-white px-14 py-5 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-light to-gold flex items-center justify-center text-xl">
          🏆
        </div>
        <div className="font-serif font-bold text-2xl">
          Formal<span className="text-gold-light">Fleet</span>
        </div>
      </Link>
      <nav className="hidden md:flex gap-9 text-[15px] font-medium text-slate-300">
        <Link href="/" className="text-white border-b-2 border-gold pb-1">
          Browse Cars
        </Link>
        <a href="#" className="hover:text-white">How It Works</a>
        <a href="#" className="hover:text-white">Verification &amp; Safety</a>
        <a href="#" className="hover:text-white">For Schools</a>
      </nav>
      <div className="flex gap-3.5 items-center">
        <a href="#" className="px-5 py-2.5 rounded-lg font-semibold text-sm border border-white/35">
          Log In
        </a>
        <a
          href="#"
          className="px-5 py-2.5 rounded-lg font-semibold text-sm text-navy-deep bg-gradient-to-br from-gold-light to-gold"
        >
          List Your Car
        </a>
      </div>
    </header>
  );
}
