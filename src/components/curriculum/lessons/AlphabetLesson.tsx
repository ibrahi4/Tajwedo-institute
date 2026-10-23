"use client";

import React, { useState, useMemo } from "react";
import { useLesson } from "../shared/LessonContext";
import AudioButton from "../shared/AudioButton";
import QuizEngine, { QuizQuestion } from "../shared/QuizEngine";
import {
  Sparkles,
  Volume2,
  GitCommitHorizontal,
  Scale,
  GraduationCap,
  HelpCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Compass,
  Award,
  Mic,
  Maximize2,
  Minimize2,
  Shuffle
} from "lucide-react";

// ============================================================================
// 1. COMPREHENSIVE 28-LETTER ARABIC & QURANIC PHONETICS DATASET
// ============================================================================

export interface ArabicLetterProfile {
  id: string;
  char: string;
  nameAr: string;
  nameEn: string;
  translit: string;
  weight: "Heavy (مُفَخَّم)" | "Light (مُرَقَّق)" | "Conditional (تَارَةً وَتَارَة)";
  makhrajGroup: "Throat (الحَلْق)" | "Tongue (اللِّسَان)" | "Lips (الشَّفَتَان)" | "Oral Cavity (الجَوْف)";
  makhrajDetailEn: string;
  isHeavy7: boolean;
  isInterdental: boolean;
  isNonConnector: boolean;
  forms: {
    isolated: string;
    initial: string;
    medial: string;
    final: string;
  };
  positionExamples: {
    initialWord: string;
    medialWord: string;
    finalWord: string;
  };
  quranExampleAr: string;
  quranExampleTranslit: string;
  quranExampleMeaning: string;
  articulationTip: string;
  commonMistake: string;
}

