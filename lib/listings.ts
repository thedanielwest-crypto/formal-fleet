export type Listing = {
  slug: string;
  title: string;
  price: number | "free";
  priceLabel: string;
  suburb: string;
  region: string;
  badge: "gold" | "verified" | "pending";
  badgeLabel: string;
  ownerName: string;
  ownerInitials: string;
  ownerSub: string;
  description: string;
  heroImage: string;
  gallery: string[];
};

export const listings: Listing[] = [
  {
    slug: "mazda-rx7-peter-stuyvesant-tribute",
    title: '1980s Mazda RX-7 — "Peter Stuyvesant" Tribute',
    price: 100,
    priceLabel: "$100 / trip",
    suburb: "Samford",
    region: "Brisbane North, QLD",
    badge: "gold",
    badgeLabel: "Gold Verified",
    ownerName: "Craig English",
    ownerInitials: "CE",
    ownerSub: "Verified owner · Samford",
    description:
      'A faithful tribute to the iconic #43 Peter Stuyvesant International Mazda RX-7 — right down to the Allan Moffat signage and gold BBS-style wheels. Craig is the son of legendary racer John English, and this build is a genuine labour of love. Expect a proper race-car welcome: hood up for a look at the engine bay, and a ride nobody at the formal will forget.',
    heroImage: "/photos/rx7-hero.jpg",
    gallery: ["/photos/rx7-hero.jpg", "/photos/rx7-engine.jpg"],
  },
  {
    slug: "ac-cobra-replica",
    title: "AC Cobra Replica",
    price: "free",
    priceLabel: "Free ride",
    suburb: "The Gap",
    region: "Brisbane North, QLD",
    badge: "gold",
    badgeLabel: "Gold Verified",
    ownerName: "Jeff Metcalf",
    ownerInitials: "JM",
    ownerSub: "Verified owner · The Gap",
    description:
      "Hand-built Cobra replica with cream leather interior, roll bar, and a proper V8 rumble. Jeff's happy to drive for free — he just loves seeing the reaction when the doors open outside the venue.",
    heroImage: "/photos/cobra-hero.jpg",
    gallery: ["/photos/cobra-hero.jpg", "/photos/cobra-side.jpg", "/photos/cobra-interior.jpg"],
  },
  {
    slug: "subaru-legacy-gt-wagon",
    title: "Subaru Legacy GT Wagon",
    price: 500,
    priceLabel: "$500 / trip",
    suburb: "The Gap",
    region: "Brisbane North, QLD",
    badge: "gold",
    badgeLabel: "Gold Verified",
    ownerName: "Orlando West",
    ownerInitials: "OW",
    ownerSub: "Verified owner · The Gap",
    description:
      "Immaculately kept family wagon with plenty of room for formal wear. A comfortable, reliable ride from a fully licensed, verified driver.",
    heroImage: "/photos/subaru-hero.jpg",
    gallery: ["/photos/subaru-hero.jpg"],
  },
  {
    slug: "krazy-lemon-novelty-van",
    title: '"Krazy Lemon" Novelty Van',
    price: 75.55,
    priceLabel: "$75.55 / trip",
    suburb: "Brendale",
    region: "Brisbane North, QLD",
    badge: "verified",
    badgeLabel: "Verified",
    ownerName: "Daniel West",
    ownerInitials: "DW",
    ownerSub: "Verified owner · Brendale",
    description:
      "Not your average formal ride — Brisbane's most recognisable lemonade van, driven by owner Daniel West. Guaranteed to be the most talked-about arrival of the night.",
    heroImage: "/photos/lemon-van-hero.jpg",
    gallery: ["/photos/lemon-van-hero.jpg"],
  },
];

export function getListingBySlug(slug: string): Listing | undefined {
  return listings.find((l) => l.slug === slug);
}
