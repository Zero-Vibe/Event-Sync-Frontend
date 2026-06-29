'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { SpeakerCard } from '@/src/components/SpeakerCard'
import type { Speaker } from '@/src/types'

const PAGE_SIZE = 12

export function SpeakersList({ speakers }: { speakers: Speaker[] }) {
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () =>
      query
        ? speakers.filter((s) =>
            `${s.firstName} ${s.lastName}`.toLowerCase().includes(query.toLowerCase())
          )
        : speakers,
    [speakers, query]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = useMemo(
    () => filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [filtered, page]
  )

  const handleSearch = (value: string) => {
    setQuery(value)
    setPage(0)
  }

  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-10 w-full rounded-lg border border-border/60 bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {query ? 'No speakers match your search.' : 'No speakers found.'}
        </p>
      )}

      {filtered.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paged.map((s) => (
              <SpeakerCard key={s.id} speaker={s} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
                className="inline-flex h-8 items-center gap-1 rounded-md border border-border/60 px-3 text-xs text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>
              <span className="text-xs text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
                className="inline-flex h-8 items-center gap-1 rounded-md border border-border/60 px-3 text-xs text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
