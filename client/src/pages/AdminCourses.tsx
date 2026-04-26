/**
 * AdminCourses — admin-only course & lesson editor
 * Route: /admin/courses
 * Access: admin role only
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { toast } from "sonner";

const S = {
  bg: "oklch(0.10 0.015 60)",
  card: "oklch(0.13 0.015 60)",
  border: "oklch(0.20 0.02 60)",
  gold: "oklch(0.75 0.12 80)",
  goldDim: "oklch(0.60 0.06 75)",
  text: "oklch(0.80 0.05 75)",
  textDim: "oklch(0.55 0.04 75)",
  danger: "oklch(0.55 0.15 20)",
  cinzel: "Cinzel, serif",
  garamond: "EB Garamond, serif",
  mono: "Courier Prime, monospace",
};

type Lesson = { id: number; slug: string; title: string; content: string; sortOrder: number };
type Course = { id: number; slug: string; title: string; subtitle: string | null; description: string | null; icon: string | null; color: string | null; sortOrder: number; published: "yes" | "no"; lessons: Lesson[] };

export default function AdminCourses() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [view, setView] = useState<"courses" | "lessons" | "editCourse" | "editLesson" | "newCourse" | "newLesson">("courses");

  // Forms
  const [courseForm, setCourseForm] = useState({ slug: "", title: "", subtitle: "", description: "", icon: "✦", color: "oklch(0.75 0.12 80)", published: "yes" as "yes" | "no" });
  const [lessonForm, setLessonForm] = useState({ slug: "", title: "", content: "" });

  const { data: allCourses, isLoading } = trpc.courses.adminList.useQuery();

  const seed = trpc.courses.seed.useMutation({ onSuccess: (r) => { toast.success(r.message); utils.courses.adminList.invalidate(); } });
  const createCourse = trpc.courses.createCourse.useMutation({ onSuccess: () => { toast.success("Course created"); utils.courses.adminList.invalidate(); setView("courses"); } });
  const updateCourse = trpc.courses.updateCourse.useMutation({ onSuccess: () => { toast.success("Course updated"); utils.courses.adminList.invalidate(); setView("lessons"); } });
  const deleteCourse = trpc.courses.deleteCourse.useMutation({ onSuccess: () => { toast.success("Course deleted"); utils.courses.adminList.invalidate(); setView("courses"); setSelectedCourse(null); } });
  const createLesson = trpc.courses.createLesson.useMutation({ onSuccess: () => { toast.success("Lesson created"); utils.courses.adminList.invalidate(); setView("lessons"); } });
  const updateLesson = trpc.courses.updateLesson.useMutation({ onSuccess: () => { toast.success("Lesson updated"); utils.courses.adminList.invalidate(); setView("lessons"); } });
  const deleteLesson = trpc.courses.deleteLesson.useMutation({ onSuccess: () => { toast.success("Lesson deleted"); utils.courses.adminList.invalidate(); setView("lessons"); } });

  if (loading) return <div style={{ background: S.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: S.goldDim, fontFamily: S.cinzel }}>Loading...</div>;
  if (!user || user.role !== "admin") {
    return (
      <div style={{ background: S.bg, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <p style={{ fontFamily: S.cinzel, color: S.danger, fontSize: "1rem" }}>Access denied — admin only.</p>
        <button onClick={() => navigate("/")} style={{ fontFamily: S.cinzel, fontSize: "0.7rem", letterSpacing: "0.1em", color: S.goldDim, background: "none", border: `1px solid ${S.border}`, padding: "0.4rem 1rem", borderRadius: "4px", cursor: "pointer" }}>← RETURN TO ORACLE</button>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = { width: "100%", background: "oklch(0.08 0.01 60)", border: `1px solid ${S.border}`, borderRadius: "4px", padding: "0.5rem 0.75rem", color: S.text, fontFamily: S.garamond, fontSize: "1rem", outline: "none", boxSizing: "border-box" };
  const labelStyle: React.CSSProperties = { fontFamily: S.mono, fontSize: "0.6rem", letterSpacing: "0.15em", color: S.textDim, display: "block", marginBottom: "0.3rem" };
  const btnPrimary: React.CSSProperties = { fontFamily: S.cinzel, fontSize: "0.7rem", letterSpacing: "0.12em", background: S.gold, color: "oklch(0.10 0.015 60)", border: "none", padding: "0.5rem 1.2rem", borderRadius: "4px", cursor: "pointer" };
  const btnSecondary: React.CSSProperties = { fontFamily: S.cinzel, fontSize: "0.7rem", letterSpacing: "0.12em", background: "none", color: S.goldDim, border: `1px solid ${S.border}`, padding: "0.5rem 1.2rem", borderRadius: "4px", cursor: "pointer" };
  const btnDanger: React.CSSProperties = { fontFamily: S.cinzel, fontSize: "0.7rem", letterSpacing: "0.12em", background: "none", color: S.danger, border: `1px solid ${S.danger}40`, padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" };

  return (
    <div style={{ background: S.bg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1.5rem", borderBottom: `1px solid ${S.border}`, position: "sticky", top: 0, background: "oklch(0.09 0.015 60 / 95%)", backdropFilter: "blur(8px)", zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={() => navigate("/")} style={{ ...btnSecondary, padding: "0.3rem 0.8rem", fontSize: "0.65rem" }}>← ORACLE</button>
          <span style={{ fontFamily: S.cinzel, fontSize: "0.85rem", letterSpacing: "0.15em", color: S.gold }}>COURSE ADMIN</span>
        </div>
        {(allCourses?.length ?? 0) === 0 && (
          <button onClick={() => seed.mutate()} disabled={seed.isPending} style={btnPrimary}>
            {seed.isPending ? "SEEDING..." : "SEED EXISTING COURSES"}
          </button>
        )}
      </nav>

      <main style={{ flex: 1, maxWidth: "900px", margin: "0 auto", width: "100%", padding: "2rem 1.5rem" }}>

        {/* ── COURSE LIST ── */}
        {view === "courses" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h1 style={{ fontFamily: S.cinzel, fontSize: "1.3rem", color: S.gold, margin: 0 }}>All Courses</h1>
              <button onClick={() => { setCourseForm({ slug: "", title: "", subtitle: "", description: "", icon: "✦", color: "oklch(0.75 0.12 80)", published: "yes" }); setView("newCourse"); }} style={btnPrimary}>+ NEW COURSE</button>
            </div>
            {isLoading && <p style={{ color: S.textDim, fontFamily: S.mono, fontSize: "0.75rem" }}>Loading...</p>}
            {allCourses?.map(c => (
              <div key={c.id} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: "6px", padding: "1rem 1.25rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.2rem" }}>{c.icon}</span>
                    <span style={{ fontFamily: S.cinzel, fontSize: "0.95rem", color: S.text }}>{c.title}</span>
                    {c.published === "no" && <span style={{ fontFamily: S.mono, fontSize: "0.55rem", color: S.danger, border: `1px solid ${S.danger}40`, padding: "0.1rem 0.4rem", borderRadius: "2px" }}>HIDDEN</span>}
                  </div>
                  <p style={{ fontFamily: S.mono, fontSize: "0.6rem", color: S.textDim, margin: "0.2rem 0 0" }}>{c.lessons.length} LESSONS</p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => { setSelectedCourse(c as Course); setView("lessons"); }} style={btnSecondary}>LESSONS</button>
                  <button onClick={() => { setSelectedCourse(c as Course); setCourseForm({ slug: c.slug, title: c.title, subtitle: c.subtitle ?? "", description: c.description ?? "", icon: c.icon ?? "✦", color: c.color ?? "oklch(0.75 0.12 80)", published: c.published }); setView("editCourse"); }} style={btnSecondary}>EDIT</button>
                  <button onClick={() => { if (confirm(`Delete "${c.title}" and all its lessons?`)) deleteCourse.mutate({ id: c.id }); }} style={btnDanger}>DELETE</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── NEW COURSE FORM ── */}
        {view === "newCourse" && (
          <div>
            <h2 style={{ fontFamily: S.cinzel, fontSize: "1.1rem", color: S.gold, marginBottom: "1.5rem" }}>New Course</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div><label style={labelStyle}>SLUG (URL-safe ID, e.g. gospel-of-thomas)</label><input style={inputStyle} value={courseForm.slug} onChange={e => setCourseForm(f => ({ ...f, slug: e.target.value }))} placeholder="gospel-of-thomas" /></div>
              <div><label style={labelStyle}>TITLE</label><input style={inputStyle} value={courseForm.title} onChange={e => setCourseForm(f => ({ ...f, title: e.target.value }))} placeholder="The Gospel of Thomas" /></div>
              <div><label style={labelStyle}>SUBTITLE</label><input style={inputStyle} value={courseForm.subtitle} onChange={e => setCourseForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="Sayings of the Living Jesus" /></div>
              <div><label style={labelStyle}>DESCRIPTION</label><textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} value={courseForm.description} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>ICON (emoji)</label><input style={inputStyle} value={courseForm.icon} onChange={e => setCourseForm(f => ({ ...f, icon: e.target.value }))} /></div>
                <div style={{ flex: 2 }}><label style={labelStyle}>COLOR (oklch)</label><input style={inputStyle} value={courseForm.color} onChange={e => setCourseForm(f => ({ ...f, color: e.target.value }))} /></div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button onClick={() => createCourse.mutate(courseForm)} disabled={createCourse.isPending || !courseForm.slug || !courseForm.title} style={btnPrimary}>{createCourse.isPending ? "SAVING..." : "CREATE COURSE"}</button>
                <button onClick={() => setView("courses")} style={btnSecondary}>CANCEL</button>
              </div>
            </div>
          </div>
        )}

        {/* ── EDIT COURSE FORM ── */}
        {view === "editCourse" && selectedCourse && (
          <div>
            <h2 style={{ fontFamily: S.cinzel, fontSize: "1.1rem", color: S.gold, marginBottom: "1.5rem" }}>Edit Course</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div><label style={labelStyle}>TITLE</label><input style={inputStyle} value={courseForm.title} onChange={e => setCourseForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div><label style={labelStyle}>SUBTITLE</label><input style={inputStyle} value={courseForm.subtitle} onChange={e => setCourseForm(f => ({ ...f, subtitle: e.target.value }))} /></div>
              <div><label style={labelStyle}>DESCRIPTION</label><textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} value={courseForm.description} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} /></div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}><label style={labelStyle}>ICON</label><input style={inputStyle} value={courseForm.icon} onChange={e => setCourseForm(f => ({ ...f, icon: e.target.value }))} /></div>
                <div style={{ flex: 2 }}><label style={labelStyle}>COLOR</label><input style={inputStyle} value={courseForm.color} onChange={e => setCourseForm(f => ({ ...f, color: e.target.value }))} /></div>
              </div>
              <div>
                <label style={labelStyle}>VISIBILITY</label>
                <select style={{ ...inputStyle, width: "auto" }} value={courseForm.published} onChange={e => setCourseForm(f => ({ ...f, published: e.target.value as "yes" | "no" }))}>
                  <option value="yes">Published (visible)</option>
                  <option value="no">Hidden</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button onClick={() => updateCourse.mutate({ id: selectedCourse.id, ...courseForm })} disabled={updateCourse.isPending} style={btnPrimary}>{updateCourse.isPending ? "SAVING..." : "SAVE CHANGES"}</button>
                <button onClick={() => setView("lessons")} style={btnSecondary}>CANCEL</button>
              </div>
            </div>
          </div>
        )}

        {/* ── LESSON LIST ── */}
        {view === "lessons" && selectedCourse && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <button onClick={() => setView("courses")} style={{ ...btnSecondary, padding: "0.3rem 0.8rem", fontSize: "0.65rem" }}>← COURSES</button>
              <h2 style={{ fontFamily: S.cinzel, fontSize: "1.1rem", color: S.gold, margin: 0, flex: 1 }}>{selectedCourse.title}</h2>
              <button onClick={() => { setSelectedCourse(allCourses?.find(c => c.id === selectedCourse.id) as Course ?? selectedCourse); setCourseForm({ slug: selectedCourse.slug, title: selectedCourse.title, subtitle: selectedCourse.subtitle ?? "", description: selectedCourse.description ?? "", icon: selectedCourse.icon ?? "✦", color: selectedCourse.color ?? "oklch(0.75 0.12 80)", published: selectedCourse.published }); setView("editCourse"); }} style={btnSecondary}>EDIT COURSE</button>
              <button onClick={() => { setLessonForm({ slug: "", title: "", content: "" }); setView("newLesson"); }} style={btnPrimary}>+ NEW LESSON</button>
            </div>
            {(allCourses?.find(c => c.id === selectedCourse.id) as Course | undefined)?.lessons.map((l, idx) => (
              <div key={l.id} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: "6px", padding: "0.85rem 1.25rem", marginBottom: "0.6rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <div>
                  <span style={{ fontFamily: S.mono, fontSize: "0.6rem", color: S.textDim, marginRight: "0.75rem" }}>{idx + 1}</span>
                  <span style={{ fontFamily: S.garamond, fontSize: "1rem", color: S.text }}>{l.title}</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => { setSelectedLesson(l); setLessonForm({ slug: l.slug, title: l.title, content: l.content }); setView("editLesson"); }} style={btnSecondary}>EDIT</button>
                  <button onClick={() => { if (confirm(`Delete lesson "${l.title}"?`)) deleteLesson.mutate({ id: l.id }); }} style={btnDanger}>DELETE</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── NEW LESSON FORM ── */}
        {view === "newLesson" && selectedCourse && (
          <div>
            <h2 style={{ fontFamily: S.cinzel, fontSize: "1.1rem", color: S.gold, marginBottom: "1.5rem" }}>New Lesson — {selectedCourse.title}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div><label style={labelStyle}>LESSON TITLE</label><input style={inputStyle} value={lessonForm.title} onChange={e => setLessonForm(f => ({ ...f, title: e.target.value }))} placeholder="Introduction to Gnosis" /></div>
              <div><label style={labelStyle}>SLUG (URL-safe ID)</label><input style={inputStyle} value={lessonForm.slug} onChange={e => setLessonForm(f => ({ ...f, slug: e.target.value }))} placeholder="intro-to-gnosis" /></div>
              <div><label style={labelStyle}>CONTENT (Markdown supported)</label><textarea style={{ ...inputStyle, minHeight: "300px", resize: "vertical", fontFamily: S.mono, fontSize: "0.85rem" }} value={lessonForm.content} onChange={e => setLessonForm(f => ({ ...f, content: e.target.value }))} placeholder="## Introduction&#10;&#10;Write your lesson content here..." /></div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => createLesson.mutate({ courseId: selectedCourse.id, ...lessonForm, sortOrder: (allCourses?.find(c => c.id === selectedCourse.id) as Course | undefined)?.lessons.length ?? 0 })} disabled={createLesson.isPending || !lessonForm.title || !lessonForm.slug} style={btnPrimary}>{createLesson.isPending ? "SAVING..." : "CREATE LESSON"}</button>
                <button onClick={() => setView("lessons")} style={btnSecondary}>CANCEL</button>
              </div>
            </div>
          </div>
        )}

        {/* ── EDIT LESSON FORM ── */}
        {view === "editLesson" && selectedLesson && (
          <div>
            <h2 style={{ fontFamily: S.cinzel, fontSize: "1.1rem", color: S.gold, marginBottom: "1.5rem" }}>Edit Lesson</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div><label style={labelStyle}>LESSON TITLE</label><input style={inputStyle} value={lessonForm.title} onChange={e => setLessonForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div><label style={labelStyle}>CONTENT (Markdown supported)</label><textarea style={{ ...inputStyle, minHeight: "400px", resize: "vertical", fontFamily: S.mono, fontSize: "0.85rem" }} value={lessonForm.content} onChange={e => setLessonForm(f => ({ ...f, content: e.target.value }))} /></div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => updateLesson.mutate({ id: selectedLesson.id, title: lessonForm.title, content: lessonForm.content })} disabled={updateLesson.isPending} style={btnPrimary}>{updateLesson.isPending ? "SAVING..." : "SAVE CHANGES"}</button>
                <button onClick={() => setView("lessons")} style={btnSecondary}>CANCEL</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
