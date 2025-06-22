import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "@/app/globals.css";
import RootLayoutWrapper from "@/components/layout/RootLayoutWrapper";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "GMF Plus - AI-Powered Growth Management Framework",
    template: "%s | GMF Plus"
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
    "business optimization"
  ],
  authors: [{ name: "GMF Plus Team" }],
  creator: "GMF Plus",
  publisher: "GMF Plus",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yourdomain.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    siteName: 'GMF Plus',
    title: 'GMF Plus - AI-Powered Growth Management Framework',
    description: 'Transform your business growth with AI-powered assessments, strategic insights, and data-driven recommendations.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GMF Plus - AI-Powered Growth Management Framework',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@gmfplus',
    creator: '@gmfplus',
    title: 'GMF Plus - AI-Powered Growth Management Framework',
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
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Usercentrics CMP - Consent Management Platform */}
        <script src="https://web.cmp.usercentrics.eu/modules/autoblocker.js" async></script>
        <script 
          id="usercentrics-cmp" 
          src="https://web.cmp.usercentrics.eu/ui/loader.js" 
          data-settings-id="6-e4t0p1FNb5Vx" 
          async
        ></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased bg-gray-50 text-gray-900 font-sans`}>
        {/* Only wrap "normal" pages in RootLayoutWrapper. 
            /premium and /subscribe will have their own layout wrappers. */}
        <RootLayoutWrapper>
          {children}
        </RootLayoutWrapper>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff",
              color: "#1f2937",
              border: "1px solid #e2e8f0",
              padding: "12px 20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              fontFamily: "var(--font-inter)",
              fontSize: "16px",
            },
            success: {
              iconTheme: {
                primary: "#2563eb",
                secondary: "#f0f4f8",
              },
            },
            error: {
              iconTheme: {
                primary: "#dc2626",
                secondary: "#fde8e8",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
