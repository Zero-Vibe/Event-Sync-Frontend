'use client';

import { useEffect, useState } from 'react';
import { useToastStore } from '@/src/stores/toast.store';
import Link from 'next/link';
import { CalendarHeart, Trash2 } from 'lucide-react';
import { SessionCard } from '@/src/components/SessionCard';
import { formatDate } from '@/src/utils/format';
import { useFavoritesStore } from '@/src/stores/favorite.store';
import { getEvents } from '@/src/api/events';
import { getSessions } from '@/src/api/sessions';
import { PageLoader } from '@/src/components/ui';
import type { Session } from '@/src/types';

/**
 * Agenda page — shows all sessions the user has bookmarked, grouped by day.
 *
 * Strategy: fetch all events, then all sessions for each event in parallel,
 * then filter to those whose IDs are in the favorites store.
 * This avoids needing a dedicated "get session by id" endpoint for each favorite.
 */
export default function AgendaPage() {
  const { sessionIds, toggle } = useFavoritesStore();
  const addToast = useToastStore((s) => s.addToast);

  const [sessions, setSessions] = useState<(Session & { eventId: string })[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const events = await getEvents();

        // Fetch sessions for all events in parallel
        const chunks = await Promise.allSettled(
          events.map((ev) =>
            getSessions(ev.id).then((ss) =>
              ss.map((s) => ({ ...s, eventId: ev.id }))
            )
          )
        );

        const all: (Session & { eventId: string })[] = [];
        for (const chunk of chunks) {
          if (chunk.status === 'fulfilled') all.push(...chunk.value);
        }

        if (!cancelled) setSessions(all);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to load sessions.';
        if (!cancelled) {
          setError(msg);
          addToast(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const saved = sessions
    .filter((s) => sessionIds.includes(s.id))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const byDay = new Map<string, typeof saved>();
  for (const s of saved) {
    const k = formatDate(s.startTime);
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k)!.push(s);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-muted-foreground">Personal</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            My agenda
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground text-sm">
            Your saved sessions, sorted by start time.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {loading && <PageLoader />}

        {!loading && !error && sessionIds.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
            <CalendarHeart className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold">No sessions saved yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse events and tap the bookmark on any session to add it here.
            </p>
            <Link
              href="/events"
              className="mt-6 inline-flex h-10 items-center rounded-md bg-foreground px-5 text-sm font-semibold text-background hover:opacity-80"
            >
              Browse events
            </Link>
          </div>
        )}

        {/* Favorites exist but sessions haven't loaded yet (e.g. data still fetching) */}
        {!loading && !error && sessionIds.length > 0 && saved.length === 0 && (
          <p className="text-sm text-muted-foreground">
            None of your saved sessions could be found.
          </p>
        )}

        {!loading && !error && saved.length > 0 && (
          <div className="space-y-12">
            {Array.from(byDay.entries()).map(([day, list]) => (
              <div key={day}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {day}
                </h2>
                <div className="mt-4 space-y-3">
                  {list.map((s) => (
                    <div key={s.id} className="flex items-start gap-3">
                      <div className="flex-1">
                        <SessionCard session={s} eventId={s.eventId} />
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
