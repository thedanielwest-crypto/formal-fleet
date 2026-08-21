import { Listing } from "@/lib/listings";

export default function Badge({ listing }: { listing: Listing }) {
  const isPending = listing.badge === "pending";
  return (
    <div
      className={`absolute top-3.5 left-3.5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-bold ${
        isPending ? "bg-amber-bg text-amber" : "bg-white/95 text-navy-deep"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isPending ? "bg-amber" : "bg-gold"}`}
      />
      {listing.badgeLabel}
    </div>
  );
}
