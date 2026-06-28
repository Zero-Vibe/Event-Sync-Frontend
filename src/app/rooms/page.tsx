'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useApi } from '@/src/hooks/useApi';
import { getRooms, getRoom } from '@/src/api/rooms';
import { PageLoader, ErrorMessage } from '@/src/components/ui';
import { useEffect, useState } from "react";
import { Room } from "../../types"

export default function RoomsPage() {
  const { data: rooms, loading, error } = useApi(getRooms);

  const [roomDetails, setRoomDetails] = useState<Record<string, Room>>({});

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
      <section className="relative border-b border-border/60">
        <div className="absolute inset-0 bg-radial-violet opacity-15 dark:opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All events
          </Link>
          <p className="mt-6 text-sm font-medium text-primary">Venue</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Rooms</h1>
          {rooms && (
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {rooms.length} rooms across the venue.
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
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
                className="card-hover rounded-2xl border border-border bg-card p-6"
              >
                <h3 className="text-lg font-semibold">{r.name}</h3>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{roomDetails[r.id]?.sessions?.length ?? 0} sessions</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
