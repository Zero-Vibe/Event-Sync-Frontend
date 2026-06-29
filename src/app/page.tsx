'use cache'

import { cacheLife } from 'next/cache'
import { HeroSection } from './(components)/HeroSection'
import { UpcomingEvents } from './(components)/UpcomingEvents'
import { PastEvents } from './(components)/PastEvents'
import type { Event } from '@/src/types'

export default async function HomePage() {
  cacheLife({ stale: 60 * 60 * 12, revalidate: 60 * 60, expire: 60 * 60 * 24 * 2 })

  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${baseUrl}/events`)

  if (!res.ok) throw new Error('Failed to load events')

  const events: Event[] = await res.json()

  const now = Date.now()
  const upcoming = events
    .filter((e) => new Date(e.endDateTime).getTime() >= now)
    .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())

  const past = events
    .filter((e) => new Date(e.endDateTime).getTime() < now)
    .sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime())

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <UpcomingEvents events={upcoming} />
      <PastEvents events={past} />
    </div>
  )
}
