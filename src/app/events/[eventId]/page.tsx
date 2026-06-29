'use cache'

import { cacheLife } from 'next/cache'
import { EventHeader } from './(components)/EventHeader'
import { EventTabBar } from './(components)/EventTabBar'
import { OverviewSection } from './(components)/OverviewSection'
import { ScheduleSection } from './(components)/ScheduleSection'
import { SpeakersSection } from './(components)/SpeakersSection'
import { isLive } from '@/src/types'
import { formatDate } from '@/src/utils/format'
import type { Session, Event, SpeakerSummary } from '@/src/types'

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  cacheLife({ stale: 60 * 60 * 12, revalidate: 60 * 60, expire: 60 * 60 * 24 * 2 })

  const { eventId } = await params
  const baseUrl = process.env.NEXT_PUBLIC_API_URL

  const [eventRes, sessionsRes] = await Promise.all([
    fetch(`${baseUrl}/events/${eventId}`),
    fetch(`${baseUrl}/events/${eventId}/sessions`),
  ])

  if (!eventRes.ok) throw new Error('Failed to load event')

  const event: Event = await eventRes.json()
  const sessions: Session[] = sessionsRes.ok ? await sessionsRes.json() : []

  const allSpeakers: SpeakerSummary[] = Array.from(
    new Map(
      sessions
        .flatMap((s) => s.speakers)
        .filter(Boolean)
        .map((sp) => [sp.id, sp])
    ).values()
  )

  const groupedByDay = new Map<string, Session[]>()
  for (const s of sessions) {
    const day = formatDate(s.startTime)
    if (!groupedByDay.has(day)) groupedByDay.set(day, [])
    groupedByDay.get(day)!.push(s)
  }

  const liveSessions = sessions.filter((s) => isLive(s.startTime, s.endTime))

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EventHeader event={event} liveSessionsCount={liveSessions.length} />

      <EventTabBar
        overview={
          <OverviewSection
            event={event}
            liveSessions={liveSessions}
            sessionsCount={sessions.length}
            speakersCount={allSpeakers.length}
            liveSessionsCount={liveSessions.length}
            eventId={eventId}
          />
        }
        schedule={
          <ScheduleSection groupedByDay={groupedByDay} eventId={eventId} />
        }
        speakers={<SpeakersSection speakers={allSpeakers} />}
      />
    </div>
  )
}
