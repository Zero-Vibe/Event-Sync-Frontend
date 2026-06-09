import Link from 'next/link';
import { Clock, MapPin } from 'lucide-react';
import type { Session, SessionSummary } from '../types';
import { formatTime } from '../utils/format';
import { LiveBadge } from './LiveBadge';

type AnySession = Session | SessionSummary;

function isFullSession(s: AnySession): s is Session {
  return 'startTime' in s && typeof (s as Session).startTime === 'string';
}

export function SessionCard({
  session,
  eventId,
  compact = false,
}: {
  session: AnySession;
  eventId: string;
  compact?: boolean;
}) {
  const id = session.id ?? '';
  const title = session.title ?? 'Untitled session';
  const isLive = session.isLive;
  const room = session.room;
  const speakers = session.speakers ?? [];

  const startTime = isFullSession(session) ? session.startTime : session.startTime;
  const endTime = isFullSession(session) ? session.endTime : session.endTime;
  const description = isFullSession(session) ? session.description : undefined;

  return (
    <Link
      href={`/events/${eventId}/sessions/${id}`}
      data-live={isLive}
      className="group flex flex-col gap-2 rounded-xl border border-border/70 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-sm data-[live=true]:border-[color-mix(in_oklab,var(--live)_35%,transparent)]"
    >
      <div className="flex items-center gap-2">
        {isLive && <LiveBadge />}
      </div>

      <h3 className="font-medium leading-snug tracking-tight text-sm">
        {title}
      </h3>

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
            s.pictureUrl ? (
              <img
                key={s.id}
                src={s.pictureUrl}
                alt={s.fullName ?? ''}
                className="h-5 w-5 rounded-full border border-border object-cover"
              />
            ) : (
              <div
                key={s.id}
                className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-muted text-[9px] font-medium"
              >
                {s.fullName?.[0] ?? '?'}
              </div>
            )
          )}
          <span className="text-xs text-muted-foreground">
            {speakers.map((s) => s.fullName).join(', ')}
          </span>
        </div>
      )}
    </Link>
  );
}
