export function OverviewSideCard({
  sessionsCount,
  speakersCount,
  liveSessionsCount,
}: {
  sessionsCount: number
  speakersCount: number
  liveSessionsCount: number
}) {
  return (
    <aside>
      <div className="rounded-xl border border-border/70 bg-card p-5">
        <h3 className="font-medium">At a glance</h3>
        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Sessions</dt>
            <dd>{sessionsCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Speakers</dt>
            <dd>{speakersCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Live now</dt>
            <dd>{liveSessionsCount}</dd>
          </div>
        </dl>
      </div>
    </aside>
  )
}
