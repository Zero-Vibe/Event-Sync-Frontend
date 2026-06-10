'use client';

import Link from 'next/link';
import { useApi } from '@/src/hooks/useApi';
import { getRooms, getRoom } from '@/src/api/rooms';
import { PageLoader, ErrorMessage } from '@/src/components/ui';
import { useEffect, useState } from "react";
import { Room } from "../../types"



export default function RoomsPage() {
  const { data: rooms, loading, error } = useApi(getRooms);

  const [roomDetails, setRoomDetails] = useState<Record<number, Room>>({});

  useEffect(() => {
    async function loadDetails() {
      if (!rooms) return;

      const details = await Promise.all(
        rooms.map(async (room) => ({
          id: room.id,
          data: await getRoom(room.id),
        }))
      );

      setRoomDetails(
        Object.fromEntries(details.map(d => [d.id, d.data]))
      );
    }

    loadDetails();
  }, [rooms]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">Venue</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Rooms</h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {loading && <PageLoader />}
        {error && <ErrorMessage message={error} />}
        {rooms && rooms.length === 0 && (
          <p className="text-sm text-muted-foreground">No rooms available.</p>
        )}
        {rooms && rooms.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((r) => (
              <Link
                key={r.id}
                href={`/rooms/${r.id}`}
                className="rounded-xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-sm"
              >
                <h3 className="font-semibold">{r.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  { roomDetails[r.id]?.sessions?.length ?? 0 } sessions
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
