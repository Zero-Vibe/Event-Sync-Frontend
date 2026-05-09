"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Users, ArrowLeft } from "lucide-react";
import { SessionCard } from "@/src/components/SessionCard";
import { SpeakerCard } from "@/src/components/SpeakerCard";
import { LiveBadge } from "@/src/components/Livebadge";
import { getEvent, sessionsForEvent, rooms, speakers as allSpeakers, formatDateRange, formatTime, formatDate } from "../../../lib/modck-data";
import { cn } from "@/src/lib/utils";
const tabs = ["Overview", "Schedule", "Speakers", "Rooms"] as const;
type Tab = (typeof tabs)[number];

export default function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = use(params);
  const event = getEvent(eventId);
  const [tab, setTab] = useState<Tab>("Overview");

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-semibold">Event not found</h1>
          <Link href="/events" className="mt-4 inline-block text-primary hover:underline">← Back to events</Link>
        </div>
      </div>
    );
  }

  const eventSessions = sessionsForEvent(event.id);
  const liveSessions = eventSessions.filter((s) => s.isLive);

  const groupedByDay = useMemo(() => {
    const map = new Map<string, typeof eventSessions>();
    for (const s of eventSessions) {
      const day = formatDate(s.startTime);
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(s);
    }
    for (const [, list] of map) list.sort((a, b) => a.startTime.localeCompare(b.startTime));
    return Array.from(map.entries());
  }, [eventSessions]);

  const eventSpeakerIds = Array.from(new Set(eventSessions.flatMap((s) => s.speakerIds)));
  const eventSpeakers = allSpeakers.filter((s) => eventSpeakerIds.includes(s.id));
  const eventRooms = rooms.filter((r) => eventSessions.some((s) => s.roomId === r.id));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[44vh] min-h-[320px] w-full overflow-hidden">
          <img src={event.cover} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        </div>
        <div className="mx-auto -mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All events
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {event.isLive && <LiveBadge label="Happening now" />}
            <span className="rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              {event.tracks.length} tracks · {eventSessions.length} sessions
            </span>
          </div>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{event.name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{event.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" />{formatDateRange(event.startDate, event.endDate)}</span>
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{event.location} · {event.city}</span>
            <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" />{event.attendees.toLocaleString()} attendees</span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-16 z-30 mt-12 border-y border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative h-12 px-4 text-sm font-medium transition-colors",
                tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
              {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {tab === "Overview" && (
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
                    {liveSessions.map((s) => <SessionCard key={s.id} session={s} />)}
                  </div>
                </div>
              )}
              <div className="mt-12">
                <h3 className="text-lg font-semibold tracking-tight">Tracks</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {event.tracks.map((t: string) => (
                    <span key={t} className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <aside className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-semibold">At a glance</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Sessions</dt><dd>{eventSessions.length}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Speakers</dt><dd>{eventSpeakers.length}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Rooms</dt><dd>{eventRooms.length}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Attendees</dt><dd>{event.attendees.toLocaleString()}</dd></div>
                </dl>
              </div>
              <button className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground shadow-lg transition hover:brightness-110">
                Get your ticket
              </button>
            </aside>
          </div>
        )}

        {tab === "Schedule" && (
          <div className="space-y-12">
            {groupedByDay.map(([day, sessions]) => (
              <div key={day}>
                <div className="sticky top-28 z-20 -mx-4 mb-4 bg-background/80 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                  <h2 className="text-xl font-semibold tracking-tight">{day}</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {sessions.map((s) => (
                    <div key={s.id} className="flex gap-4">
                      <div className="w-16 shrink-0 pt-5 text-right text-xs font-medium text-muted-foreground">
                        {formatTime(s.startTime)}
                      </div>
                      <div className="flex-1">
                        <SessionCard session={s} showTime={false} compact />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Speakers" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eventSpeakers.map((s) => <SpeakerCard key={s.id} speaker={s} />)}
          </div>
        )}

        {tab === "Rooms" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eventRooms.map((r) => {
              const count = eventSessions.filter((s) => s.roomId === r.id).length;
              return (
                <Link key={r.id} href={`/rooms/${r.id}`} className="card-hover rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold">{r.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.floor}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{count} sessions</span>
                    <span>Capacity {r.capacity}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}