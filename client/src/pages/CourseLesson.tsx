/**
 * CourseLesson — individual lesson reader page
 * Route: /courses/:courseId/:lessonId  (lessonId = lesson slug or "lessons" for index)
 * All courses are free — no paywall
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useParams, useLocation } from "wouter";
import { Streamdown } from "streamdown";

export default function CourseLesson() {
  const params = useParams<{ courseId: string; lessonId: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const { data: course, isLoading } = trpc.courses.get.useQuery({ slug: params.courseId });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.10 0.015 60)" }}>
        <p style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.7rem", color: "oklch(0.45 0.04 75)", letterSpacing: "0.1em" }}>LOADING...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.10 0.015 60)" }}>
        <p style={{ fontFamily: "Cinzel, serif", color: "oklch(0.55 0.06 75)" }}>Course not found.</p>
      </div>
    );
  }

  // "lessons" is the index view — show lesson list
  const isIndex = params.lessonId === "lessons" || !params.lessonId;
  const lesson = isIndex ? null : course.lessons.find(l => l.slug === params.lessonId);
  const currentIndex = lesson ? course.lessons.findIndex(l => l.slug === params.lessonId) : -1;
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.10 0.015 60)" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid oklch(0.20 0.02 60)", position: "sticky", top: 0, background: "oklch(0.09 0.015 60 / 95%)", backdropFilter: "blur(8px)", zIndex: 50 }}>
        <a href="/courses" style={{ fontFamily: "Cinzel, serif", fontSize: "0.85rem", letterSpacing: "0.15em", color: "oklch(0.65 0.08 75)", textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.85 0.10 80)")}
          onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.65 0.08 75)")}
        >← COURSES</a>
        <div className="flex items-center gap-4">
          {lesson && (
            <span style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: "oklch(0.40 0.04 75)" }}>
              {currentIndex + 1} / {course.lessons.length}
            </span>
          )}
          {user?.role === "admin" && (
            <a href="/admin/courses" style={{ fontFamily: "Cinzel, serif", fontSize: "0.65rem", letterSpacing: "0.12em", color: "oklch(0.75 0.12 80)", textDecoration: "none", border: "1px solid oklch(0.75 0.12 80 / 40%)", padding: "0.3rem 0.8rem", borderRadius: "3px" }}>MANAGE</a>
          )}
        </div>
      </nav>

      {/* Course index — lesson list */}
      {isIndex && (
        <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
          <div className="mb-10">
            <span style={{ fontSize: "2rem", color: course.color ?? "oklch(0.75 0.12 80)" }}>{course.icon ?? "✦"}</span>
            <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "clamp(1.5rem, 4vw, 2.2rem)", color: "oklch(0.85 0.10 80)", marginTop: "0.5rem", lineHeight: 1.3 }}>{course.title}</h1>
            {course.subtitle && <p style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.65rem", color: course.color ?? "oklch(0.75 0.12 80)", letterSpacing: "0.1em", marginTop: "0.3rem" }}>{course.subtitle}</p>}
            {course.description && <p style={{ fontFamily: "EB Garamond, serif", fontStyle: "italic", fontSize: "1rem", color: "oklch(0.65 0.05 75)", marginTop: "1rem", lineHeight: 1.7 }}>{course.description}</p>}
          </div>
          <div style={{ borderTop: "1px solid oklch(0.20 0.02 60)", paddingTop: "1.5rem" }}>
            <p style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: "oklch(0.40 0.04 75)", marginBottom: "1rem" }}>LESSONS</p>
            {course.lessons.map((l, idx) => (
              <button key={l.id} onClick={() => navigate(`/courses/${course.slug}/${l.slug}`)}
                className="w-full text-left"
                style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.85rem 1rem", marginBottom: "0.4rem", background: "oklch(0.13 0.015 60)", border: "1px solid oklch(0.20 0.02 60)", borderRadius: "4px", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = course.color ?? "oklch(0.75 0.12 80)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "oklch(0.20 0.02 60)")}
              >
                <span style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.6rem", color: "oklch(0.40 0.04 75)", minWidth: "1.5rem" }}>{idx + 1}</span>
                <span style={{ fontFamily: "EB Garamond, serif", fontSize: "1rem", color: "oklch(0.80 0.05 75)" }}>{l.title}</span>
              </button>
            ))}
          </div>
        </main>
      )}

      {/* Lesson not found */}
      {!isIndex && !lesson && (
        <div className="flex-1 flex items-center justify-center">
          <p style={{ fontFamily: "Cinzel, serif", color: "oklch(0.55 0.06 75)" }}>Lesson not found.</p>
        </div>
      )}

      {/* Lesson content */}
      {!isIndex && lesson && (
        <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
          <div className="mb-10">
            <p style={{ fontFamily: "Courier Prime, monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "oklch(0.45 0.04 75)", marginBottom: "0.5rem" }}>
              LESSON {currentIndex + 1}
            </p>
            <h1 style={{ fontFamily: "Cinzel, serif", fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "oklch(0.85 0.10 80)", lineHeight: 1.3 }}>
              {lesson.title}
            </h1>
          </div>

          <div
            className="prose prose-invert max-w-none"
            style={{ fontFamily: "EB Garamond, serif", fontSize: "1.1rem", lineHeight: 1.85, color: "oklch(0.75 0.05 75)" }}
          >
            <Streamdown>{lesson.content}</Streamdown>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-16 pt-8" style={{ borderTop: "1px solid oklch(0.20 0.02 60)" }}>
            {prevLesson ? (
              <button onClick={() => navigate(`/courses/${course.slug}/${prevLesson.slug}`)}
                style={{ fontFamily: "Cinzel, serif", fontSize: "0.75rem", letterSpacing: "0.1em", color: "oklch(0.65 0.08 75)", background: "none", border: "1px solid oklch(0.25 0.03 75 / 50%)", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "oklch(0.65 0.08 75)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "oklch(0.25 0.03 75 / 50%)")}
              >← PREVIOUS</button>
            ) : (
              <button onClick={() => navigate(`/courses/${course.slug}/lessons`)}
                style={{ fontFamily: "Cinzel, serif", fontSize: "0.75rem", letterSpacing: "0.1em", color: "oklch(0.65 0.08 75)", background: "none", border: "1px solid oklch(0.25 0.03 75 / 50%)", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" }}
              >← ALL LESSONS</button>
            )}

            {nextLesson ? (
              <button onClick={() => navigate(`/courses/${course.slug}/${nextLesson.slug}`)}
                style={{ fontFamily: "Cinzel, serif", fontSize: "0.75rem", letterSpacing: "0.1em", color: "oklch(0.10 0.015 60)", background: "oklch(0.75 0.12 80)", border: "none", padding: "0.5rem 1.25rem", borderRadius: "4px", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.82 0.12 80)")}
                onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.75 0.12 80)")}
              >NEXT LESSON →</button>
            ) : (
              <button onClick={() => navigate("/courses")}
                style={{ fontFamily: "Cinzel, serif", fontSize: "0.75rem", letterSpacing: "0.1em", color: "oklch(0.10 0.015 60)", background: "oklch(0.75 0.12 80)", border: "none", padding: "0.5rem 1.25rem", borderRadius: "4px", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.82 0.12 80)")}
                onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.75 0.12 80)")}
              >COURSE COMPLETE ✦</button>
            )}
          </div>
        </main>
      )}

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
