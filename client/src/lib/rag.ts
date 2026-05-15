/**
 * RAG (Retrieval-Augmented Generation) utility
 * Loads the Gnostic Gospels knowledge base and retrieves relevant chunks
 * for a given query using TF-IDF-style keyword scoring.
 */

export interface KnowledgeChunk {
  id: string;
  title: string;
  source: string;
  text: string;
}

let knowledgeBase: KnowledgeChunk[] | null = null;

// Raw passage shape from the Wikipedia scrape
interface WikiPassage {
  source: string;
  section: string;
  text: string;
  url: string;
}

export async function loadKnowledgeBase(): Promise<KnowledgeChunk[]> {
  if (knowledgeBase) return knowledgeBase;
  const res = await fetch('/manus-storage/nag_hammadi_wiki_knowledge_05d4efe5.json');
  if (!res.ok) throw new Error('Failed to load knowledge base');
  const raw: WikiPassage[] = await res.json();
  // Normalise into KnowledgeChunk shape
  knowledgeBase = raw.map((p, i) => ({
    id: `wiki_${i}`,
    title: p.source,
    source: `${p.source} — ${p.section}`,
    text: p.text,
  }));
  return knowledgeBase!;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

// Stop words to ignore in scoring
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
  'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
  'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who',
  'did', 'let', 'put', 'say', 'she', 'too', 'use', 'that', 'this', 'with',
  'have', 'from', 'they', 'will', 'been', 'said', 'each', 'which', 'their',
  'time', 'when', 'what', 'there', 'about', 'would', 'these', 'other',
  'into', 'than', 'then', 'some', 'also', 'upon', 'unto', 'shall', 'them',
]);

export function retrieveRelevantChunks(
  query: string,
  chunks: KnowledgeChunk[],
  topK = 5
): KnowledgeChunk[] {
  const queryTokens = tokenize(query).filter(t => !STOP_WORDS.has(t));
  if (queryTokens.length === 0) return chunks.slice(0, topK);

  const scored = chunks.map(chunk => {
    const chunkTokens = tokenize(chunk.text + ' ' + chunk.title);
    const chunkSet = new Set(chunkTokens);
    
    let score = 0;
    for (const qt of queryTokens) {
      // Exact match
      if (chunkSet.has(qt)) score += 2;
      // Partial match (substring)
      for (const ct of Array.from(chunkSet)) {
        if (ct.includes(qt) || qt.includes(ct)) score += 0.5;
      }
      // Title match bonus
      if (chunk.title.toLowerCase().includes(qt)) score += 3;
    }
    
    // Frequency bonus
    const freq = chunkTokens.filter(t => queryTokens.includes(t)).length;
    score += freq * 0.3;
    
    return { chunk, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(s => s.score > 0)
    .map(s => s.chunk);
}

export function buildSystemPrompt(relevantChunks: KnowledgeChunk[]): string {
  const context = relevantChunks
    .map(c => `[From: ${c.title}]\n${c.text}`)
    .join('\n\n---\n\n');

  return `You are the Oracle of the Gnostic Gospels — a wise, reverent guide to the ancient Nag Hammadi texts and related Gnostic scriptures. You speak with depth, clarity, and spiritual insight.

Your answers are grounded in the actual texts of the Gnostic Gospels. When you cite a passage, name the source text (e.g., "The Gospel of Thomas", "The Gospel of Philip", "The Apocryphon of John").

Relevant passages from the texts for this query:

${context}

Guidelines:
- Answer thoughtfully and with scholarly depth, drawing on the passages above
- Quote directly from the texts when relevant, using quotation marks and naming the source
- If the question touches on Sophia, the Demiurge, gnosis, the Pleroma, or other key Gnostic concepts, explain them clearly
- If the texts do not directly address the question, say so honestly and offer what related wisdom exists
- Keep your tone reverent but accessible — like a learned guide, not an academic paper
- End answers with a relevant direct quote from one of the texts when possible`;
}
