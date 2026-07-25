"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const labels: Record<string, string> = {
  admin: "Dashboard",
  ai: "AI assistant",
  "audit-logs": "Analytics",
  blog: "Blogs",
  categories: "Categories",
  courses: "Courses",
  documents: "Documents",
  images: "Images",
  media: "Media",
  permissions: "Settings",
  products: "Products",
  projects: "Portfolio",
  roles: "Roles",
  subcategories: "Sub Categories",
  users: "Users",
  videos: "Videos",
};

function getLabel(segment: string) {
  return labels[segment] ?? segment.replaceAll("-", " ");
}

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1 text-sm text-muted-foreground md:flex">
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isCurrent = index === segments.length - 1;

        return (
          <div className="flex min-w-0 items-center gap-1" key={href}>
            {index > 0 ? <ChevronRight className="size-4 shrink-0" aria-hidden="true" /> : null}
            {isCurrent ? (
              <span aria-current="page" className="truncate font-medium text-foreground">
                {getLabel(segment)}
              </span>
            ) : (
              <Link className="truncate transition hover:text-foreground" href={href}>
                {getLabel(segment)}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
