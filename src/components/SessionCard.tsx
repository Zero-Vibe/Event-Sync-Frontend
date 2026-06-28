import Link from 'next/link';
import { Clock, MapPin, Bookmark } from 'lucide-react';
import type { Session, SessionSummary } from '../types';
import { isLive, isEnded } from '../types';
import { formatTime } from '../utils/format';
import { LiveBadge } from './LiveBadge';
import { useFavoritesStore } from '../stores/favorite.store';

type AnySession = Session | SessionSummary;

const trackColors: Record<string, string> = {
  Infrastructure: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  AI: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  Design: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
  DevTools: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Security: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  Frontend: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Workshop: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
};

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
      className="card-hover group relative flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-5 data-[live=true]:ring-1 data-[live=true]:ring-[color-mix(in_oklab,var(--live)_45%,transparent)]"
    >
      <button
        onClick={handleBookmark}
        aria-label={saved ? 'Remove from agenda' : 'Save to agenda'}
        data-saved={saved}
        className="absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground data-[saved=true]:text-foreground"
      >
        <Bookmark className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
      </button>

      <div className="flex flex-wrap items-center gap-2 pr-8">
        {live && <LiveBadge />}
        {!live && ended && (
          <span className="inline-flex items-center rounded-full border border-border/60 px-2 py-0.5 text-xs text-muted-foreground">Ended</span>
        )}
      </div>

      <h3 data-compact={compact} className="font-semibold leading-snug tracking-tight data-[compact=true]:text-base data-[compact=false]:text-lg pr-8">
        {title}
      </h3>

      {!compact && description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {startTime && endTime && (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {formatTime(startTime)} – {formatTime(endTime)}
          </span>
        )}
        {room && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {room.name}
          </span>
        )}
      </div>

      {speakers.length > 0 && (
        <div className="flex items-center gap-2 pt-1">
          <div className="flex -space-x-2">
            {speakers.slice(0, 3).map((s) =>
              s["base64Picture"] ? (
                <img key={s.id} src={s["base64Picture"]} alt={s.firstName ?? ''} className="h-6 w-6 rounded-full border-2 border-card object-cover" />
              ) : (
                <div key={s.id} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[9px] font-medium">
                  {(s.firstName?.[0] ?? '') + (s.lastName?.[0] ?? '')}
                </div>
              )
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {speakers.map((s) => s.firstName).join(', ')}
          </span>
        </div>
      )}
    </Link>
  );
}
