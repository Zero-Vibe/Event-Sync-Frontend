'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useToastStore, type ToastType } from '@/src/stores/toast.store'

const styles: Record<ToastType, { border: string; bg: string; text: string }> = {
  error: {
    border: 'border-destructive/40',
    bg: 'bg-destructive/10',
    text: 'text-destructive',
  },
  success: {
    border: 'border-emerald-400/40',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  info: {
    border: 'border-blue-400/40',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
  },
}

function ToastItem({
  id,
  message,
  type,
  duration,
}: {
  id: string
  message: string
  type: ToastType
  duration: number
}) {
  const removeToast = useToastStore((s) => s.removeToast)

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), duration)
    return () => clearTimeout(timer)
  }, [id, duration, removeToast])

  const s = styles[type]

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start gap-2 rounded-lg border ${s.border} ${s.bg} px-4 py-3 text-sm shadow-sm animate-in slide-in-from-right-2`}
    >
      <p className={`flex-1 ${s.text}`}>{message}</p>
      <button
        onClick={() => removeToast(id)}
        className={`shrink-0 opacity-60 hover:opacity-100 transition-opacity ${s.text}`}
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function Toast() {
  const toasts = useToastStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  )
}
