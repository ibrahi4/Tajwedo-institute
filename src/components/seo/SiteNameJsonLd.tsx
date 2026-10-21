import React from "react";

export default function SiteNameJsonLd() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://tajwedo.com/#website",
      "name": "Tajwedo Institute",
      "alternateName": ["Tajwedo", "معهد تجويدو", "Tajwedo Academy"],
      "url": "https://tajwedo.com/"
    },
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "@id": "https://tajwedo.com/#organization",
      "name": "Tajwedo Institute",
      "alternateName": ["Tajwedo", "معهد تجويدو"],
      "url": "https://tajwedo.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://tajwedo.com/Tajwedo-Public-Assets/logo.webp"
      }
    }
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}