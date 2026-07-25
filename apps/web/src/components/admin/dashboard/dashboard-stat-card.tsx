import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

type DashboardStatCardProps = {
  description: string;
  href: string;
  icon: LucideIcon;
  label: string;
  value: number;
};

export function DashboardStatCard({ description, href, icon: Icon, label, value }: DashboardStatCardProps) {
  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <Link className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground" href={href} aria-label={`Manage ${label.toLowerCase()}`}>
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <p className="mt-5 text-3xl font-semibold tracking-tight text-foreground">{value.toLocaleString()}</p>
        <p className="mt-1 text-sm font-medium text-foreground">{label}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
