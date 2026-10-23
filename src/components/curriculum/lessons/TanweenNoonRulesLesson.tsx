"use client";

import React, { useState, useMemo } from "react";
import { useLesson } from "../shared/LessonContext";
import AudioButton from "../shared/AudioButton";
import QuizEngine, { QuizQuestion } from "../shared/QuizEngine";
import {
  Sparkles,
  Volume2,
  Layers,
  Search,
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
  Minimize2
} from "lucide-react";

// ============================================================================
// 1. CURRICULUM DATA ARCHITECTURE (AL-AZHAR TAJWEED STANDARD)
// ============================================================================

interface TanweenTypeCard {
  id: "fathatan" | "kasratan" | "dammatan";
  titleEn: string;
  titleAr: string;
  symbol: string;
  colorClass: string;
  badgeBg: string;
  formulaEn: string;
  exampleWord: string;
  acousticTwin: string;
  translitContinue: string;
  waqfWord: string;
  waqfTranslit: string;
  waqfRuleName: string;
  waqfExplanation: string;
  meaningEn: string;
}

const TANWEEN_TYPES: TanweenTypeCard[] = [
  {
    id: "fathatan",
    titleEn: "Tanween Fath (Double Fatha)",
    titleAr: "تَنْوِينُ الفَتْحِ (ـً)",
    symbol: "ـً ا",
    colorClass: "border-amber-500/40 bg-amber-500/5",
    badgeBg: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    formulaEn: "Fatha (a) + Hidden Noon Sakinah (n) = -an",
    exampleWord: "عَلِيمًا",
    acousticTwin: "عَلِيمَنْ",
    translitContinue: "'Aleeman",
    waqfWord: "عَلِيمَا",
    waqfTranslit: "'Aleemaa (2-Beat Stretch)",
    waqfRuleName: "Madd 'Iwad (مَدُّ عِوَض)",
    waqfExplanation: "When stopping on Tanween Fath, the 'n' sound transforms into a natural 2-beat Alif stretch!",
    meaningEn: "All-Knowing"
  },
  {
    id: "kasratan",
    titleEn: "Tanween Kasr (Double Kasra)",
    titleAr: "تَنْوِينُ الكَسْرِ (ـٍ)",
    symbol: "ـٍ",
    colorClass: "border-teal-500/40 bg-teal-500/5",
    badgeBg: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
    formulaEn: "Kasra (i) + Hidden Noon Sakinah (n) = -in",
    exampleWord: "حَكِيمٍ",
    acousticTwin: "حَكِيمِنْ",
    translitContinue: "Hakeemin",
    waqfWord: "حَكِيمْ",
    waqfTranslit: "Hakeem (Quiet Stop)",
    waqfRuleName: "Sukun Stop (وَقْفٌ بِالسُّكُون)",
    waqfExplanation: "When stopping on Tanween Kasr, both marks drop completely and the final letter rests on Sukun.",
    meaningEn: "All-Wise"
  },
  {
    id: "dammatan",
    titleEn: "Tanween Damm (Double Damma)",
    titleAr: "تَنْوِينُ الضَّمِّ (ـٌ)",
    symbol: "ـٌ",
    colorClass: "border-indigo-500/40 bg-indigo-500/5",
    badgeBg: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
    formulaEn: "Damma (u) + Hidden Noon Sakinah (n) = -un",
    exampleWord: "غَفُورٌ",
    acousticTwin: "غَفُورُنْ",
    translitContinue: "Ghafoorun",
    waqfWord: "غَفُورْ",
    waqfTranslit: "Ghafoor (Quiet Stop)",
    waqfRuleName: "Sukun Stop (وَقْفٌ بِالسُّكُون)",
    waqfExplanation: "When stopping on Tanween Damm, the '-un' sound drops completely and you stop cleanly on Sukun.",
    meaningEn: "All-Forgiving"
  }
];

interface TajweedRuleItem {
  id: "izhar" | "idgham" | "iqlab" | "ikhfa";
  nameEn: string;
  nameAr: string;
  shortNameEn: string;
  taglineEn: string;
  ghunnahBeats: string;
  mushafSign: string;
  themeColor: string;
  badgeStyle: string;
  lettersCount: number;
  letters: string[];
  mnemonicAr?: string;
  mnemonicMeaning?: string;
  howToPronounce: string;
  teacherMistakeAlert: string;
  examples: {
    type: "Noon Sakinah" | "Tanween";
    arabic: string;
    triggerLetter: string;
    translit: string;
    meaning: string;
    analysis: string;
  }[];
}

