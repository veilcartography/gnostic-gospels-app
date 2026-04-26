/**
 * Courses page — reads from database (admin-managed)
 * All courses are free to access — no paywall
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Courses() {
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  const { data: subStatus } = trpc.stripe.status.useQuery();
  const createCheckout = trpc.stripe.createCheckout.useMutation();
  const { data: dbCourses, isLoading } = trpc.courses.list.useQuery();

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
      <nav className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid oklch(0.20 0.02 60)", position: "sticky", top: 0, background: "oklch(0.09 0.015 60 / 95%)", backdropFilter: "blur(8px)", zIndex: 50 }}>
        <a href="/" style={{ fontFamily: "Cinzel, serif", fontSize: "0.85rem", letterSpacing: "0.15em", color: "oklch(0.65 0.08 75)", textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.85 0.10 80)")}
          onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.65 0.08 75)")}
        >← THE ORACLE</a>
        <div className="flex items-center gap-4">
          {!isAuthenticated && (
            <a href={getLoginUrl()} style={{ fontFamily: "Cinzel, serif", fontSize: "0.65rem", letterSpacing: "0.12em", color: "oklch(0.60 0.06 75)", textDecoration: "none", border: "1px solid oklch(0.30 0.03 75)", padding: "0.35rem 0.9rem", borderRadius: "3px" }}
              onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.75 0.12 80)")}
              onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.60 0.06 75)")}
            >LOGIN</a>
          )}
          {isAuthenticated && !isSubscribed && (
            <button onClick={handleSubscribe} style={{ fontFamily: "Cinzel, serif", fontSize: "0.65rem", letterSpacing: "0.12em", background: "oklch(0.75 0.12 80)", color: "oklch(0.10 0.015 60)", border: "none", padding: "0.35rem 0.9rem", borderRadius: "3px", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.82 0.12 80)")}
              onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.75 0.12 80)")}
            >SUBSCRIBE — £5.99/MONTH</button>
          )}
          {isAuthenticated && isSubscribed && (
            <span style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.65rem", color: "oklch(0.60 0.08 130)", letterSpacing: "0.05em" }}>✓ SUBSCRIBED</span>
          )}
          {user?.role === "admin" && (
            <a href="/admin/courses" style={{ fontFamily: "Cinzel, serif", fontSize: "0.65rem", letterSpacing: "0.12em", color: "oklch(0.75 0.12 80)", textDecoration: "none", border: "1px solid oklch(0.75 0.12 80 / 40%)", padding: "0.35rem 0.9rem", borderRadius: "3px" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "oklch(0.75 0.12 80)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "oklch(0.75 0.12 80 / 40%)")}
            >MANAGE COURSES</a>
          )}
        </div>
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
      </div>

      {/* Course grid */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 pb-16">
        {isLoading && (
          <div className="text-center py-12">
            <p style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.7rem", color: "oklch(0.45 0.04 75)", letterSpacing: "0.1em" }}>LOADING COURSES...</p>
          </div>
        )}
        {!isLoading && (!dbCourses || dbCourses.length === 0) && (
          <div className="text-center py-12">
            <p style={{ fontFamily: "EB Garamond, serif", fontStyle: "italic", fontSize: "1rem", color: "oklch(0.50 0.04 75)" }}>Courses are being prepared. Check back soon.</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dbCourses?.map(course => (
            <div
              key={course.id}
              className="rounded p-6 flex flex-col gap-4"
              style={{
                background: "oklch(0.13 0.015 60)",
                border: `1px solid ${course.color ?? "oklch(0.75 0.12 80)"}30`,
              }}
            >
              <div>
                <span style={{ fontSize: "1.5rem", color: course.color ?? "oklch(0.75 0.12 80)" }}>{course.icon ?? "✦"}</span>
                <h2 style={{ fontFamily: "Cinzel, serif", fontSize: "1rem", color: "oklch(0.85 0.10 80)", marginTop: "0.5rem", lineHeight: 1.3 }}>
                  {course.title}
                </h2>
                {course.subtitle && (
                  <p style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.65rem", color: course.color ?? "oklch(0.75 0.12 80)", letterSpacing: "0.1em", marginTop: "0.2rem" }}>
                    {course.subtitle}
                  </p>
                )}
              </div>
              {course.description && (
                <p style={{ fontFamily: "EB Garamond, serif", fontSize: "0.95rem", color: "oklch(0.65 0.05 75)", lineHeight: 1.7, flex: 1 }}>
                  {course.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.65rem", color: "oklch(0.40 0.04 75)", letterSpacing: "0.05em" }}>
                  FREE ACCESS
                </span>
                <button
                  onClick={() => navigate(`/courses/${course.slug}/lessons`)}
                  style={{
                    fontFamily: "Cinzel, serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.12em",
                    background: course.color ?? "oklch(0.75 0.12 80)",
                    color: "oklch(0.10 0.015 60)",
                    border: "none",
                    padding: "0.4rem 1rem",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  BEGIN
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-8 text-center" style={{ borderTop: "1px solid oklch(0.20 0.02 60)" }}>
        <a href="https://www.youtube.com/@veilcartography" target="_blank" rel="noopener noreferrer"
          style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.65rem", color: "oklch(0.40 0.04 75)", letterSpacing: "0.08em", textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.75 0.12 80)")}
          onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.40 0.04 75)")}
        >@VEILCARTOGRAPHY ON YOUTUBE</a>
      </footer>
    </div>
  );
}
