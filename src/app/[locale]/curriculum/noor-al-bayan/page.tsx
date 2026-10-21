import React from "react";
import type { Metadata } from "next";
import CourseOverview from "@/components/curriculum/CourseOverview";
import { NOOR_AL_BAYAN_COURSE } from "@/lib/curriculum/noor-al-bayan";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const isAr = resolved.locale === "ar";

  return {
    title: isAr
      ? "منهج نور البيان لتعليم قراءة القرآن | ١٢ درساً تفاعلياً مجانياً - معهد تجويدو"
      : "Noor Al-Bayan: Learn to Read Quran (12 Free Interactive Lessons) | Tajwedo Institute",
    description: isAr
      ? NOOR_AL_BAYAN_COURSE.descriptionAr
      : NOOR_AL_BAYAN_COURSE.description,
  };
}

export default async function NoorAlBayanCoursePage({ params }: PageProps) {
  const resolved = await params;
  return <CourseOverview course={NOOR_AL_BAYAN_COURSE} locale={resolved.locale} />;
}