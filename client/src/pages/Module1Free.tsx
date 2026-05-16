/**
 * Module 1 Free — What Is Gnosis?
 * Free content page accessible to anyone who has submitted their email.
 * Content sourced directly from Tee's lesson plan and training manuals.
 */

import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663251063494/TadG6nNb4cG9vCt5k7wNnj/gnostic_hero_bg-bmSiDxD6HFcp9oGKctTvpW.webp';
const PDF_URL = '/manus-storage/module1_what_is_gnosis_5f04dc97.pdf';

export default function Module1Free() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const captureLead = trpc.leads.capture.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success('Your PDF is on its way — check your inbox.');
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    captureLead.mutate({ name: name.trim(), email: email.trim(), source: 'module1_page' });
  };

  useEffect(() => {
    document.title = 'Module 1: What Is Gnosis? — Free — The Gnostic Gospels Oracle';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.10 0.015 60)', color: 'oklch(0.88 0.05 80)' }}>

      {/* NAV */}
      <nav className="flex items-center justify-between px-6 py-3" style={{ borderBottom: '1px solid oklch(0.18 0.02 60)', background: 'oklch(0.09 0.015 60 / 95%)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(8px)' }}>
        <Link href="/" style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'oklch(0.60 0.06 75)', textDecoration: 'none' }}>
          ← THE ORACLE
        </Link>
        <Link href="/courses" style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'oklch(0.60 0.06 75)', textDecoration: 'none' }}>
          ALL COURSES
        </Link>
      </nav>

      {/* HERO */}
      <header className="relative overflow-hidden" style={{ minHeight: '220px' }}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_BG})` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, oklch(0.08 0.015 60 / 70%) 0%, oklch(0.10 0.015 60 / 95%) 80%, oklch(0.10 0.015 60) 100%)' }} />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-12">
          <p style={{ fontFamily: 'Courier Prime, monospace', fontSize: '0.65rem', letterSpacing: '0.25em', color: 'oklch(0.65 0.08 75)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            FREE MODULE · FOUNDATIONS
          </p>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(1.6rem, 5vw, 2.8rem)', fontWeight: 700, color: 'oklch(0.85 0.10 80)', lineHeight: 1.2, marginBottom: '0.75rem' }}>
            Module 1: What Is Gnosis?
          </h1>
          <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '1.1rem', fontStyle: 'italic', color: 'oklch(0.70 0.05 75)', maxWidth: '520px', lineHeight: 1.7 }}>
            The Gnostic Genesis — Foundations of the Divine Spark
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-3xl mx-auto w-full px-6 py-12 flex flex-col gap-10">

        {/* LEARNING OBJECTIVES */}
        <section>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', color: 'oklch(0.75 0.12 80)', letterSpacing: '0.1em', marginBottom: '1rem', borderBottom: '1px solid oklch(0.25 0.04 75 / 40%)', paddingBottom: '0.5rem' }}>
            WHAT YOU WILL LEARN
          </h2>
          <ul style={{ fontFamily: 'EB Garamond, serif', fontSize: '1.05rem', color: 'oklch(0.78 0.05 75)', lineHeight: 2, listStyle: 'none', padding: 0 }}>
            {[
              'Explain the functional Gnostic model of reality — how consciousness became matter',
              'Define the key cosmological entities: The Pleroma, Aeons, Sophia, the Demiurge, and the Archons',
              'Understand the Gnostic view of the material world as a "counterfeit creation or a beautiful prison"',
              'Distinguish between the three stages of human awareness: Hylic, Psychic, and Pneumatic',
              'Execute the two foundational daily drills for awakening the divine spark within you',
            ].map((obj, i) => (
              <li key={i} className="flex items-start gap-3">
                <span style={{ color: 'oklch(0.75 0.12 80)', marginTop: '0.1rem', flexShrink: 0 }}>✦</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* PART 1: COSMOLOGY */}
        <section>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', color: 'oklch(0.75 0.12 80)', letterSpacing: '0.1em', marginBottom: '1rem', borderBottom: '1px solid oklch(0.25 0.04 75 / 40%)', paddingBottom: '0.5rem' }}>
            PART 1 — THE COSMOLOGY OF ORIGINS
          </h2>

          <div style={{ fontFamily: 'EB Garamond, serif', fontSize: '1.05rem', color: 'oklch(0.80 0.04 75)', lineHeight: 1.9 }} className="flex flex-col gap-6">

            <div>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '0.85rem', color: 'oklch(0.70 0.08 80)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>THE PLEROMA</h3>
              <p>In Gnostic cosmology, the <strong style={{ color: 'oklch(0.82 0.08 80)' }}>Pleroma</strong> ("Fullness") is the realm of pure consciousness, unity, and divine emanation. It is not a place but a state of being — the totality of divine light from which all things originate. Within the Pleroma dwell the <strong style={{ color: 'oklch(0.82 0.08 80)' }}>Aeons</strong> — archetypal principles that express facets of divine consciousness. Key Aeons include the Invisible Spirit (the Source), Barbelo (the First Thought), Autogenes (the Self-Generated), and Sophia (Wisdom).</p>
            </div>

            <div>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '0.85rem', color: 'oklch(0.70 0.08 80)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>SOPHIA'S DESCENT</h3>
              <p><strong style={{ color: 'oklch(0.82 0.08 80)' }}>Sophia</strong>, the youngest Aeon, made an independent creative act — she birthed a creation without her masculine counterpart. This act of imbalance produced a being of immense power but fundamental ignorance: <strong style={{ color: 'oklch(0.82 0.08 80)' }}>Yaldabaoth</strong>, the Demiurge. Sophia's fall is not a moral failure but a cosmic event. Her light became embedded in matter — and this is the origin of the divine spark in humanity.</p>
            </div>

            <div>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '0.85rem', color: 'oklch(0.70 0.08 80)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>THE DEMIURGE AND THE ARCHONS</h3>
              <p>Yaldabaoth — also called the <strong style={{ color: 'oklch(0.82 0.08 80)' }}>Demiurge</strong> — constructed the material world as a distorted reflection of the Pleroma. He created seven <strong style={{ color: 'oklch(0.82 0.08 80)' }}>Archons</strong> to govern the planetary spheres: Athoth (Saturn), Harmas (Jupiter), Kalila-Oumbri (Mars), Yabel (Sun), Adonaios (Venus), Sabaoth (Mercury), and Belias (Moon). Each Archon governs a psychological pattern — heaviness, pride, anger, vanity, craving, overthinking, instability. These patterns form the architecture of human conditioning.</p>
            </div>

            <div>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '0.85rem', color: 'oklch(0.70 0.08 80)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>THE THREE HUMAN TYPES</h3>
              <p>Gnostic anthropology recognises three developmental stages of human awareness:</p>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.75rem' }} className="flex flex-col gap-3">
                {[
                  ['HYLIC', 'Entirely identified with the physical body and its impulses — survival, appetite, status. The material-focused stage.'],
                  ['PSYCHIC', 'Beginning to seek meaning beyond the material — drawn to religion, philosophy, or self-improvement. The soul-seeking stage.'],
                  ['PNEUMATIC', 'The divine spark is awakening. Capable of inner guidance, drawn to truth and liberation. The spirit-awakening stage.'],
                ].map(([label, desc]) => (
                  <li key={label} className="flex gap-3">
                    <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.7rem', color: 'oklch(0.75 0.12 80)', letterSpacing: '0.1em', minWidth: '90px', paddingTop: '0.15rem' }}>{label}</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* EMAIL GATE — shown before Part 2 */}
        {!submitted ? (
          <section className="relative">
            {/* Fade overlay over the teaser */}
            <div className="pointer-events-none select-none opacity-30" style={{ fontFamily: 'EB Garamond, serif', fontSize: '1.05rem', color: 'oklch(0.80 0.04 75)', lineHeight: 1.9 }}>
              <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', color: 'oklch(0.75 0.12 80)', letterSpacing: '0.1em', marginBottom: '1rem', borderBottom: '1px solid oklch(0.25 0.04 75 / 40%)', paddingBottom: '0.5rem' }}>PART 2 — PRACTICAL: AWAKENING THE SPARK</h2>
              <p>Two foundational daily practices — the Heart-Centre Invocation and the Thought Observation drill — form the core of your Gnostic inner work. Plus a full review quiz to test your understanding...</p>
            </div>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, oklch(0.10 0.015 60) 60%)' }} />

            {/* Email form */}
            <div className="relative mt-6 p-8 rounded" style={{ background: 'oklch(0.13 0.015 60)', border: '1px solid oklch(0.30 0.06 75 / 40%)' }}>
              <div className="text-center mb-6">
                <span style={{ fontSize: '1.5rem', color: 'oklch(0.75 0.12 80)' }}>✦</span>
                <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', color: 'oklch(0.82 0.10 80)', margin: '0.75rem 0 0.5rem' }}>Receive the Full Module Free</h3>
                <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '0.95rem', color: 'oklch(0.65 0.05 75)', fontStyle: 'italic' }}>
                  Enter your details and we will send the complete Module 1 PDF to your inbox — including both daily practice drills, the full review quiz, and your next steps.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={{ background: 'oklch(0.10 0.015 60)', border: '1px solid oklch(0.30 0.04 75 / 50%)', borderRadius: '3px', padding: '0.75rem 1rem', color: 'oklch(0.88 0.05 80)', fontFamily: 'EB Garamond, serif', fontSize: '1rem', outline: 'none' }}
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ background: 'oklch(0.10 0.015 60)', border: '1px solid oklch(0.30 0.04 75 / 50%)', borderRadius: '3px', padding: '0.75rem 1rem', color: 'oklch(0.88 0.05 80)', fontFamily: 'EB Garamond, serif', fontSize: '1rem', outline: 'none' }}
                />
                <button
                  type="submit"
                  disabled={captureLead.isPending}
                  style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem', letterSpacing: '0.15em', background: 'oklch(0.75 0.12 80)', color: 'oklch(0.10 0.015 60)', border: 'none', padding: '0.85rem 1.75rem', borderRadius: '3px', cursor: 'pointer', opacity: captureLead.isPending ? 0.6 : 1 }}
                >
                  {captureLead.isPending ? 'SENDING...' : 'SEND ME MODULE 1 FREE →'}
                </button>
              </form>
            </div>
          </section>
        ) : (
          <section className="p-8 rounded text-center" style={{ background: 'oklch(0.13 0.015 60)', border: '1px solid oklch(0.30 0.06 75 / 40%)' }}>
            <span style={{ fontSize: '2rem', color: 'oklch(0.75 0.12 80)' }}>✦</span>
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', color: 'oklch(0.82 0.10 80)', margin: '0.75rem 0 0.5rem' }}>The Teaching Is Sent</h3>
            <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '0.95rem', color: 'oklch(0.65 0.05 75)', fontStyle: 'italic', marginBottom: '1rem' }}>
              Check your inbox for the full Module 1 PDF. If you do not see it within a few minutes, check your spam folder.
            </p>
            <a
              href={PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'oklch(0.75 0.12 80)', textDecoration: 'underline' }}
            >
              Download PDF directly →
            </a>
          </section>
        )}

        {/* PART 2: PRACTICE — only shown after email submitted */}
        {submitted && <section id="part2">
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', color: 'oklch(0.75 0.12 80)', letterSpacing: '0.1em', marginBottom: '1rem', borderBottom: '1px solid oklch(0.25 0.04 75 / 40%)', paddingBottom: '0.5rem' }}>
            PART 2 — PRACTICAL: AWAKENING THE SPARK
          </h2>

          <div style={{ fontFamily: 'EB Garamond, serif', fontSize: '1.05rem', color: 'oklch(0.80 0.04 75)', lineHeight: 1.9 }} className="flex flex-col gap-6">

            <div>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '0.85rem', color: 'oklch(0.70 0.08 80)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>DRILL 1 — HEART-CENTRE INVOCATION</h3>
              <p>The Heart-Centre Invocation directly addresses the inner Sophia-spark, building a connection to your true pneumatic identity rather than your archonic personality.</p>
              <div className="mt-4 p-5 rounded" style={{ background: 'oklch(0.13 0.015 60)', border: '1px solid oklch(0.30 0.06 75 / 40%)' }}>
                <p style={{ fontFamily: 'Courier Prime, monospace', fontSize: '0.8rem', color: 'oklch(0.65 0.08 75)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>DAILY PRACTICE — 5 MINUTES</p>
                <ol style={{ listStyle: 'none', padding: 0 }} className="flex flex-col gap-2">
                  {[
                    'Sit comfortably. Close your eyes gently.',
                    'Bring your awareness to the centre of your chest.',
                    'With each exhale, silently repeat: "Sophia, I remember."',
                    'Notice any warmth, expansion, or subtle presence.',
                    'Do not force. Simply observe and allow.',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span style={{ color: 'oklch(0.55 0.08 75)', fontFamily: 'Cinzel, serif', fontSize: '0.75rem', minWidth: '1.5rem' }}>{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div>
              <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '0.85rem', color: 'oklch(0.70 0.08 80)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>DRILL 2 — THOUGHT OBSERVATION</h3>
              <p>This practice trains <strong style={{ color: 'oklch(0.82 0.08 80)' }}>noûs</strong> — direct, non-discursive knowing — by teaching you to observe thoughts as external broadcasts rather than your own voice.</p>
              <div className="mt-4 p-5 rounded" style={{ background: 'oklch(0.13 0.015 60)', border: '1px solid oklch(0.30 0.06 75 / 40%)' }}>
                <p style={{ fontFamily: 'Courier Prime, monospace', fontSize: '0.8rem', color: 'oklch(0.65 0.08 75)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>DAILY PRACTICE — 5 MINUTES</p>
                <ol style={{ listStyle: 'none', padding: 0 }} className="flex flex-col gap-2">
                  {[
                    'Sit quietly. Observe the stream of thoughts arising.',
                    'Do not engage. Simply label each thought as it appears.',
                    'Label: "archonic fear" / "archonic desire" / "archonic impulse" / "my true voice"',
                    'Notice: most thoughts are repetitive patterns, not original insights.',
                    'The gap between thoughts is where your spark lives.',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span style={{ color: 'oklch(0.55 0.08 75)', fontFamily: 'Cinzel, serif', fontSize: '0.75rem', minWidth: '1.5rem' }}>{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>}

        {submitted && <section>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', color: 'oklch(0.75 0.12 80)', letterSpacing: '0.1em', marginBottom: '1rem', borderBottom: '1px solid oklch(0.25 0.04 75 / 40%)', paddingBottom: '0.5rem' }}>
            MODULE 1 REVIEW — TEST YOURSELF
          </h2>
          <div className="flex flex-col gap-5" style={{ fontFamily: 'EB Garamond, serif', fontSize: '1rem', color: 'oklch(0.78 0.04 75)' }}>
            {[
              { q: 'What is the Pleroma?', a: 'The state of pure consciousness, fullness, and unity where the Aeons exist — not a place but a state of being.' },
              { q: 'Why did Sophia\'s creation result in the Demiurge?', a: 'She created independently without her masculine counterpart, resulting in raw power without structuring wisdom — producing Yaldabaoth.' },
              { q: 'How do Gnostics view the human body?', a: 'As an "archonic technology" — a temporary vehicle assembled to contain the divine spark, running programmes of fear, hunger, and status-seeking.' },
              { q: 'What is the purpose of the Heart-Centre Invocation?', a: 'To awaken the divine Sophia-spark within the chest and shift identity away from the conditioned archonic self.' },
              { q: 'What does it mean to be in the Pneumatic stage?', a: 'Your divine spark is awakening. You are capable of inner guidance and drawn to truth and liberation beyond material conditioning.' },
            ].map(({ q, a }, i) => (
              <details key={i} className="rounded p-4" style={{ background: 'oklch(0.13 0.015 60)', border: '1px solid oklch(0.22 0.03 75 / 40%)' }}>
                <summary style={{ fontFamily: 'Cinzel, serif', fontSize: '0.85rem', color: 'oklch(0.72 0.08 80)', cursor: 'pointer', letterSpacing: '0.03em', lineHeight: 1.5 }}>
                  {i + 1}. {q}
                </summary>
                <p className="mt-3" style={{ borderTop: '1px solid oklch(0.20 0.03 75 / 30%)', paddingTop: '0.75rem', lineHeight: 1.8 }}>
                  <span style={{ color: 'oklch(0.65 0.08 75)', fontFamily: 'Courier Prime, monospace', fontSize: '0.7rem', letterSpacing: '0.08em' }}>ANSWER: </span>
                  {a}
                </p>
              </details>
            ))}
          </div>
        </section>}

        {/* CTA */}
        <section className="text-center py-8" style={{ borderTop: '1px solid oklch(0.20 0.03 75 / 40%)' }}>
          <span style={{ fontSize: '2rem', color: 'oklch(0.75 0.12 80)' }}>✦</span>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.2rem', color: 'oklch(0.82 0.10 80)', margin: '1rem 0 0.5rem' }}>Ready to Go Deeper?</h2>
          <p style={{ fontFamily: 'EB Garamond, serif', fontSize: '1rem', fontStyle: 'italic', color: 'oklch(0.65 0.05 75)', marginBottom: '1.5rem' }}>
            Continue your journey with the full course pathway — from foundations to initiatory practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/courses" style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem', letterSpacing: '0.15em', background: 'oklch(0.75 0.12 80)', color: 'oklch(0.10 0.015 60)', border: 'none', padding: '0.75rem 1.75rem', borderRadius: '3px', textDecoration: 'none', display: 'inline-block' }}>
              VIEW ALL COURSES
            </Link>
            <Link href="/" style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem', letterSpacing: '0.15em', background: 'none', color: 'oklch(0.60 0.06 75)', border: '1px solid oklch(0.30 0.04 75)', padding: '0.75rem 1.75rem', borderRadius: '3px', textDecoration: 'none', display: 'inline-block' }}>
              ASK THE ORACLE
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
