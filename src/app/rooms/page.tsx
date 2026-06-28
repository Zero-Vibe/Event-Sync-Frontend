'use cache';

import Link from 'next/link';
import { Room } from "../../types"
import { cacheLife } from 'next/cache';

export default async function RoomsPage() {
  cacheLife({ stale: 60 * 60 * 12, revalidate: 60 * 60 * 3, expire: 60 * 60 * 24 })

  const roomsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`);

  if (!roomsRes.ok) throw new Error("Failed to fetch rooms");
  const rooms = await roomsRes.json();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">Venue</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Rooms</h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {rooms && rooms.length === 0 && (
          <p className="text-sm text-muted-foreground">No rooms available.</p>
        )}
        {rooms && rooms.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map(async (r: Room) => {
              const roomWithDetailsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${r.id}`);
              let roomDetails: Room | null = null;
              if (roomWithDetailsRes.ok) {
                roomDetails = await roomWithDetailsRes.json();
              }
              return (
                <Link
                  key={r.id}
                  href={`/rooms/${r.id}`}
                  className="rounded-xl border border-border/70 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-sm"
                >
                  <h3 className="font-semibold">{r.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {roomDetails?.sessions?.length ?? 0} sessions
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  );
}
