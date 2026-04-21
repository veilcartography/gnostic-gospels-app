/**
 * Courses page — teaser for structured Gnostic learning paths
 * Locked behind subscription; free users see a subscribe prompt
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

const COURSES = [
  {
    id: 1,
    title: "Introduction to Gnosticism",
    subtitle: "The Hidden Tradition",
    description: "Discover the origins of Gnostic thought, the Nag Hammadi discovery, and the core cosmology that underpins all Gnostic scripture.",
    lessons: 6,
    icon: "✦",
    color: "oklch(0.75 0.12 80)",
  },
  {
    id: 2,
    title: "The Feminine Divine",
    subtitle: "Sophia & the Sacred Feminine",
    description: "Explore the role of Sophia — the fallen and redeemed goddess of wisdom — across the Gospel of Philip, the Apocryphon of John, and Thunder, Perfect Mind.",
    lessons: 8,
    icon: "☽",
    color: "oklch(0.72 0.10 300)",
  },
  {
    id: 3,
    title: "The Gospel of Thomas",
    subtitle: "Sayings of the Living Jesus",
    description: "A verse-by-verse study of the 114 sayings attributed to Jesus in the Gospel of Thomas — the most studied Gnostic text.",
    lessons: 10,
    icon: "◈",
    color: "oklch(0.70 0.10 200)",
  },
  {
    id: 4,
    title: "The Demiurge & the Archons",
    subtitle: "The False Creator",
    description: "Who created the material world? Examine the Gnostic answer through the Apocryphon of John, the Hypostasis of the Archons, and On the Origin of the World.",
    lessons: 7,
    icon: "⊕",
    color: "oklch(0.68 0.10 30)",
  },
  {
    id: 5,
    title: "Gnosis & Liberation",
    subtitle: "The Path to the Pleroma",
    description: "What is gnosis — direct spiritual knowledge — and how does one attain it? Study the soul's journey through the Gospel of Mary and the Exegesis on the Soul.",
    lessons: 6,
    icon: "◎",
    color: "oklch(0.73 0.10 150)",
  },
  {
    id: 6,
    title: "Gnostic Christianity",
    subtitle: "The Other Gospels",
    description: "How do the Gnostic gospels compare to the canonical New Testament? Explore the Gospel of Truth, the Gospel of Philip, and the Sophia of Jesus Christ.",
    lessons: 8,
    icon: "✙",
    color: "oklch(0.72 0.10 60)",
  },
];

export default function Courses() {
  const { user, isAuthenticated } = useAuth();
  const { data: subStatus } = trpc.stripe.status.useQuery();
  const createCheckout = trpc.stripe.createCheckout.useMutation();

  const isSubscribed = subStatus?.isSubscribed ?? false;

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    try {
      toast.info("Opening secure checkout...");
      const result = await createCheckout.mutateAsync({ origin: window.location.origin });
      if (result.url) window.open(result.url, "_blank");
    } catch {
      toast.error("Could not open checkout. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.10 0.015 60)" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid oklch(0.20 0.02 60)" }}>
        <a href="/" style={{ fontFamily: "Cinzel, serif", fontSize: "0.85rem", letterSpacing: "0.15em", color: "oklch(0.65 0.08 75)", textDecoration: "none" }}>
          ← THE ORACLE
        </a>
        <span style={{ fontFamily: "Cinzel, serif", fontSize: "0.75rem", letterSpacing: "0.2em", color: "oklch(0.50 0.06 75)", textTransform: "uppercase" }}>
          Sacred Courses
        </span>
      </nav>

      {/* Hero */}
      <header className="text-center px-6 py-14" style={{ borderBottom: "1px solid oklch(0.18 0.02 60)" }}>
        <p style={{ fontFamily: "Cinzel, serif", fontSize: "0.7rem", letterSpacing: "0.3em", color: "oklch(0.55 0.06 75)", textTransform: "uppercase", marginBottom: "1rem" }}>
          Structured Learning
        </p>
        <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 700, color: "oklch(0.85 0.10 80)", marginBottom: "1rem" }}>
          The Gnostic Mystery School
        </h1>
        <p style={{ fontFamily: "EB Garamond, serif", fontStyle: "italic", fontSize: "1.1rem", color: "oklch(0.65 0.05 75)", maxWidth: "540px", margin: "0 auto 2rem" }}>
          Six in-depth courses guiding you from the discovery of the Nag Hammadi texts to the innermost secrets of Gnostic cosmology.
        </p>

        {!isSubscribed && (
          <div className="inline-flex flex-col items-center gap-3">
            <button
              onClick={handleSubscribe}
              className="px-8 py-3 rounded transition-all"
              style={{
                fontFamily: "Cinzel, serif",
                fontSize: "0.8rem",
                letterSpacing: "0.15em",
                background: "oklch(0.75 0.12 80)",
                color: "oklch(0.10 0.015 60)",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.82 0.12 80)")}
              onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.75 0.12 80)")}
            >
              UNLOCK ALL COURSES — £5.99/MONTH
            </button>
            <p style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.65rem", color: "oklch(0.40 0.04 75)", letterSpacing: "0.05em" }}>
              Includes unlimited Oracle access · Cancel anytime · Test card: 4242 4242 4242 4242
            </p>
          </div>
        )}

        {isSubscribed && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded" style={{ background: "oklch(0.15 0.03 130)", border: "1px solid oklch(0.40 0.08 130 / 50%)" }}>
            <span style={{ color: "oklch(0.70 0.12 130)", fontSize: "0.8rem" }}>✓</span>
            <span style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.7rem", color: "oklch(0.65 0.08 130)", letterSpacing: "0.05em" }}>ACTIVE SUBSCRIPTION</span>
          </div>
        )}
      </header>

      {/* Course grid */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map(course => (
            <div
              key={course.id}
              className="rounded p-6 flex flex-col gap-3 transition-all relative overflow-hidden"
              style={{
                background: "oklch(0.13 0.015 60)",
                border: `1px solid oklch(0.25 0.03 75 / 40%)`,
                cursor: isSubscribed ? "pointer" : "default",
              }}
              onMouseEnter={e => { if (isSubscribed) e.currentTarget.style.borderColor = `${course.color} / 50%`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "oklch(0.25 0.03 75 / 40%)"; }}
            >
              {/* Lock overlay for non-subscribers */}
              {!isSubscribed && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded"
                  style={{ background: "oklch(0.10 0.015 60 / 70%)", backdropFilter: "blur(2px)", zIndex: 2 }}
                  onClick={handleSubscribe}
                >
                  <span style={{ fontSize: "1.5rem", color: "oklch(0.55 0.06 75)" }}>⊗</span>
                  <span style={{ fontFamily: "Cinzel, serif", fontSize: "0.65rem", letterSpacing: "0.15em", color: "oklch(0.55 0.06 75)", cursor: "pointer" }}>
                    SUBSCRIBE TO UNLOCK
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <span style={{ fontSize: "1.5rem", color: course.color }}>{course.icon}</span>
                <div>
                  <p style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.65rem", color: "oklch(0.45 0.04 75)", letterSpacing: "0.08em" }}>
                    {course.subtitle.toUpperCase()}
                  </p>
                  <h3 style={{ fontFamily: "Cinzel, serif", fontSize: "1rem", color: "oklch(0.85 0.08 80)", lineHeight: 1.3 }}>
                    {course.title}
                  </h3>
                </div>
              </div>

              <p style={{ fontFamily: "EB Garamond, serif", fontSize: "0.95rem", color: "oklch(0.60 0.05 75)", lineHeight: 1.7, flex: 1 }}>
                {course.description}
              </p>

              <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid oklch(0.20 0.02 60)" }}>
                <span style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.65rem", color: "oklch(0.40 0.04 75)", letterSpacing: "0.05em" }}>
                  {course.lessons} LESSONS
                </span>
                {isSubscribed && (
                  <span style={{ fontFamily: "Cinzel, serif", fontSize: "0.65rem", color: course.color, letterSpacing: "0.1em" }}>
                    BEGIN →
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-8 text-center" style={{ borderTop: "1px solid oklch(0.20 0.02 60)" }}>
        <a
          href="https://www.youtube.com/@veilcartography"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.65rem", color: "oklch(0.40 0.04 75)", letterSpacing: "0.08em", textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.75 0.12 80)")}
          onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.40 0.04 75)")}
        >
          @VEILCARTOGRAPHY ON YOUTUBE
        </a>
      </footer>
    </div>
  );
}
