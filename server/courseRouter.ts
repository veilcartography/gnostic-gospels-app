/**
 * courseRouter — CRUD for courses and lessons
 * Public: list courses, get course with lessons
 * Admin-only: create, update, delete courses and lessons + seed
 */
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { courses, lessons } from "../drizzle/schema";
import { eq, asc } from "drizzle-orm";
import { z } from "zod";
import { COURSES as SEED_COURSES } from "../client/src/data/courseContent";

export const courseRouter = router({
  // ── PUBLIC ──────────────────────────────────────────────────────────────

  list: publicProcedure.query(async () => {
    const d = await getDb();
    if (!d) return [];
    return d.select().from(courses).where(eq(courses.published, "yes")).orderBy(asc(courses.sortOrder));
  }),

  get: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const d = await getDb();
      if (!d) return null;
      const [course] = await d.select().from(courses).where(eq(courses.slug, input.slug));
      if (!course) return null;
      const lessonRows = await d.select().from(lessons).where(eq(lessons.courseId, course.id)).orderBy(asc(lessons.sortOrder));
      return { ...course, lessons: lessonRows };
    }),

  // ── ADMIN ────────────────────────────────────────────────────────────────

  adminList: adminProcedure.query(async () => {
    const d = await getDb();
    if (!d) return [];
    const rows = await d.select().from(courses).orderBy(asc(courses.sortOrder));
    return Promise.all(rows.map(async (c) => {
      const lessonRows = await d.select().from(lessons).where(eq(lessons.courseId, c.id)).orderBy(asc(lessons.sortOrder));
      return { ...c, lessons: lessonRows };
    }));
  }),

  createCourse: adminProcedure
    .input(z.object({
      slug: z.string().min(1).max(128),
      title: z.string().min(1).max(256),
      subtitle: z.string().max(256).optional(),
      description: z.string().optional(),
      icon: z.string().max(16).optional(),
      color: z.string().max(64).optional(),
      sortOrder: z.number().int().optional(),
    }))
    .mutation(async ({ input }) => {
      const d = await getDb();
      if (!d) throw new Error("DB unavailable");
      await d.insert(courses).values({
        slug: input.slug,
        title: input.title,
        subtitle: input.subtitle ?? null,
        description: input.description ?? null,
        icon: input.icon ?? "✦",
        color: input.color ?? "oklch(0.75 0.12 80)",
        sortOrder: input.sortOrder ?? 0,
        published: "yes",
      });
      const [created] = await d.select().from(courses).where(eq(courses.slug, input.slug));
      return created;
    }),

  updateCourse: adminProcedure
    .input(z.object({
      id: z.number().int(),
      title: z.string().min(1).max(256).optional(),
      subtitle: z.string().max(256).optional(),
      description: z.string().optional(),
      icon: z.string().max(16).optional(),
      color: z.string().max(64).optional(),
      sortOrder: z.number().int().optional(),
      published: z.enum(["yes", "no"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const d = await getDb();
      if (!d) throw new Error("DB unavailable");
      const { id, ...fields } = input;
      const updateData: Record<string, unknown> = {};
      if (fields.title !== undefined) updateData.title = fields.title;
      if (fields.subtitle !== undefined) updateData.subtitle = fields.subtitle;
      if (fields.description !== undefined) updateData.description = fields.description;
      if (fields.icon !== undefined) updateData.icon = fields.icon;
      if (fields.color !== undefined) updateData.color = fields.color;
      if (fields.sortOrder !== undefined) updateData.sortOrder = fields.sortOrder;
      if (fields.published !== undefined) updateData.published = fields.published;
      await d.update(courses).set(updateData).where(eq(courses.id, id));
      const [updated] = await d.select().from(courses).where(eq(courses.id, id));
      return updated;
    }),

  deleteCourse: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      const d = await getDb();
      if (!d) throw new Error("DB unavailable");
      await d.delete(lessons).where(eq(lessons.courseId, input.id));
      await d.delete(courses).where(eq(courses.id, input.id));
      return { success: true };
    }),

  createLesson: adminProcedure
    .input(z.object({
      courseId: z.number().int(),
      slug: z.string().min(1).max(128),
      title: z.string().min(1).max(256),
      content: z.string(),
      sortOrder: z.number().int().optional(),
    }))
    .mutation(async ({ input }) => {
      const d = await getDb();
      if (!d) throw new Error("DB unavailable");
      await d.insert(lessons).values({
        courseId: input.courseId,
        slug: input.slug,
        title: input.title,
        content: input.content,
        sortOrder: input.sortOrder ?? 0,
      });
      const allLessons = await d.select().from(lessons).where(eq(lessons.courseId, input.courseId)).orderBy(asc(lessons.sortOrder));
      return allLessons[allLessons.length - 1];
    }),

  updateLesson: adminProcedure
    .input(z.object({
      id: z.number().int(),
      title: z.string().min(1).max(256).optional(),
      content: z.string().optional(),
      sortOrder: z.number().int().optional(),
    }))
    .mutation(async ({ input }) => {
      const d = await getDb();
      if (!d) throw new Error("DB unavailable");
      const { id, ...fields } = input;
      const updateData: Record<string, unknown> = {};
      if (fields.title !== undefined) updateData.title = fields.title;
      if (fields.content !== undefined) updateData.content = fields.content;
      if (fields.sortOrder !== undefined) updateData.sortOrder = fields.sortOrder;
      await d.update(lessons).set(updateData).where(eq(lessons.id, id));
      const [updated] = await d.select().from(lessons).where(eq(lessons.id, id));
      return updated;
    }),

  deleteLesson: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      const d = await getDb();
      if (!d) throw new Error("DB unavailable");
      await d.delete(lessons).where(eq(lessons.id, input.id));
      return { success: true };
    }),

  /** Seed the database with existing hardcoded courses (run once from admin UI) */
  seed: adminProcedure.mutation(async () => {
    const d = await getDb();
    if (!d) throw new Error("DB unavailable");
    const existing = await d.select().from(courses);
    if (existing.length > 0) return { message: "Already seeded", count: existing.length };

    for (let ci = 0; ci < SEED_COURSES.length; ci++) {
      const c = SEED_COURSES[ci];
      await d.insert(courses).values({
        slug: c.id,
        title: c.title,
        subtitle: c.subtitle,
        description: c.description,
        icon: c.icon,
        color: c.color,
        sortOrder: ci,
        published: "yes",
      });
      const [inserted] = await d.select().from(courses).where(eq(courses.slug, c.id));
      for (let li = 0; li < c.lessons.length; li++) {
        const l = c.lessons[li];
        await d.insert(lessons).values({
          courseId: inserted.id,
          slug: l.id,
          title: l.title,
          content: l.content,
          sortOrder: li,
        });
      }
    }
    return { message: "Seeded successfully", count: SEED_COURSES.length };
  }),
});
