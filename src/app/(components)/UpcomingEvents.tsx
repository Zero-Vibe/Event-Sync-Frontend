import Link from 'next/link'
import { EventCard } from '@/src/components/EventCard'
import type { Event } from '@/src/types'

export function UpcomingEvents({ events }: { events: Event[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Upcoming events</h2>
        <Link
          href="/events"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View all
        </Link>
      </div>

      <div className="mt-6">
        {events.length === 0 && (
          <p className="text-sm text-muted-foreground">No upcoming events.</p>
        )}
        {events.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 6).map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
