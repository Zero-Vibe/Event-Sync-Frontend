'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { EventCard } from '@/src/components/EventCard';
import { PageLoader, ErrorMessage } from '@/src/components/ui';
import { useApi } from '@/src/hooks/useApi';
import { getEvents } from '@/src/api/events';

export default function EventsPage() {
  const { data: events, loading, error } = useApi(getEvents);
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    if (!events) return [];
    if (!q.trim()) return events;
    const lq = q.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(lq) ||
        e.location.toLowerCase().includes(lq) ||
        e.description?.toLowerCase().includes(lq)
    );
  }, [events, q]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">Browse</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">All events</h1>

          <div className="relative mt-6 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search events..."
              className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {loading && <PageLoader />}
        {error && <ErrorMessage message={error} />}
        {events && (
          <>
            <p className="mb-6 text-xs text-muted-foreground">
              {filtered.length} of {events.length} events
            </p>
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events match your search.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
