import { create } from 'zustand'

export type ToastType = 'error' | 'success' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration: number
}

interface ToastState {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType, duration?: number) => void
  removeToast: (id: string) => void
}

let nextId = 0

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'error', duration = 4000) => {
    const id = String(++nextId)
    set((s) => ({ toasts: [...s.toasts, { id, message, type, duration }] }))
  },
  removeToast: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
  },
}))
