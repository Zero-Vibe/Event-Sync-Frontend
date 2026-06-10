import Link from 'next/link';
import { CalendarDays, MapPin } from 'lucide-react';
import type { Event } from '../types';
import { isLive as statusIsLive } from '../types';
import { formatDateRange } from '../utils/format';
import { LiveBadge } from './LiveBadge';

export function EventCard({ event }: { event: Event }) {
  const hasLive = event.sessions?.some((s) => statusIsLive(s.status));

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-sm"
    >
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDateRange(event.startDateTime, event.endDateTime)}
          </div>
          {hasLive && <LiveBadge />}
        </div>
        <h3 className="text-base font-semibold leading-snug tracking-tight">
          {event.title}
        </h3>
        {event.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {event.description}
          </p>
        )}
        <div className="mt-auto flex items-center gap-1.5 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {event.location}
        </div>
      </div>
    </Link>
  );
}
