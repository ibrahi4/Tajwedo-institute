export interface BlogArticle {
  slug: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  title: { en: string; ar: string };
  introduction: { en: string; ar: string };
  sections: Array<{
    heading: { en: string; ar: string };
    content: { en: string; ar: string };
  }>;
  conclusionTitle: { en: string; ar: string };
  conclusion: { en: string; ar: string };
}

export const BLOG_ARTICLES: Record<string, BlogArticle> = {
  'best-online-quran-teacher-for-kids-uk': {
    slug: 'best-online-quran-teacher-for-kids-uk',
    category: 'Quran for Kids',
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
    conclusionTitle: {
      en: 'Give Your Child the Gift of Beautiful Recitation',
      ar: 'امنح طفلك هدية التلاوة الصحيحة'
    },
    conclusion: {
      en: 'At Tajwedo Institute, we specialize in helping UK Muslim families connect their children with certified native Arab scholars. Experience the difference with a free 30-minute 1-on-1 assessment.',
      ar: 'في معهد تجويدو، نختص بتقديم تعليم قرآن عالي الجودة للعائلات المسلمة في بريطانيا عبر معلمين عرب معتمدين. اختبر الفرق بنفسك عبر حجز تقييم مجاني لمدة 30 دقيقة.'
    }
  }
};

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES[slug];
}