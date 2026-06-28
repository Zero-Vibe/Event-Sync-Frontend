'use client';

import { useMemo, useState } from 'react';
import { Search, MapPin, CalendarRange } from 'lucide-react';
import { EventCard } from '@/src/components/EventCard';
import { PageLoader, ErrorMessage } from '@/src/components/ui';
import { useApi } from '@/src/hooks/useApi';
import { getEvents } from '@/src/api/events';

const dateFilters = [
  { id: 'all', label: 'Any time' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
];

export default function EventsPage() {
  const { data: events, loading, error } = useApi(getEvents);
  const [q, setQ] = useState('');
  const [date, setDate] = useState('all');

  const filtered = useMemo(() => {
    if (!events) return { upcoming: [], past: [], total: 0, allCount: 0 };
    const now = new Date();
    const lq = q.trim().toLowerCase();

    const searched = lq
      ? events.filter(
          (e) =>
            e.title.toLowerCase().includes(lq) ||
            e.location.toLowerCase().includes(lq) ||
            e.description?.toLowerCase().includes(lq)
        )
      : events;

    const upcoming = searched.filter((e) => new Date(e.endDateTime) >= now);
    const past = searched.filter((e) => new Date(e.endDateTime) < now);

    let filtered = searched;
    if (date === 'upcoming') filtered = upcoming;
    if (date === 'past') filtered = past;

    return {
      upcoming,
      past,
      total: filtered.length,
      allCount: searched.length,
    };
  }, [events, q, date]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative border-b border-border/60">
        <div className="absolute inset-0 bg-radial-violet opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-primary">Browse</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">All events</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Search across events worldwide.
          </p>

          <div className="mt-10 grid gap-3 rounded-2xl border border-border/70 bg-card/70 p-3 backdrop-blur md:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search events, cities, topics…"
                className="h-11 w-full rounded-lg bg-background/60 pl-9 pr-3 text-sm outline-none ring-1 ring-border/60 transition focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-1 rounded-lg bg-background/60 p-1 ring-1 ring-border/60">
              <CalendarRange className="ml-2 h-4 w-4 text-muted-foreground" />
              {dateFilters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setDate(f.id)}
                  data-active={date === f.id}
                  className="h-9 rounded-md px-3 text-xs font-medium transition-colors text-muted-foreground hover:text-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {loading && <PageLoader />}
        {error && <ErrorMessage message={error} />}

        {events && (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              Showing <span className="text-foreground">{filtered.total}</span> of {events.length} events
            </p>

            {filtered.total === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
                <p className="text-muted-foreground">No events match your filters.</p>
              </div>
            )}

            {date !== 'past' && filtered.upcoming.length > 0 && (
              <div className={date === 'all' ? '' : ''}>
                {date === 'all' && (
                  <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Upcoming
                  </h2>
                )}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.upcoming.map((e) => (
                    <EventCard key={e.id} event={e} />
                  ))}
                </div>
              </div>
            )}

            {date !== 'upcoming' && filtered.past.length > 0 && (
              <div className={(date === 'all' && filtered.upcoming.length > 0) ? 'mt-14' : ''}>
                {date === 'all' && (
                  <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Past
                  </h2>
                )}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-60">
                  {filtered.past.map((e) => (
                    <EventCard key={e.id} event={e} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}