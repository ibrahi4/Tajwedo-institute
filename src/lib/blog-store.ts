export interface BlogArticle {
  slug: string;
  category: string;
  serviceSlug: string;
  author: string;
  date: string;
  readTime: string;
  title: { en: string; ar: string };
  introduction: { en: string; ar: string };
  sections: Array<{
    heading: { en: string; ar: string };
    content: { en: string; ar: string };
  }>;
  faqs?: Array<{
    question: { en: string; ar: string };
    answer: { en: string; ar: string };
  }>;
  conclusionTitle: { en: string; ar: string };
  conclusion: { en: string; ar: string };
}

export const BLOG_ARTICLES: Record<string, BlogArticle> = {
  'best-online-quran-teacher-for-kids-uk': {
    slug: 'best-online-quran-teacher-for-kids-uk',
    category: 'Quran for Kids',
    serviceSlug: 'kids-program',
    author: 'Tajwedo Institute',
    date: 'October 2, 2026',
    readTime: '7 min read',
    title: {
      en: 'How to Choose the Best Online Quran Teacher for Kids in the UK (2026 Guide)',
      ar: 'كيف تختار أفضل معلم قرآن أونلاين للأطفال في بريطانيا'
    },
    introduction: {
      en: 'Finding a reliable, qualified Quran tutor for your child in the UK can be challenging. Between busy school schedules and crowded weekend madrasahs, many Muslim parents in London, Birmingham, and Manchester are turning to 1-on-1 online Quran tuition.',
      ar: 'قد يكون البحث عن معلم قرآن مؤهل وموثوق لطفلك في بريطانيا أمراً صعباً. بين الجداول المدرسية المزدحمة والمدارس الأسبوعية المكتظة، يتجه العديد من أولياء الأمور المسلمين في بريطانيا إلى الدروس الفردية عبر الإنترنت.'
    },
    sections: [
      {
        heading: {
          en: '1. Look for Authentic Al-Azhar Credentials & Ijazah',
          ar: '1. التأكد من المؤهل الأزهري والإجازة المسندة'
        },
        content: {
          en: 'An authentic Ijazah ensures that the teacher has a verified chain of recitation (Sanad) traced back to the Prophet (PBUH). Certified scholars from Al-Azhar University combine deep Quranic knowledge with proper pedagogy, ensuring your child learns correct Makharij from day one.',
          ar: 'تضمن الإجازة المسندة أن المعلم يتلو بسند متصل إلى النبي ﷺ. يجمع علماء الأزهر الشريف بين الفهم العميق لقواعد التجويد والأسلوب التربوي المناسب للأطفال لضمان خروج الحروف من مخارجها الصحيحة.'
        }
      },
      {
        heading: {
          en: '2. Prioritize 1-on-1 Attention Over Group Madrasahs',
          ar: '2. أولوية الاهتمام الفردي (1-إلى-1) على الفصول الجماعية'
        },
        content: {
          en: 'In traditional weekend classes across the UK, a teacher may manage 15-20 students at once, giving your child only 2-3 minutes of direct recitation time. Dedicated 1-on-1 online sessions ensure 100% focused attention, accelerating your child\'s progress by up to 4x.',
          ar: 'في المدارس الأسبوعية التقليدية في بريطانيا، قد يشرف المعلم على 15-20 طفلاً، مما يمنح طفلك دقيقتين فقط من التلاوة المباشرة. تضمن الجلسات الفردية عبر الإنترنت تركيزاً بنسبة 100% وتسريع تقدم الطفل.'
        }
      }
    ],
    faqs: [
      {
        question: {
          en: 'How many times a week should a child take online Quran classes?',
          ar: 'كم مرة في الأسبوع يجب أن يأخذ الطفل حصص القرآن أونلاين؟'
        },
        answer: {
          en: '2 to 3 sessions per week (30 minutes each) is the optimal frequency for steady memorization and retention without causing fatigue.',
          ar: 'من حصتين إلى 3 حصص أسبوعياً (30 دقيقة للحصة) هو المعدل المثالي للحفظ الثابت دون التسبب في إرهاق الطفل.'
        }
      }
    ],
    conclusionTitle: {
      en: 'Give Your Child the Gift of Beautiful Recitation',
      ar: 'امنح طفلك هدية التلاوة الصحيحة'
    },
    conclusion: {
      en: 'At Tajwedo Institute, we specialize in helping UK Muslim families connect their children with certified native Arab scholars. Experience the difference with a free 30-minute 1-on-1 assessment.',
      ar: 'في معهد تجويدو، نختص بتقديم تعليم قرآن عالي الجودة للعائلات المسلمة في بريطانيا عبر معلمين عرب معتمدين. اختبر الفرق بنفسك عبر حجز تقييم مجاني لمدة 30 دقيقة.'
    }
  },

  'how-to-learn-quran-for-converts-non-arabic-speakers': {
    slug: 'how-to-learn-quran-for-converts-non-arabic-speakers',
    category: 'New Muslims',
    serviceSlug: 'new-muslims',
    author: 'Tajwedo Institute',
    date: 'October 2, 2026',
    readTime: '8 min read',
    title: {
      en: 'How to Learn Quran as a Convert & Non-Arabic Speaker (Step-by-Step Guide)',
      ar: 'كيف تتعلم القرآن بعد اعتناق الإسلام لغير الناطقين بالعربية'
    },
    introduction: {
      en: 'Accepting Islam is a beautiful milestone, but looking at the Arabic script for the first time can feel intimidating. As a new Muslim or revert, learning to recite the Holy Quran and master daily prayers (Salah) is completely achievable with patient guidance.',
      ar: 'اعتناق الإسلام خطوة مباركة، ولكن النظر إلى الحروف العربية لأول مرة قد يبدو مهيباً. كمسلم جديد، فإن تعلم تلاوة القرآن وإتقان الصلوات الخمس أمر ممكن جداً وطبيعي مع التوجيه الصبور.'
    },
    sections: [
      {
        heading: {
          en: '1. Start with Audio & Transliteration for Prayer (Salah)',
          ar: '1. البداية بالاستماع والكتابة اللاتينية للصلاة'
        },
        content: {
          en: 'Do not pressure yourself to read Arabic script on day one. Focus on memorizing Surah Al-Fatiha and short surahs using clear audio recordings and English transliteration so you can perform your five daily prayers with confidence immediately.',
          ar: 'لا تضغط على نفسك لقراءة الرسم العثماني من اليوم الأول. ركز على حفظ سورة الفاتحة والسور القصيرة باستخدام التسجيلات الصوتية والكتابة باللغة الإنجليزية لتتمكن من أداء صلواتك الخمس بثقة فوراً.'
        }
      }
    ],
    faqs: [
      {
        question: {
          en: 'Can I pray in English while learning Arabic?',
          ar: 'هل يمكنني الصلاة بالإنجليزية أثناء تعلم العربية؟'
        },
        answer: {
          en: 'Scholars agree that new Muslims can use transliteration and basic English meanings for prayer while actively learning Surah Al-Fatiha in Arabic.',
          ar: 'يتفق العلماء على أنه يمكن للمسلم الجديد استخدام الترجمة اللاتينية والأساسيات أثناء تعلم سورة الفاتحة بالعربية.'
        }
      }
    ],
    conclusionTitle: {
      en: 'Begin Your Quranic Journey Today',
      ar: 'ابدأ رحلتك القرآنية اليوم'
    },
    conclusion: {
      en: 'At Tajwedo Institute, we offer specialized 1-on-1 programs for new Muslims and non-Arabic speakers. Book your free 30-minute introductory session to meet your patient teacher.',
      ar: 'يقدم معهد تجويدو دورات فردية مخصصة للمسلمين الجدد وغير الناطقين بالعربية. احجز درساً تجريبياً مجانياً لمدة 30 دقيقة للتعرف على معلمك.'
    }
  },

  'online-tajweed-classes-for-adults-usa': {
    slug: 'online-tajweed-classes-for-adults-usa',
    category: 'Tajweed for Adults',
    serviceSlug: 'tajweed',
    author: 'Tajwedo Institute',
    date: 'October 2, 2026',
    readTime: '7 min read',
    title: {
      en: '1-on-1 Online Tajweed Classes for Adults in the USA & Canada (2026 Guide)',
      ar: 'دروس التجويد الفردية أونلاين للكبار في أمريكا وكندا'
    },
    introduction: {
      en: 'Reciting the Holy Quran with proper Tajweed is a spiritual desire for every Muslim. However, many working professionals and adults in the USA and Canada feel hesitant to correct their recitation in public mosque halaqahs.',
      ar: 'تلاوة القرآن الكريم بالتجويد الصحيح أمنية روحية لكل مسلم. ومع ذلك، يشعر العديد من الكبار والمحترفين في الولايات المتحدة وكندا بالحرج من تصحيح تلاوتهم في الحلقات العامة.'
    },
    sections: [
      {
        heading: {
          en: '1. Overcome Public Hesitation with Private 1-on-1 Instruction',
          ar: '1. التغلب على الحرج الاجتماعي عبر الجلسات الفردية'
        },
        content: {
          en: 'Learning as an adult comes with unique psychological hesitation. Private 1-on-1 live Zoom sessions provide a comfortable, non-judgmental atmosphere where you can ask questions freely and repeat verses without feeling rushed.',
          ar: 'التعلم في مرحلة البلوغ يتطلب مراعاة خاصة. توفر الجلسات المباشرة الفردية عبر زووم بيئة مريحة وخالية من الحرج، حيث يمكنك طرح الأسئلة بحرية وإعادة الآيات دون استعجال.'
        }
      }
    ],
    conclusionTitle: {
      en: 'Elevate Your Recitation Today',
      ar: 'ارتقِ بتلاوتك اليوم'
    },
    conclusion: {
      en: 'At Tajwedo Institute, we respect your busy schedule and provide dignified, personalized Tajweed instruction for adults across North America. Schedule your free 30-minute assessment session today.',
      ar: 'في معهد تجويدو، نحترم وقتك ونوفر تعليماً راقياً ومخصصاً للتجويد للكبار في أمريكا الشمالية. احجز جلستك التقييمية المجانية لمدة 30 دقيقة اليوم.'
    }
  },

  'how-long-does-it-take-to-learn-tajweed': {
    slug: 'how-long-does-it-take-to-learn-tajweed',
    category: 'Tajweed Guide',
    serviceSlug: 'tajweed',
    author: 'Tajwedo Institute',
    date: 'October 3, 2026',
    readTime: '6 min read',
    title: {
      en: 'How Long Does It Take to Learn Tajweed Rules Online?',
      ar: 'كم يستغرق تعلم أحكام التجويد أونلاين؟ (الخطة الزمنية)'
    },
    introduction: {
      en: 'On average, it takes 3 to 6 months of consistent 1-on-1 online classes to learn and apply foundational Tajweed rules. Achieving complete mastery and earning an Ijazah can take 1 to 2 years depending on daily practice.',
      ar: 'في المتوسط، يستغرق تعلم وتطبيق أحكام التجويد الأساسية من 3 إلى 6 أشهر من الحصص الفردية المستمرة. أما الوصول إلى الإتقان التام والحصول على الإجازة فقد يستغرق من سنة إلى سنتين.'
    },
    sections: [
      {
        heading: {
          en: '1. The 3-Month Milestone (Foundations)',
          ar: '1. إنجاز الـ 3 أشهر (مرحلة التأسيس)'
        },
        content: {
          en: 'In the first 3 months with 2-3 sessions per week, you will master the Arabic alphabet articulation points (Makharij) and core rules like Noon Sakinah and Meem Sakinah. You will read short surahs smoothly.',
          ar: 'في أول 3 أشهر مع 2-3 حصص أسبوعياً، ستتمكن من إتقان مخارج الحروف وأحكام النون والميم الساكنتين، وستصبح قادراً على قراءة السور القصيرة بطلاقة.'
        }
      }
    ],
    faqs: [
      {
        question: {
          en: 'How long does it take to learn Tajweed for a non-Arabic speaker?',
          ar: 'كم من الوقت يحتاج غير الناطق بالعربية لتعلم التجويد؟'
        },
        answer: {
          en: 'With a dedicated 1-on-1 native Arab tutor, a non-Arabic speaker usually reaches fluency in basic Tajweed rules within 4 to 6 months.',
          ar: 'مع معلم عرب متخصص في الحصص الفردية، يصل غير الناطق بالعربية للطلاقة في الأحكام الأساسية خلال 4 إلى 6 أشهر.'
        }
      }
    ],
    conclusionTitle: {
      en: 'Start Your Tajweed Journey Today',
      ar: 'ابدأ رحلتك مع التجويد اليوم'
    },
    conclusion: {
      en: 'Do not rush the journey of perfecting the Quran. Book a free 30-minute assessment with our certified tutors to get a customized timeline based on your current reading level.',
      ar: 'لا تستعجل ثمار إتقان القرآن. احجز تقييماً مجانياً لمدة 30 دقيقة مع معلمينا المعتمدين للحصول على خطة زمنية تناسب مستواك الحالي.'
    }
  }
};

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES[slug];
}

export function getAllArticles(): BlogArticle[] {
  return Object.values(BLOG_ARTICLES);
}