'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SiteHeader() {
  const pathname = usePathname();

  const navItem = (href: string, label: string) => {
    const active = pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={`text-sm transition-colors ${
          active
            ? 'font-medium text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          EventSync
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItem('/events', 'Events')}
          {navItem('/rooms', 'Rooms')}
        </nav>

        <Link
          href="/events"
          className="inline-flex h-8 items-center rounded-md bg-foreground px-3 text-xs font-medium text-background transition-opacity hover:opacity-80"
        >
          Browse events
        </Link>
      </div>
    </header>
  );
}
