'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react';
import { SessionCard } from '@/src/components/SessionCard';
import { LiveBadge } from '@/src/components/LiveBadge';
import { PageLoader, ErrorMessage } from '@/src/components/ui';
import { useApi } from '@/src/hooks/useApi';
import { getEvent } from '@/src/api/events';
import { getSessions } from '@/src/api/sessions';
import { formatDateRange, formatDate } from '@/src/utils/format';
import { isLive } from '@/src/types';

const tabs = ['Overview', 'Schedule', 'Speakers'] as const;
type Tab = (typeof tabs)[number];

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);

  const { data: event, loading: loadingEvent, error: errorEvent } = useApi(
    () => getEvent(eventId),
    [eventId]
  );
  const { data: sessions, loading: loadingSessions } = useApi(
    () => getSessions(eventId),
    [eventId]
  );
  const [tab, setTab] = useState<Tab>('Overview');

  if (loadingEvent) return <PageLoader />;
  if (errorEvent)
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorMessage message={errorEvent} />
      </div>
    );
  if (!event) return null;

  const allSpeakers = Array.from(
    new Map(
      (sessions ?? [])
        .flatMap((s) => s.speakers)
        .filter(Boolean)
        .map((sp) => [sp.id, sp])
    ).values()
  );

  const groupedByDay = new Map<string, typeof sessions>();
  for (const s of sessions ?? []) {
    const day = formatDate(s.startTime);
    if (!groupedByDay.has(day)) groupedByDay.set(day, []);
    groupedByDay.get(day)!.push(s);
  }

  const liveSessions = (sessions ?? []).filter((s) => isLive(s.startTime, s.endTime));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All events
          </Link>

          <div className="mt-6 flex flex-wrap items-start gap-3">
            {liveSessions.length > 0 && <LiveBadge label="Happening now" />}
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {event.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {formatDateRange(event.startDateTime, event.endDateTime)}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {event.location}
            </span>
          </div>
        </div>
      </section>

      {/* Tab bar */}
      <div className="sticky top-14 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl gap-0 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              data-active={tab === t}
              className="relative h-11 px-4 text-sm transition-colors text-muted-foreground hover:text-foreground data-[active=true]:text-foreground"
            >
              {t}
              {tab === t && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-foreground" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {tab === 'Overview' && (
          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            <div>
              {event.description && (
                <>
                  <h2 className="text-lg font-semibold">About</h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {event.description}
                  </p>
                </>
              )}
              {liveSessions.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center gap-2">
                    <LiveBadge />
                    <h3 className="font-semibold">Live sessions</h3>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {liveSessions.map((s) => (
                      <SessionCard key={s.id} session={s} eventId={eventId} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside>
              <div className="rounded-xl border border-border/70 bg-card p-5">
                <h3 className="font-medium">At a glance</h3>
                <dl className="mt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Sessions</dt>
                    <dd>{sessions?.length ?? '–'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Speakers</dt>
                    <dd>{allSpeakers.length}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Live now</dt>
                    <dd>{liveSessions.length}</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        )}

        {tab === 'Schedule' && (
          <div>
            {loadingSessions && <PageLoader />}
            {!loadingSessions && (sessions?.length ?? 0) === 0 && (
              <p className="text-sm text-muted-foreground">No sessions scheduled.</p>
            )}
            <div className="space-y-10">
              {Array.from(groupedByDay.entries()).map(([day, daySessions]) => (
                <div key={day}>
                  <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {day}
                  </h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {daySessions!.map((s) => (
                      <SessionCard key={s.id} session={s} eventId={eventId} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'Speakers' && (
          <div>
            {allSpeakers.length === 0 && (
              <p className="text-sm text-muted-foreground">No speakers yet.</p>
            )}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {allSpeakers.map((s) => (
                <Link
                  key={s.id}
                  href={`/speakers/${s.id}`}
                  className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4 transition-colors hover:bg-accent/40"
                >
                  {s.pictureUrl ? (
                    <img
                      src={s.pictureUrl}
                      alt={s.firstName ?? ''}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {(s.firstName?.[0] ?? '') + (s.lastName?.[0] ?? '')}
                    </div>
                  )}
                  <p className="text-sm font-medium">
                    {[s.firstName, s.lastName].filter(Boolean).join(' ')}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
