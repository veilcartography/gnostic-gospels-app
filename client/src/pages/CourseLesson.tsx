/**
 * CourseLesson — individual lesson reader page
 * Route: /courses/:courseId/:lessonId
 * Subscriber-only access
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { getCourseById, getLessonById } from "@/data/courseContent";
import { useParams, useLocation } from "wouter";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

export default function CourseLesson() {
  const params = useParams<{ courseId: string; lessonId: string }>();
  const [, navigate] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { data: subStatus } = trpc.stripe.status.useQuery();
  const createCheckout = trpc.stripe.createCheckout.useMutation();

  const isOwnerOrAdmin = user?.role === 'admin';
  const isSubscribed = isOwnerOrAdmin || (subStatus?.isSubscribed ?? false);

  const course = getCourseById(params.courseId);
  const lesson = getLessonById(params.courseId, params.lessonId);

  if (!course || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.10 0.015 60)" }}>
        <p style={{ fontFamily: "Cinzel, serif", color: "oklch(0.55 0.06 75)" }}>Lesson not found.</p>
      </div>
    );
  }

  const currentIndex = course.lessons.findIndex(l => l.id === params.lessonId);
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;

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
        <a
          href="/courses"
          style={{ fontFamily: "Cinzel, serif", fontSize: "0.85rem", letterSpacing: "0.15em", color: "oklch(0.65 0.08 75)", textDecoration: "none" }}
        >
          ← {course.title.toUpperCase()}
        </a>
        <span style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: "oklch(0.40 0.04 75)" }}>
          {currentIndex + 1} / {course.lessons.length}
        </span>
      </nav>

      {/* Paywall for non-subscribers */}
      {!isSubscribed ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center gap-6">
          <span style={{ fontSize: "2rem", color: "oklch(0.55 0.06 75)" }}>⊗</span>
          <h2 style={{ fontFamily: "Cinzel, serif", fontSize: "1.5rem", color: "oklch(0.85 0.10 80)" }}>
            Subscriber Access Required
          </h2>
          <p style={{ fontFamily: "EB Garamond, serif", fontStyle: "italic", fontSize: "1rem", color: "oklch(0.60 0.05 75)", maxWidth: "400px" }}>
            Unlock all courses and unlimited Oracle access for £5.99/month.
          </p>
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
        </div>
      ) : (
        <>
          {/* Lesson content */}
          <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">

            {/* Lesson header */}
            <div className="mb-10">
              <p style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "oklch(0.45 0.04 75)", marginBottom: "0.5rem" }}>
                LESSON {currentIndex + 1}
              </p>
              <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "oklch(0.85 0.10 80)", lineHeight: 1.3 }}>
                {lesson.title}
              </h1>
            </div>

            {/* Lesson body — rendered markdown */}
            <div
              className="prose prose-invert max-w-none"
              style={{
                fontFamily: "EB Garamond, serif",
                fontSize: "1.1rem",
                lineHeight: 1.85,
                color: "oklch(0.75 0.05 75)",
              }}
            >
              <Streamdown>{lesson.content}</Streamdown>
            </div>

            {/* Lesson navigation */}
            <div className="flex items-center justify-between mt-16 pt-8" style={{ borderTop: "1px solid oklch(0.20 0.02 60)" }}>
              {prevLesson ? (
                <button
                  onClick={() => navigate(`/courses/${params.courseId}/${prevLesson.id}`)}
                  style={{
                    fontFamily: "Cinzel, serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    color: "oklch(0.65 0.08 75)",
                    background: "none",
                    border: "1px solid oklch(0.25 0.03 75 / 50%)",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "oklch(0.65 0.08 75)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "oklch(0.25 0.03 75 / 50%)")}
                >
                  ← PREVIOUS
                </button>
              ) : <div />}

              {nextLesson ? (
                <button
                  onClick={() => navigate(`/courses/${params.courseId}/${nextLesson.id}`)}
                  style={{
                    fontFamily: "Cinzel, serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    color: "oklch(0.10 0.015 60)",
                    background: "oklch(0.75 0.12 80)",
                    border: "none",
                    padding: "0.5rem 1.25rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.82 0.12 80)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.75 0.12 80)")}
                >
                  NEXT LESSON →
                </button>
              ) : (
                <button
                  onClick={() => navigate("/courses")}
                  style={{
                    fontFamily: "Cinzel, serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    color: "oklch(0.10 0.015 60)",
                    background: "oklch(0.75 0.12 80)",
                    border: "none",
                    padding: "0.5rem 1.25rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.82 0.12 80)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.75 0.12 80)")}
                >
                  COURSE COMPLETE ✦
                </button>
              )}
            </div>
          </main>
        </>
      )}

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
