import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import RootLayoutWrapper from "@/components/layout/RootLayoutWrapper";
import { Toaster } from "react-hot-toast"; // ✅ Add this import

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "OptimaliQ - AI-Powered Business Strategy",
  description: "Smarter decisions, faster growth with real-time AI insights.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased bg-gray-50 text-gray-900 font-sans`}
      >
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
      fontFamily: "var(--font-inter)", // or Geist Sans if you prefer
      fontSize: "16px",
    },
    success: {
      iconTheme: {
        primary: "#2563eb",  // OptimaliQ blue
        secondary: "#f0f4f8", // soft background behind the icon
      },
    },
    error: {
      iconTheme: {
        primary: "#dc2626",  // Red for error
        secondary: "#fde8e8", // light red background
      },
    },
  }}
/>
      </body>
    </html>
  );
}
