import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import type { EventItem } from "../types";
import { formatDateRange } from "../utils/format";
import { LiveBadge } from "./Livebadge";

export function EventCard({ event }: { event: EventItem }) {
  return (
    <Link href={`/events/${event.id}`} className="card-hover group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={event.cover} alt={event.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        {event.isLive && (
          <div className="absolute left-4 top-4">
            <LiveBadge />
          </div>
        )}
        <div className="absolute bottom-3 right-3 rounded-md border border-white/10 bg-black/40 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
          {event.tracks.length} tracks
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDateRange(event.startDate, event.endDate)}
        </div>
        <h3 className="text-lg font-semibold leading-snug tracking-tight">{event.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{event.tagline}</p>
        <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{event.city}</span>
          <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{event.attendees.toLocaleString()} attending</span>
        </div>
      </div>
    </Link>
  );
}