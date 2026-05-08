"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const linkClass = "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">EventSync</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/events" className={cn(linkClass, pathname === "/events" && "text-foreground font-semibold")}>
            Events
          </Link>
          <Link href="/agenda" className={cn(linkClass, pathname === "/agenda" && "text-foreground font-semibold")}>
            My agenda
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/agenda" className="hidden h-9 items-center gap-2 rounded-md border border-border/80 bg-secondary/50 px-3 text-sm font-medium text-foreground/90 transition-colors hover:bg-secondary md:inline-flex">
            <CalendarDays className="h-4 w-4" />
            Agenda
          </Link>
          <Link href="/events" className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-[0_8px_24px_-8px_color-mix(in_oklab,var(--primary)_60%,transparent)] transition-all hover:brightness-110">
            Browse events
          </Link>
        </div>
      </div>
    </header>
  );
}