import { FileImage, Image, Video } from "lucide-react";
import { notFound } from "next/navigation";

import { MediaLibraryEmptyState } from "@/components/admin/media/media-library-empty-state";

const mediaLibraries = {
  images: {
    title: "Images",
    description: "Manage image assets used across MicroHelp content and campaigns.",
    icon: Image,
  },
  videos: {
    title: "Videos",
    description: "Organize video assets for lessons, product demos, and platform updates.",
    icon: Video,
  },
  documents: {
    title: "Documents",
    description: "Maintain downloadable documentation, guides, and engineering resources.",
    icon: FileImage,
  },
} as const;

type MediaType = keyof typeof mediaLibraries;

function isMediaType(value: string): value is MediaType {
  return value in mediaLibraries;
}

export default async function MediaLibraryPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;

  if (!isMediaType(type)) {
    notFound();
  }

  return <MediaLibraryEmptyState {...mediaLibraries[type]} />;
}
