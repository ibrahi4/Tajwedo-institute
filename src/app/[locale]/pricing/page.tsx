import React from 'react';
import { createMetadata } from '@/lib/metadata';
import Container from '@/components/shared/Container';
import { Check, MessageCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  return createMetadata({
    title: locale === 'ar' ? 'الأسعار والباقات | معهد تجويدو' : 'Affordable Pricing Plans | Tajwedo Institute',
    description: locale === 'ar'
      ? 'باقات شهرية مرنة وبأسعار مناسبة لتعليم القرآن والتجويد والعربية أونلاين. بدون رسوم تسجيل وبحصة تجريبية مجانية.'
      : 'Flexible and affordable monthly plans for online 1-on-1 Quran and Arabic tuition. No registration fees & free trial lesson.',
    path: '/pricing',
    locale,
  });
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  const isRTL = locale === 'ar';

  const t = (en: string, ar: string) => (isRTL ? ar : en);

  const plans = [
    {
      name: t('Basic Starter', 'الباقة الأساسية'),
      price: '$36',
      period: t('/ month', '/ شهرياً'),
      lessons: t('2 Sessions / Week (8/mo)', 'حصتان أسبوعياً (8 شهرياً)'),
      features: [
        t('30-minute 1-on-1 Zoom classes', 'دروس فردية 30 دقيقة على زووم'),
        t('Certified Al-Azhar Tutor', 'معلم أزهري معتمد'),
        t('Weekly Progress Reports', 'تقارير تقدم أسبوعية'),
        t('Flexible Rescheduling', 'إعادة جدولة مرنة'),
      ],
      popular: false,
    },
    {
      name: t('Standard Progress', 'الباقة المتقدمة'),
      price: '$54',
      period: t('/ month', '/ شهرياً'),
      lessons: t('3 Sessions / Week (12/mo)', '3 حصص أسبوعياً (12 شهرياً)'),
      features: [
        t('30-minute 1-on-1 Zoom classes', 'دروس فردية 30 دقيقة على زووم'),
        t('Certified Al-Azhar Tutor', 'معلم أزهري معتمد'),
        t('Weekly Progress Reports', 'تقارير تقدم أسبوعية'),
        t('Sibling Discount Eligible', 'خصم خاص للإخوة'),
        t('Free Study Materials', 'مواد تعليمية مجانية'),
      ],
      popular: true,
    },
    {
      name: t('Intensive Hifz', 'باقة الحفظ المكثف'),
      price: '$80',
      period: t('/ month', '/ شهرياً'),
      lessons: t('5 Sessions / Week (20/mo)', '5 حصص أسبوعياً (20 شهرياً)'),
      features: [
        t('30-minute 1-on-1 Zoom classes', 'دروس فردية 30 دقيقة على زووم'),
        t('Dedicated Hifz Scholar', 'معلم متخصص في تحفيظ القرآن'),
        t('Daily Revision Monitoring', 'متابعة وتسميع يومي'),
        t('Ijazah Preparation Path', 'مسار إعداد للإجازة المسندة'),
      ],
      popular: false,
    },
  ];

  return (
    <div className="pt-28 pb-16">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#0D4F4F]/10 text-[#0D4F4F] font-bold text-xs uppercase tracking-wider mb-4">
            {t('Transparent Investment', 'أسعار واضحة ومحددة')}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            {t('Affordable Monthly Plans for Every Family', 'باقات شهرية مناسبة لكل عائلة')}
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            {t(
              'No registration fees, no long-term contracts. Start with a 30-minute free trial before selecting a plan.',
              'بدون أي رسوم تسجيل، وبدون عقود طويلة الأمد. ابدأ بحصة تجريبية مجانية قبل اختيار الباقة.'
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl p-8 border bg-white transition-all ${
                plan.popular
                  ? 'border-[#0D4F4F] shadow-xl ring-2 ring-[#0D4F4F]/20 scale-105'
                  : 'border-stone-200 shadow-sm'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0D4F4F] text-amber-400 font-bold text-xs uppercase tracking-wider shadow-md">
                  {t('Most Popular', 'الأكثر طلباً')}
                </span>
              )}
              <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-xs text-[#0D4F4F] font-bold mb-6">{plan.lessons}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-sm text-slate-500 font-semibold">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 text-sm text-slate-600">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0D4F4F] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href="/book-trial" className="block">
                <Button
                  size="lg"
                  className={`w-full rounded-xl font-bold h-12 text-sm ${
                    plan.popular
                      ? 'bg-[#0D4F4F] text-white hover:bg-[#093D33]'
                      : 'bg-stone-100 text-slate-800 hover:bg-stone-200'
                  }`}
                >
                  {t('Book Free Trial', 'احجز التجربة المجانية')}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center flex items-center justify-center gap-3">
          <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0" />
          <p className="text-slate-800 text-sm font-semibold">
            {t('Money-back guarantee within the first week if you are not fully satisfied.', 'ضمان استرداد المبالغ خلال الأسبوع الأول في حال عدم الرضا التام.')}
          </p>
        </div>
      </Container>
    </div>
  );
}