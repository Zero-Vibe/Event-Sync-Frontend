'use client';

import { use, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, MapPin, Users } from 'lucide-react';
import { SessionCard } from '@/src/components/SessionCard';
import { LiveBadge } from '@/src/components/LiveBadge';
import { SpeakerCard } from '@/src/components/SpeakerCard';
import { PageLoader, ErrorMessage } from '@/src/components/ui';
import { useApi } from '@/src/hooks/useApi';
import { getEvent } from '@/src/api/events';
import { getSessions } from '@/src/api/sessions';
import { formatDateRange, formatDate, formatTime } from '@/src/utils/format';
import { isLive } from '@/src/types';

const tabs = ['Overview', 'Schedule', 'Speakers', 'Rooms'] as const;
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

  const allSpeakers = Array.from(
    new Map(
      (sessions ?? [])
        .flatMap((s) => s.speakers)
        .filter(Boolean)
        .map((sp) => [sp.id, sp])
    ).values()
  );

  const eventRooms = Array.from(
    new Map(
      (sessions ?? [])
        .map((s) => s.room)
        .filter(Boolean)
        .map((r) => [r.id, r])
    ).values()
  );

  const groupedByDay = useMemo(() => {
    const map = new Map<string, NonNullable<typeof sessions>>();
    for (const s of sessions ?? []) {
      const day = formatDate(s.startTime);
      if (!map.has(day)) map.set(day, []);
      const list = map.get(day);
      if (list) list.push(s);
    }
    for (const list of map.values()) list.sort((a, b) => a.startTime.localeCompare(b.startTime));
    return Array.from(map.entries());
  }, [sessions]);

  const liveSessions = (sessions ?? []).filter((s) => isLive(s.startTime, s.endTime));

  if (loadingEvent) return <PageLoader />;
  if (errorEvent)
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorMessage message={errorEvent} />
      </div>
    );
  if (!event) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative">
        <div className="relative h-[44vh] min-h-[320px] w-full overflow-hidden bg-gradient-to-br from-primary/20 via-card to-card">
          <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
          <div className="absolute inset-0 bg-radial-violet opacity-60" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto -mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All events
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {liveSessions.length > 0 && <LiveBadge label="Happening now" />}
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              {sessions?.length ?? 0} sessions
            </span>
          </div>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{event.title}</h1>
          {event.description && (
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{event.description}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" />{formatDateRange(event.startDateTime, event.endDateTime)}</span>
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{event.location}</span>
            <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" />{allSpeakers.length} speakers</span>
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-30 mt-12 border-y border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              data-active={tab === t}
              className="relative h-12 px-4 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground data-[active=true]:text-foreground"
            >
              {t}
              {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {tab === 'Overview' && (
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">About this event</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{event.description}</p>
              {liveSessions.length > 0 && (
                <div className="mt-12">
                  <div className="flex items-center gap-3">
                    <LiveBadge />
                    <h3 className="text-lg font-semibold tracking-tight">Live sessions</h3>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {liveSessions.map((s) => <SessionCard key={s.id} session={s} eventId={eventId} />)}
                  </div>
                </div>
              )}
            </div>
            <aside className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-semibold">At a glance</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Sessions</dt><dd>{sessions?.length ?? '–'}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Speakers</dt><dd>{allSpeakers.length}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Rooms</dt><dd>{eventRooms.length}</dd></div>
                </dl>
              </div>
              <button className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground shadow-lg transition hover:brightness-110">
                Get your ticket
              </button>
            </aside>
          </div>
        )}

        {tab === 'Schedule' && (
          <div>
            {loadingSessions && <PageLoader />}
            {!loadingSessions && (sessions?.length ?? 0) === 0 && (
              <p className="text-sm text-muted-foreground">No sessions scheduled.</p>
            )}
            <div className="space-y-12">
              {groupedByDay.map(([day, daySessions]) => (
                <div key={day}>
                  <div className="sticky top-28 z-20 -mx-4 mb-4 bg-background/80 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <h2 className="text-xl font-semibold tracking-tight">{day}</h2>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {daySessions.map((s) => (
                      <div key={s.id} className="flex gap-4">
                        <div className="w-16 shrink-0 pt-5 text-right text-xs font-medium text-muted-foreground">
                          {formatTime(s.startTime)}
                        </div>
                        <div className="flex-1">
                          <SessionCard session={s} eventId={eventId} compact />
                        </div>
                      </div>
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allSpeakers.map((s) => (
                <Link key={s.id} href={`/speakers/${s.id}`} className="card-hover flex items-center gap-4 rounded-xl border border-border/70 bg-card p-4">
                  {s.pictureUrl ? (
                    <img src={s.pictureUrl} alt={s.firstName ?? ''} className="h-14 w-14 rounded-full object-cover ring-2 ring-border" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-sm font-medium ring-2 ring-border">
                      {(s.firstName?.[0] ?? '') + (s.lastName?.[0] ?? '')}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-semibold tracking-tight">{[s.firstName, s.lastName].filter(Boolean).join(' ')}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {tab === 'Rooms' && (
          <div>
            {eventRooms.length === 0 && (
              <p className="text-sm text-muted-foreground">No rooms yet.</p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {eventRooms.map((r) => {
                const count = sessions?.filter((s) => s.room?.id === r.id).length ?? 0;
                return (
                  <Link key={r.id} href={`/rooms/${r.id}`} className="card-hover rounded-2xl border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold">{r.name}</h3>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{count} sessions</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
