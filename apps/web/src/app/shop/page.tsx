import type { Metadata } from "next";
import { CircuitBoard } from "lucide-react";

import { ComingSoon } from "@/components/common/ComingSoon";
import { SiteShell } from "@/components/layout/SiteShell";

const shopFeatures = [
  "Embedded Projects",
  "PCB Designs",
  "Hardware Kits",
  "Premium Courses",
  "Source Code",
  "Components Store",
] as const;

export const metadata: Metadata = {
  title: "Shop Coming Soon",
  description: "MicroHelp is building India's Embedded Engineering Marketplace.",
};

export default function ShopPage() {
  return (
    <SiteShell>
      <ComingSoon
        title="Coming Soon"
        description="We are building India's first Embedded Engineering Marketplace."
        features={shopFeatures}
        illustration={CircuitBoard}
        productName="the MicroHelp Shop"
      />
    </SiteShell>
  );
}
