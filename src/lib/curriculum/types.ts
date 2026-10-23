export type LessonComponentKey =
  | "AlphabetLesson"
  | "HamzatulWaslLesson"
  | "HarakatLesson"
  | "LamLesson"
  | "MaddLeenLesson"
  | "MaddLesson"
  | "QuranicMasteryLesson"
  | "ReadingPracticeLesson"
  | "ShaddahLesson"
  | "ShortSurahsLesson"
  | "SukunLesson"
  | "TaaMarbutaLesson"
  | "TanweenLesson"
  | "TanweenNoonRulesLesson";

export interface CurriculumLesson {
  id: string;
  number: number;
  order: number;
  slug: string;
  aliases?: string[];
  componentKey: LessonComponentKey;
  isPublished: boolean;
  isFree: boolean;
  duration: string;
  estimatedMinutes: number;
  minutes?: number;
  difficulty: "Beginner" | "Elementary" | "Intermediate";
  arabicBadge: string;
  iconName: string;
  accentColor: string;
  coverImage: string;
  title: string;
  titleEn?: string;
  titleAr: string;
  subtitle: string;
  subtitleEn?: string;
  subtitleAr: string;
  description: string;
  descriptionEn?: string;
  descriptionAr: string;
  objectives: string[];
  objectivesAr: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface CurriculumCourse {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  titleAr: string;
  subtitle: string;
  taglineEn: string;
  taglineAr?: string;
  subtitleAr: string;
  description: string;
  descriptionEn?: string;
  descriptionAr: string;
  ageRange: string;
  level?: string;
  totalLessons: number;
  totalMinutes: number;
  isPublished: boolean;
  available?: boolean;
  badgeText: string;
  accentColor?: string;
  heroGradient?: string;
  lessons: CurriculumLesson[];
  outcomes?: string[];
  audience?: string[];
  requirements?: string[];
  name?: string;
  metaTitle?: string;
  metaDescription?: string;
  [key: string]: any;
}

export type CourseId = "noor-al-bayan" | "arabic" | "tajweed" | "islamic-studies";

export type CourseMeta = CurriculumCourse;
export type LessonMeta = CurriculumLesson;