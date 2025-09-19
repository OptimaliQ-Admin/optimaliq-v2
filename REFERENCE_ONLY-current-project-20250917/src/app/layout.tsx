import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import RootLayoutWrapper from "@/components/layout/RootLayoutWrapper";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "OptimaliQ - AI-Powered Growth Strategy Platform",
    template: "%s | OptimaliQ"
  },
  description: "Transform your business growth with AI-powered assessments, strategic insights, and data-driven recommendations. Get personalized growth strategies and competitive benchmarking.",
  keywords: [
    "business growth",
    "AI strategy",
    "growth assessment",
    "business analytics",
    "competitive benchmarking",
    "strategic planning",
    "business intelligence",
    "growth framework",
    "market insights",
    "business optimization",
    "enterprise AI",
    "RAG capabilities",
    "multi-tenant architecture"
  ],
  authors: [{ name: "OptimaliQ Team" }],
  creator: "OptimaliQ",
  publisher: "OptimaliQ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://optimaliq.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://optimaliq.ai',
    siteName: 'OptimaliQ',
    title: 'OptimaliQ - AI-Powered Growth Strategy Platform',
    description: 'Transform your business growth with AI-powered assessments, strategic insights, and data-driven recommendations.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'OptimaliQ - AI-Powered Growth Strategy Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@optimaliq',
    creator: '@optimaliq',
    title: 'OptimaliQ - AI-Powered Growth Strategy Platform',
    description: 'Transform your business growth with AI-powered assessments, strategic insights, and data-driven recommendations.',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'business',
  classification: 'business software',
  other: {
    'msapplication-TileColor': '#3b82f6',
    'theme-color': '#3b82f6',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}>
      <body className="antialiased">
        <RootLayoutWrapper>
          {children}
        </RootLayoutWrapper>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
