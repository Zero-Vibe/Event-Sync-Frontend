'use cache'

import Link from 'next/link'
import { ArrowLeft, Clock, MapPin } from 'lucide-react'
import { LiveBadge } from '@/src/components/LiveBadge'
import { formatTime } from '@/src/utils/format'
import { isLive, isEnded, isUpcoming } from '@/src/types'
import type { Session, Event } from '@/src/types'
import { RegisterButton } from './(components)/RegisterButton'
import { RegistrationCount } from './(components)/RegistrationCount'
import { QnASection } from './(components)/QnASection'
import { cacheLife } from 'next/cache'

export default async function SessionPage({ params }: { params: Promise<{ eventId: string; sessionId: string }> }) {
  cacheLife({ stale: 60 * 60 * 12, revalidate: 60 * 60, expire: 60 * 60 * 24 * 2 } )

  const { eventId, sessionId } = await params
  const baseUrl = process.env.NEXT_PUBLIC_API_URL

  const [sessionRes, eventRes] = await Promise.all([
    fetch(`${baseUrl}/events/${eventId}/sessions/${sessionId}`),
    fetch(`${baseUrl}/events/${eventId}`),
  ])

  if (!sessionRes.ok) throw new Error('Failed to load session')

  const session: Session = await sessionRes.json()
  const event: Event | null = eventRes.ok ? await eventRes.json() : null

  const live = isLive(session.startTime, session.endTime)
  const ended = isEnded(session.endTime)
  const upcoming = isUpcoming(session.startTime)
  const statusLabel = live ? 'Live now' : ended ? 'Ended' : upcoming ? 'Upcoming' : '–'

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href={`/events/${eventId}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {event?.title ?? 'Back'}
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {live && <LiveBadge />}
            {!live && ended && (
              <span className="inline-flex items-center rounded-full border border-border/60 px-2.5 py-0.5 text-xs text-muted-foreground">
                Ended
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {session.title}
            </h1>
            {!live && (
              <RegisterButton eventId={eventId} sessionId={sessionId} />
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {formatTime(session.startTime)} – {formatTime(session.endTime)}
            </span>
            {session.room && (
              <Link
                href={`/rooms/${session.room.id}`}
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                <MapPin className="h-4 w-4" />
                {session.room.name}
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <div className="space-y-10">
          {session.speakers.length > 0 && (
            <div>
              <h2 className="text-base font-semibold">
                {session.speakers.length > 1 ? 'Speakers' : 'Speaker'}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {session.speakers.map((sp) => (
                  <Link
                    key={sp.id}
                    href={`/speakers/${sp.id}`}
                    className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4 transition-colors hover:bg-accent/40"
                  >
                    {sp["base64Picture"] ? (
                      <img
                        src={sp["base64Picture"]}
                        alt={sp.firstName ?? ''}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {(sp.firstName?.[0] ?? '') + (sp.lastName?.[0] ?? '')}
                      </div>
                    )}
                    <p className="text-sm font-medium">
                      {[sp.firstName, sp.lastName].filter(Boolean).join(' ')}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {session.description && (
            <div>
              <h2 className="text-base font-semibold">About</h2>
              <p className="mt-3 leading-relaxed text-sm text-muted-foreground">
                {session.description}
              </p>
            </div>
          )}

          {!ended && (
            <QnASection
              eventId={eventId}
              sessionId={sessionId}
              live={live}
              upcoming={upcoming}
            />
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border/70 bg-card p-5">
            <h3 className="text-sm font-semibold">Details</h3>
            <dl className="mt-3 space-y-2 text-sm">
              {session.room && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Room</dt>
                  <dd>{session.room.name}</dd>
                </div>
              )}
              {session.capacity && (
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Capacity</dt>
                  <dd className="flex items-center gap-1.5">
                    <RegistrationCount isUpcoming={upcoming} eventId={eventId} sessionId={sessionId} capacity={session.capacity} />
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd>{statusLabel}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>
    </div>
  )
}
