'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { EventCard } from '../components/EventCard';
import { PageLoader, ErrorMessage } from '../components/ui';
import { useApi } from '../hooks/useApi';
import { getEvents } from '../api/events';

export default function HomePage() {
  const { data: events, loading, error } = useApi(getEvents);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm text-muted-foreground">Event management platform</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Schedule, stream, and engage.
            </h1>
            <p className="mt-4 text-base text-muted-foreground">
              EventSync powers conferences with real-time schedules, live Q&amp;A, and
              speaker management — all from one API-driven platform.
            </p>
            <div className="mt-8 flex gap-3">
              <Link
                href="/events"
                className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                Browse events
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming events</h2>
          <Link
            href="/events"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View all
          </Link>
        </div>

        <div className="mt-6">
          {loading && <PageLoader />}
          {error && <ErrorMessage message={error} />}
          {events && events.length === 0 && (
            <p className="text-sm text-muted-foreground">No events yet.</p>
          )}
          {events && events.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.slice(0, 6).map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
