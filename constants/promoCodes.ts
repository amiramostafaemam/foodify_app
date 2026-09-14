// A small local list rather than an Appwrite collection — same pattern as
// offers.constants.ts, since these are fixed demo codes, not something an
// admin needs to manage live.
export interface PromoCode {
  code: string;
  type: "percent" | "fixed";
  value: number; // percent (0-100) for "percent", dollars for "fixed"
  minOrder?: number;
}

export const PROMO_CODES: PromoCode[] = [
  { code: "WELCOME10", type: "percent", value: 10 },
  { code: "SAVE5", type: "fixed", value: 5, minOrder: 20 },
  { code: "FOODIFY20", type: "percent", value: 20, minOrder: 40 },
];

export const findPromoCode = (input: string): PromoCode | null =>
  PROMO_CODES.find((p) => p.code === input.trim().toUpperCase()) ?? null;

/** Dollar amount a promo takes off a given subtotal — 0 if the code's
 * minimum order isn't met, so `discount` never quietly steals from you. */
export const computePromoDiscount = (promo: PromoCode, subtotal: number) => {
  if (promo.minOrder && subtotal < promo.minOrder) return 0;
  const raw = promo.type === "percent" ? subtotal * (promo.value / 100) : promo.value;
  return Math.min(raw, subtotal);
};
