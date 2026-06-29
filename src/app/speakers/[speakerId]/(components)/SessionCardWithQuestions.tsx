import { SessionCard } from '@/src/components/SessionCard'
import { type Session, type Question, isLive } from '@/src/types'

export function SessionCardWithQuestions({
  session,
  eventId,
  topQuestions,
}: {
  session: Session
  eventId: string
  topQuestions: Question[]
}) {
  return (
    <div>
      <SessionCard session={session} eventId={eventId} />
      {topQuestions.length > 0 && (
        <div className="mt-2 rounded-xl border border-border/40 bg-card/50 p-3">
          <h4 className="mb-2 text-xs font-medium text-muted-foreground">
            Top question
          </h4>
          <div className="space-y-1.5">
            {topQuestions.map((q) => (
              <div key={q.id} className="flex items-start gap-2 text-xs">
                <span className="shrink-0 text-muted-foreground">
                  ↑{q.upvotes}
                </span>
                <span className="line-clamp-1 text-muted-foreground/80">
                  {q.content}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
