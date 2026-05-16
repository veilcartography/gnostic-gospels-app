import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { stripeRouter } from "./stripeRouter";
import { courseRouter } from "./courseRouter";
import { z } from "zod";
import { getDb } from "./db";
import { emailLeads } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  stripe: stripeRouter,
  courses: courseRouter,

  leads: router({
    // Admin: list all leads
    list: adminProcedure
      .query(async () => {
        const db = await getDb();
        const rows = await db!.select().from(emailLeads).orderBy(desc(emailLeads.createdAt));
        return rows;
      }),

    // Admin: delete a lead by id
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        await db!.delete(emailLeads).where(eq(emailLeads.id, input.id));
        return { success: true };
      }),

    capture: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(128),
        email: z.string().email().max(320),
        source: z.string().max(64).optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        const isNew = { value: false };
        try {
          await db!.insert(emailLeads).values({
            name: input.name.trim(),
            email: input.email.trim().toLowerCase(),
            source: input.source ?? "oracle",
          });
          isNew.value = true;
        } catch (err: any) {
          // Duplicate email — treat as success so we don't reveal who is already subscribed
          if (err?.code !== 'ER_DUP_ENTRY') throw err;
        }

        // Send welcome email with Module 1 link (only for new sign-ups)
        if (isNew.value) {
          try {
            const { invokeLLM: _unused, ...rest } = { invokeLLM: null }; void rest;
            const baseUrl = process.env.VITE_APP_ID
              ? `https://gnosticchat-tadg6nnb.manus.space`
              : 'http://localhost:3000';
            const module1Url = `${baseUrl}/module-1-what-is-gnosis`;
            const coursesUrl = `${baseUrl}/courses`;

            const emailHtml = `<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0d0b08; color: #d4b896; padding: 40px 32px;">
  <p style="font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 3px; color: #8a7a5a; text-transform: uppercase; margin-bottom: 24px;">The Gnostic Gospels Oracle</p>
  <h1 style="font-family: Georgia, serif; font-size: 22px; color: #c9a84c; margin-bottom: 8px; line-height: 1.4;">Start here: What Is Gnosis? (free)</h1>
  <p style="font-size: 16px; line-height: 1.8; margin-bottom: 20px;">Dear ${input.name.trim()},</p>
  <p style="font-size: 16px; line-height: 1.8; margin-bottom: 20px;">Here is your free Module 1: <strong>What Is Gnosis?</strong> — the foundation for everything you will explore in the Oracle.</p>
  <p style="margin-bottom: 28px;">
    <a href="${module1Url}" style="display: inline-block; background: #c9a84c; color: #0d0b08; font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; padding: 14px 28px; text-decoration: none; border-radius: 3px;">Read Module 1 Now →</a>
  </p>
  <p style="font-size: 15px; line-height: 1.8; margin-bottom: 20px;">This is the foundation for everything you will explore in the Oracle. It covers the Pleroma, Sophia's descent, the Archons, and the two foundational daily practices for awakening your divine spark.</p>
  <p style="font-size: 15px; line-height: 1.8; margin-bottom: 28px;">Ready to go deeper? <a href="${coursesUrl}" style="color: #c9a84c;">Choose your next module →</a></p>
  <hr style="border: none; border-top: 1px solid #2a2318; margin: 28px 0;" />
  <p style="font-family: 'Courier New', monospace; font-size: 10px; color: #4a3f2a; letter-spacing: 1px;">The Gnostic Gospels Oracle · You are receiving this because you asked of the hidden wisdom. <a href="#" style="color: #4a3f2a;">Unsubscribe</a></p>
</div>`;

            // Use the Forge notification API to send the welcome email
            const forgeBaseUrl = (process.env.BUILT_IN_FORGE_API_URL || '').replace(/\/+$/, '');
            const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;
            if (forgeBaseUrl && forgeKey) {
              await fetch(`${forgeBaseUrl}/v1/notification/email`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${forgeKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  to: input.email.trim().toLowerCase(),
                  subject: 'Start here: What Is Gnosis? (free) + your Oracle is unlocked',
                  html: emailHtml,
                }),
              }).catch(() => {}); // Non-blocking — don't fail the sign-up if email fails
            }
          } catch {
            // Email failure is non-blocking
          }
        }

        return { success: true, message: isNew.value ? "The Oracle has received your name." : "You are already known to the Oracle." };
      }),
  }),

  oracle: router({
    ask: publicProcedure
      .input(z.object({
        question: z.string().min(1).max(2000),
        context: z.string().max(20000).optional(),
        sources: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        const systemPrompt = `You are the Oracle of the Gnostic Gospels — a wise, reverent guide to the ancient Nag Hammadi texts and related Gnostic scriptures. You speak with depth, clarity, and spiritual insight.

Your answers are grounded in the actual texts of the Gnostic Gospels. When you cite a passage, name the source text (e.g., "The Gospel of Thomas", "The Gospel of Philip", "The Apocryphon of John").

${input.context ? `Relevant passages from the texts for this query:\n\n${input.context}` : ''}

Provide a thoughtful, scholarly answer drawing from the Gnostic texts. Be specific about which texts say what. Keep your answer focused and illuminating — typically 2-4 paragraphs.`;

        const response = await invokeLLM({
          messages: [
            { role: "system" as const, content: systemPrompt },
            { role: "user" as const, content: input.question },
          ],
        });

        const rawContent = response.choices?.[0]?.message?.content;
        const content = typeof rawContent === 'string' ? rawContent : "The Oracle is silent on this matter.";
        return { answer: content, sources: input.sources ?? [] };
      }),
  }),
});

export type AppRouter = typeof appRouter;
