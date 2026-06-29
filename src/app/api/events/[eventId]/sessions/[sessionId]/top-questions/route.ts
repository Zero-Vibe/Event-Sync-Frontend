export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string; sessionId: string }> }
) {
  const { eventId, sessionId } = await params

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/sessions/${sessionId}/top-questions`
    )
    if (!res.ok) {
      return Response.json(
        { message: 'Failed to fetch top questions' },
        { status: res.status }
      )
    }
    const data = await res.json()
    return Response.json(data, { status: 200 })
  } catch {
    return Response.json({ message: 'Failed to fetch top questions' }, { status: 500 })
  }
}
