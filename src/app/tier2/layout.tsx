import type { Metadata } from "next";
import Tier2ClientLayout from "./layout-client";

export const metadata: Metadata = {
  title: "OptimaliQ | Tier 2",
  description: "Tier 2 Dashboard & Assessment for OptimaliQ",
};

export default function Tier2Layout({ children }: { children: React.ReactNode }) {
  return <Tier2ClientLayout>{children}</Tier2ClientLayout>;
}
