'use client'

import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Session, Question } from '@/src/types'
import { formatDate } from '@/src/utils/format'
import { isLive } from '@/src/types'
import { SessionCardWithQuestions } from './SessionCardWithQuestions'

const PAGE_SIZE = 6

export function SpeakerSessions({ speakerId }: { speakerId: string }) {
  const [page, setPage] = useState(0)
  const [allSessions, setAllSessions] = useState<Session[]>([])
  const [questions, setQuestions] = useState<Record<string, Question[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/speakers/${speakerId}/sessions`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch sessions')
        return r.json() as Promise<Session[]>
      })
      .then(async (sessions) => {
        setAllSessions(sessions)
        const questionsResults = await Promise.all(
          sessions.map(async (s) => {
            try {
              if (!isLive(s?.startTime, s?.endTime)) return [s.id, []] as const
              const res = await fetch(
                `/api/events/${s.eventId}/sessions/${s.id}/top-questions`
              )
              if (!res.ok) return [s.id, []] as const
              const qs: Question[] = await res.json()
              return [s.id, qs] as const
            } catch {
              return [s.id, []] as const
            }
          })
        )
        setQuestions(Object.fromEntries(questionsResults))
      })
      .finally(() => setLoading(false))
  }, [speakerId])

  const sortedSessions = useMemo(
    () =>
      [...allSessions].sort((a, b) => {
        if (isLive(a.startTime, a.endTime) && !isLive(b.startTime, b.endTime)) return -1
        if (!isLive(a.startTime, a.endTime) && isLive(b.startTime, b.endTime)) return 1
        return 0
      }),
    [allSessions]
  )

  const totalPages = Math.max(1, Math.ceil(allSessions.length / PAGE_SIZE))
  const pagedSessions = useMemo(
    () => sortedSessions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [sortedSessions, page]
  )

  const groupedByDay = useMemo(() => {
    const map = new Map<string, Session[]>()
    for (const s of pagedSessions) {
      const day = formatDate(s.startTime)
      if (!map.has(day)) map.set(day, [])
      map.get(day)!.push(s)
    }
    return map
  }, [pagedSessions])

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading sessions...</p>
  }

  if (allSessions.length === 0) {
    return <p className="text-sm text-muted-foreground">No sessions found.</p>
  }

  return (
    <div>
      <div className="space-y-10">
        {Array.from(groupedByDay.entries()).map(([day, daySessions]) => (
          <div key={day}>
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {day}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {daySessions.map((s) => (
                <SessionCardWithQuestions
                  key={s.id}
                  session={s}
                  eventId={s.eventId}
                  topQuestions={questions[s.id] ?? []}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className="inline-flex h-8 items-center gap-1 rounded-md border border-border/60 px-3 text-xs text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </button>
          <span className="text-xs text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages - 1}
            className="inline-flex h-8 items-center gap-1 rounded-md border border-border/60 px-3 text-xs text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
