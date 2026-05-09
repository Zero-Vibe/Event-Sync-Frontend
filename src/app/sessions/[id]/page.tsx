"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Heart, ArrowBigUp, Send, Sparkles } from "lucide-react";
import { LiveBadge } from "@/src/components/Livebadge";
import { SpeakerCard } from "@/src/components/SpeakerCard";
import { getSession, getRoom, getSpeaker } from "@/src/data/queries";
import { formatTime } from "@/src/utils/format";
import type { Question } from "@/src/types";

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const session = getSession(id);

  const [questions, setQuestions] = useState<Question[]>(session?.questions ?? []);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());
  const [isFav, setIsFav] = useState(false);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-semibold">Session not found</h1>
          <Link href="/events" className="mt-4 inline-block text-primary hover:underline">← Back</Link>
        </div>
      </div>
    );
  }

  const room = getRoom(session.roomId);
  const speakers = session.speakerIds.map(getSpeaker).filter((s): s is NonNullable<typeof s> => Boolean(s));

  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => b.upvotes - a.upvotes),
    [questions]
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newQ: Question = {
      id: `q-${Date.now()}`,
      author: name.trim() || "Anonymous",
      text: text.trim(),
      upvotes: 1,
      createdAt: new Date().toISOString(),
    };
    setQuestions((qs) => [...qs, newQ]);
    setUpvoted((s) => new Set(s).add(newQ.id));
    setText("");
  };

  const upvote = (id: string) => {
    const isUp = upvoted.has(id);
    setQuestions((qs) => qs.map((q) => q.id === id ? { ...q, upvotes: q.upvotes + (isUp ? -1 : 1) } : q));
    setUpvoted((s) => {
      const next = new Set(s);
      if (isUp) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-radial-violet opacity-70" aria-hidden />
        <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All events
          </Link>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {session.isLive && <LiveBadge />}
                <span className="rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">{session.track}</span>
                <span className="rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">{session.level}</span>
              </div>
              <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{session.title}</h1>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" />{formatTime(session.startTime)} – {formatTime(session.endTime)}</span>
                {room && (
                  <Link href={`/rooms/${room.id}`} className="inline-flex items-center gap-2 hover:text-foreground">
                    <MapPin className="h-4 w-4" />{room.name} · {room.floor}
                  </Link>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsFav((f) => !f)}
              data-fav={isFav}
              className="
                inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors
                border-border bg-card hover:bg-secondary
                data-[fav=true]:border-primary data-[fav=true]:bg-primary/15 data-[fav=true]:text-primary
              "
            >
              <Heart data-fav={isFav} className="h-4 w-4 data-[fav=true]:fill-current" />
              {isFav ? "Saved" : "Save to agenda"}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="space-y-12">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{speakers.length > 1 ? "Speakers" : "Speaker"}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {speakers.map((s) => (
                <SpeakerCard key={s.id} speaker={s} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight">About this session</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{session.description}</p>
          </div>

          {session.isLive && (
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">Live Q&amp;A</h2>
                    <p className="text-xs text-muted-foreground">{questions.length} questions · sorted by upvotes</p>
                  </div>
                </div>
                <LiveBadge label="Open" />
              </div>

              <form onSubmit={submit} className="mt-5 rounded-2xl border border-border bg-card p-4">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Ask the speaker a question…"
                  rows={3}
                  className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border/60 pt-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="h-9 flex-1 min-w-[160px] rounded-md bg-secondary/50 px-3 text-sm outline-none ring-1 ring-border focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={!text.trim()}
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-50 hover:brightness-110"
                  >
                    <Send className="h-4 w-4" /> Post
                  </button>
                </div>
              </form>

              <ul className="mt-6 space-y-3">
                {sortedQuestions.map((q) => {
                  const isUp = upvoted.has(q.id);
                  return (
                    <li key={q.id} className="group flex gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
                      <button
                        onClick={() => upvote(q.id)}
                        data-active={isUp}
                        className="
                          flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-lg border text-xs font-semibold transition-colors
                          border-border bg-secondary/40 text-muted-foreground
                          hover:border-primary/40 hover:text-foreground
                          data-[active=true]:border-primary data-[active=true]:bg-primary/15 data-[active=true]:text-primary
                        "
                        aria-label="Upvote"
                      >
                        <ArrowBigUp data-active={isUp} className="h-5 w-5 data-[active=true]:fill-current" />
                        {q.upvotes}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-relaxed text-foreground">{q.text}</p>
                        <p className="mt-2 text-xs text-muted-foreground">— {q.author}</p>
                      </div>
                    </li>
                  );
                })}
                {sortedQuestions.length === 0 && (
                  <li className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center text-sm text-muted-foreground">
                    Be the first to ask a question.
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold">Capacity</h3>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-3xl font-semibold tracking-tight">{session.capacityFilled}%</span>
              <span className="text-xs text-muted-foreground">{room?.capacity} max</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                data-fill={session.capacityFilled >= 95 ? "full" : session.capacityFilled >= 80 ? "warn" : "ok"}
                className="h-full rounded-full transition-all data-[fill=full]:bg-destructive data-[fill=warn]:bg-amber-500 data-[fill=ok]:bg-primary"
                style={{ width: `${session.capacityFilled}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {session.capacityFilled >= 95 ? "Almost full — arrive early." : session.capacityFilled >= 80 ? "Filling up fast." : "Plenty of seats available."}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold">Details</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Track</dt><dd>{session.track}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Level</dt><dd>{session.level}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Room</dt><dd>{room?.name}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Floor</dt><dd>{room?.floor}</dd></div>
            </dl>
          </div>
        </aside>
      </section>
    </div>
  );
}
