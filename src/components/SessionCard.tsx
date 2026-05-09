import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { type Session, formatTime, getRoom, getSpeaker }from "../lib/modck-data";
import { LiveBadge } from "./Livebadge";
import { cn } from "../lib/utils";

const trackColors: Record<string, string> = {
  Infrastructure: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  AI: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  Design: "bg-pink-500/15 text-pink-300 border-pink-500/30",
  DevTools: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Security: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  Frontend: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Workshop: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
};

export function SessionCard({ session, showTime = true, compact = false }: { session: Session; showTime?: boolean; compact?: boolean }) {
  const room = getRoom(session.roomId);
  const speakerList = session.speakerIds.map(getSpeaker).filter(Boolean);
  const trackClass = trackColors[session.track] ?? "bg-muted text-muted-foreground border-border";

  return (
    <Link
      href={`/events/${session.eventId}/sessions/${session.id}`}
      className={cn(
        "card-hover group relative flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-5",
        session.isLive && "ring-1 ring-[color-mix(in_oklab,var(--live)_45%,transparent)]"
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {session.isLive && <LiveBadge />}
        <span className={cn("rounded-md border px-2 py-0.5 text-[11px] font-medium", trackClass)}>
          {session.track}
        </span>
        <span className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {session.level}
        </span>
      </div>

      <h3 className={cn("font-semibold leading-snug tracking-tight", compact ? "text-base" : "text-lg")}>
        {session.title}
      </h3>

      {!compact && (
        <p className="line-clamp-2 text-sm text-muted-foreground">{session.description}</p>
      )}

      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {showTime && (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {formatTime(session.startTime)} – {formatTime(session.endTime)}
          </span>
        )}
        {room && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {room.name}
          </span>
        )}
      </div>

      {speakerList.length > 0 && (
        <div className="flex items-center gap-2 pt-1">
          <div className="flex -space-x-2">
            {speakerList.map((s) => (
              <img key={s!.id} src={s!.avatar} alt={s!.name} className="h-6 w-6 rounded-full border-2 border-card object-cover" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{speakerList.map((s) => s!.name).join(", ")}</span>
        </div>
      )}
    </Link>
  );
}