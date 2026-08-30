import React from "react";
import type { Metadata } from "next";
import ContactPageContent from "@/components/contact/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact Tajwedo Institute",
  description: "Get in touch with Tajwedo Institute for Quran, Arabic, and Islamic Studies lessons.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}