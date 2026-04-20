/**
 * useOracle hook — handles querying the Gnostic Gospels Oracle
 * Uses RAG: retrieves relevant text chunks, then sends to AI via tRPC server procedure
 */

import { useState, useCallback, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { loadKnowledgeBase, retrieveRelevantChunks, buildSystemPrompt, KnowledgeChunk } from '@/lib/rag';

export interface Message {
  id: string;
  role: 'user' | 'oracle';
  content: string;
  sources?: string[];
  timestamp: Date;
}

export function useOracle() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kbLoaded, setKbLoaded] = useState(false);
  const kbRef = useRef<KnowledgeChunk[] | null>(null);

  const oracleMutation = trpc.oracle.ask.useMutation();

  const initKnowledgeBase = useCallback(async () => {
    if (kbRef.current) return;
    try {
      kbRef.current = await loadKnowledgeBase();
      setKbLoaded(true);
    } catch (e) {
      setError('Failed to load the sacred texts. Please refresh.');
    }
  }, []);

  const askOracle = useCallback(async (question: string) => {
    if (!question.trim() || isLoading) return;
    setError(null);

    // Add user message
    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: question.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Ensure KB is loaded
      if (!kbRef.current) {
        kbRef.current = await loadKnowledgeBase();
        setKbLoaded(true);
      }

      // Retrieve relevant chunks via RAG
      const relevantChunks = retrieveRelevantChunks(question, kbRef.current, 5);
      const sources = Array.from(new Set(relevantChunks.map((c: KnowledgeChunk) => c.title)));
      const contextText = buildSystemPrompt(relevantChunks);

      // Call server-side oracle via tRPC (uses BUILT_IN_FORGE_API_KEY securely)
      const result = await oracleMutation.mutateAsync({
        question: question.trim(),
        context: contextText,
        sources,
      });

      const oracleMsg: Message = {
        id: `oracle_${Date.now()}`,
        role: 'oracle',
        content: result.answer,
        sources: result.sources,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, oracleMsg]);
    } catch (e: any) {
      setError(e.message || 'The Oracle could not be reached. Please try again.');
      setMessages(prev => prev.filter(m => m.id !== userMsg.id));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, oracleMutation]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    kbLoaded,
    askOracle,
    initKnowledgeBase,
    clearMessages,
  };
}
