export async function GET(
  request: Request,
  { params }: { params: Promise<{ speakerId: string }> }
) {
  const { speakerId } = await params

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/speakers/${speakerId}/sessions`
    )
    if (!res.ok) {
      return Response.json(
        { message: 'Failed to fetch speaker sessions' },
        { status: res.status }
      )
    }
    const data = await res.json()
    return Response.json(data, { status: 200 })
  } catch {
    return Response.json({ message: 'Failed to fetch speaker sessions' }, { status: 500 })
  }
}
