/**
 * DESIGN: Sacred Manuscript / Dark Illuminated Codex
 * Layout: Full-height page — hero header with manuscript image, then chat area below
 * Colors: Deep charcoal bg, antique gold accents, warm parchment text
 * Fonts: Cinzel (headings), EB Garamond (body), Courier Prime (citations/sources)
 */

import { useState, useEffect, useRef } from 'react';
import { useOracle } from '@/hooks/useOracle';
import { Streamdown } from 'streamdown';

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663251063494/TadG6nNb4cG9vCt5k7wNnj/gnostic_hero_bg-bmSiDxD6HFcp9oGKctTvpW.webp';
const SOPHIA_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663251063494/TadG6nNb4cG9vCt5k7wNnj/gnostic_sophia-LJqwXjFqbbRN6FDZDXfZgy.webp';
const PATTERN_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663251063494/TadG6nNb4cG9vCt5k7wNnj/gnostic_pattern-hiia5nH5JE2KmUCphGKh4P.webp';

const SUGGESTED_QUESTIONS = [
  'What does the Gospel of Thomas say about the Kingdom?',
  'Who is Sophia and what is her role in Gnostic thought?',
  'What is the Demiurge according to the Apocryphon of John?',
  'What does the Gospel of Philip say about the bridal chamber?',
  'How does the Gospel of Mary describe the soul\'s ascent?',
  'What is gnosis and how is it attained?',
];

