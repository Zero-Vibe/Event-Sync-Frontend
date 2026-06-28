'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Sparkles, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/auth.store';

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const linkClass = 'text-sm font-medium text-muted-foreground transition-colors hover:text-foreground';

  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

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
          <Link href="/events" data-active={pathname.startsWith('/events')} className={`${linkClass} data-[active=true]:text-foreground data-[active=true]:font-semibold`}>
            Events
          </Link>
          <Link href="/rooms" data-active={pathname.startsWith('/rooms')} className={`${linkClass} data-[active=true]:text-foreground data-[active=true]:font-semibold`}>
            Rooms
          </Link>
          <Link href="/agenda" data-active={pathname === '/agenda'} className={`${linkClass} data-[active=true]:text-foreground data-[active=true]:font-semibold`}>
            My agenda
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/80 bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Toggle dark mode"
            title={mounted ? (theme === 'dark' ? 'Light mode' : 'Dark mode') : 'Toggle dark mode'}
          >
            {mounted ? (theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : <div className="h-4 w-4" />}
          </button>

          {isAuthenticated ? (
            <>
              <Link
                href="/events"
                className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-[0_8px_24px_-8px_color-mix(in_oklab,var(--primary)_60%,transparent)] transition-all hover:brightness-110"
              >
                Browse events
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/80 bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-[0_8px_24px_-8px_color-mix(in_oklab,var(--primary)_60%,transparent)] transition-all hover:brightness-110"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
