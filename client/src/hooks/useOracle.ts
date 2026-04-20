/**
 * useOracle hook — handles querying the Gnostic Gospels Oracle
 * Uses RAG: retrieves relevant text chunks, then sends to AI via Forge API
 */

import { useState, useCallback, useRef } from 'react';
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

      // Retrieve relevant chunks
      const relevantChunks = retrieveRelevantChunks(question, kbRef.current, 5);
      const sources = Array.from(new Set(relevantChunks.map(c => c.title)));
      const systemPrompt = buildSystemPrompt(relevantChunks);

      // Call Forge API (built-in AI)
      const apiUrl = import.meta.env.VITE_FRONTEND_FORGE_API_URL;
      const apiKey = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;

      const response = await fetch(`${apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku',
          messages: [
            { role: 'system', content: systemPrompt },
            // Include last 3 exchanges for context
            ...messages.slice(-6).map(m => ({
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.content,
            })),
            { role: 'user', content: question },
          ],
          max_tokens: 1200,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Oracle unavailable: ${response.status}`);
      }

      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content || 'The Oracle is silent on this matter.';

      const oracleMsg: Message = {
        id: `oracle_${Date.now()}`,
        role: 'oracle',
        content: answer,
        sources,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, oracleMsg]);
    } catch (e: any) {
      setError(e.message || 'The Oracle could not be reached. Please try again.');
      // Remove the user message on error
      setMessages(prev => prev.filter(m => m.id !== userMsg.id));
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

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