const FOUR_TAJWEED_RULES: TajweedRuleItem[] = [
  {
    id: "izhar",
    nameEn: "1. Al-Izhar Al-Halqi (Clear Pronunciation)",
    shortNameEn: "1. Izhar (Clear)",
    nameAr: "الإِظْهَارُ الحَلْقِيُّ",
    taglineEn: "Crisp, clear 'N' sound with ZERO extra nasal hold",
    ghunnahBeats: "No Extra Ghunnah (Natural touch only)",
    mushafSign: "Noon carries a tiny Sukun head (نْ) / Stacked symmetrical Tanween",
    themeColor: "border-emerald-500/40 bg-emerald-500/5",
    badgeStyle: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    lettersCount: 6,
    letters: ["ء", "هـ", "ع", "ح", "غ", "خ"],
    mnemonicAr: "أَخِي هَاكَ عِلْمًا حَازَهُ غَيْرُ خَاسِرِ",
    mnemonicMeaning: "The 6 Throat Letters (حُرُوفُ الحَلْق) — First letter of each word",
    howToPronounce: "Touch the tip of your tongue firmly to the upper gums to produce a clean, crisp 'N' sound, then immediately pronounce the throat letter without bouncing or holding.",
    teacherMistakeAlert: "Watch out for students holding the Noon for 2 beats before 'Ayn (ع) or Ghayn (غ), or bouncing the tongue creating accidental Qalqalah.",
    examples: [
      {
        type: "Noon Sakinah",
        arabic: "مَنْ آمَنَ",
        triggerLetter: "ء",
        translit: "Man Aamana",
        meaning: "Whoever believes",
        analysis: "نْ followed by Hamza (ء) → Crisp Izhar"
      },
      {
        type: "Noon Sakinah",
        arabic: "مِنْ عِلْمٍ",
        triggerLetter: "ع",
        translit: "Min 'Ilmin",
        meaning: "Of knowledge",
        analysis: "نْ followed by 'Ayn (ع) → Clear Throat Rule"
      },
      {
        type: "Tanween",
        arabic: "سَمِيعٌ عَلِيمٌ",
        triggerLetter: "ع",
        translit: "Samee'un 'Aleem",
        meaning: "All-Hearing, All-Knowing",
        analysis: "Tanween (ـٌ) followed by 'Ayn (ع) → Crisp '-un'"
      },
      {
        type: "Tanween",
        arabic: "عَذَابٌ أَلِيمٌ",
        triggerLetter: "ء",
        translit: "'Adhaabun Aleem",
        meaning: "A painful punishment",
        analysis: "Tanween (ـٌ) followed by Hamza (ء) → Clear Izhar"
      }
    ]
  },
  {
    id: "idgham",
    nameEn: "2. Al-Idgham (Seamless Merging)",
    shortNameEn: "2. Idgham (Merge)",
    nameAr: "الإِدْغَامُ (يَرْمَلُون)",
    taglineEn: "Melt the Noon/Tanween directly into the next letter!",
    ghunnahBeats: "2 Beats with (ي ن م و) • 0 Beats with (ل ر)",
    mushafSign: "Bare Noon (ن) with NO Sukun + Shaddah (ّ) on next letter",
    themeColor: "border-purple-500/40 bg-purple-500/5",
    badgeStyle: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
    lettersCount: 6,
    letters: ["ي", "ر", "م", "ل", "و", "ن"],
    mnemonicAr: "يَرْمَلُونَ (بِغُنَّةٍ: يَنْمُو • بِغَيْرِ غُنَّةٍ: ل - ر)",
    mnemonicMeaning: "Divided into 4 Nasal Merge letters (ي ن م و) & 2 Pure Merge letters (ل ر)",
    howToPronounce: "Skip the 'N' tongue touch completely! Jump straight from the letter before Noon into the Yarmaloon letter. Hold for 2 nasal beats on (ي ن م و), or merge cleanly with zero nasal hold on (ل ر).",
    teacherMistakeAlert: "Idgham ONLY happens across TWO separate words! If Noon Sakinah and a Yarmaloon letter appear inside the SAME word (دُنْيَا, بُنْيَانٌ, صِنْوَانٌ, قِنْوَانٌ), it is pronounced clearly (Izhar Mutlaq).",
    examples: [
      {
        type: "Noon Sakinah",
        arabic: "مَن يَقُولُ",
        triggerLetter: "ي",
        translit: "May-yaqoolu",
        meaning: "Whoever says",
        analysis: "Idgham with Ghunnah (2 beats) — ن melts into ي"
      },
      {
        type: "Noon Sakinah",
        arabic: "مِن رَّبِّهِمْ",
        triggerLetter: "ر",
        translit: "Mir-rabbihim",
        meaning: "From their Lord",
        analysis: "Idgham WITHOUT Ghunnah — Pure merge into رّ"
      },
      {
        type: "Tanween",
        arabic: "هُدًى لِّلْمُتَّقِينَ",
        triggerLetter: "ل",
        translit: "Hudal-lil-muttaqeen",
        meaning: "Guidance for the righteous",
        analysis: "Idgham WITHOUT Ghunnah — Tanween melts into لّ"
      },
      {
        type: "Tanween",
        arabic: "خَيْرٌ وَأَبْقَىٰ",
        triggerLetter: "و",
        translit: "Khayruw-wa abqaa",
        meaning: "Better and more lasting",
        analysis: "Idgham with Ghunnah (2 beats) — Tanween into و"
      }
    ]
  },
  {
    id: "iqlab",
    nameEn: "3. Al-Iqlab (Transform into Meem)",
    shortNameEn: "3. Iqlab (into Meem)",
    nameAr: "الإِقْلَابُ (قَلْبُ النُّونِ مِيمًا)",
    taglineEn: "Turn the 'N' sound into a gentle nasal 'M' before letter Baa (ب)!",
    ghunnahBeats: "2 Nasal Beats (Soft lip touch)",
    mushafSign: "A tiny standing Meem (مـ) placed directly above the Noon or Tanween",
    themeColor: "border-sky-500/40 bg-sky-500/5",
    badgeStyle: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
    lettersCount: 1,
    letters: ["ب"],
    mnemonicAr: "حَرْفٌ وَاحِدٌ فَقَطْ: البَاء (ب)",
    mnemonicMeaning: "Whenever Noon Sakinah or Tanween meets Baa (either in 1 word or across 2 words)",
    howToPronounce: "Instead of touching your tongue for 'N', bring your two lips gently together to form a soft hidden Meem (م) with a 2-beat nasal hum (Ghunnah), then release into Baa (ب).",
    teacherMistakeAlert: "Avoid pressing the lips tightly or leaving a wide open gap between the lips. The lips should touch lightly without squeezing during the 2-beat hum.",
    examples: [
      {
        type: "Noon Sakinah",
        arabic: "مِنۢ بَعْدِ",
        triggerLetter: "ب",
        translit: "Mim-ba'di",
        meaning: "After",
        analysis: "ن + ب across two words → Pronounced 'Mim-ba'di' (2 beats)"
      },
      {
        type: "Noon Sakinah",
        arabic: "أَنۢبِئْهُم",
        triggerLetter: "ب",
        translit: "Am-bi'hum",
        meaning: "Inform them",
        analysis: "ن + ب inside ONE word → Tiny Meem sign (ۢ) shows Iqlab"
      },
      {
        type: "Tanween",
        arabic: "سَمِيعٌۢ بَصِيرٌ",
        triggerLetter: "ب",
        translit: "Samee'um-Baseer",
        meaning: "All-Hearing, All-Seeing",
        analysis: "Tanween + ب → '-un' transforms into '-um' for 2 beats"
      },
      {
        type: "Tanween",
        arabic: "عَلِيمٌۢ بِذَاتِ",
        triggerLetter: "ب",
        translit: "'Aleemum-bidhaati",
        meaning: "Knowing of what is within",
        analysis: "Tanween + ب → Smooth nasal 'M' bridge"
      }
    ]
  },
  {
    id: "ikhfa",
    nameEn: "4. Al-Ikhfa Al-Haqiqi (Nasal Concealment)",
    shortNameEn: "4. Ikhfa (Conceal)",
    nameAr: "الإِخْفَاءُ الحَقِيقِيُّ",
    taglineEn: "Hover your tongue near the next letter with a 2-beat nasal hum!",
    ghunnahBeats: "2 Nasal Beats (Light or Heavy depending on next letter)",
    mushafSign: "Bare Noon (ن) with NO Sukun + NO Shaddah on the next letter",
    themeColor: "border-rose-500/40 bg-rose-500/5",
    badgeStyle: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
    lettersCount: 15,
    letters: ["ت", "ث", "ج", "د", "ذ", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ف", "ق", "ك"],
    mnemonicAr: "صِفْ ذَا ثَنَا كَمْ جَادَ شَخْصٌ قَدْ سَمَا • دُمْ طَيِّبًا زِدْ فِي تُقًى ضَعْ ظَالِمَا",
    mnemonicMeaning: "The remaining 15 letters of the Arabic alphabet (First letter of each word in the poem)",
    howToPronounce: "Keep the tip of your tongue hovering OFF the upper gums! Prepare your mouth at the articulation point (Makhraj) of the upcoming letter while humming through the nose for 2 beats.",
    teacherMistakeAlert: "The #1 student error in Ikhfa is pressing the tongue tip against the roof of the mouth (making it sound like Izhar 'In-saan' instead of hovering 'In~saan').",
    examples: [
      {
        type: "Noon Sakinah",
        arabic: "ٱلْإِنسَٰنُ",
        triggerLetter: "س",
        translit: "Al-In~saanu",
        meaning: "Mankind",
        analysis: "Light Ghunnah (2 beats) — Tongue hovers near Seen (س)"
      },
      {
        type: "Noon Sakinah",
        arabic: "مَنصُورًا",
        triggerLetter: "ص",
        translit: "Man~sooraa",
        meaning: "Supported / Victorious",
        analysis: "HEAVY Ghunnah (2 beats) — Because Saad (ص) is a heavy letter!"
      },
      {
        type: "Noon Sakinah",
        arabic: "مِن قَبْلِ",
        triggerLetter: "ق",
        translit: "Min~qabli",
        meaning: "Before",
        analysis: "Deep Heavy Ghunnah at the back of the tongue before Qaf (ق)"
      },
      {
        type: "Tanween",
        arabic: "رِيحٍ صَرْصَرٍ",
        triggerLetter: "ص",
        translit: "Reehin~sarsarin",
        meaning: "A furious wind",
        analysis: "Tanween + ص → Heavy 2-beat nasal concealment"
      }
    ]
  }
];

const ALPHABET_SCANNER_DATA: {
  letter: string;
  ruleId: "izhar" | "idgham" | "iqlab" | "ikhfa";
  ruleName: string;
  subRule: string;
  ghunnah: string;
  sampleAr: string;
  sampleTranslit: string;
  color: string;
}[] = [
  { letter: "ء", ruleId: "izhar", ruleName: "Izhar Halqi (إِظْهَار)", subRule: "Throat Letter", ghunnah: "Zero extra hold", sampleAr: "مَنْ آمَنَ", sampleTranslit: "Man Aamana", color: "bg-emerald-500 text-white" },
  { letter: "ب", ruleId: "iqlab", ruleName: "Iqlab (إِقْلَاب)", subRule: "Turns into Meem (م)", ghunnah: "2 Nasal Beats", sampleAr: "مِنۢ بَعْدِ", sampleTranslit: "Mim-ba'di", color: "bg-sky-500 text-white" },
  { letter: "ت", ruleId: "ikhfa", ruleName: "Ikhfa Haqiqi (إِخْفَاء)", subRule: "Light Nasal Hover", ghunnah: "2 Light Beats", sampleAr: "جَنَّٰتٍ تَجْرِي", sampleTranslit: "Jannaatin~tajree", color: "bg-rose-500 text-white" },
  { letter: "ث", ruleId: "ikhfa", ruleName: "Ikhfa Haqiqi (إِخْفَاء)", subRule: "Light Nasal Hover", ghunnah: "2 Light Beats", sampleAr: "مَنثُورًا", sampleTranslit: "Man~thooraa", color: "bg-rose-500 text-white" },
  { letter: "ج", ruleId: "ikhfa", ruleName: "Ikhfa Haqiqi (إِخْفَاء)", subRule: "Light Nasal Hover", ghunnah: "2 Light Beats", sampleAr: "مَن جَاءَ", sampleTranslit: "Man~jaa'a", color: "bg-rose-500 text-white" },
  { letter: "ح", ruleId: "izhar", ruleName: "Izhar Halqi (إِظْهَار)", subRule: "Throat Letter", ghunnah: "Zero extra hold", sampleAr: "عَلِيمٌ حَكِيمٌ", sampleTranslit: "'Aleemun Hakeem", color: "bg-emerald-500 text-white" },
  { letter: "خ", ruleId: "izhar", ruleName: "Izhar Halqi (إِظْهَار)", subRule: "Throat Letter", ghunnah: "Zero extra hold", sampleAr: "مِنْ خَيْرٍ", sampleTranslit: "Min Khayrin", color: "bg-emerald-500 text-white" },
  { letter: "د", ruleId: "ikhfa", ruleName: "Ikhfa Haqiqi (إِخْفَاء)", subRule: "Light Nasal Hover", ghunnah: "2 Light Beats", sampleAr: "أَندَادًا", sampleTranslit: "An~daadaa", color: "bg-rose-500 text-white" },
  { letter: "ذ", ruleId: "ikhfa", ruleName: "Ikhfa Haqiqi (إِخْفَاء)", subRule: "Light Nasal Hover", ghunnah: "2 Light Beats", sampleAr: "مُنذِرٌ", sampleTranslit: "Mun~dhirun", color: "bg-rose-500 text-white" },
  { letter: "ر", ruleId: "idgham", ruleName: "Idgham (إِدْغَام بِغَيْرِ غُنَّة)", subRule: "Complete Merge (No Ghunnah)", ghunnah: "0 Nasal Beats", sampleAr: "مِن رَّبِّهِمْ", sampleTranslit: "Mir-rabbihim", color: "bg-purple-600 text-white" },
  { letter: "ز", ruleId: "ikhfa", ruleName: "Ikhfa Haqiqi (إِخْفَاء)", subRule: "Light Nasal Hover", ghunnah: "2 Light Beats", sampleAr: "نَفْسًا زَكِيَّةً", sampleTranslit: "Nafsan~zakiyyah", color: "bg-rose-500 text-white" },
  { letter: "س", ruleId: "ikhfa", ruleName: "Ikhfa Haqiqi (إِخْفَاء)", subRule: "Light Nasal Hover", ghunnah: "2 Light Beats", sampleAr: "ٱلْإِنسَٰنُ", sampleTranslit: "Al-In~saanu", color: "bg-rose-500 text-white" },
  { letter: "ش", ruleId: "ikhfa", ruleName: "Ikhfa Haqiqi (إِخْفَاء)", subRule: "Light Nasal Hover", ghunnah: "2 Light Beats", sampleAr: "مِن شَرِّ", sampleTranslit: "Min~sharri", color: "bg-rose-500 text-white" },
  { letter: "ص", ruleId: "ikhfa", ruleName: "Ikhfa Haqiqi (إِخْفَاء مُفَخَّم)", subRule: "HEAVY Nasal Hover", ghunnah: "2 Heavy Beats", sampleAr: "مَنصُورًا", sampleTranslit: "Man~sooraa", color: "bg-rose-600 text-white" },
  { letter: "ض", ruleId: "ikhfa", ruleName: "Ikhfa Haqiqi (إِخْفَاء مُفَخَّم)", subRule: "HEAVY Nasal Hover", ghunnah: "2 Heavy Beats", sampleAr: "مَّنضُودٍ", sampleTranslit: "Man~doodin", color: "bg-rose-600 text-white" },
  { letter: "ط", ruleId: "ikhfa", ruleName: "Ikhfa Haqiqi (إِخْفَاء مُفَخَّم)", subRule: "HEAVY Nasal Hover", ghunnah: "2 Heavy Beats", sampleAr: "مِن طَيِّبَٰتِ", sampleTranslit: "Min~tayyibaati", color: "bg-rose-600 text-white" },
  { letter: "ظ", ruleId: "ikhfa", ruleName: "Ikhfa Haqiqi (إِخْفَاء مُفَخَّم)", subRule: "HEAVY Nasal Hover", ghunnah: "2 Heavy Beats", sampleAr: "يَنظُرُونَ", sampleTranslit: "Yan~dhuroona", color: "bg-rose-600 text-white" },
  { letter: "ع", ruleId: "izhar", ruleName: "Izhar Halqi (إِظْهَار)", subRule: "Throat Letter", ghunnah: "Zero extra hold", sampleAr: "مِنْ عِلْمٍ", sampleTranslit: "Min 'Ilmin", color: "bg-emerald-500 text-white" },
  { letter: "غ", ruleId: "izhar", ruleName: "Izhar Halqi (إِظْهَار)", subRule: "Throat Letter", ghunnah: "Zero extra hold", sampleAr: "مِنْ غِلٍّ", sampleTranslit: "Min Ghillin", color: "bg-emerald-500 text-white" },
  { letter: "ف", ruleId: "ikhfa", ruleName: "Ikhfa Haqiqi (إِخْفَاء)", subRule: "Light Nasal Hover", ghunnah: "2 Light Beats", sampleAr: "أَنفُسِهِمْ", sampleTranslit: "An~fusihim", color: "bg-rose-500 text-white" },
  { letter: "ق", ruleId: "ikhfa", ruleName: "Ikhfa Haqiqi (إِخْفَاء مُفَخَّم)", subRule: "HEAVY Nasal Hover", ghunnah: "2 Heavy Beats", sampleAr: "مِن قَبْلِ", sampleTranslit: "Min~qabli", color: "bg-rose-600 text-white" },
  { letter: "ك", ruleId: "ikhfa", ruleName: "Ikhfa Haqiqi (إِخْفَاء)", subRule: "Light Nasal Hover", ghunnah: "2 Light Beats", sampleAr: "مَن كَانَ", sampleTranslit: "Man~kaana", color: "bg-rose-500 text-white" },
  { letter: "ل", ruleId: "idgham", ruleName: "Idgham (إِدْغَام بِغَيْرِ غُنَّة)", subRule: "Complete Merge (No Ghunnah)", ghunnah: "0 Nasal Beats", sampleAr: "مِن لَّدُنْهُ", sampleTranslit: "Mil-ladunhu", color: "bg-purple-600 text-white" },
  { letter: "م", ruleId: "idgham", ruleName: "Idgham with Ghunnah (إِدْغَام بِغُنَّة)", subRule: "Nasal Merge (ينمو)", ghunnah: "2 Nasal Beats", sampleAr: "مِن مَّاءٍ", sampleTranslit: "Mim-maa'in", color: "bg-purple-500 text-white" },
  { letter: "ن", ruleId: "idgham", ruleName: "Idgham with Ghunnah (إِدْغَام بِغُنَّة)", subRule: "Nasal Merge (ينمو)", ghunnah: "2 Nasal Beats", sampleAr: "مِن نِّعْمَةٍ", sampleTranslit: "Min-ni'matin", color: "bg-purple-500 text-white" },
  { letter: "هـ", ruleId: "izhar", ruleName: "Izhar Halqi (إِظْهَار)", subRule: "Throat Letter", ghunnah: "Zero extra hold", sampleAr: "مِنْ هَادٍ", sampleTranslit: "Min Haadin", color: "bg-emerald-500 text-white" },
  { letter: "و", ruleId: "idgham", ruleName: "Idgham with Ghunnah (إِدْغَام بِغُنَّة)", subRule: "Nasal Merge (ينمو)", ghunnah: "2 Nasal Beats", sampleAr: "مِن وَالٍ", sampleTranslit: "Miw-waalin", color: "bg-purple-500 text-white" },
  { letter: "ي", ruleId: "idgham", ruleName: "Idgham with Ghunnah (إِدْغَام بِغُنَّة)", subRule: "Nasal Merge (ينمو)", ghunnah: "2 Nasal Beats", sampleAr: "مَن يَقُولُ", sampleTranslit: "May-yaqoolu", color: "bg-purple-500 text-white" }
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "tn1",
    questionEn: "What is Tanween (التَّنْوِين) acoustically equivalent to when pronouncing it?",
    arabicPrompt: "عَلِيمٌ = عَلِيمُنْ",
    options: [
      { id: "a", text: "A hidden Noon Sakinah (نْ) heard at the end of a noun when continuing, but never written as a Noon", isCorrect: true },
      { id: "b", text: "A 4-beat long vowel stretch", isCorrect: false },
      { id: "c", text: "A silent letter that is never pronounced", isCorrect: false },
      { id: "d", text: "A heavy Qalqalah bounce", isCorrect: false }
    ],
    explanation: "Tanween is a supplementary Noon Sakinah (نُونٌ سَاكِنَةٌ زَائِدَة) pronounced when continuing, and dropped when stopping!"
  },
  {
    id: "tn2",
    questionEn: "What happens when you STOP (Waqf) on a word ending with Tanween Fath like (عَلِيمًا)?",
    arabicPrompt: "عَلِيمًا ⬅ عَلِيمَا",
    options: [
      { id: "a", text: "The 'n' sound transforms into a 2-beat Alif stretch called Madd 'Iwad (مَدُّ عِوَض)", isCorrect: true },
      { id: "b", text: "You pronounce the 'n' sound strongly", isCorrect: false },
      { id: "c", text: "You stop on Sukun ('Aleem)", isCorrect: false },
      { id: "d", text: "It turns into a Damma", isCorrect: false }
    ],
    explanation: "Unlike Tanween Kasr and Damm (which drop to Sukun when stopping), Tanween Fath turns into a natural 2-beat Alif stretch (Madd 'Iwad)!"
  },
  {
    id: "tn3",
    questionEn: "Which Tajweed rule applies in (مِنۢ بَعْدِ) where a tiny Meem (مـ) sits above the Noon?",
    arabicPrompt: "مِنۢ بَعْدِ",
    options: [
      { id: "a", text: "Al-Iqlab (الإِقْلَاب) — Transform Noon into a gentle Meem with 2 beats of Ghunnah before Baa (ب)", isCorrect: true },
      { id: "b", text: "Al-Izhar Al-Halqi (الإِظْهَار)", isCorrect: false },
      { id: "c", text: "Idgham without Ghunnah", isCorrect: false },
      { id: "d", text: "Madd Lazim", isCorrect: false }
    ],
    explanation: "Whenever Noon Sakinah or Tanween is followed by letter Baa (ب), Iqlab occurs — marked in the Mushaf by a miniature standing Meem (مـ)."
  },
  {
    id: "tn4",
    questionEn: "In (مِن رَّبِّهِمْ), Noon Sakinah is followed by Raa (ر). How is it pronounced?",
    arabicPrompt: "مِن رَّبِّهِمْ",
    options: [
      { id: "a", text: "Idgham WITHOUT Ghunnah (Mir-rabbihim) — Complete merge with zero nasal hold", isCorrect: true },
      { id: "b", text: "Idgham with 2 beats of Ghunnah", isCorrect: false },
      { id: "c", text: "Crisp Izhar (Min Rabbihim)", isCorrect: false },
      { id: "d", text: "Iqlab into Meem", isCorrect: false }
    ],
    explanation: "Letters Lam (ل) and Raa (ر) are the two letters of Idgham WITHOUT Ghunnah — the Noon merges completely into Raa with a clean transition."
  },
  {
    id: "tn5",
    questionEn: "Why is the Noon Sakinah in the word (دُنْيَا) pronounced clearly instead of merging into Ya (ي)?",
    arabicPrompt: "دُنْيَا • بُنْيَانٌ",
    options: [
      { id: "a", text: "Because Noon Sakinah and Ya are inside the SAME word (Izhar Mutlaq), whereas Idgham only happens across TWO words", isCorrect: true },
      { id: "b", text: "Because Ya is a throat letter", isCorrect: false },
      { id: "c", text: "Because Dunya has a Shaddah", isCorrect: false },
      { id: "d", text: "Because Noon has a Damma", isCorrect: false }
    ],
    explanation: "Idgham requires two separate words. In the 4 Quranic words (دُنْيَا، بُنْيَانٌ، صِنْوَانٌ، قِنْوَانٌ), Noon Sakinah and the Yarmaloon letter occur inside a single word, so it MUST be pronounced clearly (إِظْهَار مُطْلَق)!"
  }
];

