import { describe, expect, it, vi } from "vitest";

// Mock the LLM module
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: "The Gospel of Thomas speaks of the Kingdom within." } }],
  }),
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("oracle.ask", () => {
  it("returns an answer from the LLM", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.oracle.ask({
      question: "What does Thomas say about the Kingdom?",
      context: "Relevant passage from Gospel of Thomas...",
      sources: ["Gospel of Thomas"],
    });

    expect(result.answer).toBe("The Gospel of Thomas speaks of the Kingdom within.");
    expect(result.sources).toEqual(["Gospel of Thomas"]);
  });

  it("returns fallback text when LLM returns no content", async () => {
    const { invokeLLM } = await import("./_core/llm");
    vi.mocked(invokeLLM).mockResolvedValueOnce({ choices: [] } as any);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.oracle.ask({
      question: "Who is Sophia?",
    });

    expect(result.answer).toBe("The Oracle is silent on this matter.");
  });
});
