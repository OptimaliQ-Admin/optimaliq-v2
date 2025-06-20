import { PremiumUserProvider } from "@/context/PremiumUserContext";
import Navbar from "@/components/layout/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join GMF Plus and start your growth journey. Create your account to access AI-powered business insights and strategic recommendations.",
  openGraph: {
    title: "Join GMF Plus - Create Your Account",
    description: "Join GMF Plus and start your growth journey. Create your account to access AI-powered business insights and strategic recommendations.",
    url: "https://yourdomain.com/subscribe",
    siteName: "GMF Plus",
    images: [
      {
        url: "/images/subscribe-og.jpg",
        width: 1200,
        height: 630,
        alt: "Join GMF Plus",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join GMF Plus - Create Your Account",
    description: "Join GMF Plus and start your growth journey. Create your account to access AI-powered business insights and strategic recommendations.",
    images: ["/images/subscribe-twitter.jpg"],
  },
  alternates: {
    canonical: "/subscribe",
  },
};

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  return (
    <PremiumUserProvider>
      <Navbar />
      {children}
    </PremiumUserProvider>
  );
}
