import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About OptimaliQ | AI-Powered Growth Strategy Platform",
  description: "Learn about OptimaliQ's mission to make strategic clarity accessible through AI-powered insights and data-driven growth strategies.",
  openGraph: {
    title: "About OptimaliQ",
    description: "Smarter decisions. Faster growth. Real-time insights. Learn how OptimaliQ transforms assessment data into strategic clarity.",
    url: "https://optimaliq.ai/about",
    siteName: "OptimaliQ",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 