// ============================================================================
// 2. MAIN INTERACTIVE COMPONENT (100% MOBILE-FIRST RESPONSIVE)
// ============================================================================

export default function TanweenNoonRulesLesson() {
  const lessonCtx = useLesson();
  const darkMode = lessonCtx?.darkMode ?? false;
  const showTransliteration = lessonCtx?.showTransliteration ?? true;
  const showEnglishMeaning = lessonCtx?.showEnglishMeaning ?? true;
  const isTeacherMode = lessonCtx?.isTeacherMode ?? false;
  const fontSizeMultiplier = lessonCtx?.fontSizeMultiplier ?? 1.1;

  const [activeStudio, setActiveStudio] = useState<"tanween" | "rules" | "scanner" | "teacher" | "quiz">("tanween");
  const [tanweenReciteMode, setTanweenReciteMode] = useState<"wasl" | "waqf">("wasl");
  const [showTwinReveal, setShowTwinReveal] = useState<boolean>(true);
  const [selectedRuleId, setSelectedRuleId] = useState<"izhar" | "idgham" | "iqlab" | "ikhfa">("izhar");
  const [selectedScannerLetter, setSelectedScannerLetter] = useState<string>("ب");
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);
  const [hideAnswersInSpotlight, setHideAnswersInSpotlight] = useState<boolean>(false);
  const [isFullscreenCard, setIsFullscreenCard] = useState<boolean>(false);

  const activeRuleObj = useMemo(
    () => FOUR_TAJWEED_RULES.find((r) => r.id === selectedRuleId) || FOUR_TAJWEED_RULES[0],
    [selectedRuleId]
  );

  const activeScannerObj = useMemo(
    () => ALPHABET_SCANNER_DATA.find((item) => item.letter === selectedScannerLetter) || ALPHABET_SCANNER_DATA[1],
    [selectedScannerLetter]
  );

  const SPOTLIGHT_DRILLS = useMemo(() => {
    return FOUR_TAJWEED_RULES.flatMap((rule) =>
      rule.examples.map((ex) => ({
        ...ex,
        ruleNameEn: rule.nameEn,
        ruleNameAr: rule.nameAr,
        ghunnahBeats: rule.ghunnahBeats,
        badgeStyle: rule.badgeStyle
      }))
    );
  }, []);

  const currentSpotlightCard = SPOTLIGHT_DRILLS[spotlightIndex] || SPOTLIGHT_DRILLS[0];
  const effectiveHideAnswers = isTeacherMode || hideAnswersInSpotlight;

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-12">
      {/* =====================================================================
          HERO PEDAGOGICAL BANNER (RESPONSIVE STACK ON MOBILE)
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
              <span>Core Tajweed Foundation • Noor Al-Bayan & Hafs</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug">
              Tanween & The 4 Master Rules of Noon Sakinah{" "}
              <span dir="rtl" className="text-teal-600 dark:text-teal-400 font-serif block sm:inline mt-1 sm:mt-0 text-lg sm:text-2xl">
                (أَحْكَامُ النُّونِ السَّاكِنَةِ وَالتَّنْوِين)
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Why do scholars teach <strong>Noon Sakinah (نْ)</strong> and <strong>Tanween (ـً ـٍ ـٌ)</strong> together? Because acoustically, <strong>Tanween IS a hidden Noon Sakinah</strong> at the end of a word! Master this secret once, and you unlock 40% of Quranic recitation fluency.
            </p>
          </div>

          {/* Quick Golden Formula Pill */}
          <div
            className={`w-full lg:w-auto shrink-0 rounded-2xl border p-4 text-center space-y-1.5 ${
              darkMode ? "bg-slate-950/80 border-slate-800" : "bg-white/90 border-teal-200 shadow-xs"
            }`}
          >
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
              The Golden Acoustic Equation
            </span>
            <div dir="rtl" className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-serif font-bold text-xl sm:text-2xl lg:text-3xl">
              <span className="text-teal-600 dark:text-teal-400">بً / بٍ / بٌ</span>
              <span className="text-slate-400 text-base">=</span>
              <span className="text-amber-600 dark:text-amber-400">بَنْ / بِنْ / بُنْ</span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">
              Same Sound • Same 4 Tajweed Rules!
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================================
          5-STUDIO INTERACTIVE NAVIGATION BAR (WRAPPING GRID ON MOBILE, NO OVERFLOW)
         ===================================================================== */}
      <div
        className={`rounded-2xl border p-1.5 sm:p-2 ${
          darkMode ? "bg-slate-900/90 border-slate-800" : "bg-slate-100/90 border-slate-200"
        }`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap items-stretch gap-1.5 sm:gap-2">
          {[
            { id: "tanween", shortLabel: "1. Tanween Lab", fullLabel: "1. Tanween & Waqf Lab", icon: Volume2 },
            { id: "rules", shortLabel: "2. The 4 Rules", fullLabel: "2. The 4 Tajweed Rules", icon: Layers },
            { id: "scanner", shortLabel: "3. Rule Scanner", fullLabel: "3. 28-Letter Scanner", icon: Search },
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
          STUDIO 1: TANWEEN TWIN ACOUSTIC LAB & WAQF (STOPPING) SIMULATOR
         ===================================================================== */}
      {activeStudio === "tanween" && (
        <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
          {/* Interactive Controls Bar */}
          <div
            className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xs"
            }`}
          >
            <div className="space-y-1">
              <h3 className="text-base sm:text-xl font-extrabold flex flex-wrap items-center gap-2">
                <span>Interactive Tanween & Stopping Simulator</span>
                <span dir="rtl" className="text-teal-600 dark:text-teal-400 font-serif text-sm sm:text-base">
                  (مُحَاكِي التَّنْوِين عِنْدَ الوَصْلِ وَالوَقْف)
                </span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Toggle between <strong>Continuing (وَصْل)</strong> and <strong>Stopping (وَقْف)</strong> to see and hear how Tanween transforms!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
              {/* Wasl vs Waqf Switch */}
              <div className="grid grid-cols-2 sm:inline-flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setTanweenReciteMode("wasl")}
                  className={`px-3 py-2 rounded-lg sm:rounded-xl text-xs font-extrabold transition text-center ${
                    tanweenReciteMode === "wasl"
                      ? "bg-[#0D9488] text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  🔗 Continuing (وَصْل)
                </button>
                <button
                  type="button"
                  onClick={() => setTanweenReciteMode("waqf")}
                  className={`px-3 py-2 rounded-lg sm:rounded-xl text-xs font-extrabold transition text-center ${
                    tanweenReciteMode === "waqf"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  🛑 Stopping (وَقْف)
                </button>
              </div>

              {/* Acoustic X-Ray Toggle */}
              <button
                type="button"
                onClick={() => setShowTwinReveal((prev) => !prev)}
                className={`px-3.5 py-2.5 rounded-xl sm:rounded-2xl border text-xs font-extrabold inline-flex items-center justify-center gap-1.5 transition ${
                  showTwinReveal
                    ? "border-teal-500/40 bg-teal-500/10 text-teal-700 dark:text-teal-300"
                    : "border-slate-200 dark:border-slate-800 text-slate-500"
                }`}
              >
                {showTwinReveal ? <Eye className="w-3.5 h-3.5 shrink-0" /> : <EyeOff className="w-3.5 h-3.5 shrink-0" />}
                <span>Acoustic X-Ray (نْ)</span>
              </button>
            </div>
          </div>

          {/* 3 Tanween Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {TANWEEN_TYPES.map((item) => {
              const displayedArabic = tanweenReciteMode === "wasl" ? item.exampleWord : item.waqfWord;
              const displayedTranslit = tanweenReciteMode === "wasl" ? item.translitContinue : item.waqfTranslit;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl sm:rounded-3xl border-2 p-4 sm:p-6 space-y-4 sm:space-y-5 transition-all flex flex-col justify-between ${
                    darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200/90 shadow-xs"
                  }`}
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${item.badgeBg}`}>
                        {item.titleAr}
                      </span>
                      <AudioButton text={displayedArabic} />
                    </div>

                    <div>
                      <h4 className="font-extrabold text-base sm:text-lg">{item.titleEn}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">{item.formulaEn}</p>
                    </div>

                    {/* Main Arabic Stage with Responsive Clamp Font Size */}
                    <div
                      dir="rtl"
                      className={`rounded-2xl border p-4 sm:p-6 text-center space-y-3 overflow-hidden ${item.colorClass}`}
                    >
                      <p
                        style={{ fontSize: `clamp(1.85rem, ${2.3 * fontSizeMultiplier}rem, 3.2rem)` }}
                        className="font-serif font-bold leading-relaxed tracking-wide break-words select-all"
                      >
                        {displayedArabic}
                      </p>

                      {showTwinReveal && tanweenReciteMode === "wasl" && (
                        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-950/90 border border-slate-200/70 dark:border-slate-800 text-xs font-bold max-w-full">
                          <span className="text-slate-500 font-sans">Sounds like:</span>
                          <span className="font-serif text-base text-teal-600 dark:text-teal-400 font-extrabold">
                            {item.acousticTwin}
                          </span>
                        </div>
                      )}

                      {tanweenReciteMode === "waqf" && (
                        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-extrabold font-sans max-w-full">
                          <span>🛑 {item.waqfRuleName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isTeacherMode && (
                    <div className="pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                      {showTransliteration && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400 font-bold uppercase shrink-0">Sound:</span>
                          <span className="font-extrabold text-teal-600 dark:text-teal-400 text-right truncate">
                            {displayedTranslit}
                          </span>
                        </div>
                      )}
                      {showEnglishMeaning && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400 font-bold uppercase shrink-0">Meaning:</span>
                          <span className="font-semibold text-slate-600 dark:text-slate-300 text-right">{item.meaningEn}</span>
                        </div>
                      )}
                      <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                        {tanweenReciteMode === "wasl"
                          ? "In connected recitation, pronounce a crisp hidden Noon Sakinah at the end."
                          : item.waqfExplanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Special Exception Callout: Ta' Marbutah (ةً) */}
          <div
            className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              darkMode ? "bg-amber-950/20 border-amber-800/40" : "bg-amber-50/70 border-amber-200"
            }`}
          >
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold text-amber-700 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Golden Stopping Rule: Round Taa (التَّاء المَرْبُوطَة ـةً)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                When a word ends with <strong>Round Taa (ـةً / ةً)</strong> like <strong dir="rtl">رَحْمَةً</strong>, Tanween Fath does <strong>NOT</strong> take an extra Alif at the end, and when stopping on it, it transforms into a soft <strong>Haa Sakinah (رَحْمَهْ - Rahmah)</strong>!
              </p>
            </div>
            <div className="w-full sm:w-auto shrink-0 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-200/60 dark:border-amber-800/40">
              <div dir="rtl" className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 font-serif font-bold text-lg sm:text-xl">
                رَحْمَةً ⬅ رَحْمَهْ
              </div>
              <AudioButton text="رَحْمَةً" />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          STUDIO 2: THE 4 MASTER TAJWEED RULES (COLOR-CODED INTERACTIVE LAB)
         ===================================================================== */}
      {activeStudio === "rules" && (
        <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
          {/* 4 Rule Selector Cards (2x2 on mobile, 4 cols on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {FOUR_TAJWEED_RULES.map((rule) => {
              const isSelected = rule.id === selectedRuleId;
              return (
                <button
                  key={rule.id}
                  type="button"
                  onClick={() => setSelectedRuleId(rule.id)}
                  className={`text-left rounded-2xl border p-3 sm:p-4 transition-all space-y-1.5 sm:space-y-2 ${
                    isSelected
                      ? "border-[#0D9488] bg-teal-500/10 ring-2 ring-[#0D9488]/30 shadow-xs"
                      : darkMode
                      ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                      : "bg-white border-slate-200 hover:border-teal-300"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold ${rule.badgeStyle}`}>
                      {rule.lettersCount} {rule.lettersCount === 1 ? "Letter" : "Letters"}
                    </span>
                    <span dir="rtl" className="font-serif font-bold text-xs sm:text-sm text-teal-600 dark:text-teal-400">
                      {rule.nameAr}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm truncate">
                    <span className="sm:hidden">{rule.shortNameEn}</span>
                    <span className="hidden sm:inline">{rule.nameEn}</span>
                  </h4>
                </button>
              );
            })}
          </div>

          {/* Active Rule Deep-Dive Dashboard */}
          <div
            className={`rounded-2xl sm:rounded-3xl border-2 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xs"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 sm:pb-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${activeRuleObj.badgeStyle}`}>
                    {activeRuleObj.nameAr}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    ⏱️ {activeRuleObj.ghunnahBeats}
                  </span>
                </div>
                <h3 className="text-lg sm:text-2xl font-extrabold leading-snug">{activeRuleObj.nameEn}</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold">{activeRuleObj.taglineEn}</p>
              </div>

              <div className="rounded-2xl border border-dashed border-teal-500/40 bg-teal-500/5 p-3.5 sm:p-4 lg:max-w-md space-y-1">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                  📖 How to Spot It in the Mushaf
                </span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
                  {activeRuleObj.mushafSign}
                </p>
              </div>
            </div>

            {/* Trigger Letters Showcase & Mnemonic */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start lg:items-center">
              <div className="lg:col-span-7 space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  Trigger Letters ({activeRuleObj.lettersCount}):
                </span>
                <div dir="rtl" className="flex flex-wrap items-center gap-2">
                  {activeRuleObj.letters.map((letter) => (
                    <div
                      key={letter}
                      className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl border-2 flex items-center justify-center font-serif font-bold text-xl sm:text-2xl shadow-2xs ${activeRuleObj.themeColor}`}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                {activeRuleObj.mnemonicAr && (
                  <div className="pt-2 space-y-1">
                    <p dir="rtl" className="font-serif font-bold text-sm sm:text-lg text-amber-600 dark:text-amber-400 leading-relaxed">
                      « {activeRuleObj.mnemonicAr} »
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">{activeRuleObj.mnemonicMeaning}</p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 space-y-3 w-full">
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-3.5 sm:p-4 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                  <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 shrink-0" />
                    <span>Vocal Technique (آلِيَّةُ النُّطْق):</span>
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {activeRuleObj.howToPronounce}
                  </p>
                </div>

                <div className="rounded-2xl bg-rose-500/5 p-3.5 sm:p-4 border border-rose-500/20 space-y-1">
                  <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Common Mistake to Avoid:</span>
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {activeRuleObj.teacherMistakeAlert}
                  </p>
                </div>
              </div>
            </div>

            {/* Quranic Examples Grid */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Authentic Quranic Examples (Noon Sakinah & Tanween):
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {activeRuleObj.examples.map((ex, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between gap-3 sm:gap-4 ${
                      darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50/70 border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold ${activeRuleObj.badgeStyle}`}>
                          {ex.type}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          Letter: <strong dir="rtl" className="font-serif text-sm text-slate-800 dark:text-white">({ex.triggerLetter})</strong>
                        </span>
                      </div>
                      <AudioButton text={ex.arabic} />
                    </div>

                    <div dir="rtl" className="text-center py-1 sm:py-2 overflow-hidden">
                      <p
                        style={{ fontSize: `clamp(1.65rem, ${2.0 * fontSizeMultiplier}rem, 2.6rem)` }}
                        className="font-serif font-bold tracking-wide break-words leading-relaxed"
                      >
                        {ex.arabic}
                      </p>
                    </div>

                    {!isTeacherMode && (
                      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 space-y-1 text-xs">
                        {showTransliteration && (
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <span className="font-extrabold text-teal-600 dark:text-teal-400">{ex.translit}</span>
                            {showEnglishMeaning && <span className="text-slate-500 italic">&ldquo;{ex.meaning}&rdquo;</span>}
                          </div>
                        )}
                        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">{ex.analysis}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          STUDIO 3: INTERACTIVE 28-LETTER TAJWEED RULE SCANNER
         ===================================================================== */}
      {activeStudio === "scanner" && (
        <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
          <div
            className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xs"
            }`}
          >
            <div className="space-y-1">
              <h3 className="text-base sm:text-xl font-extrabold flex items-center gap-2">
                <Compass className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>28-Letter Tajweed Rule Detective (كَاشِفُ الأَحْكَامِ الفَوْرِي)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Tap <strong>ANY Arabic letter below</strong> to immediately see which rule applies when it comes right after Noon Sakinah (نْ) or Tanween (ـً ـٍ ـٌ)!
              </p>
            </div>

            {/* Responsive 28 Arabic Letters Grid: 7 cols on mobile, 14 on desktop */}
            <div dir="rtl" className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 sm:gap-2">
              {ALPHABET_SCANNER_DATA.map((item) => {
                const isSelected = item.letter === selectedScannerLetter;
                return (
                  <button
                    key={item.letter}
                    type="button"
                    onClick={() => setSelectedScannerLetter(item.letter)}
                    className={`h-11 sm:h-12 rounded-xl sm:rounded-2xl font-serif font-bold text-lg sm:text-xl flex items-center justify-center transition-all border ${
                      isSelected
                        ? `${item.color} scale-105 shadow-md ring-2 ring-teal-500`
                        : darkMode
                        ? "bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-700"
                        : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-teal-50"
                    }`}
                  >
                    {item.letter}
                  </button>
                );
              })}
            </div>

            {/* Instant Diagnostic Result Card */}
            <div
              className={`rounded-2xl sm:rounded-3xl border-2 p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center ${
                darkMode ? "bg-slate-950/80 border-slate-800" : "bg-slate-50/80 border-slate-200"
              }`}
            >
              <div className="lg:col-span-7 space-y-2.5 sm:space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${activeScannerObj.color}`}>
                    {activeScannerObj.ruleName}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    • {activeScannerObj.subRule}
                  </span>
                </div>

                <h4 className="text-base sm:text-2xl font-extrabold leading-snug">
                  Noon Sakinah / Tanween + Letter{" "}
                  <span dir="rtl" className="font-serif text-xl sm:text-3xl text-teal-600 dark:text-teal-400 px-1">
                    ({activeScannerObj.letter})
                  </span>
                </h4>

                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1.5 sm:gap-4 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span>🎵 Ghunnah: <strong>{activeScannerObj.ghunnah}</strong></span>
                  <span>🎯 Sound: <strong>{activeScannerObj.sampleTranslit}</strong></span>
                </div>
              </div>

              <div className="lg:col-span-5 flex items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Live Quranic Example
                  </span>
                  <p dir="rtl" className="font-serif font-bold text-2xl sm:text-3xl text-teal-700 dark:text-teal-300 truncate">
                    {activeScannerObj.sampleAr}
                  </p>
                </div>
                <AudioButton text={activeScannerObj.sampleAr} />
              </div>
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
            {/* Top Classroom Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-lg">
                    Live Classroom Drill Board (سَبُّورَةُ التَّدْرِيبِ المُبَاشِر)
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    Hide rule labels to test your student live, then reveal with one tap!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setHideAnswersInSpotlight((prev) => !prev)}
                  className={`flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 border transition ${
                    effectiveHideAnswers
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300"
                      : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {effectiveHideAnswers ? <EyeOff className="w-4 h-4 shrink-0" /> : <Eye className="w-4 h-4 shrink-0" />}
                  <span>{effectiveHideAnswers ? "Exam Mode (Hidden)" : "Answers Visible"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFullscreenCard((prev) => !prev)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 shrink-0"
                  title="Toggle Large Spotlight"
                >
                  {isFullscreenCard ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Center Spotlight Flashcard */}
            <div className="py-6 sm:py-10 text-center space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-extrabold text-slate-500">
                <span>Card {spotlightIndex + 1} / {SPOTLIGHT_DRILLS.length}</span>
                <span>•</span>
                <span>{currentSpotlightCard.type}</span>
              </div>

              <div dir="rtl" className="py-2 sm:py-4 px-2 overflow-hidden">
                <p
                  style={{
                    fontSize: isFullscreenCard
                      ? `clamp(2.2rem, ${3.5 * fontSizeMultiplier}rem, 4.2rem)`
                      : `clamp(1.9rem, ${2.8 * fontSizeMultiplier}rem, 3.3rem)`
                  }}
                  className="font-serif font-bold tracking-wide text-slate-900 dark:text-white break-words leading-relaxed select-all"
                >
                  {currentSpotlightCard.arabic}
                </p>
              </div>

              <div className="flex justify-center">
                <AudioButton text={currentSpotlightCard.arabic} />
              </div>

              {/* Answer Reveal Box */}
              {effectiveHideAnswers ? (
                <div className="max-w-md mx-auto p-4 sm:p-5 rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/5 text-center space-y-2.5">
                  <p className="text-xs font-extrabold text-amber-700 dark:text-amber-300">
                    🔒 Ask the student: Which Tajweed rule applies here & how many beats of Ghunnah?
                  </p>
                  <button
                    type="button"
                    onClick={() => setHideAnswersInSpotlight(false)}
                    className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-extrabold hover:bg-amber-700 transition"
                  >
                    Reveal Answer Now
                  </button>
                </div>
              ) : (
                <div className="max-w-xl mx-auto p-4 sm:p-5 rounded-2xl border border-teal-500/30 bg-teal-500/5 space-y-2 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${currentSpotlightCard.badgeStyle}`}>
                      {currentSpotlightCard.ruleNameAr}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      Trigger: ({currentSpotlightCard.triggerLetter})
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-extrabold text-teal-700 dark:text-teal-300">
                    {currentSpotlightCard.translit} — <span className="font-normal italic text-slate-500">&ldquo;{currentSpotlightCard.meaning}&rdquo;</span>
                  </p>
                  <p className="text-xs text-slate-500 font-semibold">{currentSpotlightCard.analysis}</p>
                </div>
              )}
            </div>

            {/* Bottom Card Switcher */}
            <div className="flex items-center justify-between gap-2 pt-5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() =>
                  setSpotlightIndex((i) => (i === 0 ? SPOTLIGHT_DRILLS.length - 1 : i - 1))
                }
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-extrabold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                ← Prev
              </button>

              <span className="text-xs font-bold text-slate-400 sm:hidden">
                {spotlightIndex + 1} / {SPOTLIGHT_DRILLS.length}
              </span>

              <div className="hidden sm:flex items-center gap-1.5 flex-wrap justify-center max-w-md">
                {SPOTLIGHT_DRILLS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSpotlightIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === spotlightIndex ? "w-6 bg-[#0D9488]" : "w-2 bg-slate-300 dark:bg-slate-700"
                    }`}
                    aria-label={`Go to drill ${i + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setSpotlightIndex((i) => (i + 1) % SPOTLIGHT_DRILLS.length)
                }
                className="px-4 py-2.5 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm transition shadow-sm"
              >
                Next →
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
            title="Tanween & Noon Sakinah Rules — Mastery Check"
            questions={QUIZ_QUESTIONS}
          />
        </div>
      )}

      {/* =====================================================================
          HIGH-CONVERTING 1-ON-1 AL-AZHAR TEACHER CTA BANNER (RESPONSIVE)
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
            <span>1-on-1 Live Tajweed Correction with Certified Al-Azhar Tutors</span>
          </div>
          <h3 className="text-base sm:text-xl font-extrabold leading-snug">
            Want a Certified Teacher to Check Your Ghunnah & Ikhfa Live?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Distinguishing between a crisp Izhar, a light/heavy Ikhfa tongue hover, and a 2-beat Iqlab requires live acoustic feedback (التَّلَقِّي وَالمُشَافَهَة). Book a free 1-on-1 evaluation session today!
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 text-xs font-bold text-slate-500">
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Free Zoom Assessment
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Kids & Adults
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Ijazah-Certified
            </span>
          </div>
        </div>

        <a
          href="/book-trial"
          className="w-full sm:w-auto justify-center shrink-0 px-6 py-3.5 rounded-2xl bg-[#0D9488] hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg transition"
        >
          <span>Book Free 1-on-1 Evaluation</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </a>
      </div>
    </div>
  );
}