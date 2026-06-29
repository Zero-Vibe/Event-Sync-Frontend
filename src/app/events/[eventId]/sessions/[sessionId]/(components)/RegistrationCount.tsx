'use client'

import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

export function RegistrationCount({ isUpcoming, eventId, sessionId, capacity }: { isUpcoming: boolean, eventId: string; sessionId: string; capacity: number }) {
  const [count, setCount] = useState<number>(0)
  const [refresh, setRefresh] = useState<boolean>(true)

  useEffect(() => {
    fetch(`/api/events/${eventId}/sessions/${sessionId}/register`)
      .then(r => r.json())
      .then(r => setCount(r.count))
      .catch(() => setCount(0))
      .finally(() => setRefresh(false))
  }, [eventId, sessionId, refresh])

  return (
    <>
      {(!refresh) ? count : "-"} / {capacity}
      {isUpcoming && (<button
        onClick={() => setRefresh(true)}
        className="inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Refresh"
      >
        <RefreshCw className="h-3 w-3" />
      </button>)}
    </>
  )
}
