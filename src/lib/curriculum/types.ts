export type LessonComponentKey =
  | "AlphabetLesson"
  | "HarakatLesson"
  | "SukunLesson"
  | "TanweenLesson"
  | "MaddLesson"
  | "ShaddahLesson"
  | "LamLesson"
  | "TaaMarbutaLesson"
  | "MaddLeenLesson"
  | "HamzatulWaslLesson"
  | "TanweenNoonRulesLesson"
  | "QuranicMasteryLesson";

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
  difficulty: "Beginner" | "Elementary" | "Intermediate";
  arabicBadge: string;
  iconName: string;
  accentColor: string;
  coverImage: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  description: string;
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
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  description: string;
  descriptionAr: string;
  ageRange: string;
  totalLessons: number;
  isPublished: boolean;
  badgeText: string;
  lessons: CurriculumLesson[];
}