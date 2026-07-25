import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

import { ComingSoon } from "@/components/common/ComingSoon";
import { SiteShell } from "@/components/layout/SiteShell";

const courseFeatures = ["STM32", "ESP32", "RTOS", "Linux", "Embedded C", "PCB Design"] as const;

export const metadata: Metadata = {
  title: "Courses Coming Soon",
  description: "Professional Embedded Engineering courses are under development.",
};

export default function CoursesPage() {
  return (
    <SiteShell>
      <ComingSoon
        title="Courses Coming Soon"
        description="Professional Embedded Engineering courses are under development."
        features={courseFeatures}
        illustration={BookOpen}
        productName="VJtronix Courses"
      />
    </SiteShell>
  );
}
