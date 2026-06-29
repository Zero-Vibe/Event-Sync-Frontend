import { headers } from "next/headers"

export async function GET(request: Request, { params }: { params: Promise<{ eventId: string, sessionId: string }> }) {
    const { eventId, sessionId } = await params;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/sessions/${sessionId}/register`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json();
        if (!res.ok) {
            return Response.json(
                { message: data.message || "Failed to get registration count" }
                , { status: res.status })
        }

        return Response.json({ count: data }, { status: 200 });
    } catch (err) {
        return Response.json({ message: 'Failed to get registration count' }, { status: 500 });
    }
}

export async function POST(request: Request, { params }: { params: Promise<{ eventId: string, sessionId: string }> }) {
    const requestHeaders = await headers()
    const authorization = requestHeaders.get("Authorization") || ""
    const { eventId, sessionId } = await params;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/sessions/${sessionId}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authorization
            }
        })

        if (response.ok || response.status === 409) {
            return Response.json({}, { status: 200 })
        }
        
        const data = await response.json()
        return Response.json({ message: data.message }, { status: response.status })
    } catch {
        return Response.json({ message: "Failed to register" }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ eventId: string, sessionId: string }> }) {
    const requestHeaders = await headers()
    const authorization = requestHeaders.get("Authorization") || ""
    const { eventId, sessionId } = await params;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/sessions/${sessionId}/register`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: authorization
            }
        })

        if (response.ok || response.status === 404) {
            return Response.json({}, { status: 200 })
        }

        const data = await response.json()
        return Response.json({ message: data.message }, { status: response.status })
    } catch {
        return Response.json({ message: "Failed to unregister" }, { status: 500 })
    }
} 