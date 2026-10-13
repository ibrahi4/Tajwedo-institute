"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "@/hooks/useLocale";
import { ChevronRight, ChevronLeft, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const { isRTL, locale } = useLocale();
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  const fullItems = [
    { label: isRTL ? "الرئيسية" : "Home", href: "/" },
    ...items,
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `https://tajwedo.com/${locale}${item.href === "/" ? "" : item.href}` : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="flex items-center flex-wrap gap-2 text-xs font-semibold text-slate-500 mb-6 select-none"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {fullItems.map((item, index) => {
          const isLast = index === fullItems.length - 1;

          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              {isLast || !item.href ? (
                <span className="text-[#0D4F4F] font-bold" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#0D4F4F] transition-colors inline-flex items-center gap-1"
                >
                  {index === 0 && <Home className="w-3.5 h-3.5 me-0.5 text-[#0D4F4F]" />}
                  <span>{item.label}</span>
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
}