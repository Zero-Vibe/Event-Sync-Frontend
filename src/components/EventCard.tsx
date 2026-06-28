import Link from 'next/link';
import { CalendarDays, MapPin } from 'lucide-react';
import type { Event } from '../types';
import { isLive } from '../types';
import { formatDateRange } from '../utils/format';
import { LiveBadge } from './LiveBadge';

export function EventCard({ event }: { event: Event }) {
  const hasLive = event.sessions?.some((s) => isLive(s.startTime, s.endTime));

  return (
    <Link
      href={`/events/${event.id}`}
      className="card-hover group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-linear-to-br from-primary/10 via-card to-card">
        <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
        <div className="absolute inset-0 bg-linear-to-t from-card via-card/30 to-transparent" />
        {hasLive && (
          <div className="absolute left-4 top-4">
            <LiveBadge />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDateRange(event.startDateTime, event.endDateTime)}
        </div>
        <h3 className="text-lg font-semibold leading-snug tracking-tight">{event.title}</h3>
        {event.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
        )}
        <div className="mt-auto flex items-center border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{event.location}</span>
        </div>
      </div>
    </Link>
  );
}
