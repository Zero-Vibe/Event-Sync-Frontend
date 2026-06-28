'use client';

import Link from 'next/link';
import { ArrowRight, CalendarClock, MessageSquareText, Radio, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { EventCard } from '../components/EventCard';
import { LiveBadge } from '../components/LiveBadge';
import { PageLoader, ErrorMessage } from '../components/ui';
import { useApi } from '../hooks/useApi';
import { getEvents } from '../api/events';

const features = [
  { icon: CalendarClock, title: 'Live schedules', desc: 'Drag-and-drop agendas that sync to every attendee in real time, across web and mobile.' },
  { icon: MessageSquareText, title: 'Audience Q&A', desc: 'Upvoted questions, moderation queues, and ghost-typing indicators for a calm room.' },
  { icon: Radio, title: 'Streaming built in', desc: 'Low-latency video for keynotes and breakouts with zero plugins to install.' },
  { icon: Users, title: 'Networking', desc: 'Match attendees by interest and let them book 1:1s without leaving the app.' },
  { icon: ShieldCheck, title: 'Enterprise-grade', desc: 'SSO, SCIM, audit logs, and a SOC 2 Type II posture out of the box.' },
  { icon: Sparkles, title: 'Beautiful by default', desc: 'Branded experiences in minutes — no design team or implementation week required.' },
];

export default function HomePage() {
  const { data: events, loading, error } = useApi(getEvents);

  const now = Date.now();
  const upcoming = (events ?? [])
    .filter((e) => new Date(e.endDateTime).getTime() >= now)
    .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
  const past = (events ?? [])
    .filter((e) => new Date(e.endDateTime).getTime() < now)
    .sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime());

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
        <div className="absolute inset-0 bg-radial-violet" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <LiveBadge label="EventSync Summit is live" />
            </div>
            <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              The <span className="text-gradient">event platform</span> your audience deserves.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
              EventSync powers the world&apos;s most engaging conferences. Real-time schedules, live Q&amp;A, and intimate networking — all in one beautifully crafted product.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/events" className="group inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_12px_40px_-12px_color-mix(in_oklab,var(--primary)_70%,transparent)] transition-all hover:brightness-110">
                Explore events
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a href="#features" className="inline-flex h-11 items-center rounded-md border border-border bg-card/50 px-5 text-sm font-semibold backdrop-blur transition-colors hover:bg-card">
                See features
              </a>
            </div>
            
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-primary">Happening soon</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Upcoming events</h2>
          </div>
          <Link href="/events" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-flex">
            View all →
          </Link>
        </div>

        {loading && <div className="mt-10"><PageLoader /></div>}
        {error && <div className="mt-10"><ErrorMessage message={error} /></div>}

        {!loading && !error && upcoming.length === 0 && (
          <p className="mt-10 text-sm text-muted-foreground">No upcoming events.</p>
        )}

        {upcoming.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.slice(0, 3).map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </section>

      <section id="features" className="border-t border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-primary">Everything in one place</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Built for organizers. Loved by attendees.</h2>
            <p className="mt-4 text-muted-foreground">Six modules, one cohesive experience. Spin up an event in an afternoon and look like you spent six months on it.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="card-hover group rounded-2xl border border-border/70 bg-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-primary/15 via-card to-card p-10 sm:p-16">
          <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ready to run your next event?</h2>
            <p className="mt-4 text-muted-foreground">Join thousands of organizers using EventSync to create memorable experiences.</p>
            <div className="mt-8">
              <Link href="/events" className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg transition hover:brightness-110">
                Browse upcoming events <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {!loading && !error && past.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight">Past events</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-60">
            {past.slice(0, 3).map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}
    </div>
  );
}
