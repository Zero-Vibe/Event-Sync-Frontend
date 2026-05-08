"use client";

import Link from "next/link";
import { CalendarHeart, Trash2 } from "lucide-react";
import { SessionCard } from "@/components/SessionCard";
import { sessions, formatDate } from "@/lib/mock-data";
import { useFavorites } from "@/lib/use-favorites";

export default function AgendaPage() {
  const { favorites, toggle } = useFavorites();
  const saved = sessions
    .filter((s) => favorites.includes(s.id))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const byDay = new Map<string, typeof saved>();
  for (const s of saved) {
    const k = formatDate(s.startTime);
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k)!.push(s);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative border-b border-border/60">
        <div className="absolute inset-0 bg-radial-violet opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-primary">Personal</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">My agenda</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">Your saved sessions, sorted by start time.</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {saved.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
            <CalendarHeart className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold">No sessions saved yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Browse events and save sessions you want to attend.</p>
            <Link href="/events" className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:brightness-110">
              Browse events
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {Array.from(byDay.entries()).map(([day, list]) => (
              <div key={day}>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{day}</h2>
                <div className="mt-4 space-y-3">
                  {list.map((s) => (
                    <div key={s.id} className="flex items-start gap-3">
                      <div className="flex-1">
                        <SessionCard session={s} />
                      </div>
                      <button
                        onClick={() => toggle(s.id)}
                        className="mt-2 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                        aria-label="Remove from agenda"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}