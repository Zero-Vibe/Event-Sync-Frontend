export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/speakers`)
    if (!res.ok) {
      return Response.json(
        { message: 'Failed to fetch speakers' },
        { status: res.status }
      )
    }
    const data = await res.json()
    return Response.json(data, { status: 200 })
  } catch {
    return Response.json({ message: 'Failed to fetch speakers' }, { status: 500 })
  }
}
