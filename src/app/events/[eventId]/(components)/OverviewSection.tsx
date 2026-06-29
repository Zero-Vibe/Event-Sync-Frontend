import { SessionCard } from '@/src/components/SessionCard'
import { LiveBadge } from '@/src/components/LiveBadge'
import { OverviewSideCard } from './OverviewSideCard'
import type { Event, Session } from '@/src/types'

export function OverviewSection({
  event,
  liveSessions,
  sessionsCount,
  speakersCount,
  liveSessionsCount,
  eventId,
}: {
  event: Event
  liveSessions: Session[]
  sessionsCount: number
  speakersCount: number
  liveSessionsCount: number
  eventId: string
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div>
        {event.description && (
          <>
            <h2 className="text-lg font-semibold">About</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          </>
        )}
        {liveSessions.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-2">
              <LiveBadge />
              <h3 className="font-semibold">Live sessions</h3>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {liveSessions.map((s) => (
                <SessionCard key={s.id} session={s} eventId={eventId} />
              ))}
            </div>
          </div>
        )}
      </div>

      <OverviewSideCard
        sessionsCount={sessionsCount}
        speakersCount={speakersCount}
        liveSessionsCount={liveSessionsCount}
      />
    </div>
  )
}
