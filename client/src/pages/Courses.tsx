/**
 * Courses page — real Gnostic learning paths from Google Drive content
 * Subscribers can open lessons; free users see a subscribe prompt
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { COURSES } from "@/data/courseContent";
import { useLocation } from "wouter";
import { toast } from "sonner";

// Placeholder courses for courses not yet built
const PLACEHOLDER_COURSES = [
  {
    id: "gospel-of-thomas",
    title: "The Gospel of Thomas",
    subtitle: "Sayings of the Living Jesus",
    description: "A verse-by-verse study of the 114 sayings attributed to Jesus — the most studied Gnostic text.",
    icon: "◈",
    color: "oklch(0.70 0.10 200)",
    lessons: [],
    comingSoon: true,
  },
  {
    id: "demiurge-archons",
    title: "The Demiurge & the Archons",
    subtitle: "The False Creator",
    description: "Who created the material world? Examine the Gnostic answer through the Apocryphon of John and the Hypostasis of the Archons.",
    icon: "⊕",
    color: "oklch(0.68 0.10 30)",
    lessons: [],
    comingSoon: true,
  },
  {
    id: "gnosis-liberation",
    title: "Gnosis & Liberation",
    subtitle: "The Path to the Pleroma",
    description: "What is gnosis and how does it liberate? A practical study of awakening consciousness through the Gnostic texts.",
    icon: "⊗",
    color: "oklch(0.70 0.08 130)",
    lessons: [],
    comingSoon: true,
  },
  {
    id: "gospel-of-mary",
    title: "The Gospel of Mary",
    subtitle: "Mary Magdalene's Vision",
    description: "The only surviving gospel attributed to a woman — Mary Magdalene's account of the soul's ascent through the planetary powers.",
    icon: "✧",
    color: "oklch(0.72 0.10 300)",
    lessons: [],
    comingSoon: true,
  },
];

const ALL_COURSES = [
  ...COURSES.map(c => ({ ...c, comingSoon: false })),
  ...PLACEHOLDER_COURSES,
];

export default function Courses() {
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  const { data: subStatus } = trpc.stripe.status.useQuery();
  const createCheckout = trpc.stripe.createCheckout.useMutation();

  // Courses are free to all — no paywall
  const isSubscribed = true;

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

  const handleStartCourse = (courseId: string, firstLessonId: string) => {
    if (!isSubscribed) {
      handleSubscribe();
      return;
    }
    navigate(`/courses/${courseId}/${firstLessonId}`);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.10 0.015 60)" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid oklch(0.20 0.02 60)" }}>
        <a
          href="/"
          style={{ fontFamily: "Cinzel, serif", fontSize: "0.85rem", letterSpacing: "0.15em", color: "oklch(0.65 0.08 75)", textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.85 0.10 80)")}
          onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.65 0.08 75)")}
        >
          ← THE ORACLE
        </a>
        {!isSubscribed && (
          <button
            onClick={handleSubscribe}
            style={{ fontFamily: "Cinzel, serif", fontSize: "0.65rem", letterSpacing: "0.12em", background: "oklch(0.75 0.12 80)", color: "oklch(0.10 0.015 60)", border: "none", padding: "0.35rem 0.9rem", borderRadius: "3px", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.82 0.12 80)")}
            onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.75 0.12 80)")}
          >
            SUBSCRIBE — £5.99/MONTH
          </button>
        )}
        {isSubscribed && (
          <span style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.65rem", color: "oklch(0.60 0.08 130)", letterSpacing: "0.05em" }}>✓ SUBSCRIBED</span>
        )}
      </nav>

      {/* Header */}
      <div className="text-center py-16 px-6">
        <p style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.65rem", letterSpacing: "0.3em", color: "oklch(0.45 0.04 75)", marginBottom: "1rem" }}>
          THE INNER CURRICULUM
        </p>
        <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "clamp(1.8rem, 5vw, 3rem)", color: "oklch(0.85 0.10 80)", marginBottom: "1rem" }}>
          Gnostic Courses
        </h1>
        <p style={{ fontFamily: "EB Garamond, serif", fontStyle: "italic", fontSize: "1.1rem", color: "oklch(0.65 0.05 75)", maxWidth: "560px", margin: "0 auto" }}>
          Structured learning paths drawn from the Nag Hammadi Library and the initiatory Gnostic tradition.
        </p>
        {!isSubscribed && (
          <div className="mt-8 inline-block px-6 py-4 rounded" style={{ background: "oklch(0.13 0.015 60)", border: "1px solid oklch(0.45 0.08 80 / 40%)" }}>
            <p style={{ fontFamily: "EB Garamond, serif", fontSize: "0.95rem", color: "oklch(0.70 0.06 75)", marginBottom: "0.75rem" }}>
              Subscribe for £5.99/month to unlock all courses and unlimited Oracle access.
            </p>
            <button
              onClick={handleSubscribe}
              style={{ fontFamily: "Cinzel, serif", fontSize: "0.75rem", letterSpacing: "0.15em", background: "oklch(0.75 0.12 80)", color: "oklch(0.10 0.015 60)", border: "none", padding: "0.6rem 1.5rem", borderRadius: "4px", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.82 0.12 80)")}
              onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.75 0.12 80)")}
            >
              UNLOCK ALL COURSES
            </button>
          </div>
        )}
      </div>

      {/* Course grid */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ALL_COURSES.map(course => (
            <div
              key={course.id}
              className="rounded p-6 flex flex-col gap-4"
              style={{
                background: "oklch(0.13 0.015 60)",
                border: `1px solid ${course.color}30`,
                opacity: course.comingSoon ? 0.65 : 1,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span style={{ fontSize: "1.5rem", color: course.color }}>{course.icon}</span>
                  <h2 style={{ fontFamily: "Cinzel, serif", fontSize: "1rem", color: "oklch(0.85 0.10 80)", marginTop: "0.5rem", lineHeight: 1.3 }}>
                    {course.title}
                  </h2>
                  <p style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.65rem", color: course.color, letterSpacing: "0.1em", marginTop: "0.2rem" }}>
                    {course.subtitle}
                  </p>
                </div>
                {course.comingSoon && (
                  <span style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.55rem", letterSpacing: "0.1em", color: "oklch(0.45 0.04 75)", border: "1px solid oklch(0.25 0.03 75 / 50%)", padding: "0.2rem 0.5rem", borderRadius: "2px", whiteSpace: "nowrap", flexShrink: 0 }}>
                    COMING SOON
                  </span>
                )}
              </div>

              <p style={{ fontFamily: "EB Garamond, serif", fontSize: "0.95rem", color: "oklch(0.65 0.05 75)", lineHeight: 1.7, flex: 1 }}>
                {course.description}
              </p>

              <div className="flex items-center justify-between">
                <span style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.65rem", color: "oklch(0.40 0.04 75)", letterSpacing: "0.05em" }}>
                  {course.lessons.length > 0 ? `${course.lessons.length} LESSONS` : "LESSONS COMING"}
                </span>
                {!course.comingSoon && course.lessons.length > 0 && (
                  <button
                    onClick={() => handleStartCourse(course.id, course.lessons[0].id)}
                    style={{
                      fontFamily: "Cinzel, serif",
                      fontSize: "0.7rem",
                      letterSpacing: "0.12em",
                      background: isSubscribed ? course.color : "oklch(0.20 0.02 60)",
                      color: isSubscribed ? "oklch(0.10 0.015 60)" : "oklch(0.55 0.06 75)",
                      border: isSubscribed ? "none" : `1px solid ${course.color}50`,
                      padding: "0.4rem 1rem",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                    onMouseEnter={e => { if (isSubscribed) e.currentTarget.style.opacity = "0.85"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                  >
                    {isSubscribed ? "BEGIN" : "🔒 SUBSCRIBE"}
                  </button>
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
