"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Twitter, Github, Linkedin, Globe } from "lucide-react";
import { SessionCard } from "@/src/components/SessionCard";
import { sessionsForSpeaker ,getSpeaker} from '../../../lib/modck-data';

export default function SpeakerDetailPage({ params }: { params: Promise<{ speakerId: string }> }) {
  const { speakerId } = use(params);
  const speaker = getSpeaker(speakerId);
  const sessions = sessionsForSpeaker(speakerId);

  if (!speaker) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-semibold">Speaker not found</h1>
          <Link href="/" className="mt-4 inline-block text-primary hover:underline">← Home</Link>
        </div>
      </div>
    );
  }

  const social = [
    speaker.twitter && { icon: Twitter, label: speaker.twitter, href: `https://twitter.com/${speaker.twitter}` },
    speaker.github && { icon: Github, label: speaker.github, href: `https://github.com/${speaker.github}` },
    speaker.linkedin && { icon: Linkedin, label: speaker.linkedin, href: `https://linkedin.com/in/${speaker.linkedin}` },
    speaker.website && { icon: Globe, label: speaker.website, href: `https://${speaker.website}` },
  ].filter(Boolean) as { icon: typeof Twitter; label: string; href: string }[];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative border-b border-border/60">
        <div className="absolute inset-0 bg-radial-violet opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-center">
            <img src={speaker.avatar} alt={speaker.name} className="h-32 w-32 rounded-2xl object-cover ring-2 ring-border sm:h-40 sm:w-40" />
            <div>
              <p className="text-sm font-medium text-primary">Speaker</p>
              <h1 className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">{speaker.name}</h1>
              <p className="mt-2 text-lg text-muted-foreground">{speaker.title} · {speaker.company}</p>
              {social.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {social.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                      <s.icon className="h-3.5 w-3.5" /> {s.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold tracking-tight">Bio</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">{speaker.bio}</p>
        <h2 className="mt-12 text-xl font-semibold tracking-tight">Sessions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {sessions.map((s) => <SessionCard key={s.id} session={s} />)}
        </div>
      </section>
    </div>
  );
}