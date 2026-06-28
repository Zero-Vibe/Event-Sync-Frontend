'use client';

import { useMemo, useState } from 'react';
import { Search, MapPin, CalendarRange } from 'lucide-react';
import { EventCard } from '@/src/components/EventCard';
import { PageLoader, ErrorMessage } from '@/src/components/ui';
import { useApi } from '@/src/hooks/useApi';
import { getEvents } from '@/src/api/events';
import { isLive as checkLive } from '@/src/types';

const locations = ['All locations'];

const dateFilters = [
  { id: 'all', label: 'Any time' },
  { id: 'live', label: 'Live now' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
];

export default function EventsPage() {
  const { data: events, loading, error } = useApi(getEvents);
  const [q, setQ] = useState('');
  const [location, setLocation] = useState('All locations');
  const [date, setDate] = useState('all');

  const filtered = useMemo(() => {
    if (!events) return [];
    const now = Date.now();
    const lq = q.trim().toLowerCase();

    return events.filter((e) => {
      if (lq && !`${e.title} ${e.description ?? ''} ${e.location}`.toLowerCase().includes(lq)) return false;
      if (location !== 'All locations' && e.location !== location) return false;
      if (date === 'live') {
        const hasLive = e.sessions?.some((s) => checkLive(s.startTime, s.endTime));
        if (!hasLive) return false;
      }
      if (date === 'upcoming' && new Date(e.endDateTime).getTime() < now) return false;
      if (date === 'past' && new Date(e.endDateTime).getTime() >= now) return false;
      return true;
    });
  }, [events, q, location, date]);

  const uniqueLocations = useMemo(() => {
    if (!events) return locations;
    return ['All locations', ...Array.from(new Set(events.map((e) => e.location)))];
  }, [events]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative border-b border-border/60">
        <div className="absolute inset-0 bg-radial-violet opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-primary">Browse</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">All events</h1>
          {events && (
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Search across {events.length} curated events worldwide.
            </p>
          )}

          <div className="mt-10 grid gap-3 rounded-2xl border border-border/70 bg-card/70 p-3 backdrop-blur md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search events, locations, topics…"
                className="h-11 w-full rounded-lg bg-background/60 pl-9 pr-3 text-sm outline-none ring-1 ring-border/60 transition focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg bg-background/60 pl-9 pr-8 text-sm outline-none ring-1 ring-border/60 focus:ring-2 focus:ring-primary md:w-56"
              >
                {uniqueLocations.map((l) => <option key={l}>{l}</option>)}
              </select>
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
              Showing <span className="text-foreground">{filtered.length}</span> of {events.length} events
            </p>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
                <p className="text-muted-foreground">No events match your filters.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((e) => <EventCard key={e.id} event={e} />)}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
