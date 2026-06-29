import Link from 'next/link'
import { EventCard } from '@/src/components/EventCard'
import type { Event } from '@/src/types'

export function PastEvents({ events }: { events: Event[] }) {
  if (events.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Past events</h2>
        <Link
          href="/events"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View all
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 opacity-60">
        {events.slice(0, 3).map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </section>
  )
}
