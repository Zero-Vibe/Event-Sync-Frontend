import Link from "next/link";
import type { Speaker } from "../types";

export function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <Link href={`/speakers/${speaker.id}`} className="card-hover group flex items-center gap-4 rounded-xl border border-border/70 bg-card p-4">
      <img src={speaker["base64Picture"]} alt={speaker.firstName} className="h-14 w-14 rounded-full object-cover ring-2 ring-border" />
      <div className="min-w-0 flex-1">
        <h4 className="truncate font-semibold tracking-tight">{speaker.firstName + " " + speaker.lastName}</h4>
        <p className="truncate text-xs text-muted-foreground">{speaker.biography}</p>
      </div>
    </Link>
  );
}