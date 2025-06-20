import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Growth Assessment",
  description: "Take our comprehensive AI-powered growth assessment to identify opportunities, benchmark against competitors, and get personalized recommendations.",
  openGraph: {
    title: "GMF Plus Growth Assessment - AI-Powered Business Analysis",
    description: "Take our comprehensive AI-powered growth assessment to identify opportunities, benchmark against competitors, and get personalized recommendations.",
    url: "https://yourdomain.com/growth-assessment",
    siteName: "GMF Plus",
    images: [
      {
        url: "/images/assessment-og.jpg",
        width: 1200,
        height: 630,
        alt: "GMF Plus Growth Assessment",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GMF Plus Growth Assessment - AI-Powered Business Analysis",
    description: "Take our comprehensive AI-powered growth assessment to identify opportunities, benchmark against competitors, and get personalized recommendations.",
    images: ["/images/assessment-twitter.jpg"],
  },
  alternates: {
    canonical: "/growth-assessment",
  },
};

export default function GrowthAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 