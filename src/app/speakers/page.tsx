'use cache'

import { cacheLife } from 'next/cache'
import { SpeakersList } from './(components)/SpeakersList'
import type { Speaker } from '@/src/types'

export default async function SpeakersPage() {
  cacheLife({ stale: 60 * 60 * 24, revalidate: 60 * 60 * 12, expire: 60 * 60 * 24 * 7 })

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/speakers`)
  if (!res.ok) throw new Error('Failed to fetch speakers')

  const speakers: Speaker[] = await res.json()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-tight">Speakers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse conference speakers
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SpeakersList speakers={speakers} />
      </section>
    </div>
  )
}
