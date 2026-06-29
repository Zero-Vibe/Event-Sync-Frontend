import Link from 'next/link'
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react'
import { LiveBadge } from '@/src/components/LiveBadge'
import { formatDateRange } from '@/src/utils/format'
import type { Event } from '@/src/types'

export function EventHeader({
  event,
  liveSessionsCount,
}: {
  event: Event
  liveSessionsCount: number
}) {
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All events
        </Link>

        <div className="mt-6 flex flex-wrap items-start gap-3">
          {liveSessionsCount > 0 && <LiveBadge label="Happening now" />}
        </div>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {event.title}
        </h1>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {formatDateRange(event.startDateTime, event.endDateTime)}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {event.location}
          </span>
        </div>
      </div>
    </section>
  )
}