const ARABIC_ALPHABET_DATA: ArabicLetterProfile[] = [
  {
    id: "alif",
    char: "أ / ا",
    nameAr: "أَلِف / هَمْزَة",
    nameEn: "Alif / Hamzah",
    translit: "' / aa",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Throat (الحَلْق)",
    makhrajDetailEn: "Deepest part of the throat (Hamzah) / Open oral cavity (Alif Madd)",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: true,
    forms: { isolated: "أ", initial: "أ", medial: "ـأ", final: "ـأ" },
    positionExamples: { initialWord: "أَمَرَ", medialWord: "سَأَلَ", finalWord: "قَرَأَ" },
    quranExampleAr: "إِيَّاكَ نَعْبُدُ",
    quranExampleTranslit: "Iyyaaka na'budu",
    quranExampleMeaning: "You alone we worship",
    articulationTip: "Produce a crisp glottal stop from the bottom of the throat without making it heavy like 'O'.",
    commonMistake: "Pronouncing Hamzah with heaviness before heavy letters (saying 'Aw' instead of 'A')."
  },
  {
    id: "baa",
    char: "ب",
    nameAr: "بَاء",
    nameEn: "Baa",
    translit: "b",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Lips (الشَّفَتَان)",
    makhrajDetailEn: "Closing both lips together firmly (Wet inner edge)",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "ب", initial: "بـ", medial: "ـبـ", final: "ـب" },
    positionExamples: { initialWord: "بَدَأَ", medialWord: "عَبَدَ", finalWord: "كَتَبَ" },
    quranExampleAr: "بِسْمِ ٱللَّهِ",
    quranExampleTranslit: "Bismillaahi",
    quranExampleMeaning: "In the Name of Allah",
    articulationTip: "Press the two lips cleanly with a light voice; bounces with Qalqalah when Sakin (بْ).",
    commonMistake: "Letting air escape like an English 'P' or puffing the cheeks to make it heavy."
  },
  {
    id: "taa",
    char: "ت",
    nameAr: "تَاء",
    nameEn: "Taa",
    translit: "t",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Tongue (اللِّسَان)",
    makhrajDetailEn: "Tip of the tongue touching the roots of the upper front teeth",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "ت", initial: "تـ", medial: "ـتـ", final: "ـت" },
    positionExamples: { initialWord: "تَرَكَ", medialWord: "كَتَمَ", finalWord: "بَيْتٌ" },
    quranExampleAr: "تَبَارَكَ",
    quranExampleTranslit: "Tabaaraka",
    quranExampleMeaning: "Blessed is He",
    articulationTip: "Smile slightly to keep Taa crisp and light, with a gentle breath release (Hams) when Sakin.",
    commonMistake: "Turning it into a heavy Taa (ط) or adding a noisy 'ch/ts' hiss."
  },
  {
    id: "thaa",
    char: "ث",
    nameAr: "ثَاء",
    nameEn: "Thaa",
    translit: "th (soft)",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Tongue (اللِّسَان)",
    makhrajDetailEn: "Tip of the tongue gently touching the bottom edge of the upper front teeth",
    isHeavy7: false,
    isInterdental: true,
    isNonConnector: false,
    forms: { isolated: "ث", initial: "ثـ", medial: "ـثـ", final: "ـث" },
    positionExamples: { initialWord: "ثَبَتَ", medialWord: "مَثَلُ", finalWord: "بَعَثَ" },
    quranExampleAr: "ٱلْكَوْثَرَ",
    quranExampleTranslit: "Al-Kawthar",
    quranExampleMeaning: "Abundance",
    articulationTip: "Stick the very tip of your tongue out slightly between the teeth like 'th' in English 'Think'.",
    commonMistake: "Pulling the tongue inside and pronouncing it as Seen (س) or Taa (ت)."
  },
  {
    id: "jeem",
    char: "ج",
    nameAr: "جِيم",
    nameEn: "Jeem",
    translit: "j",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Tongue (اللِّسَان)",
    makhrajDetailEn: "Middle of the tongue pressing firmly against the middle roof of the mouth",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "ج", initial: "جـ", medial: "ـجـ", final: "ـج" },
    positionExamples: { initialWord: "جَعَلَ", medialWord: "سَجَدَ", finalWord: "حَرَجٌ" },
    quranExampleAr: "جَنَّاتٍ",
    quranExampleTranslit: "Jannaatin",
    quranExampleMeaning: "Gardens",
    articulationTip: "Lock the middle of the tongue cleanly without letting breath slide (unlike French 'j' or colloquial 'g').",
    commonMistake: "Pronouncing it like a hard 'G' (Egyptian dialect) or a slushy 'Zh' (Levantine dialect)."
  },
  {
    id: "haa_sharp",
    char: "ح",
    nameAr: "حَاء",
    nameEn: "Haa (Sharp Throat)",
    translit: "ḥ",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Throat (الحَلْق)",
    makhrajDetailEn: "Middle of the throat (Epiglottis area) with smooth airflow",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "ح", initial: "حـ", medial: "ـحـ", final: "ـح" },
    positionExamples: { initialWord: "حَمِدَ", medialWord: "رَحِمَ", finalWord: "فَتَحَ" },
    quranExampleAr: "ٱلْحَمْدُ لِلَّهِ",
    quranExampleTranslit: "Al-Hamdu lillaahi",
    quranExampleMeaning: "All praise belongs to Allah",
    articulationTip: "Imagine fogging up a pair of glasses with a warm, whispered breath from the middle of your throat.",
    commonMistake: "Pronouncing it from the chest like soft Haa (هـ) or scraping the top of the throat like Khaa (خ)."
  },
  {
    id: "khaa",
    char: "خ",
    nameAr: "خَاء",
    nameEn: "Khaa",
    translit: "kh",
    weight: "Heavy (مُفَخَّم)",
    makhrajGroup: "Throat (الحَلْق)",
    makhrajDetailEn: "Top of the throat nearest to the mouth roof",
    isHeavy7: true,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "خ", initial: "خـ", medial: "ـخـ", final: "ـخ" },
    positionExamples: { initialWord: "خَلَقَ", medialWord: "دَخَلَ", finalWord: "نَفَخَ" },
    quranExampleAr: "خَالِدِينَ",
    quranExampleTranslit: "Khaalideena",
    quranExampleMeaning: "Abiding forever",
    articulationTip: "Elevate the back of your tongue to give Khaa a rich, elevated heavy resonance.",
    commonMistake: "Making it flat and light or exaggerating a harsh snore-like scrape."
  },
  {
    id: "daal",
    char: "د",
    nameAr: "دَال",
    nameEn: "Daal",
    translit: "d",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Tongue (اللِّسَان)",
    makhrajDetailEn: "Tip of the tongue touching the roots of the upper front teeth",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: true,
    forms: { isolated: "د", initial: "د", medial: "ـد", final: "ـد" },
    positionExamples: { initialWord: "دَخَلَ", medialWord: "صَدَقَ", finalWord: "أَحَدٌ" },
    quranExampleAr: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
    quranExampleTranslit: "Qul Huwal-laahu Ahad",
    quranExampleMeaning: "Say: He is Allah, the One",
    articulationTip: "Keep the tongue flat and light; bounces crisply with Qalqalah when Sakin (دْ).",
    commonMistake: "Making it heavy like Daad (ض) or letting air leak like Taa (ت)."
  },
  {
    id: "dhaal",
    char: "ذ",
    nameAr: "ذَال",
    nameEn: "Dhaal",
    translit: "dh (voiced)",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Tongue (اللِّسَان)",
    makhrajDetailEn: "Tip of the tongue touching the bottom edge of the upper front teeth",
    isHeavy7: false,
    isInterdental: true,
    isNonConnector: true,
    forms: { isolated: "ذ", initial: "ذ", medial: "ـذ", final: "ـذ" },
    positionExamples: { initialWord: "ذَكَرَ", medialWord: "أَذِنَ", finalWord: "يَوْمَئِذٍ" },
    quranExampleAr: "ذَٰلِكَ ٱلْكِتَابُ",
    quranExampleTranslit: "Dhaalikal-Kitaabu",
    quranExampleMeaning: "That is the Book",
    articulationTip: "Gently place the tongue tip between the teeth like 'th' in English 'This' — keep it 100% light!",
    commonMistake: "Buzzing it inside the teeth like Zay (ز) or making it heavy like Dhaa (ظ)."
  },
  {
    id: "raa",
    char: "ر",
    nameAr: "رَاء",
    nameEn: "Raa",
    translit: "r",
    weight: "Conditional (تَارَةً وَتَارَة)",
    makhrajGroup: "Tongue (اللِّسَان)",
    makhrajDetailEn: "Tip of the tongue with its top surface touching the front palate ridges",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: true,
    forms: { isolated: "ر", initial: "ر", medial: "ـر", final: "ـر" },
    positionExamples: { initialWord: "رَزَقَ", medialWord: "قَرَأَ", finalWord: "قَدَرٌ" },
    quranExampleAr: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    quranExampleTranslit: "Ar-Rahmaanir-Raheem",
    quranExampleMeaning: "The Most Gracious, the Most Merciful",
    articulationTip: "Heavy with Fatha/Damma, Light with Kasra. Allow a single light tap without rolling excessive trills.",
    commonMistake: "Curling the tongue back like an American English 'R' or trilling it 5 times."
  },
  {
    id: "zay",
    char: "ز",
    nameAr: "زَاي",
    nameEn: "Zay",
    translit: "z",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Tongue (اللِّسَان)",
    makhrajDetailEn: "Tip of the tongue behind the lower front teeth with a clear vocal buzz",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: true,
    forms: { isolated: "ز", initial: "ز", medial: "ـز", final: "ـز" },
    positionExamples: { initialWord: "زَعَمَ", medialWord: "عَزَمَ", finalWord: "عَزِيزٌ" },
    quranExampleAr: "زُلْزِلَتِ",
    quranExampleTranslit: "Zulzilati",
    quranExampleMeaning: "Is shaken",
    articulationTip: "Keep the teeth close together and produce a sharp, buzzing bee-like sound (Safir).",
    commonMistake: "Sticking the tongue out and confusing it with Dhaal (ذ)."
  },
  {
    id: "seen",
    char: "س",
    nameAr: "سِين",
    nameEn: "Seen",
    translit: "s",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Tongue (اللِّسَان)",
    makhrajDetailEn: "Tip of the tongue resting behind the lower front teeth with a crisp whistle",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "س", initial: "سـ", medial: "ـسـ", final: "ـس" },
    positionExamples: { initialWord: "سَمِعَ", medialWord: "كَسَبَ", finalWord: "نَاسِ" },
    quranExampleAr: "بِسْمِ ٱللَّهِ",
    quranExampleTranslit: "Bismillaahi",
    quranExampleMeaning: "In the Name of Allah",
    articulationTip: "Keep the back of the tongue down so Seen stays bright and smiling (never heavy like Saad).",
    commonMistake: "Turning Seen into Saad (ص) when followed by a heavy letter (like in مُسْتَقِيم)."
  },
  {
    id: "sheen",
    char: "ش",
    nameAr: "شِين",
    nameEn: "Sheen",
    translit: "sh",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Tongue (اللِّسَان)",
    makhrajDetailEn: "Middle of the tongue approaching the roof of the mouth with spreading air",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "ش", initial: "شـ", medial: "ـشـ", final: "ـش" },
    positionExamples: { initialWord: "شَكَرَ", medialWord: "خَشَعَ", finalWord: "قُرَيْشٍ" },
    quranExampleAr: "وَٱلشَّمْسِ",
    quranExampleTranslit: "Wash-shamsi",
    quranExampleMeaning: "By the sun",
    articulationTip: "Let the air spread widely and softly across the mouth (Tafasshi) without rounding the lips.",
    commonMistake: "Puckering the lips forward which makes Sheen sound muffled and heavy."
  },
  {
    id: "saad",
    char: "ص",
    nameAr: "صَاد",
    nameEn: "Saad",
    translit: "ṣ (heavy)",
    weight: "Heavy (مُفَخَّم)",
    makhrajGroup: "Tongue (اللِّسَان)",
    makhrajDetailEn: "Tip of the tongue behind lower teeth + raised back of tongue (Isti'la & Itbaq)",
    isHeavy7: true,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "ص", initial: "صـ", medial: "ـصـ", final: "ـص" },
    positionExamples: { initialWord: "صَبَرَ", medialWord: "نَصَرَ", finalWord: "أَخْلَصَ" },
    quranExampleAr: "ٱلصِّرَاطَ ٱلْمُسْتَقِيمَ",
    quranExampleTranslit: "As-Siraatal-Mustaqeem",
    quranExampleMeaning: "The Straight Path",
    articulationTip: "Raise the back of your tongue toward the soft palate to create a full, hollow brass-like 'S' WITHOUT rounding your lips!",
    commonMistake: "Puckering the lips to fake heaviness, or letting it weaken into a light Seen (س)."
  },
  {
    id: "daad",
    char: "ض",
    nameAr: "ضَاد",
    nameEn: "Daad",
    translit: "ḍ (heavy)",
    weight: "Heavy (مُفَخَّم)",
    makhrajGroup: "Tongue (اللِّسَان)",
    makhrajDetailEn: "One or both sides of the tongue pressing against the upper molars",
    isHeavy7: true,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "ض", initial: "ضـ", medial: "ـضـ", final: "ـض" },
    positionExamples: { initialWord: "ضَرَبَ", medialWord: "حَضَرَ", finalWord: "ٱلْأَرْضِ" },
    quranExampleAr: "وَلَا ٱلضَّالِّينَ",
    quranExampleTranslit: "Wa lad-daalleen",
    quranExampleMeaning: "Nor of those who go astray",
    articulationTip: "Press the side edge of the tongue against the upper molars while keeping the tip away from the front teeth; stretches slightly (Istitalah).",
    commonMistake: "Sticking the tongue out so it sounds like Dhaa (ظ) or bouncing it like Qalqalah."
  },
  {
    id: "taa_heavy",
    char: "ط",
    nameAr: "طَاء",
    nameEn: "Taa (Heavy)",
    translit: "ṭ (heavy)",
    weight: "Heavy (مُفَخَّم)",
    makhrajGroup: "Tongue (اللِّسَان)",
    makhrajDetailEn: "Tip of the tongue at upper teeth roots + strongly raised back of tongue",
    isHeavy7: true,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "ط", initial: "طـ", medial: "ـطـ", final: "ـط" },
    positionExamples: { initialWord: "طَبَعَ", medialWord: "فَطَرَ", finalWord: "مُحِيطٌ" },
    quranExampleAr: "ٱلطَّامَّةُ",
    quranExampleTranslit: "At-Taammatu",
    quranExampleMeaning: "The Overwhelming Calamity",
    articulationTip: "The strongest letter in Arabic! Release cleanly with zero breathiness (No Hams) and bounce with Qalqalah when Sakin (طْ).",
    commonMistake: "Letting air escape like light Taa (ت) or softening it when it has a Kasra."
  },
  {
    id: "dhaa_heavy",
    char: "ظ",
    nameAr: "ظَاء",
    nameEn: "Dhaa (Heavy)",
    translit: "ẓ (heavy)",
    weight: "Heavy (مُفَخَّم)",
    makhrajGroup: "Tongue (اللِّسَان)",
    makhrajDetailEn: "Tip of the tongue touching the edge of upper front teeth + raised back tongue",
    isHeavy7: true,
    isInterdental: true,
    isNonConnector: false,
    forms: { isolated: "ظ", initial: "ظـ", medial: "ـظـ", final: "ـظ" },
    positionExamples: { initialWord: "ظَلَمَ", medialWord: "نَظَرَ", finalWord: "حَفِظَ" },
    quranExampleAr: "ٱلظَّالِمِينَ",
    quranExampleTranslit: "Adh-Dhaalimeen",
    quranExampleMeaning: "The wrongdoers",
    articulationTip: "Place the tongue tip gently between the teeth just like Dhaal (ذ), then elevate the back of the tongue strongly!",
    commonMistake: "Pulling the tongue inside the mouth and pronouncing it as a heavy 'Z' (Zaa)."
  },
  {
    id: "ayn",
    char: "ع",
    nameAr: "عَيْن",
    nameEn: "'Ayn",
    translit: "' (deep)",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Throat (الحَلْق)",
    makhrajDetailEn: "Middle of the throat (Epiglottis gently flexing backward)",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "ع", initial: "عـ", medial: "ـعـ", final: "ـع" },
    positionExamples: { initialWord: "عَمِلَ", medialWord: "جَعَلَ", finalWord: "سَمِعَ" },
    quranExampleAr: "ٱلْعَالَمِينَ",
    quranExampleTranslit: "Al-'Aalameen",
    quranExampleMeaning: "The worlds",
    articulationTip: "Gently flex the middle of your throat with a smooth, warm voiced sound — never through the nose!",
    commonMistake: "Replacing it with Hamzah (أ) or squeezing it through the nasal cavity."
  },
  {
    id: "ghayn",
    char: "غ",
    nameAr: "غَيْن",
    nameEn: "Ghayn",
    translit: "gh",
    weight: "Heavy (مُفَخَّم)",
    makhrajGroup: "Throat (الحَلْق)",
    makhrajDetailEn: "Top of the throat (Soft palate area, voiced)",
    isHeavy7: true,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "غ", initial: "غـ", medial: "ـغـ", final: "ـغ" },
    positionExamples: { initialWord: "غَفَرَ", medialWord: "بَلَغَ", finalWord: "بَلَاغٌ" },
    quranExampleAr: "غَيْرِ ٱلْمَغْضُوبِ",
    quranExampleTranslit: "Ghayril-maghdoobi",
    quranExampleMeaning: "Not of those who earned wrath",
    articulationTip: "A smooth, voiced gargle-like sound at the very top of the throat with elevated heaviness.",
    commonMistake: "Blocking the sound completely so it turns into a 'G' or bouncing it when Sakin."
  },
  {
    id: "faa",
    char: "ف",
    nameAr: "فَاء",
    nameEn: "Faa",
    translit: "f",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Lips (الشَّفَتَان)",
    makhrajDetailEn: "Edges of the upper front teeth touching the wet inside of the lower lip",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "ف", initial: "فـ", medial: "ـفـ", final: "ـف" },
    positionExamples: { initialWord: "فَتَحَ", medialWord: "شَفَعَ", finalWord: "خَوْفٌ" },
    quranExampleAr: "ٱلْفَلَقِ",
    quranExampleTranslit: "Al-Falaqi",
    quranExampleMeaning: "The daybreak",
    articulationTip: "Let the air flow softly and continuously between the upper teeth and inner lower lip.",
    commonMistake: "Pressing too hard and blocking the gentle airflow."
  },
  {
    id: "qaaf",
    char: "ق",
    nameAr: "قَاف",
    nameEn: "Qaaf",
    translit: "q",
    weight: "Heavy (مُفَخَّم)",
    makhrajGroup: "Tongue (اللِّسَان)",
    makhrajDetailEn: "Deepest back part of the tongue touching the soft palate (near uvula)",
    isHeavy7: true,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "ق", initial: "قـ", medial: "ـقـ", final: "ـق" },
    positionExamples: { initialWord: "قَرَأَ", medialWord: "عَقَلَ", finalWord: "خَلَقَ" },
    quranExampleAr: "ٱلْقُرْآنُ",
    quranExampleTranslit: "Al-Qur'aanu",
    quranExampleMeaning: "The Quran",
    articulationTip: "Touch the very back of your tongue to the soft fleshy roof of the mouth; bounces with Qalqalah when Sakin (قْ).",
    commonMistake: "Moving it forward so it sounds like Kaaf (ك) or letting air puff out."
  },
  {
    id: "kaaf",
    char: "ك",
    nameAr: "كَاف",
    nameEn: "Kaaf",
    translit: "k",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Tongue (اللِّسَان)",
    makhrajDetailEn: "Back of the tongue touching the hard & soft palate (slightly forward from Qaaf)",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "ك", initial: "كـ", medial: "ـكـ", final: "ـك" },
    positionExamples: { initialWord: "كَتَبَ", medialWord: "شَكَرَ", finalWord: "مَلِكِ" },
    quranExampleAr: "ٱلْكَوْثَرَ",
    quranExampleTranslit: "Al-Kawthar",
    quranExampleMeaning: "Abundance",
    articulationTip: "Keep it light and release a gentle whisper of air (Hams) at the end when Sakin (كْ).",
    commonMistake: "Making it heavy like Qaaf (ق) or over-aspirating with saliva noise."
  },
  {
    id: "laam",
    char: "ل",
    nameAr: "لَام",
    nameEn: "Laam",
    translit: "l",
    weight: "Conditional (تَارَةً وَتَارَة)",
    makhrajGroup: "Tongue (اللِّسَان)",
    makhrajDetailEn: "Front side edges and tip of the tongue touching the upper gums",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "ل", initial: "لـ", medial: "ـلـ", final: "ـل" },
    positionExamples: { initialWord: "لَعِبَ", medialWord: "عَلِمَ", finalWord: "جَعَلَ" },
    quranExampleAr: "لَيْلَةِ ٱلْقَدْرِ",
    quranExampleTranslit: "Laylatil-Qadri",
    quranExampleMeaning: "The Night of Decree",
    articulationTip: "Always light in every word EXCEPT in the Name of Allah (ٱللَّه) after Fatha or Damma!",
    commonMistake: "Using a dark English 'L' (like in 'Ball') in normal Quranic words."
  },
  {
    id: "meem",
    char: "م",
    nameAr: "مِيم",
    nameEn: "Meem",
    translit: "m",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Lips (الشَّفَتَان)",
    makhrajDetailEn: "Gently closing the dry outer edges of both lips + natural nasal resonance",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "م", initial: "مـ", medial: "ـمـ", final: "ـم" },
    positionExamples: { initialWord: "مَلَكَ", medialWord: "عَمِلَ", finalWord: "عَلِيمٌ" },
    quranExampleAr: "مَالِكِ يَوْمِ ٱلدِّينِ",
    quranExampleTranslit: "Maaliki Yawmid-Deen",
    quranExampleMeaning: "Master of the Day of Judgment",
    articulationTip: "Close the lips smoothly and always keep Meem light (say 'Maa', never 'Maw').",
    commonMistake: "Making Meem heavy before heavy letters (e.g., in مَخْمَصَة)."
  },
  {
    id: "noon",
    char: "ن",
    nameAr: "نُون",
    nameEn: "Noon",
    translit: "n",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Tongue (اللِّسَان)",
    makhrajDetailEn: "Tip of the tongue touching the upper gums + natural nasal resonance (Ghunnah)",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "ن", initial: "نـ", medial: "ـنـ", final: "ـن" },
    positionExamples: { initialWord: "نَصَرَ", medialWord: "صَنَعَ", finalWord: "ٱلرَّحْمَٰنِ" },
    quranExampleAr: "نَسْتَعِينُ",
    quranExampleTranslit: "Nasta'eenu",
    quranExampleMeaning: "We seek help",
    articulationTip: "Half of Noon's sound comes from the tongue tip and half from the nasal passage (Khayshoom).",
    commonMistake: "Bouncing the tongue when stopping on Noon Sakinah."
  },
  {
    id: "haa_soft",
    char: "هـ",
    nameAr: "هَاء",
    nameEn: "Haa (Soft Chest)",
    translit: "h",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Throat (الحَلْق)",
    makhrajDetailEn: "Deepest part of the throat nearest the chest",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "ه", initial: "هـ", medial: "ـهـ", final: "ـه" },
    positionExamples: { initialWord: "هَدَى", medialWord: "شَهِدَ", finalWord: "ٱللَّهُ" },
    quranExampleAr: "ٱهْدِنَا",
    quranExampleTranslit: "Ihdinaa",
    quranExampleMeaning: "Guide us",
    articulationTip: "Produce a clear, deep breath from the bottom of the throat so it doesn't disappear when Sakin.",
    commonMistake: "Swallowing the Haa when stopping or confusing it with middle-throat Haa (ح)."
  },
  {
    id: "waaw",
    char: "و",
    nameAr: "وَاو",
    nameEn: "Waaw",
    translit: "w / oo",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Lips (الشَّفَتَان)",
    makhrajDetailEn: "Rounding both lips forward with a small circular opening",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: true,
    forms: { isolated: "و", initial: "و", medial: "ـو", final: "ـو" },
    positionExamples: { initialWord: "وَجَدَ", medialWord: "قَوْمٌ", finalWord: "عَفُوٌّ" },
    quranExampleAr: "وَلَمْ يَكُن",
    quranExampleTranslit: "Wa lam yakun",
    quranExampleMeaning: "And there is none",
    articulationTip: "Round the lips cleanly in a circle without touching the teeth to the lip (unlike English 'V').",
    commonMistake: "Making Waaw heavy before heavy letters (saying 'Waw-llahi' instead of 'Wa-llaahi')."
  },
  {
    id: "yaa",
    char: "ي",
    nameAr: "يَاء",
    nameEn: "Yaa",
    translit: "y / ee",
    weight: "Light (مُرَقَّق)",
    makhrajGroup: "Tongue (اللِّسَان)",
    makhrajDetailEn: "Middle of the tongue rising toward the middle roof of the mouth",
    isHeavy7: false,
    isInterdental: false,
    isNonConnector: false,
    forms: { isolated: "ي", initial: "يـ", medial: "ـيـ", final: "ـي" },
    positionExamples: { initialWord: "يَعْلَمُ", medialWord: "شَيْءٍ", finalWord: "حَيٌّ" },
    quranExampleAr: "يَوْمِ ٱلدِّينِ",
    quranExampleTranslit: "Yawmid-Deen",
    quranExampleMeaning: "Day of Judgment",
    articulationTip: "Raise the middle of the tongue smoothly and keep the sound bright and clear.",
    commonMistake: "Adding nasalization (Ghunnah) to long Yaa Madd."
  }
];

