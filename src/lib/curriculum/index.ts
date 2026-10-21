import type { CourseMeta, CourseId } from './types';
import { NOOR_AL_BAYAN } from './noor-al-bayan';

export const CURRICULUM: Record<CourseId, CourseMeta> = {
  'noor-al-bayan': NOOR_AL_BAYAN,
  // Future courses:
  'arabic': NOOR_AL_BAYAN, // placeholder - will be replaced
  'tajweed': NOOR_AL_BAYAN, // placeholder
  'islamic-studies': NOOR_AL_BAYAN, // placeholder
};

export const PUBLISHED_COURSES: CourseMeta[] = [NOOR_AL_BAYAN];

export function getCourse(slug: string): CourseMeta | null {
  const course = PUBLISHED_COURSES.find((c) => c.slug === slug);
  return course || null;
}

export function getLesson(courseSlug: string, lessonSlug: string) {
  const course = getCourse(courseSlug);
  if (!course) return null;
  const lesson = course.lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) return null;
  return { course, lesson };
}

export function getAllPublishedLessonSlugs(): { course: string; lesson: string }[] {
  return PUBLISHED_COURSES.flatMap((c) =>
    c.lessons.filter((l) => l.isPublished).map((l) => ({ course: c.slug, lesson: l.slug }))
  );
}

export * from './types';