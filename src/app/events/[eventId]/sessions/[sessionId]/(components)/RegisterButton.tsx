'use client'

import { useAuthStore } from '@/src/stores/auth.store'
import { useRegistrationStore } from '@/src/stores/registration.store'
import { useToastStore } from '@/src/stores/toast.store'

export function RegisterButton({ eventId, sessionId }: { eventId: string; sessionId: string }) {
  const { token } = useAuthStore()
  const { toggle, isRegistered } = useRegistrationStore()
  const addToast = useToastStore((s) => s.addToast)

  const handleRegister = async () => {
    const response = await fetch(`/api/events/${eventId}/sessions/${sessionId}/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      }
    })
    if (response.ok) toggle(sessionId)
    else addToast('Failed to register.')
  }

  const handleUnregister = async () => {
    const response = await fetch(`/api/events/${eventId}/sessions/${sessionId}/register`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      }
    })
    if (response.ok) toggle(sessionId)
    else addToast('Failed to unregister.')
  }

  const registered = isRegistered(sessionId)

  return (
    <button
      className={`inline-flex w-fit h-8 shrink-0 items-center rounded-md px-5 py-4 text-[13px] font-medium transition-colors ${
        registered
          ? "border border-border text-muted-foreground hover:border-destructive hover:text-destructive"
          : "bg-foreground text-background hover:opacity-80"
      }`}
      onClick={() => (registered ? handleUnregister() : handleRegister())}
    >
      {registered ? "Unregister" : "Register"}
    </button>
  )
}
