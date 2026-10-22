/**
 * The page body shell: a centred column wide enough for the widest block on
 * any page, so blocks fill it and the only remaining limits are on prose,
 * where line length still matters.
 */
export const SHELL = "mx-auto w-full max-w-[1100px]";

/**
 * The navbar and footer. They run the full width of the window with ordinary
 * padding, the way a standard site sits, instead of sharing the body's
 * centred column and leaving wide margins either side.
 */
export const FRAME = "w-full";
