'use client'

import { useState } from 'react'

const TABS = ['Overview', 'Schedule', 'Speakers'] as const
type Tab = (typeof TABS)[number]

export function EventTabBar({
  overview,
  schedule,
  speakers,
}: {
  overview: React.ReactNode
  schedule: React.ReactNode
  speakers: React.ReactNode
}) {
  const [tab, setTab] = useState<Tab>('Overview')

  return (
    <>
      <div className="sticky top-14 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl gap-0 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              data-active={tab === t}
              className="relative h-11 px-4 text-sm transition-colors text-muted-foreground hover:text-foreground data-[active=true]:text-foreground"
            >
              {t}
              {tab === t && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-foreground" />
              )}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {tab === 'Overview' && overview}
        {tab === 'Schedule' && schedule}
        {tab === 'Speakers' && speakers}
      </section>
    </>
  )
}
