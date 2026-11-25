/**
 * Live car_submissions rows that must never show on the public site.
 *
 * - Seeded demo cars: their photos are the sketch-style illustrations in
 *   /public/photos/demo. Only real cars with real photos are listed now.
 * - Two duplicate RX-7 submissions: Craig's RX-7 already has its own
 *   curated listing at /listing/mazda-rx7-peter-stuyvesant-tribute.
 *
 * Filtering here (rather than deleting rows) keeps the data recoverable;
 * the rows can also be marked "rejected" or deleted from the Admin page.
 */
export const HIDDEN_CAR_IDS = new Set<string>([
  "973682f7-8470-4d91-9f72-421e0f8da41c", // "Mazda RX7 1981" (duplicate of curated RX-7)
  "89d4cfa7-9d08-4acc-91ca-675e1b3dd177", // "1980s RX7" (duplicate of curated RX-7)
]);

export function isHiddenSubmission(row: {
  id: string;
  photo1_path?: string | null;
}): boolean {
  if (HIDDEN_CAR_IDS.has(row.id)) return true;
  return /\/photos\/demo\//i.test(row.photo1_path ?? "");
}
