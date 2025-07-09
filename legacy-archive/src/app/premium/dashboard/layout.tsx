import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your AI-powered business dashboard with real-time insights, growth analytics, and strategic recommendations.",
  openGraph: {
    title: "GMF Plus Dashboard - AI-Powered Business Insights",
    description: "Your AI-powered business dashboard with real-time insights, growth analytics, and strategic recommendations.",
    url: "https://yourdomain.com/premium/dashboard",
    siteName: "GMF Plus",
    images: [
      {
        url: "/images/dashboard-og.jpg",
        width: 1200,
        height: 630,
        alt: "GMF Plus Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GMF Plus Dashboard - AI-Powered Business Insights",
    description: "Your AI-powered business dashboard with real-time insights, growth analytics, and strategic recommendations.",
    images: ["/images/dashboard-twitter.jpg"],
  },
  alternates: {
    canonical: "/premium/dashboard",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 