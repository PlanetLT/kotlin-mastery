"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { LessonMenu } from "@/presentation/lesson-menu";
import type { MenuPart } from "@/presentation/menu";
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, cn } from "@/shared/ui";

export function SiteHeader({ parts }: { parts: readonly MenuPart[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const onSources = pathname === "/sources";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<Button variant="outline" size="sm" className="font-mono lg:hidden" />}
          >
            Path
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(100%,20rem)] overflow-y-auto bg-background">
            <SheetHeader>
              <SheetTitle className="font-mono text-xs tracking-[0.16em] uppercase">
                The path
              </SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-8">
              <LessonMenu parts={parts} onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="font-mono text-xs tracking-[0.18em] uppercase">
          Kotlin Field Guide
        </Link>
        <nav className="ml-auto flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              "rounded-md px-2.5 py-1.5 font-mono text-xs tracking-wide uppercase",
              pathname === "/" ? "bg-muted" : "hover:bg-muted",
            )}
          >
            Path
          </Link>
          <Link
            href="/sources"
            className={cn(
              "rounded-md px-2.5 py-1.5 font-mono text-xs tracking-wide uppercase",
              onSources ? "bg-muted" : "hover:bg-muted",
            )}
          >
            Sources
          </Link>
        </nav>
      </div>
    </header>
  );
}
