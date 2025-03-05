import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";

// Import Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OptimaliQ - AI-Powered Business Strategy",
  description: "Smarter decisions, faster growth with real-time AI insights.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased bg-gray-50 text-gray-900`}>
        <div className="min-h-screen flex flex-col">
          {/* ✅ Navbar */}
          <nav className="bg-white shadow-md fixed top-0 left-0 w-full px-6 py-4 z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <a href="/Homepage" className="text-xl font-bold text-blue-600">
                OptimaliQ
              </a>
              <div className="flex space-x-6">
                <a href="#how-it-works" className="hover:text-blue-600">
                  How It Works
                </a>
                <a href="#key-features" className="hover:text-blue-600">
                  Key Features
                </a>
                <a href="#faq" className="hover:text-blue-600">
                  FAQ
                </a>
                <a href="/pricing" className="hover:text-blue-600">
                  Pricing
                </a>
              </div>
              <a
                href="/tier2/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Sign In
              </a>
            </div>
          </nav>

          {/* ✅ Main Wrapper (Content) */}
          <main className="flex-grow pt-16">{children}</main>

          {/* ✅ Footer */}
          <footer className="bg-gray-900 text-white text-center py-6 mt-10">
            <p>© {new Date().getFullYear()} OptimaliQ.ai. All Rights Reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
