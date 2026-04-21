import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { stripeRouter } from "./stripeRouter";
import { z } from "zod";

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
