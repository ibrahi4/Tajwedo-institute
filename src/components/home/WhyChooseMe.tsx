import React from "react";
import {
  GraduationCap,
  MessageCircle,
  Clock,
  Heart,
  Shield,
  Users,
  Globe,
  Target,
} from "lucide-react";
import Container from "@/components/shared/Container";
import SectionHeader from "@/components/shared/SectionHeader";
import { useTranslations } from "next-intl";

const reasonIcons = [GraduationCap, MessageCircle, Target, Heart, Clock, Users, Globe, Shield];

export default function WhyChooseMe() {
  const t = useTranslations("whyChooseMe");

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-[#FAFAF7] to-[#F5F0EB]">
      <Container className="relative z-10">
        <SectionHeader
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {reasonIcons.map((Icon, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 border border-stone-200/80 hover:border-[#0D4F4F]/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0D4F4F]/10 group-hover:bg-[#0D4F4F]/15 flex items-center justify-center mb-4 transition-colors">
                <Icon className="w-5 h-5 text-[#0D4F4F]" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#0D4F4F] transition-colors">
                {t(`reasons.${index}.title`)}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {t(`reasons.${index}.description`)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}