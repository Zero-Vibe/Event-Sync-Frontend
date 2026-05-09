"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Users } from "lucide-react";
import { SessionCard } from "@/src/components/SessionCard";
import { getRoom, sessionsForRoom, formatTime, formatDate} from '../../../lib/modck-data';

export default function RoomDetailPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const room = getRoom(roomId);
  const sessions = sessionsForRoom(roomId).sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (!room) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-semibold">Room not found</h1>
          <Link href="/" className="mt-4 inline-block text-primary hover:underline">← Home</Link>
        </div>
      </div>
    );
  }

  const byDay = new Map<string, typeof sessions>();
  for (const s of sessions) {
    const k = formatDate(s.startTime);
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k)!.push(s);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative border-b border-border/60">
        <div className="absolute inset-0 bg-radial-violet opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All events
          </Link>
          <p className="mt-6 text-sm font-medium text-primary">Room</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{room.name}</h1>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{room.floor}</span>
            <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" />Capacity {room.capacity}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold tracking-tight">Schedule</h2>
        <div className="mt-6 space-y-10">
          {Array.from(byDay.entries()).map(([day, list]) => (
            <div key={day}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{day}</h3>
              <ol className="relative mt-4 border-l border-border/70 pl-6">
                {list.map((s) => (
                  <li key={s.id} className="relative mb-6 last:mb-0">
                    <span className="absolute -left-[29px] top-3 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                    <div className="mb-2 text-xs font-medium text-muted-foreground">
                      {formatTime(s.startTime)} – {formatTime(s.endTime)}
                    </div>
                    <SessionCard session={s} showTime={false} compact />
                  </li>
                ))}
              </ol>
            </div>
          ))}
          {sessions.length === 0 && (
            <p className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center text-muted-foreground">
              No sessions scheduled in this room.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}