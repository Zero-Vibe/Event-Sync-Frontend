'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SessionCard } from '@/src/components/SessionCard';
import { PageLoader, ErrorMessage } from '@/src/components/ui';
import { useApi } from '@/src/hooks/useApi';
import { getRoom } from '@/src/api/rooms';
import { formatDate } from '@/src/utils/format';
import type { SessionSummary } from '@/src/types';

export default function RoomDetailPage({
  params,
}: {
  params: Promise<{ roomsId: string }>;
}) {
  const { roomsId } = use(params);
  const { data: room, loading, error } = useApi(
    () => getRoom(roomsId),
    [roomsId]
  );

  if (loading) return <PageLoader />;
  if (error)
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorMessage message={error} />
      </div>
    );
  if (!room) return null;

  const sessions = room.sessions ?? [];
  const sorted = [...sessions].sort((a, b) =>
    (a.starttime ?? '').localeCompare(b.starttime ?? '')
  );

  const byDay = new Map<string, SessionSummary[]>();
  for (const s of sorted) {
    if (!s.starttime) continue;
    const day = formatDate(s.starttime);
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(s);
  }

  const eventId = sessions[0]
    ? (sessions[0] as SessionSummary & { eventId?: string }).eventId ?? ''
    : '';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All rooms
          </Link>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">{room.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {sessions.length === 0 && (
          <p className="text-sm text-muted-foreground">No sessions in this room.</p>
        )}
        <div className="space-y-10">
          {Array.from(byDay.entries()).map(([day, daySessions]) => (
            <div key={day}>
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {day}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {daySessions.map((s) => (
                  <SessionCard
                    key={s.id}
                    session={s}
                    eventId={eventId}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
