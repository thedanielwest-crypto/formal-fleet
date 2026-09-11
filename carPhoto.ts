import { supabase } from "@/lib/supabaseClient";

/**
 * Resolves a car_submissions photoN_path into a viewable URL. A handful of
 * early rows were backfilled from raw form submissions (or, for our seeded
 * demo cars, point at static sketch assets in /public/photos/demo) and
 * store a full URL directly instead of a Storage object key - pass those
 * through unchanged rather than trying to resolve them as storage paths.
 * Shared between the browse grid (LiveListings) and the car detail page.
 */
export function photoUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return supabase.storage.from("car-photos").getPublicUrl(path).data.publicUrl;
}
