import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "@/app/globals.css";
import RootLayoutWrapper from "@/components/layout/RootLayoutWrapper";
import { Toaster } from "react-hot-toast";
import { PerformanceInitializer } from "@/components/performance/PerformanceInitializer";

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
        url: '/images/Hero_Background.jpeg',
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
    images: ['/images/Hero_Background.jpeg'],
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
  // Disable manifest in preview envs to avoid 401s
  // manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {/* Consent Mode Initialization */}
        <Script
          id="consent-mode-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}

              gtag('consent', 'default', {
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                ad_storage: 'denied',
                analytics_storage: 'denied',
                functionality_storage: 'denied',
                personalization_storage: 'denied',
                security_storage: 'granted'
              });
            `,
          }}
        />
        
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WM3SPJ45');
            `,
          }}
        />
        {/* End Google Tag Manager */}
        
        {/* Google Tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LBE01W0F0Y"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              gtag('js', new Date());
              gtag('config', 'G-LBE01W0F0Y');
            `,
          }}
        />
        
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* Disable manifest link to avoid 401 in preview environments */}
        {/* <link rel="manifest" href="/manifest.json" /> */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased bg-gray-50 text-gray-900 font-sans`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-WM3SPJ45"
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        {/* Usercentrics CMP - Must be loaded before any third-party scripts */}
        <Script
          src="https://web.cmp.usercentrics.eu/modules/autoblocker.js"
          strategy="beforeInteractive"
        />
        <Script
          id="usercentrics-cmp"
          src="https://web.cmp.usercentrics.eu/ui/loader.js"
          data-settings-id="6-e4t0p1FNb5Vx"
          strategy="beforeInteractive"
        />
        
        {/* Only wrap "normal" pages in RootLayoutWrapper. 
            /premium and /subscribe will have their own layout wrappers. */}
        <RootLayoutWrapper>
          {children}
        </RootLayoutWrapper>

        <PerformanceInitializer />

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
        
        <Analytics />
      </body>
    </html>
  );
}
