'use cache';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SessionCard } from '@/src/components/SessionCard';
import { formatDate } from '@/src/utils/format';
import type { SessionSummary } from '@/src/types';
import { cacheLife } from 'next/cache';

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  cacheLife({ stale: 60 * 60 * 12, revalidate: 60 * 60 * 3, expire: 60 * 60 * 24 })
  
  const { roomId } = await params;
  const roomRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}`)

  if (!roomRes.ok) throw new Error("Failed to fetch room");
  const room = await roomRes.json();
  
  if (!room) return null;

  const sessions = room.sessions ?? [];
  const sorted = [...sessions].sort((a, b) =>
    (a.startTime ?? '').localeCompare(b.startTime ?? '')
  );

  const byDay = new Map<string, SessionSummary[]>();
  for (const s of sorted) {
    if (!s.startTime) continue;
    const day = formatDate(s.startTime);
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
