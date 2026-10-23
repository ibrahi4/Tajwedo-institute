import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LessonLayout from "@/components/curriculum/LessonLayout";
import {
  NOOR_AL_BAYAN_LESSONS,
  getNoorAlBayanLessonBySlug,
  getAdjacentNoorLessons,
} from "@/lib/curriculum/noor-al-bayan";

import HarakatLesson from "@/components/curriculum/lessons/HarakatLesson";
import AlphabetLesson from "@/components/curriculum/lessons/AlphabetLesson";
import SukoonLesson from "@/components/curriculum/lessons/SukoonLesson";
import TanweenLesson from "@/components/curriculum/lessons/TanweenLesson";
import MaddLesson from "@/components/curriculum/lessons/MaddLesson";
import ShaddahLesson from "@/components/curriculum/lessons/ShaddahLesson";
import LamLesson from "@/components/curriculum/lessons/LamLesson";
import TaaMarbutaLesson from "@/components/curriculum/lessons/TaaMarbutaLesson";
import MaddLeenLesson from "@/components/curriculum/lessons/MaddLeenLesson";
import HamzatulWaslLesson from "@/components/curriculum/lessons/HamzatulWaslLesson";
import TanweenNoonRulesLesson from "@/components/curriculum/lessons/TanweenNoonRulesLesson";
import QuranicMasteryLesson from "@/components/curriculum/lessons/QuranicMasteryLesson";

interface PageProps {
  params: Promise<{
    locale: string;
    lesson: string;
  }>;
}

export async function generateStaticParams() {
  const locales = ["en", "ar"];
  const params: { locale: string; lesson: string }[] = [];

  for (const locale of locales) {
    for (const lesson of NOOR_AL_BAYAN_LESSONS) {
      params.push({ locale, lesson: lesson.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const lessonData = getNoorAlBayanLessonBySlug(resolved.lesson);

  if (!lessonData) {
    return {
      title: "Lesson Not Found | Tajwedo Institute",
    };
  }

  const isAr = resolved.locale === "ar";
  return {
    title: isAr
      ? `${lessonData.titleAr} | منهج نور البيان - معهد تجويدو`
      : lessonData.seo.metaTitle,
    description: isAr ? lessonData.descriptionAr : lessonData.seo.metaDescription,
    keywords: lessonData.seo.keywords,
    openGraph: {
      title: isAr ? lessonData.titleAr : lessonData.seo.metaTitle,
      description: isAr ? lessonData.descriptionAr : lessonData.seo.metaDescription,
      images: [{ url: lessonData.coverImage }],
    },
  };
}

export default async function NoorAlBayanLessonPage({ params }: PageProps) {
  const resolved = await params;
  const lessonData = getNoorAlBayanLessonBySlug(resolved.lesson);

  if (!lessonData) {
    notFound();
  }

  const { prev, next } = getAdjacentNoorLessons(resolved.lesson);

  const renderLessonComponent = () => {
    switch (lessonData.componentKey) {
      case "HarakatLesson":
        return <HarakatLesson />;
      case "AlphabetLesson":
        return <AlphabetLesson />;
      case "SukoonLesson":
        return <SukoonLesson />;
      case "TanweenLesson":
        return <TanweenLesson />;
      case "MaddLesson":
        return <MaddLesson />;
      case "ShaddahLesson":
        return <ShaddahLesson />;
      case "LamLesson":
        return <LamLesson />;
      case "TaaMarbutaLesson":
        return <TaaMarbutaLesson />;
      case "MaddLeenLesson":
        return <MaddLeenLesson />;
      case "HamzatulWaslLesson":
        return <HamzatulWaslLesson />;
      case "TanweenNoonRulesLesson":
        return <TanweenNoonRulesLesson />;
      case "QuranicMasteryLesson":
        return <QuranicMasteryLesson />;
      default:
        return <HarakatLesson />;
    }
  };

  return (
    <LessonLayout
      locale={resolved.locale}
      courseTitle="Noor Al-Bayan: Learn to Read Quran"
      courseSlug="noor-al-bayan"
      lessonTitle={lessonData.title}
      prevLesson={prev ? { slug: prev.slug, title: prev.title } : null}
      nextLesson={next ? { slug: next.slug, title: next.title } : null}
    >
      {renderLessonComponent()}
    </LessonLayout>
  );
}