'use client';

import { use, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, ArrowBigUp, Send } from 'lucide-react';
import { LiveBadge } from '@/src/components/LiveBadge';
import { PageLoader, ErrorMessage } from '@/src/components/ui';
import { useApi } from '@/src/hooks/useApi';
import { getSession } from '@/src/api/sessions';
import { getEvent } from '@/src/api/events';
import { getQuestions, createQuestion, voteQuestion } from '@/src/api/questions';
import { formatTime } from '@/src/utils/format';
import type { Question } from '@/src/types';

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

  const [questions, setQuestions] = useState<Question[]>([]);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: fetchedQuestions } = useApi(
    () =>
      session?.isLive
        ? getQuestions(eventId, sessionId)
        : Promise.resolve([] as Question[]),
    [eventId, sessionId, session?.isLive]
  );

  useEffect(() => {
    if (fetchedQuestions) setQuestions(fetchedQuestions);
  }, [fetchedQuestions]);

  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => b.upvotes - a.upvotes),
    [questions]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      const q = await createQuestion(eventId, sessionId, {
        content: text.trim(),
        authorName: author.trim() || null,
      });
      setQuestions((prev) => [...prev, q]);
      setVotedIds((prev) => new Set(prev).add(q.id));
      setText('');
    } catch {
      // fall through
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (qId: string) => {
    const isVoted = votedIds.has(qId);
    setVotedIds((prev) => {
      const next = new Set(prev);
      if (isVoted) next.delete(qId);
      else next.add(qId);
      return next;
    });
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId ? { ...q, upvotes: q.upvotes + (isVoted ? -1 : 1) } : q
      )
    );
    try {
      await voteQuestion(eventId, sessionId, qId, !isVoted);
    } catch {
      // revert optimistic update
      setVotedIds((prev) => {
        const next = new Set(prev);
        if (isVoted) next.add(qId);
        else next.delete(qId);
        return next;
      });
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === qId ? { ...q, upvotes: q.upvotes + (isVoted ? 1 : -1) } : q
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
            {session.isLive && <LiveBadge />}
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {session.title}
          </h1>

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
                  <div
                    key={sp.id}
                    className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4"
                  >
                    {sp.pictureUrl ? (
                      <img
                        src={sp.pictureUrl}
                        alt={sp.fullName ?? ''}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {sp.fullName?.[0] ?? '?'}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{sp.fullName}</p>
                    </div>
                  </div>
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

          {session.isLive && (
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold">Live Q&amp;A</h2>
                <span className="text-xs text-muted-foreground">
                  {questions.length} questions
                </span>
              </div>

              <form onSubmit={handleSubmit} className="mt-4 rounded-xl border border-border bg-card p-4">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Ask a question..."
                  rows={3}
                  className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                  <input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Your name (optional)"
                    className="h-8 flex-1 min-w-[140px] rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="submit"
                    disabled={!text.trim() || submitting}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md bg-foreground px-3 text-xs font-medium text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-80"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Post
                  </button>
                </div>
              </form>

              <ul className="mt-4 space-y-2.5">
                {sortedQuestions.map((q) => {
                  const isVoted = votedIds.has(q.id);
                  return (
                    <li
                      key={q.id}
                      className="flex gap-3 rounded-xl border border-border/70 bg-card p-4"
                    >
                      <button
                        onClick={() => handleVote(q.id)}
                        data-active={isVoted}
                        className="flex h-12 w-10 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border border-border/70 text-xs font-medium transition-colors hover:border-border data-[active=true]:border-foreground data-[active=true]:bg-foreground/5 data-[active=true]:text-foreground"
                        aria-label="Upvote"
                      >
                        <ArrowBigUp
                          data-active={isVoted}
                          className="h-4 w-4 data-[active=true]:fill-current"
                        />
                        {q.upvotes}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-relaxed">{q.content}</p>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {q.authorName ?? 'Anonymous'}
                        </p>
                      </div>
                    </li>
                  );
                })}
                {sortedQuestions.length === 0 && (
                  <li className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                    No questions yet.
                  </li>
                )}
              </ul>
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
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Capacity</dt>
                  <dd>{session.capacity}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd>{session.isLive ? 'Live now' : 'Not live'}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>
    </div>
  );
}
