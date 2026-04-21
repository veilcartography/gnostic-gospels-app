/**
 * Stripe router — handles subscription checkout and status checks
 */
import Stripe from "stripe";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { subscriptions } from "../drizzle/schema";
import { PRODUCTS } from "./products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

export const stripeRouter = router({
  // Create a checkout session for monthly subscription
  createCheckout: protectedProcedure
    .input(z.object({ origin: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: ctx.user.email ?? undefined,
        allow_promotion_codes: true,
        line_items: [
          {
            price_data: {
              currency: PRODUCTS.oracle_monthly.priceData.currency,
              unit_amount: PRODUCTS.oracle_monthly.priceData.unit_amount,
              recurring: PRODUCTS.oracle_monthly.priceData.recurring,
              product_data: {
                name: PRODUCTS.oracle_monthly.name,
                description: PRODUCTS.oracle_monthly.description,
              },
            },
            quantity: 1,
          },
        ],
        client_reference_id: ctx.user.id.toString(),
        metadata: {
          user_id: ctx.user.id.toString(),
          customer_email: ctx.user.email ?? "",
          customer_name: ctx.user.name ?? "",
        },
        success_url: `${input.origin}/?subscribed=true`,
        cancel_url: `${input.origin}/`,
      });

      return { url: session.url };
    }),

  // Check if current user has an active subscription
  status: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return { isSubscribed: false };
    const db = await getDb();
    if (!db) return { isSubscribed: false };

    const result = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    const sub = result[0];
    return { isSubscribed: sub?.status === "active" };
  }),
});
