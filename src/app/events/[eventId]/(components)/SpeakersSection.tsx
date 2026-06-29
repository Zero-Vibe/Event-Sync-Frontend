import Link from 'next/link'
import type { SpeakerSummary } from '@/src/types'

export function SpeakersSection({
  speakers,
}: {
  speakers: SpeakerSummary[]
}) {
  if (speakers.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No speakers yet.</p>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {speakers.map((s) => (
        <Link
          key={s.id}
          href={`/speakers/${s.id}`}
          className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4 transition-colors hover:bg-accent/40"
        >
          {s.base64Picture ? (
            <img
              src={s.base64Picture}
              alt={s.firstName ?? ''}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
              {(s.firstName?.[0] ?? '') + (s.lastName?.[0] ?? '')}
            </div>
          )}
          <p className="text-sm font-medium">
            {[s.firstName, s.lastName].filter(Boolean).join(' ')}
          </p>
        </Link>
      ))}
    </div>
  )
}
