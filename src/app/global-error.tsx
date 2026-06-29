'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global Error:', error)
  }, [error])

  return (
    <html>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center max-w-md">
            <p className="text-sm font-medium text-muted-foreground">500</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Critical error
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              A critical error occurred. Please try reloading the page.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={reset}
                className="inline-flex h-9 items-center rounded-md bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:opacity-80"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
