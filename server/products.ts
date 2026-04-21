/**
 * Stripe product and price configuration for The Gnostic Gospels Oracle
 * Monthly subscription — £5.99/month
 */

export const PRODUCTS = {
  oracle_monthly: {
    name: "The Gnostic Gospels Oracle — Monthly",
    description: "Unlimited access to the Oracle, all 12 Gnostic texts, and upcoming courses.",
    priceData: {
      currency: "gbp",
      unit_amount: 599, // £5.99 in pence
      recurring: { interval: "month" as const },
    },
  },
};

export const FREE_QUESTION_LIMIT = 3;