// Contrast Pairs for Look-Alike & Sound-Alike Lab
const CONTRAST_PAIRS = [
  {
    id: "t-vs-T",
    category: "Sound-Alike (Light vs. Heavy)",
    pairTitle: "Light Taa (ت) vs. Heavy Taa (ط)",
    letterA: { char: "ت", name: "Light Taa (تَاء مُرَقَّقَة)", word: "تِينِ", translit: "Teeni (Fig)", tip: "Flat tongue + slight smile" },
    letterB: { char: "ط", name: "Heavy Taa (طَاء مُفَخَّمَة)", word: "طِينٍ", translit: "Teenin (Clay)", tip: "Back of tongue raised high!" },
    whyCritical: "Changing ت to ط in the Quran can completely change the meaning of a word!"
  },
  {
    id: "s-vs-S",
    category: "Sound-Alike (Light vs. Heavy)",
    pairTitle: "Light Seen (س) vs. Heavy Saad (ص)",
    letterA: { char: "س", name: "Light Seen (سِين)", word: "سَمِيعٌ", translit: "Samee'un", tip: "Bright, smiling 'S' whistle" },
    letterB: { char: "ص", name: "Heavy Saad (صَاد)", word: "صِرَاطَ", translit: "Siraata", tip: "Full hollow resonance (no lip rounding)" },
    whyCritical: "In Surah Al-Fatihah, keep (ٱلْمُسْتَقِيمَ) with a crisp Seen, and (ٱلصِّرَاطَ) with a rich Saad."
  },
  {
    id: "d-vs-D",
    category: "Sound-Alike (Light vs. Heavy)",
    pairTitle: "Light Daal (د) vs. Heavy Daad (ض)",
    letterA: { char: "د", name: "Light Daal (دَال)", word: "دِينِ", translit: "Deeni", tip: "Tongue tip at upper front teeth roots" },
    letterB: { char: "ض", name: "Heavy Daad (ضَاد)", word: "ٱلضَّالِّينَ", translit: "Ad-Daalleen", tip: "Side of tongue against upper molars" },
    whyCritical: "Arabic is called the 'Language of Daad' (لُغَةُ الضَّاد) because of its unique side-tongue articulation."
  },
  {
    id: "q-vs-k",
    category: "Sound-Alike (Deep vs. Forward)",
    pairTitle: "Heavy Qaaf (ق) vs. Light Kaaf (ك)",
    letterA: { char: "ق", name: "Deep Qaaf (قَاف)", word: "قَلْبٍ", translit: "Qalbin (Heart)", tip: "Soft palate at the very back (Heavy)" },
    letterB: { char: "ك", name: "Forward Kaaf (كَاف)", word: "كَلْبٌ", translit: "Kalbun (Dog)", tip: "Hard palate slightly forward (Light + air)" },
    whyCritical: "Notice how a tiny shift between ق (Heart) and ك changes the meaning completely!"
  },
  {
    id: "h-vs-H",
    category: "Sound-Alike (Throat Depth)",
    pairTitle: "Sharp Haa (ح) vs. Soft Chest Haa (هـ)",
    letterA: { char: "ح", name: "Middle-Throat Haa (حَاء)", word: "ٱلْحَمْدُ", translit: "Al-Hamdu", tip: "Warm whispered friction in mid-throat" },
    letterB: { char: "هـ", name: "Deep-Throat Haa (هَاء)", word: "هُدًى", translit: "Hudan", tip: "Gentle open breath from near the chest" },
    whyCritical: "Non-native speakers often merge both into English 'H' — mastering ح immediately makes your recitation authentic."
  },
  {
    id: "dots-family",
    category: "Look-Alike (Visual Dot Code)",
    pairTitle: "The Boat Family: ب • ت • ث • ن • ي",
    letterA: { char: "بـ / يـ", name: "Dots BELOW the Boat", word: "بَيْتٌ", translit: "ب (1 below) • يـ (2 below)", tip: "Baa = Bottom (1 dot) • Yaa = 2 dots below" },
    letterB: { char: "تـ / ثـ / نـ", name: "Dots ABOVE the Boat", word: "تُثَبِّتُ", translit: "ن (1 above) • ت (2 above) • ث (3 above)", tip: "Noon (1 top), Taa (2 top), Thaa (3 top)" },
    whyCritical: "In joined Quranic words, the base tooth looks identical — your eyes read the DOTS!"
  }
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "al1",
    questionEn: "Which 7 Arabic letters are ALWAYS Heavy (حُرُوفُ التَّفْخِيم — خُصَّ ضَغْطٍ قِظْ)?",
    arabicPrompt: "خُصَّ ضَغْطٍ قِظْ",
    options: [
      { id: "a", text: "خ - ص - ض - غ - ط - ق - ظ", isCorrect: true },
      { id: "b", text: "ب - ت - ث - ج - د - س - ش", isCorrect: false },
      { id: "c", text: "أ - د - ذ - ر - ز - و", isCorrect: false },
      { id: "d", text: "ي - ر - م - ل - و - ن", isCorrect: false }
    ],
    explanation: "The 7 permanently heavy letters (حُرُوفُ الاِسْتِعْلَاء) are collected in the classic phrase: خُصَّ ضَغْطٍ قِظْ."
  },
  {
    id: "al2",
    questionEn: "Which 3 letters are Interdental (الحُرُوفُ اللَّثَوِيَّة), pronounced by gently touching the tongue tip to the edge of the upper front teeth?",
    arabicPrompt: "ث • ذ • ظ",
    options: [
      { id: "a", text: "Thaa (ث), Dhaal (ذ), and Heavy Dhaa (ظ)", isCorrect: true },
      { id: "b", text: "Seen (س), Zay (ز), and Saad (ص)", isCorrect: false },
      { id: "c", text: "Baa (ب), Meem (م), and Waaw (و)", isCorrect: false },
      { id: "d", text: "Hamzah (ء), Haa (هـ), and 'Ayn (ع)", isCorrect: false }
    ],
    explanation: "Always place the tip of the tongue gently between the teeth for (ث، ذ، ظ) so they never turn into (س، ز)!"
  },
  {
    id: "al3",
    questionEn: "What is special about the 6 'Non-Connecting / One-Way' letters (أ - د - ذ - ر - ز - و)?",
    arabicPrompt: "أ • د • ذ • ر • ز • و",
    options: [
      { id: "a", text: "They connect to the letter BEFORE them, but NEVER join the letter AFTER them in the same word", isCorrect: true },
      { id: "b", text: "They are always silent in the Quran", isCorrect: false },
      { id: "c", text: "They only appear at the end of a Surah", isCorrect: false },
      { id: "d", text: "They always carry three dots", isCorrect: false }
    ],
    explanation: "The 6 Naughty/One-Way letters (حُرُوفُ القَطْع) have a right hand to hold the letter before them, but no left hand to connect after!"
  },
  {
    id: "al4",
    questionEn: "Why is distinguishing between Qaaf (ق) and Kaaf (ك) critical in Quranic recitation?",
    arabicPrompt: "قَلْبٍ vs كَلْبٌ",
    options: [
      { id: "a", text: "Because Qaaf is deep and heavy while Kaaf is forward and light — confusing them changes the meaning (e.g., Heart vs. Dog)", isCorrect: true },
      { id: "b", text: "They have the exact same sound", isCorrect: false },
      { id: "c", text: "Both are throat letters", isCorrect: false },
      { id: "d", text: "Kaaf is heavier than Qaaf", isCorrect: false }
    ],
    explanation: "Precision in Makharij (Articulation Points) protects the sacred meanings of the Quran."
  }
];

