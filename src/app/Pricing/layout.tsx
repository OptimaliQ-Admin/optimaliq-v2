import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans",
  description: "Choose the perfect plan for your business growth. Start with a free assessment or unlock premium features with our flexible pricing plans.",
  openGraph: {
    title: "GMF Plus Pricing - Choose Your Growth Plan",
    description: "Choose the perfect plan for your business growth. Start with a free assessment or unlock premium features with our flexible pricing plans.",
    url: "https://yourdomain.com/pricing",
    siteName: "GMF Plus",
    images: [
      {
        url: "/images/pricing-og.jpg",
        width: 1200,
        height: 630,
        alt: "GMF Plus Pricing Plans",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GMF Plus Pricing - Choose Your Growth Plan",
    description: "Choose the perfect plan for your business growth. Start with a free assessment or unlock premium features with our flexible pricing plans.",
    images: ["/images/pricing-twitter.jpg"],
  },
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 