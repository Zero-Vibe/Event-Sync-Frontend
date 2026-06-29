import { SessionCard } from '@/src/components/SessionCard'
import type { Session } from '@/src/types'

export function ScheduleSection({
  groupedByDay,
  eventId,
}: {
  groupedByDay: Map<string, Session[]>
  eventId: string
}) {
  if (groupedByDay.size === 0) {
    return (
      <p className="text-sm text-muted-foreground">No sessions scheduled.</p>
    )
  }

  return (
    <div className="space-y-10">
      {Array.from(groupedByDay.entries()).map(([day, daySessions]) => (
        <div key={day}>
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {day}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {daySessions.map((s) => (
              <SessionCard key={s.id} session={s} eventId={eventId} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
