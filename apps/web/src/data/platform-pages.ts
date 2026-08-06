import { SITE } from "@/constants/site";

export type PlatformPageSlug =
  | "blog"
  | "projects"
  | "courses"
  | "shop"
  | "portfolio"
  | "videos";

export interface PlatformPageAction {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface PlatformPage {
  slug: PlatformPageSlug;
  title: string;
  eyebrow: string;
  description: string;
  primaryAction: PlatformPageAction;
  secondaryAction: PlatformPageAction;
  highlights: string[];
  roadmap: string[];
}

export const PLATFORM_PAGES: Record<PlatformPageSlug, PlatformPage> = {
  blog: {
    slug: "blog",
    title: "Technical Blog",
    eyebrow: "Engineering notes",
    description:
      "Deep technical articles for embedded systems, firmware, electronics, programming, AI, robotics, and practical product engineering.",
    primaryAction: {
      label: "Browse Articles",
      href: "/blog",
    },
    secondaryAction: {
      label: "View Projects",
      href: "/projects",
    },
    highlights: [
      "Firmware and embedded systems tutorials",
      "Electronics design breakdowns",
      "Programming and architecture notes",
    ],
    roadmap: [
      "Markdown/MDX publishing pipeline",
      "Categories, tags, and author pages",
      "SEO schema and related content",
    ],
  },
  projects: {
    slug: "projects",
    title: "Project CMS",
    eyebrow: "Build library",
    description:
      "A structured collection of real engineering projects with hardware notes, firmware, schematics, code links, and build logs.",
    primaryAction: {
      label: "Explore Projects",
      href: "/projects",
    },
    secondaryAction: {
      label: "Watch Videos",
      href: "/videos",
    },
    highlights: [
      "Embedded project case studies",
      "GitHub-backed source references",
      "Bill of materials and documentation",
    ],
    roadmap: [
      "Project data model",
      "GitHub repository integration",
      "Difficulty, domain, and tool filters",
    ],
  },
  courses: {
    slug: "courses",
    title: "Courses",
    eyebrow: "Learning system",
    description:
      "A course platform for structured learning paths across embedded systems, firmware, electronics, programming, AI, and robotics.",
    primaryAction: {
      label: "Start Learning",
      href: "/courses",
    },
    secondaryAction: {
      label: "Read Blog",
      href: "/blog",
    },
    highlights: [
      "Curriculum-based learning paths",
      "Lessons, modules, and progress tracking",
      "Future quizzes, certificates, and dashboards",
    ],
    roadmap: [
      "Course and lesson schema",
      "Enrollment and progress models",
      "Auth-protected user dashboard",
    ],
  },
  shop: {
    slug: "shop",
    title: "Digital Shop",
    eyebrow: "Products",
    description:
      "A digital product storefront for templates, firmware assets, project files, guides, and learning resources.",
    primaryAction: {
      label: "View Products",
      href: "/shop",
    },
    secondaryAction: {
      label: "Explore Courses",
      href: "/courses",
    },
    highlights: [
      "Digital downloads",
      "Project assets and engineering templates",
      "Future payments and customer library",
    ],
    roadmap: [
      "Product catalog model",
      "Checkout provider decision",
      "Order and entitlement system",
    ],
  },
  portfolio: {
    slug: "portfolio",
    title: "Portfolio",
    eyebrow: "Work showcase",
    description:
      "A professional portfolio for MicroHelp work, engineering experiments, open-source contributions, and product milestones.",
    primaryAction: {
      label: "View Portfolio",
      href: "/portfolio",
    },
    secondaryAction: {
      label: "Explore Projects",
      href: "/projects",
    },
    highlights: [
      "Featured work and case studies",
      "Skills, domains, and timeline",
      "GitHub and YouTube proof points",
    ],
    roadmap: [
      "Case study templates",
      "Contribution timeline",
      "External profile integrations",
    ],
  },
  videos: {
    slug: "videos",
    title: "Videos",
    eyebrow: "YouTube hub",
    description:
      "A video library for tutorials, demos, project walkthroughs, embedded systems lessons, and product engineering content.",
    primaryAction: {
      label: "Open YouTube Channel",
      href: SITE.youtube,
      isExternal: true,
    },
    secondaryAction: {
      label: "Read Blog",
      href: "/blog",
    },
    highlights: [
      "YouTube-backed tutorials",
      "Project demo videos",
      "Course companion content",
    ],
    roadmap: [
      "YouTube channel integration",
      "Video categories and playlists",
      "Related projects and articles",
    ],
  },
};

export function getPlatformPage(slug: PlatformPageSlug) {
  return PLATFORM_PAGES[slug];
}
