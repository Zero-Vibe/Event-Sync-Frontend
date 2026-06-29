'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowBigUp, Send, Lock } from 'lucide-react'
import { useApi } from '@/src/hooks/useApi'
import { useSessionWebSocket } from '@/src/hooks/useSessionWebSocket'
import { getQuestions, createQuestion, voteQuestion } from '@/src/api/questions'
import type { Question } from '@/src/types'
import { useAuthStore } from '@/src/stores/auth.store'
import { useToastStore } from '@/src/stores/toast.store'

export function QnASection({ eventId, sessionId, live, upcoming }: { eventId: string; sessionId: string; live: boolean; upcoming: boolean }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())
  const [text, setText] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { isAuthenticated, token } = useAuthStore()
  const addToast = useToastStore((s) => s.addToast)

  const { data: fetchedQuestions } = useApi(
    () =>
      live
        ? getQuestions(eventId, sessionId)
        : Promise.resolve([] as Question[]),
    [eventId, sessionId, live]
  )

  useEffect(() => {
    if (fetchedQuestions) setQuestions(fetchedQuestions)
  }, [fetchedQuestions])

  const handleNewQuestion = useCallback((question: Question) => {
    setQuestions((prev) => {
      const alreadyPresent = prev.some((q) => q.id === question.id)
      return alreadyPresent ? prev : [...prev, question]
    })
  }, [])

  const handleVoteUpdate = useCallback((updated: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q))
    )
  }, [])

  useSessionWebSocket({
    sessionId,
    enabled: live,
    onNewQuestion: handleNewQuestion,
    onVoteUpdate: handleVoteUpdate,
  })

  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => b.upvotes - a.upvotes),
    [questions]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || submitting || !live || !isAuthenticated) return
    setSubmitting(true)
    try {
      const q = await createQuestion(eventId, sessionId, {
        content: text.trim(),
        isAnonymous: anonymous,
      }, token)

      setQuestions((prev) => {
        const alreadyPresent = prev.some((existing) => existing.id === q.id)
        return alreadyPresent ? prev : [...prev, q]
      })
      setVotedIds((prev) => new Set(prev).add(q.id))
      setText('')
    } catch {
      addToast('Failed to post question.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleVote = async (qId: string) => {
    if (!live || !isAuthenticated) return

    const alreadyVoted = votedIds.has(qId)
    const upvote = !alreadyVoted

    setVotedIds((prev) => {
      const next = new Set(prev)
      if (alreadyVoted) next.delete(qId)
      else next.add(qId)
      return next
    })
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId ? { ...q, upvotes: q.upvotes + (alreadyVoted ? -1 : 1) } : q
      )
    )

    try {
      const newUpvotes = await voteQuestion(eventId, sessionId, qId, upvote)
      setQuestions((prev) =>
        prev.map((q) => (q.id === qId ? { ...q, upvotes: newUpvotes } : q))
      )
    } catch {
      addToast('Failed to register vote.')
      setVotedIds((prev) => {
        const next = new Set(prev)
        if (alreadyVoted) next.add(qId)
        else next.delete(qId)
        return next
      })
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === qId ? { ...q, upvotes: q.upvotes + (alreadyVoted ? 1 : -1) } : q
        )
      )
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold">Q&A</h2>
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
              const voted = votedIds.has(q.id)
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
              )
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
  )
}
