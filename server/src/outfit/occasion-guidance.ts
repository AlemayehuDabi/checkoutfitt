/**
 * Occasion-specific selection guidance layered into the generation prompt
 * automatically — an interview needs conservative, structured pieces where a
 * party welcomes bold ones, even though both flow through the exact same
 * `generate()` call. Keyed by plain string (not OutfitContextValue) because
 * Prisma stores an outfit's `context` as a bare String, so a value read back
 * from the database — e.g. in `shuffle()` — isn't narrowed to the literal
 * union type.
 */
export const OCCASION_GUIDANCE: Record<string, string> = {
  interview:
    'This is for a job interview — dress conservatively and professionally. Favor neutral colors and structured pieces; avoid casual items like sneakers, graphic tees, or shorts.',
  wedding:
    'This is a wedding guest outfit — dress elevated and polished. Avoid all-white or all-black outfits and anything overly casual.',
  meeting:
    'This is for a work meeting — dress professionally and put-together.',
  party:
    'This is for a party — lean expressive: bolder color, texture, or a statement piece is welcome.',
  travel:
    'This is for travel — prioritize comfort and practicality: easy layers and pieces that are simple to move in.',
  gym: 'This is for the gym — select athletic/activewear items only.',
  date_night:
    'This is a date night — put together something stylish and a bit more elevated than everyday casual.',
  office: 'This is for the office — dress professionally.',
  weekend: 'This is relaxed weekend wear — prioritize comfort.',
  casual: 'This is everyday casual wear — comfortable and low-key.',
};

export function getOccasionGuidance(context: string): string | undefined {
  return OCCASION_GUIDANCE[context];
}
