import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Restricted - OptimaliQ",
  description: "Due to regional data protection laws, OptimaliQ is currently unavailable in your location.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BlockedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 