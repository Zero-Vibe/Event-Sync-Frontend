import Link from 'next/link';
import { Clock, MapPin, Bookmark } from 'lucide-react';
import type { Session, SessionSummary } from '../types';
import { isLive, isEnded } from '../types';
import { formatTime } from '../utils/format';
import { LiveBadge } from './LiveBadge';
import { useFavoritesStore } from '../stores/favorite.store';

type AnySession = Session | SessionSummary;

export function SessionCard({
  session,
  eventId,
  compact = false,
}: {
  session: AnySession;
  eventId: string;
  compact?: boolean;
}) {
  const id         = session.id ?? '';
  const title      = session.title ?? 'Untitled session';
  const startTime  = session.startTime;
  const endTime    = session.endTime;
  const live       = isLive(startTime, endTime);
  const ended      = isEnded(endTime);
  const room       = session.room;
  const speakers   = session.speakers ?? [];
  const description = 'description' in session ? (session as Session).description : undefined;

  const { toggle, isFavorite } = useFavoritesStore();
  const saved = isFavorite(id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(id);
  };

  return (
    <Link
      href={`/events/${eventId}/sessions/${id}`}
      data-live={live}
      data-ended={ended}
      className="group relative flex flex-col gap-2 rounded-xl border border-border/70 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-sm data-[live=true]:border-[color-mix(in_oklab,var(--live)_35%,transparent)]"
    >
      {/* Bookmark button */}
      <button
        onClick={handleBookmark}
        aria-label={saved ? 'Remove from agenda' : 'Save to agenda'}
        data-saved={saved}
        className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground data-[saved=true]:text-foreground"
      >
        <Bookmark
          className="h-4 w-4 transition-all"
          fill={saved ? 'currentColor' : 'none'}
        />
      </button>

      <div className="flex items-center gap-2 pr-8">
        {live && <LiveBadge />}
        {!live && ended && (
          <span className="inline-flex items-center rounded-full border border-border/60 px-2 py-0.5 text-xs text-muted-foreground">
            Ended
          </span>
        )}
      </div>

      <h3 className="pr-8 font-medium leading-snug tracking-tight text-sm">{title}</h3>

      {!compact && description && (
        <p className="line-clamp-2 text-xs text-muted-foreground">{description}</p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {startTime && endTime && (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {formatTime(startTime)} – {formatTime(endTime)}
          </span>
        )}
        {room && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            {room.name}
          </span>
        )}
      </div>

      {speakers.length > 0 && (
        <div className="flex items-center gap-2 pt-1">
          {speakers.slice(0, 3).map((s) =>
            s["base64Picture"] ? (
              <img
                key={s.id}
                src={s["base64Picture"]}
                alt={s.firstName ?? ''}
                className="h-5 w-5 rounded-full border border-border object-cover"
              />
            ) : (
              <div
                key={s.id}
                className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-muted text-[9px] font-medium"
              >
                {(s.firstName?.[0] ?? '') + (s.lastName?.[0] ?? '')}
              </div>
            )
          )}
          <span className="text-xs text-muted-foreground">
            {speakers.map((s) => s.firstName).join(', ')}
          </span>
        </div>
      )}
    </Link>
  );
}
