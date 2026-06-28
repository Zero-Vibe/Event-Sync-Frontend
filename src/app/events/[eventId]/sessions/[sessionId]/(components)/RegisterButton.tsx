'use client'

import { useAuthStore } from '@/src/stores/auth.store'
import { useRegistrationStore } from '@/src/stores/registration.store'

export function RegisterButton({ eventId, sessionId }: { eventId: string; sessionId: string }) {
  const { token } = useAuthStore()
  const { toggle, isRegistered } = useRegistrationStore()

  const handleRegister = async () => {
    const response = await fetch(`/api/events/${eventId}/sessions/${sessionId}/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      }
    })
    if (response.ok) toggle(sessionId)
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
  }

  const registered = isRegistered(sessionId)

  return (
    <button
      className={`inline-flex h-8 shrink-0 items-center rounded-md px-3 text-xs font-medium transition-colors ${
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