// ============================================================================
// 2. MAIN INTERACTIVE COMPONENT (100% MOBILE-FIRST RESPONSIVE)
// ============================================================================

export default function AlphabetLesson() {
  const lessonCtx = useLesson();
  const darkMode = lessonCtx?.darkMode ?? false;
  const showTransliteration = lessonCtx?.showTransliteration ?? true;
  const showEnglishMeaning = lessonCtx?.showEnglishMeaning ?? true;
  const isTeacherMode = lessonCtx?.isTeacherMode ?? false;
  const fontSizeMultiplier = lessonCtx?.fontSizeMultiplier ?? 1.1;

  // 5 Interactive Studios
  const [activeStudio, setActiveStudio] = useState<"atlas" | "joining" | "contrast" | "teacher" | "quiz">("atlas");

  // Studio 1: Filter & Active Letter
  const [letterFilter, setLetterFilter] = useState<"all" | "heavy7" | "interdental" | "throat" | "nonconnect">("all");
  const [selectedLetterId, setSelectedLetterId] = useState<string>("baa");

  // Studio 4: Teacher Live Spotlight State
  const [spotlightIdx, setSpotlightIdx] = useState<number>(0);
  const [hideSpotlightDetails, setHideSpotlightDetails] = useState<boolean>(false);
  const [isLargeSpotlight, setIsLargeSpotlight] = useState<boolean>(false);

  const filteredLetters = useMemo(() => {
    return ARABIC_ALPHABET_DATA.filter((item) => {
      if (letterFilter === "heavy7") return item.isHeavy7;
      if (letterFilter === "interdental") return item.isInterdental;
      if (letterFilter === "throat") return item.makhrajGroup === "Throat (الحَلْق)";
      if (letterFilter === "nonconnect") return item.isNonConnector;
      return true;
    });
  }, [letterFilter]);

  const activeLetter = useMemo(
    () => ARABIC_ALPHABET_DATA.find((l) => l.id === selectedLetterId) || ARABIC_ALPHABET_DATA[1],
    [selectedLetterId]
  );

  const currentSpotlightLetter = ARABIC_ALPHABET_DATA[spotlightIdx] || ARABIC_ALPHABET_DATA[0];
  const effectiveHideAnswers = isTeacherMode || hideSpotlightDetails;

  const handleRandomSpotlight = () => {
    const nextIdx = Math.floor(Math.random() * ARABIC_ALPHABET_DATA.length);
    setSpotlightIdx(nextIdx);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-12">
      {/* =====================================================================
          HERO PEDAGOGICAL BANNER (STUDENT & TEACHER VALUE PROPOSITION)
         ===================================================================== */}
      <div
        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border p-4 sm:p-6 lg:p-8 ${
          darkMode
            ? "bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/50 border-slate-800"
            : "bg-gradient-to-br from-white via-teal-50/30 to-amber-50/30 border-slate-200/80 shadow-xs"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2.5 sm:space-y-3 max-w-3xl">
            <div className="inline-flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/20">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Lessons 1 & 2 Masterclass • Noor Al-Bayan & Al-Azhar Phonetics</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug">
              The 28 Arabic Letters, Makharij & Joining Forms{" "}
              <span dir="rtl" className="text-teal-600 dark:text-teal-400 font-serif block sm:inline mt-1 sm:mt-0 text-lg sm:text-2xl">
                (الحُرُوفُ الهِجَائِيَّةُ وَمَخَارِجُهَا وَأَشْكَالُهَا)
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every verse of the Quran is built from these <strong>28 sacred letters</strong>. Here you will master each letter&apos;s authentic pronunciation point (<strong>Makhraj</strong>), distinguish between <strong>Light & Heavy letters</strong>, and recognize how letters morph at the <strong>beginning, middle, and end</strong> of Quranic words.
            </p>
          </div>

          {/* Quick Phonetic Golden Rule Box */}
          <div
            className={`w-full lg:w-auto shrink-0 rounded-2xl border p-4 text-center space-y-1.5 ${
              darkMode ? "bg-slate-950/80 border-slate-800" : "bg-white/90 border-teal-200 shadow-xs"
            }`}
          >
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
              The 7 Heavy Letters Code
            </span>
            <p dir="rtl" className="font-serif font-bold text-xl sm:text-2xl text-teal-600 dark:text-teal-400">
              « خُصَّ ضَغْطٍ قِظْ »
            </p>
            <p className="text-[11px] text-slate-500 font-semibold">
              7 Heavy • 3 Interdental (ث ذ ظ) • 6 Non-Connectors
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================================
          5-STUDIO INTERACTIVE NAVIGATION BAR (100% RESPONSIVE GRID)
         ===================================================================== */}
      <div
        className={`rounded-2xl border p-1.5 sm:p-2 ${
          darkMode ? "bg-slate-900/90 border-slate-800" : "bg-slate-100/90 border-slate-200"
        }`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap items-stretch gap-1.5 sm:gap-2">
          {[
            { id: "atlas", shortLabel: "1. 28-Letter Atlas", fullLabel: "1. 28-Letter & Makharij Atlas", icon: Volume2 },
            { id: "joining", shortLabel: "2. Joining Shapes", fullLabel: "2. Letter Joining & 4 Forms", icon: GitCommitHorizontal },
            { id: "contrast", shortLabel: "3. Sound Pairs", fullLabel: "3. Look-Alike & Sound-Alike Lab", icon: Scale },
            { id: "teacher", shortLabel: "4. Live Board", fullLabel: "4. Classroom Spotlight", icon: GraduationCap },
            { id: "quiz", shortLabel: "5. Mastery Quiz", fullLabel: "5. Mastery Quiz", icon: HelpCircle }
          ].map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeStudio === tab.id;
            const spanFullOnMobile = idx === 4 ? "col-span-2 sm:col-span-1" : "";
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveStudio(tab.id as typeof activeStudio)}
                className={`${spanFullOnMobile} lg:flex-1 px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
                  isActive
                    ? "bg-[#0D9488] text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-800/70"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="sm:hidden truncate">{tab.shortLabel}</span>
                <span className="hidden sm:inline truncate">{tab.fullLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          STUDIO 1: 28-LETTER & MAKHARIJ INTERACTIVE ATLAS
         ===================================================================== */}
      {activeStudio === "atlas" && (
        <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
          {/* Smart Pedagogical Filter Pills */}
          <div
            className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3.5 ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xs"
            }`}
          >
            <div className="space-y-0.5">
              <h3 className="text-sm sm:text-base font-extrabold flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Filter Alphabet by Tajweed Group:</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Tap any letter below to inspect its exact articulation point (Makhraj) and hear its Quranic sound.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {[
                { id: "all", label: "All Letters (28)" },
                { id: "heavy7", label: "🔥 7 Heavy (خُصَّ ضَغْطٍ قِظْ)" },
                { id: "interdental", label: "👅 3 Interdental (ث ذ ظ)" },
                { id: "throat", label: "🗣️ 6 Throat Letters" },
                { id: "nonconnect", label: "✂️ 6 Non-Connectors" }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setLetterFilter(f.id as typeof letterFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition border ${
                    letterFilter === f.id
                      ? "bg-[#0D9488] text-white border-[#0D9488] shadow-2xs"
                      : darkMode
                      ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-teal-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* 28 Arabic Letters Interactive Matrix (RTL) */}
          <div
            dir="rtl"
            className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 sm:gap-3"
          >
            {filteredLetters.map((item) => {
              const isSelected = item.id === activeLetter.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedLetterId(item.id)}
                  className={`relative rounded-2xl border-2 p-3 sm:p-4 flex flex-col items-center justify-center gap-1 transition-all ${
                    isSelected
                      ? "border-[#0D9488] bg-teal-500/15 ring-2 ring-[#0D9488]/30 scale-[1.02] shadow-sm"
                      : item.isHeavy7
                      ? darkMode
                        ? "bg-amber-950/20 border-amber-800/50 hover:border-amber-600"
                        : "bg-amber-50/50 border-amber-200 hover:border-amber-400"
                      : darkMode
                      ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                      : "bg-white border-slate-200 hover:border-teal-300 shadow-2xs"
                  }`}
                >
                  {/* Top Mini Tag */}
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      item.isHeavy7
                        ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                        : item.isInterdental
                        ? "bg-purple-500/20 text-purple-700 dark:text-purple-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {item.isHeavy7 ? "مُفَخَّم" : item.isInterdental ? "لَثَوِي" : item.nameEn}
                  </span>

                  <span
                    style={{ fontSize: `clamp(1.7rem, ${2.0 * fontSizeMultiplier}rem, 2.5rem)` }}
                    className="font-serif font-bold leading-none py-1 text-slate-900 dark:text-white"
                  >
                    {item.char}
                  </span>

                  <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300">
                    {item.nameAr}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Letter Deep-Dive Anatomical & Acoustic Inspector */}
          <div
            className={`rounded-2xl sm:rounded-3xl border-2 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
              {/* Left/Right Big Letter Stage */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-teal-500/30 bg-teal-500/5 text-center space-y-3">
                <div className="flex items-center justify-between w-full">
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-teal-500/15 text-teal-700 dark:text-teal-300">
                    {activeLetter.weight}
                  </span>
                  <AudioButton text={activeLetter.nameAr} />
                </div>

                <div dir="rtl" className="py-2">
                  <span
                    style={{ fontSize: `clamp(3.2rem, ${4.2 * fontSizeMultiplier}rem, 5.2rem)` }}
                    className="font-serif font-bold text-teal-700 dark:text-teal-300 leading-none select-all"
                  >
                    {activeLetter.char}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-lg sm:text-xl font-extrabold">
                    {activeLetter.nameEn} — <span dir="rtl" className="font-serif">{activeLetter.nameAr}</span>
                  </h4>
                  <p className="text-xs text-slate-500 font-bold">
                    Sound Symbol: <span className="text-teal-600 dark:text-teal-400">[{activeLetter.translit}]</span>
                  </p>
                </div>
              </div>

              {/* Center/Right Articulation & Quranic Word Breakdown */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    📍 Articulation Zone: {activeLetter.makhrajGroup}
                  </span>
                  {activeLetter.isHeavy7 && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-300">
                      🔥 Permanent Heavy Letter (خُصَّ ضَغْطٍ قِظْ)
                    </span>
                  )}
                  {activeLetter.isInterdental && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-500/15 text-purple-700 dark:text-purple-300">
                      👅 Interdental Tip-of-Tongue Letter
                    </span>
                  )}
                  {activeLetter.isNonConnector && (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500/15 text-rose-700 dark:text-rose-300">
                      ✂️ One-Way Connector (Never joins left)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200/60 dark:border-slate-800 space-y-1">
                    <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 shrink-0" />
                      <span>How to Articulate (المَخْرَج الدَّقِيق):</span>
                    </span>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {activeLetter.makhrajDetailEn}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed pt-1">
                      {activeLetter.articulationTip}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-rose-500/5 p-4 border border-rose-500/20 space-y-1">
                    <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Common Student Mistake:</span>
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {activeLetter.commonMistake}
                    </p>
                  </div>
                </div>

                {/* Live Quranic Example Bar */}
                <div
                  className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    darkMode ? "bg-slate-950/70 border-slate-800" : "bg-teal-50/40 border-teal-200/70"
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                      Authentic Quranic Example
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {showTransliteration && (
                        <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
                          {activeLetter.quranExampleTranslit}
                        </span>
                      )}
                      {showEnglishMeaning && (
                        <span className="text-xs text-slate-500 italic">
                          &ldquo;{activeLetter.quranExampleMeaning}&rdquo;
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span dir="rtl" className="font-serif font-bold text-2xl sm:text-3xl text-teal-700 dark:text-teal-300">
                      {activeLetter.quranExampleAr}
                    </span>
                    <AudioButton text={activeLetter.quranExampleAr} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          STUDIO 2: LETTER JOINING & 4-POSITIONS MORPHING LAB (LESSON 2)
         ===================================================================== */}
      {activeStudio === "joining" && (
        <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
          {/* Quick Letter Picker Strip */}
          <div
            className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-6 space-y-4 ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xs"
            }`}
          >
            <div className="space-y-1">
              <h3 className="text-base sm:text-xl font-extrabold flex flex-wrap items-center gap-2">
                <span>Interactive 4-Position Letter Morphing Lab</span>
                <span dir="rtl" className="text-teal-600 dark:text-teal-400 font-serif text-sm sm:text-base">
                  (أَشْكَالُ الحُرُوفِ فِي أَوَّلِ وَوَسَطِ وَآخِرِ الكَلِمَة)
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                In Arabic, there are no capital or lowercase letters — instead, letters stretch out their hands to join neighbors! Select any letter below to see its <strong>4 shapes</strong>.
              </p>
            </div>

            <div dir="rtl" className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 sm:gap-2">
              {ARABIC_ALPHABET_DATA.map((item) => {
                const isSelected = item.id === activeLetter.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedLetterId(item.id)}
                    className={`h-10 sm:h-11 rounded-xl font-serif font-bold text-lg flex items-center justify-center transition border ${
                      isSelected
                        ? "bg-[#0D9488] text-white border-[#0D9488] shadow-sm scale-105"
                        : darkMode
                        ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                        : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-teal-50"
                    }`}
                  >
                    {item.forms.isolated}
                  </button>
                );
              })}
            </div>

            {/* 4 Position Cards (RTL Order: Initial -> Medial -> Final -> Isolated) */}
            <div dir="rtl" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 pt-2">
              {[
                {
                  posTitleAr: "١. فِي أَوَّلِ الكَلِمَة",
                  posTitleEn: "1. Beginning (Initial)",
                  shape: activeLetter.forms.initial,
                  word: activeLetter.positionExamples.initialWord,
                  descEn: activeLetter.isNonConnector
                    ? "Stands alone at the start (does not join left)"
                    : "Opens its left arm to connect to the next letter"
                },
                {
                  posTitleAr: "٢. فِي وَسَطِ الكَلِمَة",
                  posTitleEn: "2. Middle (Medial)",
                  shape: activeLetter.forms.medial,
                  word: activeLetter.positionExamples.medialWord,
                  descEn: activeLetter.isNonConnector
                    ? "Joins from the right ONLY, breaks connection after"
                    : "Connects smoothly on both right and left sides"
                },
                {
                  posTitleAr: "٣. فِي آخِرِ الكَلِمَة",
                  posTitleEn: "3. End (Final)",
                  shape: activeLetter.forms.final,
                  word: activeLetter.positionExamples.finalWord,
                  descEn: "Joins from the right and returns to its full tail shape"
                },
                {
                  posTitleAr: "٤. مُنْفَرِدًا (مَعْزُول)",
                  posTitleEn: "4. Isolated Form",
                  shape: activeLetter.forms.isolated,
                  word: activeLetter.quranExampleAr,
                  descEn: "Full standalone form when preceded by a non-connector"
                }
              ].map((card, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border-2 p-4 sm:p-5 flex flex-col justify-between space-y-4 ${
                    darkMode ? "bg-slate-950/70 border-slate-800" : "bg-slate-50/70 border-slate-200/90"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400 font-serif">
                      {card.posTitleAr}
                    </span>
                    <AudioButton text={card.word} />
                  </div>

                  <div className="text-center py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] font-sans font-bold text-slate-400 block" dir="ltr">
                      {card.posTitleEn}
                    </span>
                    <p
                      style={{ fontSize: `clamp(2.2rem, ${2.8 * fontSizeMultiplier}rem, 3.4rem)` }}
                      className="font-serif font-bold text-teal-600 dark:text-teal-400 leading-relaxed"
                    >
                      {card.shape}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-center">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <span className="text-[10px] font-sans font-bold text-amber-700 dark:text-amber-300 block" dir="ltr">
                        Word Example:
                      </span>
                      <p className="font-serif font-bold text-2xl text-slate-900 dark:text-white mt-0.5">
                        {card.word}
                      </p>
                    </div>
                    <p dir="ltr" className="text-[11px] font-sans text-slate-500 leading-snug">
                      {card.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The 6 One-Way / Non-Connecting Letters Banner */}
          <div
            className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
              darkMode ? "bg-rose-950/20 border-rose-800/40" : "bg-rose-50/70 border-rose-200"
            }`}
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold text-rose-700 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Golden Joining Rule: The 6 One-Way Letters (حُرُوفُ القَطْعِ السِّتَّة)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                These <strong>6 letters</strong> connect to the letter <strong>BEFORE</strong> them (on their right), but <strong>NEVER extend a hand to the letter AFTER them</strong> (on their left):
              </p>
            </div>

            <div dir="rtl" className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-center lg:justify-end">
              {["أ", "د", "ذ", "ر", "ز", "و"].map((ch) => (
                <div
                  key={ch}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-slate-900 border-2 border-rose-400 dark:border-rose-700 flex items-center justify-center font-serif font-bold text-2xl text-rose-600 dark:text-rose-400 shadow-2xs"
                >
                  {ch}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          STUDIO 3: LOOK-ALIKE & SOUND-ALIKE CONTRAST LAB
         ===================================================================== */}
      {activeStudio === "contrast" && (
        <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
          <div
            className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-6 space-y-5 ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xs"
            }`}
          >
            <div className="space-y-1">
              <h3 className="text-base sm:text-xl font-extrabold flex items-center gap-2">
                <Scale className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Acoustic & Visual Contrast Lab (مُقَارَنَةُ الحُرُوفِ المُتَشَابِهَة)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Train your ear and eye to immediately separate look-alike and sound-alike Arabic letters side by side!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
              {CONTRAST_PAIRS.map((pair) => (
                <div
                  key={pair.id}
                  className={`rounded-2xl border p-4 sm:p-5 space-y-4 flex flex-col justify-between ${
                    darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50/70 border-slate-200/80"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      {pair.category}
                    </span>
                    <h4 className="font-extrabold text-sm sm:text-base">{pair.pairTitle}</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Side A */}
                    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400">
                          {pair.letterA.name}
                        </span>
                        <AudioButton text={pair.letterA.word} />
                      </div>
                      <div dir="rtl" className="text-center py-1">
                        <span className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                          {pair.letterA.word}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        {pair.letterA.translit}
                      </p>
                      <p className="text-[11px] text-slate-500">{pair.letterA.tip}</p>
                    </div>

                    {/* Side B */}
                    <div className="rounded-xl bg-white dark:bg-slate-900 border border-amber-500/30 p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                          {pair.letterB.name}
                        </span>
                        <AudioButton text={pair.letterB.word} />
                      </div>
                      <div dir="rtl" className="text-center py-1">
                        <span className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                          {pair.letterB.word}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        {pair.letterB.translit}
                      </p>
                      <p className="text-[11px] text-slate-500">{pair.letterB.tip}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-semibold border-t border-slate-200/60 dark:border-slate-800 pt-2.5">
                    💡 {pair.whyCritical}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          STUDIO 4: TEACHER'S LIVE CLASSROOM SPOTLIGHT BOARD
         ===================================================================== */}
      {activeStudio === "teacher" && (
        <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
          <div
            className={`rounded-2xl sm:rounded-3xl border-2 transition-all p-4 sm:p-6 lg:p-8 ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            {/* Classroom Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-lg">
                    Live Alphabet & Joining Flashcard Board (سَبُّورَةُ المُعَلِّم)
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    Shuffle letters randomly to test students out of order, or hide answers during live evaluation!
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleRandomSpotlight}
                  className="px-3.5 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 hover:bg-teal-500/25 transition"
                >
                  <Shuffle className="w-3.5 h-3.5 shrink-0" />
                  <span>Random Letter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHideSpotlightDetails((prev) => !prev)}
                  className={`flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 border transition ${
                    effectiveHideAnswers
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300"
                      : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {effectiveHideAnswers ? <EyeOff className="w-4 h-4 shrink-0" /> : <Eye className="w-4 h-4 shrink-0" />}
                  <span>{effectiveHideAnswers ? "Exam Mode (Hidden)" : "Details Visible"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsLargeSpotlight((prev) => !prev)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 shrink-0"
                  title="Toggle Large Spotlight"
                >
                  {isLargeSpotlight ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Center Flashcard Stage */}
            <div className="py-6 sm:py-10 text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-extrabold text-slate-500">
                <span>Letter {spotlightIdx + 1} of {ARABIC_ALPHABET_DATA.length}</span>
              </div>

              <div dir="rtl" className="py-2">
                <p
                  style={{
                    fontSize: isLargeSpotlight
                      ? `clamp(3.8rem, ${5.0 * fontSizeMultiplier}rem, 6.2rem)`
                      : `clamp(3.0rem, ${4.0 * fontSizeMultiplier}rem, 5.0rem)`
                  }}
                  className="font-serif font-bold text-slate-900 dark:text-white leading-none select-all"
                >
                  {currentSpotlightLetter.char}
                </p>
              </div>

              {/* 4 Joining Forms Strip on Spotlight */}
              <div dir="rtl" className="max-w-lg mx-auto grid grid-cols-4 gap-2 px-2">
                {[
                  { label: "أَوَّل", val: currentSpotlightLetter.forms.initial },
                  { label: "وَسَط", val: currentSpotlightLetter.forms.medial },
                  { label: "آخِر", val: currentSpotlightLetter.forms.final },
                  { label: "مُنْفَرِد", val: currentSpotlightLetter.forms.isolated }
                ].map((f, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 block">{f.label}</span>
                    <span className="font-serif font-bold text-xl sm:text-2xl text-teal-600 dark:text-teal-400">
                      {f.val}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <AudioButton text={currentSpotlightLetter.nameAr} />
              </div>

              {effectiveHideAnswers ? (
                <div className="max-w-md mx-auto p-4 sm:p-5 rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/5 text-center space-y-2.5">
                  <p className="text-xs font-extrabold text-amber-700 dark:text-amber-300">
                    🔒 Ask the student: What is this letter&apos;s name, is it Heavy or Light, and where is its Makhraj?
                  </p>
                  <button
                    type="button"
                    onClick={() => setHideSpotlightDetails(false)}
                    className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-extrabold hover:bg-amber-700 transition"
                  >
                    Reveal Answer Now
                  </button>
                </div>
              ) : (
                <div className="max-w-xl mx-auto p-4 sm:p-5 rounded-2xl border border-teal-500/30 bg-teal-500/5 space-y-2 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-teal-500/15 text-teal-700 dark:text-teal-300">
                      {currentSpotlightLetter.nameEn} ({currentSpotlightLetter.nameAr})
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {currentSpotlightLetter.weight} • {currentSpotlightLetter.makhrajGroup}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                    {currentSpotlightLetter.makhrajDetailEn}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between gap-2 pt-5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() =>
                  setSpotlightIdx((i) => (i === 0 ? ARABIC_ALPHABET_DATA.length - 1 : i - 1))
                }
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-extrabold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                ← Prev Letter
              </button>

              <span className="text-xs font-bold text-slate-400">
                {spotlightIdx + 1} / {ARABIC_ALPHABET_DATA.length}
              </span>

              <button
                type="button"
                onClick={() =>
                  setSpotlightIdx((i) => (i + 1) % ARABIC_ALPHABET_DATA.length)
                }
                className="px-4 py-2.5 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm transition shadow-sm"
              >
                Next Letter →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          STUDIO 5: MASTERY QUIZ ENGINE
         ===================================================================== */}
      {activeStudio === "quiz" && (
        <div className="animate-in fade-in duration-300">
          <QuizEngine
            title="Arabic Alphabet, Makharij & Joining Forms — Mastery Check"
            questions={QUIZ_QUESTIONS}
          />
        </div>
      )}

      {/* =====================================================================
          HIGH-CONVERTING 1-ON-1 AL-AZHAR TEACHER CTA BANNER (BUSINESS GROWTH)
         ===================================================================== */}
      <div
        className={`rounded-2xl sm:rounded-3xl border p-5 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6 ${
          darkMode
            ? "bg-gradient-to-r from-teal-950/70 via-slate-900 to-amber-950/40 border-teal-800/50"
            : "bg-gradient-to-r from-teal-50/90 via-white to-amber-50/80 border-teal-200 shadow-xs"
        }`}
      >
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-teal-700 dark:text-teal-300">
            <Award className="w-4 h-4 shrink-0" />
            <span>1-on-1 Live Makharij Correction with Certified Al-Azhar Tutors</span>
          </div>
          <h3 className="text-base sm:text-xl font-extrabold leading-snug">
            Want a Certified Teacher to Perfect Your Child&apos;s Arabic Pronunciation From Day One?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Mastering throat letters (ع، ح، غ، خ) and heavy letters (ص، ض، ط، ظ، ق) requires live mouth-position coaching from a native Al-Azhar teacher. Book your free 1-on-1 trial class today!
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 text-xs font-bold text-slate-500">
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Free 1-on-1 Zoom Trial
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Kids & Adults Beginners Track
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Ijazah-Certified Tutors
            </span>
          </div>
        </div>

        <a
          href="/book-trial"
          className="w-full sm:w-auto justify-center shrink-0 px-6 py-3.5 rounded-2xl bg-[#0D9488] hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg transition"
        >
          <span>Book Free 1-on-1 Trial Class</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </a>
      </div>
    </div>
  );
}