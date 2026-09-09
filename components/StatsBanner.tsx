const stats = [
  { value: "122", label: "Cars on the Platform" },
  { value: "42", label: "School Events Successfully Supported" },
  { value: "$24,000", label: "Raised for Schools & P&Cs" },
];

export default function StatsBanner() {
  return (
    <section className="bg-navy-deep text-white px-6 md:px-14 py-10 border-y border-gold-border">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="font-serif font-black text-4xl md:text-5xl text-gold-light">
              {s.value}
            </div>
            <div className="mt-2 text-[12.5px] uppercase tracking-wide text-slate-300">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
