'use client';

import { use, useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, ArrowBigUp, Send, Lock, RefreshCw } from 'lucide-react';
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
import { useAuthStore } from '@/src/stores/auth.store';
import { useRegistrationStore } from '@/src/stores/registration.store';

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
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { isAuthenticated, token } = useAuthStore();

  const { toggle: toggleRegistrationStatus, isRegistered } = useRegistrationStore();
  const [registrationCount, setRegistrationCount] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)
  
  const { data: fetchedQuestions } = useApi(
    () =>
      live
        ? getQuestions(eventId, sessionId)
        : Promise.resolve([] as Question[]),
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
    setQuestions((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q))
    );
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

  const handleRegister = async (eventId: string, sessionId: string, token: string | null) => {
    const response = await fetch(`/api/events/${eventId}/sessions/${sessionId}/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      }
    })
    if (response.ok) toggleRegistrationStatus(sessionId);
  }

  const handleUnregister = async (eventId: string, sessionId: string, token: string | null) => {
    const response = await fetch(`/api/events/${eventId}/sessions/${sessionId}/register`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      }
    })
    if (response.ok) toggleRegistrationStatus(sessionId);
  }

  useEffect(() => {
    fetch(`/api/events/${eventId}/sessions/${sessionId}/register`)
      .then(r => r.json())
      .then(r => setRegistrationCount(r.count))
      .catch(() => setRegistrationCount(0))
  }, [eventId, sessionId, refreshKey])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || submitting || !live || !isAuthenticated) return;
    setSubmitting(true);
    try {
      const q = await createQuestion(eventId, sessionId, {
        content: text.trim(),
        isAnonymous: anonymous,
      },  token);

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
    if (!live || !isAuthenticated) return;

    const alreadyVoted = votedIds.has(qId);
    const upvote = !alreadyVoted;

    setVotedIds((prev) => {
      const next = new Set(prev);
      if (alreadyVoted) next.delete(qId);
      else next.add(qId);
      return next;
    });
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId ? { ...q, upvotes: q.upvotes + (alreadyVoted ? -1 : 1) } : q
      )
    );

    try {
      const newUpvotes = await voteQuestion(eventId, sessionId, qId, upvote);
      setQuestions((prev) =>
        prev.map((q) => (q.id === qId ? { ...q, upvotes: newUpvotes } : q))
      );
    } catch {
      setVotedIds((prev) => {
        const next = new Set(prev);
        if (alreadyVoted) next.add(qId);
        else next.delete(qId);
        return next;
      });
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === qId ? { ...q, upvotes: q.upvotes + (alreadyVoted ? 1 : -1) } : q
        )
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href={`/events/${eventId}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {event?.title ?? 'Back'}
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {live && <LiveBadge />}
            {!live && ended && (
              <span className="inline-flex items-center rounded-full border border-border/60 px-2.5 py-0.5 text-xs text-muted-foreground">
                Ended
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {session.title}
            </h1>
            {!live && (
              <button
                className={`inline-flex h-8 shrink-0 items-center rounded-md px-3 text-xs font-medium transition-colors ${isRegistered(sessionId)
                  ? "border border-border text-muted-foreground hover:border-destructive hover:text-destructive"
                  : "bg-foreground text-background hover:opacity-80"
                  }`}
                onClick={() =>
                  isRegistered(sessionId)
                    ? handleUnregister(eventId, sessionId, token)
                    : handleRegister(eventId, sessionId, token)
                }
              >
                {isRegistered(sessionId) ? "Unregister" : "Register"}
              </button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {formatTime(session.startTime)} – {formatTime(session.endTime)}
            </span>
            {session.room && (
              <Link
                href={`/rooms/${session.room.id}`}
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                <MapPin className="h-4 w-4" />
                {session.room.name}
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <div className="space-y-10">

          {session.speakers.length > 0 && (
            <div>
              <h2 className="text-base font-semibold">
                {session.speakers.length > 1 ? 'Speakers' : 'Speaker'}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {session.speakers.map((sp) => (
                  <Link
                    key={sp.id}
                    href={`/speakers/${sp.id}`}
                    className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4 transition-colors hover:bg-accent/40"
                  >
                    {sp.pictureUrl ? (
                      <img
                        src={sp.pictureUrl}
                        alt={sp.firstName ?? ''}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {(sp.firstName?.[0] ?? '') + (sp.lastName?.[0] ?? '')}
                      </div>
                    )}
                    <p className="text-sm font-medium">
                      {[sp.firstName, sp.lastName].filter(Boolean).join(' ')}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {session.description && (
            <div>
              <h2 className="text-base font-semibold">About</h2>
              <p className="mt-3 leading-relaxed text-sm text-muted-foreground">
                {session.description}
              </p>
            </div>
          )}

          {!ended && (
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold">Q&amp;A</h2>
                {live && (
                  <span className="text-xs text-muted-foreground">
                    {questions.length} question{questions.length !== 1 ? 's' : ''}
                  </span>
                )}
                {!isAuthenticated && live && (
                  <span className="text-xs text-muted-foreground">— sign in to participate</span>
                )}
              </div>

              {upcoming && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-5 py-4 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4 shrink-0" />
                  Q&A opens when the session goes live.
                </div>
              )}

              {live && (
                <>
                  {!isAuthenticated ? (
                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-border/60 bg-muted/40 px-5 py-4 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4 shrink-0" />
                      <span>
                        <Link href="/login" className="font-medium text-foreground hover:underline">
                          Sign in
                        </Link>{' '}
                        to ask a question or vote.
                      </span>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="mt-4 rounded-xl border border-border bg-card p-4"
                    >
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Ask a question..."
                        rows={3}
                        className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      />
                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={anonymous}
                            onChange={(e) => setAnonymous(e.target.checked)}
                            className="h-3.5 w-3.5 rounded border-border"
                          />
                          Post anonymously
                        </label>
                        <button
                          type="submit"
                          disabled={!text.trim() || submitting}
                          className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-md bg-foreground px-3 text-xs font-medium text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-80"
                        >
                          <Send className="h-3.5 w-3.5" />
                          {submitting ? 'Posting…' : 'Post'}
                        </button>
                      </div>
                    </form>
                  )}

                  <ul className="mt-4 space-y-2.5">
                    {sortedQuestions.map((q, i) => {
                      const voted = votedIds.has(q.id);
                      return (
                        <li
                          key={q.id ?? i}
                          className="flex gap-3 rounded-xl border border-border/70 bg-card p-4"
                        >
                          <button
                            onClick={() => handleVote(q.id)}
                            disabled={!isAuthenticated}
                            data-active={voted}
                            className="flex h-12 w-10 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border border-border/70 text-xs font-medium transition-colors hover:border-border disabled:cursor-not-allowed disabled:opacity-40 data-[active=true]:border-foreground data-[active=true]:bg-foreground/5 data-[active=true]:text-foreground"
                            aria-label="Upvote"
                          >
                            <ArrowBigUp
                              data-active={voted}
                              className="h-4 w-4 data-[active=true]:fill-current"
                            />
                            {q.upvotes}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm leading-relaxed">{q.content}</p>
                            <p className="mt-1.5 text-xs text-muted-foreground">
                              {q.user?.name ?? 'Anonymous'}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                    {sortedQuestions.length === 0 && (
                      <li key="empty" className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                        No questions yet. Be the first to ask.
                      </li>
                    )}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border/70 bg-card p-5">
            <h3 className="text-sm font-semibold">Details</h3>
            <dl className="mt-3 space-y-2 text-sm">
              {session.room && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Room</dt>
                  <dd>{session.room.name}</dd>
                </div>
              )}
              {session.capacity && (
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Capacity</dt>
                  <dd className="flex items-center gap-1.5">
                    {registrationCount ?? '-'} / {session.capacity}
                    <button
                      onClick={() => setRefreshKey(k => k + 1)}
                      className="inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Refresh"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </button>
                  </dd>
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