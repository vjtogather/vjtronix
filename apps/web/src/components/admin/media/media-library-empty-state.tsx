import type { LucideIcon } from "lucide-react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type MediaLibraryEmptyStateProps = {
  description: string;
  icon: LucideIcon;
  title: string;
};

export function MediaLibraryEmptyState({ description, icon: Icon, title }: MediaLibraryEmptyStateProps) {
  return (
    <div className="space-y-6 p-5 sm:p-8 lg:p-10">
      <div>
        <p className="text-sm font-semibold tracking-[0.16em] text-sky-600 uppercase dark:text-sky-300">Media</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{title} library</CardTitle>
          <CardDescription>Your uploaded files will be available here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid min-h-72 place-items-center rounded-xl border border-dashed p-8 text-center">
            <div className="max-w-sm">
              <span className="mx-auto grid size-12 place-items-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-semibold text-foreground">No {title.toLowerCase()} yet</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Upload and organize brand assets from one central MicroHelp media library.</p>
              <Button className="mt-5" type="button" disabled>
                <Upload className="size-4" aria-hidden="true" />
                Upload {title.slice(0, -1)}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
