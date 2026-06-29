'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('SSR Error:', error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-sm font-medium text-muted-foreground">500</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          An unexpected error occurred. Please try again or return home.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex h-9 items-center rounded-md bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:opacity-80"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-9 items-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-accent/40"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
