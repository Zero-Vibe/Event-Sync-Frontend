"use client";

import Link from "next/link";
import { MapPin, Users, ArrowLeft } from "lucide-react";
import { rooms } from "@/src/data/mock";
import { sessionsForRoom } from "@/src/data/queries";

export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative border-b border-border/60">
        <div className="absolute inset-0 bg-radial-violet opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All events
          </Link>
          <p className="mt-6 text-sm font-medium text-primary">Venue</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">Rooms</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {rooms.length} rooms across the venue.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((r) => {
            const count = sessionsForRoom(r.id).length;
            return (
              <Link
                key={r.id}
                href={`/rooms/${r.id}`}
                className="card-hover rounded-2xl border border-border bg-card p-6"
              >
                <h3 className="text-lg font-semibold">{r.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.floor}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{count} sessions</span>
                  <span>Capacity {r.capacity}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
