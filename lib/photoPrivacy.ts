/**
 * Car photo privacy. Only cars whose owners have confirmed their Fleet Formal
 * listing show clear photos: currently the RX-7 and the Cobra. Every other
 * car's photo is blurred until its owner opts in.
 *
 * To un-blur a car later: add a pattern below that matches its slug or name.
 * Static community photos are also blurred in the image files themselves
 * (public/photos/community); restore the original file from GitHub history.
 */
const CLEAR_PHOTOS = [/rx-?7/i, /cobra/i];

export function isPhotoBlurred(...names: (string | null | undefined)[]) {
  return !names.some((n) => n && CLEAR_PHOTOS.some((re) => re.test(n)));
}

/** Classes for a blurred <img>. Its parent should clip overflow. */
export const BLUR_IMG = "photo-blur";