export default function Home() {
  const { messages, isLoading, error, askOracle, initKnowledgeBase, clearMessages } = useOracle();
  const [input, setInput] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Silently load knowledge base — don't show error banner on startup
    initKnowledgeBase().catch(() => {});
  }, [initKnowledgeBase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const q = input;
    setInput('');
    setHasInteracted(true);
    await askOracle(q);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestion = (q: string) => {
    setInput(q);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.10 0.015 60)' }}>

      {/* ── HERO SECTION ── */}
      <header className="relative overflow-hidden" style={{ minHeight: '340px' }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, oklch(0.08 0.015 60 / 70%) 0%, oklch(0.10 0.015 60 / 90%) 70%, oklch(0.10 0.015 60) 100%)' }} />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16">
          <div className="flex items-center gap-4 mb-8 w-full max-w-lg">
            <div className="flex-1 gold-divider" />
            <span style={{ color: 'oklch(0.75 0.12 80)', fontSize: '1.2rem' }}>✦</span>
            <div className="flex-1 gold-divider" />
          </div>

          <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem', letterSpacing: '0.3em', color: 'oklch(0.65 0.08 75)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            The Nag Hammadi Library
          </p>

          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 700, color: 'oklch(0.85 0.10 80)', lineHeight: 1.15, marginBottom: '1rem', textShadow: '0 2px 20px oklch(0.75 0.12 80 / 30%)' }}>
            The Gnostic Gospels Oracle
          </h1>

          <p style={{ fontFamily: 'EB Garamond, serif', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontStyle: 'italic', color: 'oklch(0.72 0.06 75)', maxWidth: '560px', lineHeight: 1.7 }}>
            Ask of the hidden wisdom. Seek within the ancient codices of Nag Hammadi.
          </p>

          <div className="flex items-center gap-4 mt-8 w-full max-w-lg">
            <div className="flex-1 gold-divider" />
            <span style={{ color: 'oklch(0.75 0.12 80)', fontSize: '1.2rem' }}>✦</span>
            <div className="flex-1 gold-divider" />
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 lg:px-8 py-8 gap-8">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="hidden lg:flex flex-col gap-6" style={{ width: '260px', flexShrink: 0 }}>
          <div className="rounded overflow-hidden" style={{ border: '1px solid oklch(0.35 0.06 75 / 40%)' }}>
            <img src={SOPHIA_IMG} alt="Sophia, Goddess of Wisdom" className="w-full object-cover" style={{ maxHeight: '320px', objectPosition: 'top' }} />
            <div className="p-3" style={{ background: 'oklch(0.13 0.015 60)' }}>
              <p style={{ fontFamily: 'Courier Prime, monospace', fontSize: '0.7rem', color: 'oklch(0.55 0.06 75)', textAlign: 'center', letterSpacing: '0.05em' }}>
                SOPHIA — Wisdom Incarnate
              </p>
            </div>
          </div>

          <div className="p-4 rounded" style={{ background: 'oklch(0.13 0.015 60)', border: '1px solid oklch(0.30 0.04 75 / 30%)' }}>
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem', letterSpacing: '0.15em', color: 'oklch(0.65 0.08 75)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Texts Available
            </h3>
            <ul style={{ fontFamily: 'EB Garamond, serif', fontSize: '0.875rem', color: 'oklch(0.60 0.05 75)', lineHeight: 2 }}>
              {['Gospel of Thomas', 'Gospel of Philip', 'Gospel of Truth', 'Gospel of Mary', 'Apocryphon of John', 'Thunder, Perfect Mind', 'Sophia of Jesus Christ', 'Hypostasis of Archons', 'On the Origin of World', 'Exegesis on the Soul', 'Apocalypse of Peter', 'Book of Thomas'].map(t => (
                <li key={t} style={{ borderBottom: '1px solid oklch(0.20 0.015 60)', paddingBottom: '2px' }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="w-full py-2 rounded text-sm transition-all"
              style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'oklch(0.50 0.05 75)', border: '1px solid oklch(0.25 0.03 75 / 40%)', background: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'oklch(0.75 0.12 80)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'oklch(0.50 0.05 75)')}
            >
              CLEAR SCROLL
            </button>
          )}
        </aside>

        {/* ── CHAT AREA ── */}
        <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto mb-6"
            style={{ minHeight: '400px', maxHeight: 'calc(100vh - 480px)' }}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center py-8">
                <div
                  className="w-24 h-24 rounded-full mb-6 bg-cover bg-center opacity-60"
                  style={{ backgroundImage: `url(${PATTERN_BG})` }}
                />
                <p style={{ fontFamily: 'EB Garamond, serif', fontStyle: 'italic', fontSize: '1.1rem', color: 'oklch(0.55 0.05 75)', marginBottom: '2rem', textAlign: 'center' }}>
                  Seek and you shall find. Ask of the hidden wisdom.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestion(q)}
                      className="text-left p-3 rounded transition-all"
                      style={{
                        fontFamily: 'EB Garamond, serif',
                        fontSize: '0.95rem',
                        color: 'oklch(0.72 0.06 75)',
                        background: 'oklch(0.13 0.015 60)',
                        border: '1px solid oklch(0.25 0.03 75 / 40%)',
                        lineHeight: 1.5,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'oklch(0.55 0.08 80 / 60%)';
                        e.currentTarget.style.color = 'oklch(0.85 0.08 80)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'oklch(0.25 0.03 75 / 40%)';
                        e.currentTarget.style.color = 'oklch(0.72 0.06 75)';
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 pb-4">
                {messages.map(msg => (
                  <div key={msg.id} className="message-enter">
                    {msg.role === 'user' ? (
                      <div className="flex justify-end">
                        <div
                          className="max-w-xl px-5 py-3 rounded"
                          style={{
                            background: 'oklch(0.18 0.02 60)',
                            border: '1px solid oklch(0.30 0.04 75 / 40%)',
                            fontFamily: 'EB Garamond, serif',
                            fontSize: '1.05rem',
                            color: 'oklch(0.88 0.05 80)',
                            lineHeight: 1.7,
                          }}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <div
                          className="w-8 h-8 rounded-full flex-shrink-0 mt-1 bg-cover bg-center"
                          style={{ backgroundImage: `url(${PATTERN_BG})`, border: '1px solid oklch(0.55 0.08 80 / 50%)' }}
                        />
                        <div className="flex-1">
                          <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'oklch(0.55 0.06 75)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                            The Oracle Speaks
                          </p>
                          <div
                            className="px-5 py-4 rounded"
                            style={{
                              background: 'oklch(0.13 0.015 60)',
                              border: '1px solid oklch(0.35 0.06 75 / 30%)',
                              fontFamily: 'EB Garamond, serif',
                              fontSize: '1.1rem',
                              color: 'oklch(0.88 0.05 80)',
                              lineHeight: 1.85,
                            }}
                          >
                            <Streamdown>{msg.content}</Streamdown>
                          </div>
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {msg.sources.map(s => (
                                <span
                                  key={s}
                                  style={{
                                    fontFamily: 'Courier Prime, monospace',
                                    fontSize: '0.7rem',
                                    color: 'oklch(0.55 0.06 75)',
                                    background: 'oklch(0.16 0.015 60)',
                                    border: '1px solid oklch(0.28 0.04 75 / 40%)',
                                    padding: '2px 8px',
                                    borderRadius: '2px',
                                  }}
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-4 message-enter">
                    <div
                      className="w-8 h-8 rounded-full flex-shrink-0 mt-1 bg-cover bg-center"
                      style={{ backgroundImage: `url(${PATTERN_BG})`, border: '1px solid oklch(0.55 0.08 80 / 50%)' }}
                    />
                    <div className="flex-1">
                      <p style={{ fontFamily: 'Cinzel, serif', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'oklch(0.55 0.06 75)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        Consulting the Texts...
                      </p>
                      <div
                        className="px-5 py-4 rounded flex items-center gap-2"
                        style={{ background: 'oklch(0.13 0.015 60)', border: '1px solid oklch(0.35 0.06 75 / 30%)' }}
                      >
                        {[0, 1, 2].map(i => (
                          <div
                            key={i}
                            className="amber-dot w-2 h-2 rounded-full"
                            style={{ background: 'oklch(0.75 0.12 80)', animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Error — only show after user has interacted, not on initial load */}
          {error && hasInteracted && (
            <div className="mb-4 px-4 py-3 rounded text-sm" style={{ background: 'oklch(0.20 0.05 20)', border: '1px solid oklch(0.40 0.10 20 / 50%)', color: 'oklch(0.80 0.08 30)', fontFamily: 'EB Garamond, serif' }}>
              {error}
            </div>
          )}

          {/* Input area */}
          <div className="gold-divider mb-4" />
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask of the hidden wisdom... (Enter to send, Shift+Enter for new line)"
                rows={3}
                className="w-full resize-none rounded px-4 py-3 pr-24 transition-all"
                style={{
                  fontFamily: 'EB Garamond, serif',
                  fontSize: '1.05rem',
                  color: 'oklch(0.88 0.05 80)',
                  background: 'oklch(0.14 0.015 60)',
                  border: '1px solid oklch(0.30 0.04 75 / 50%)',
                  outline: 'none',
                  lineHeight: 1.7,
                  caretColor: 'oklch(0.75 0.12 80)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'oklch(0.55 0.08 80 / 70%)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'oklch(0.30 0.04 75 / 50%)')}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-3 bottom-3 px-4 py-2 rounded transition-all"
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  background: input.trim() && !isLoading ? 'oklch(0.75 0.12 80)' : 'oklch(0.25 0.03 75)',
                  color: input.trim() && !isLoading ? 'oklch(0.10 0.015 60)' : 'oklch(0.40 0.04 75)',
                  border: 'none',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                }}
              >
                SEEK
              </button>
            </div>
            <p style={{ fontFamily: 'Courier Prime, monospace', fontSize: '0.65rem', color: 'oklch(0.40 0.04 75)', textAlign: 'center', letterSpacing: '0.05em' }}>
              Drawing from 352 passages across 12 Gnostic texts · Nag Hammadi Library
            </p>
          </form>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="py-6 px-8 text-center" style={{ borderTop: '1px solid oklch(0.20 0.02 60)' }}>
        <p style={{ fontFamily: 'Courier Prime, monospace', fontSize: '0.65rem', color: 'oklch(0.35 0.04 75)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
          TEXTS FROM THE NAG HAMMADI LIBRARY · DISCOVERED UPPER EGYPT 1945 · TRANSLATIONS VIA GNOSIS.ORG
        </p>
        <a
          href="https://www.youtube.com/@veilcartography"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'Courier Prime, monospace',
            fontSize: '0.65rem',
            color: 'oklch(0.55 0.06 75)',
            letterSpacing: '0.08em',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'oklch(0.75 0.12 80)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'oklch(0.55 0.06 75)')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          @VEILCARTOGRAPHY
        </a>
      </footer>
    </div>
  );
}
