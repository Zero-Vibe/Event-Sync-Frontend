'use client';

import { use, useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, ArrowBigUp, Send, Heart, Share2, Sparkles } from 'lucide-react';
import { LiveBadge } from '@/src/components/LiveBadge';
import { PageLoader, ErrorMessage } from '@/src/components/ui';
import { useApi } from '@/src/hooks/useApi';
import { useSessionWebSocket } from '@/src/hooks/useSessionWebSocket';
import { getSession } from '@/src/api/sessions';
import { getEvent } from '@/src/api/events';
import { getQuestions, createQuestion, voteQuestion } from '@/src/api/questions';
import { formatTime } from '@/src/utils/format';
import { isLive, isEnded, isUpcoming } from '@/src/types';
import type { Question } from '@/src/types';
import { useFavoritesStore } from '@/src/stores/favorite.store';

export default function SessionDetailPage({
  params,
}: {
  params: Promise<{ eventId: string; sessionId: string }>;
}) {
  const { eventId, sessionId } = use(params);

  const { data: event } = useApi(() => getEvent(eventId), [eventId]);
  const { data: session, loading, error } = useApi(
    () => getSession(eventId, sessionId),
    [eventId, sessionId]
  );

  const live = isLive(session?.startTime, session?.endTime);
  const ended = isEnded(session?.endTime);
  const upcoming = isUpcoming(session?.startTime);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { isFavorite, toggle } = useFavoritesStore();

  const { data: fetchedQuestions } = useApi(
    () => (live ? getQuestions(eventId, sessionId) : Promise.resolve([] as Question[])),
    [eventId, sessionId, live]
  );

  useEffect(() => {
    if (fetchedQuestions) setQuestions(fetchedQuestions);
  }, [fetchedQuestions]);

  const handleNewQuestion = useCallback((question: Question) => {
    setQuestions((prev) => {
      const alreadyPresent = prev.some((q) => q.id === question.id);
      return alreadyPresent ? prev : [...prev, question];
    });
  }, []);

  const handleVoteUpdate = useCallback((updated: Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
  }, []);

  useSessionWebSocket({
    sessionId,
    enabled: live,
    onNewQuestion: handleNewQuestion,
    onVoteUpdate: handleVoteUpdate,
  });

  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => b.upvotes - a.upvotes),
    [questions]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || submitting || !live) return;
    setSubmitting(true);
    try {
      const q = await createQuestion(eventId, sessionId, { content: text.trim(), isAnonymous: !name.trim() }, undefined);
      setQuestions((prev) => {
        const alreadyPresent = prev.some((existing) => existing.id === q.id);
        return alreadyPresent ? prev : [...prev, q];
      });
      setVotedIds((prev) => new Set(prev).add(q.id));
      setText('');
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (qId: string) => {
    if (!live) return;

    const alreadyVoted = votedIds.has(qId);
    const upvote = !alreadyVoted;

    setVotedIds((prev) => {
      const next = new Set(prev);
      if (alreadyVoted) next.delete(qId);
      else next.add(qId);
      return next;
    });
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, upvotes: q.upvotes + (alreadyVoted ? -1 : 1) } : q))
    );

    try {
      const newUpvotes = await voteQuestion(eventId, sessionId, qId, upvote);
      setQuestions((prev) => prev.map((q) => (q.id === qId ? { ...q, upvotes: newUpvotes } : q)));
    } catch {
      setVotedIds((prev) => {
        const next = new Set(prev);
        if (alreadyVoted) next.add(qId);
        else next.delete(qId);
        return next;
      });
      setQuestions((prev) =>
        prev.map((q) => (q.id === qId ? { ...q, upvotes: q.upvotes + (alreadyVoted ? 1 : -1) } : q))
      );
    }
  };

  if (loading) return <PageLoader />;
  if (error)
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorMessage message={error} />
      </div>
    );
  if (!session) return null;

  const statusLabel = live ? 'Live now' : ended ? 'Ended' : upcoming ? 'Upcoming' : '–';
  const isFav = isFavorite(session.id);
  const speakers = session.speakers ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-radial-violet opacity-70" aria-hidden />
        <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href={`/events/${eventId}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {event?.title ?? 'Back'}
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {live && <LiveBadge />}
                {!live && ended && (
                  <span className="inline-flex items-center rounded-full border border-border/60 px-2.5 py-0.5 text-xs text-muted-foreground">
                    Ended
                  </span>
                )}
              </div>

              <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {session.title}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {formatTime(session.startTime)} – {formatTime(session.endTime)}
                </span>
                {session.room && (
                  <Link href={`/rooms/${session.room.id}`} className="inline-flex items-center gap-2 hover:text-foreground">
                    <MapPin className="h-4 w-4" />
                    {session.room.name}
                  </Link>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toggle(session.id)}
                data-fav={isFav}
                className="inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors border-border bg-card hover:bg-secondary data-[fav=true]:border-primary data-[fav=true]:bg-primary/15 data-[fav=true]:text-primary"
              >
                <Heart data-fav={isFav} className="h-4 w-4 data-[fav=true]:fill-current" />
                {isFav ? 'Saved' : 'Save to agenda'}
              </button>
              <button className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-card px-4 text-sm font-medium hover:bg-secondary">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="space-y-12">
          {speakers.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                {speakers.length > 1 ? 'Speakers' : 'Speaker'}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {speakers.map((sp) => (
                  <Link
                    key={sp.id}
                    href={`/speakers/${sp.id}`}
                    className="card-hover flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
                  >
                    {sp.pictureUrl ? (
                      <img src={sp.pictureUrl} alt={sp.firstName ?? ''} className="h-16 w-16 rounded-full object-cover ring-2 ring-border" />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-sm font-medium ring-2 ring-border">
                        {(sp.firstName?.[0] ?? '') + (sp.lastName?.[0] ?? '')}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-semibold tracking-tight">
                        {[sp.firstName, sp.lastName].filter(Boolean).join(' ')}
                      </h3>
                      <p className="text-sm text-muted-foreground">Speaker</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {session.description && (
            <div>
              <h2 className="text-xl font-semibold tracking-tight">About this session</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{session.description}</p>
            </div>
          )}

          {!ended && (
            <div>
              {upcoming && (
                <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-5 py-4 text-sm text-muted-foreground">
                  <span>Q&A opens when the session goes live.</span>
                </div>
              )}

              {live && (
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold tracking-tight">Live Q&amp;A</h2>
                        <p className="text-xs text-muted-foreground">
                          {questions.length} questions · sorted by upvotes
                        </p>
                      </div>
                    </div>
                    <LiveBadge label="Open" />
                  </div>

                  <form onSubmit={handleSubmit} className="mt-5 rounded-2xl border border-border bg-card p-4">
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
                        disabled={!text.trim() || submitting}
                        className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-50 hover:brightness-110"
                      >
                        <Send className="h-4 w-4" /> Post
                      </button>
                    </div>
                  </form>

                  <ul className="mt-6 space-y-3">
                    {sortedQuestions.map((q, i) => {
                      const voted = votedIds.has(q.id);
                      return (
                        <li key={q.id ?? i} className="group flex gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
                          <button
                            onClick={() => handleVote(q.id)}
                            data-active={voted}
                            className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-lg border text-xs font-semibold transition-colors border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:text-foreground data-[active=true]:border-primary data-[active=true]:bg-primary/15 data-[active=true]:text-primary"
                            aria-label="Upvote"
                          >
                            <ArrowBigUp data-active={voted} className="h-5 w-5 data-[active=true]:fill-current" />
                            {q.upvotes}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm leading-relaxed text-foreground">{q.content}</p>
                            <p className="mt-2 text-xs text-muted-foreground">— {q.user?.name ?? 'Anonymous'}</p>
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
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {session.capacity && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold">Capacity</h3>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-3xl font-semibold tracking-tight">{Math.min(100, Math.round((session.speakers.length / session.capacity) * 100))}%</span>
                <span className="text-xs text-muted-foreground">{session.capacity} max</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  data-fill={session.capacity === 0 ? 'ok' : session.speakers.length >= session.capacity * 0.95 ? 'full' : session.speakers.length >= session.capacity * 0.8 ? 'warn' : 'ok'}
                  className="h-full rounded-full transition-all data-[fill=full]:bg-destructive data-[fill=warn]:bg-amber-500 data-[fill=ok]:bg-primary"
                  style={{ width: `${Math.min(100, Math.round((session.speakers.length / (session.capacity || 1)) * 100))}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Plenty of seats available.
              </p>
            </div>
          )}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold">Details</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {session.room && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Room</dt>
                  <dd>{session.room.name}</dd>
                </div>
              )}
              {session.capacity && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Capacity</dt>
                  <dd>{session.capacity}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd>{statusLabel}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>
    </div>
  );
}
