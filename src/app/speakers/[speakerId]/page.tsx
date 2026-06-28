'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, XIcon, GitBranch, Link2Icon, Globe } from 'lucide-react';
import { SessionCard } from '@/src/components/SessionCard';
import { PageLoader, ErrorMessage } from '@/src/components/ui';
import { useApi } from '@/src/hooks/useApi';
import { getSpeaker } from '@/src/api/speakers';

const platformIcon: Record<string, typeof XIcon> = {
  twitter: XIcon, x: XIcon, github: GitBranch, git: GitBranch, linkedin: Link2Icon, website: Globe,
};

export default function SpeakerDetailPage({
  params,
}: {
  params: Promise<{ speakerId: string }>;
}) {
  const { speakerId } = use(params);
  const { data: speaker, loading, error } = useApi(
    () => getSpeaker(speakerId),
    [speakerId]
  );

  if (loading) return <PageLoader />;
  if (error)
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorMessage message={error} />
      </div>
    );
  if (!speaker) return null;

  const sessions = speaker.sessions ?? [];
  const socialLinks = speaker.links?.filter(Boolean) ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative border-b border-border/60">
        <div className="absolute inset-0 bg-radial-violet opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-center">
            {speaker["base64Picture"] ? (
              <img src={speaker["base64Picture"]} alt={speaker.firstName} className="h-32 w-32 rounded-2xl object-cover ring-2 ring-border sm:h-40 sm:w-40" />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-muted text-2xl font-semibold ring-2 ring-border sm:h-40 sm:w-40">
                {(speaker.firstName?.[0] ?? '') + (speaker.lastName?.[0] ?? '')}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-primary">Speaker</p>
              <h1 className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">
                {speaker.firstName + ' ' + speaker.lastName}
              </h1>
              {speaker.biography && <p className="mt-2 text-lg text-muted-foreground">{speaker.biography}</p>}
              {socialLinks.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {socialLinks.map((link) => {
                    const Icon = platformIcon[link.platform.toLowerCase()] ?? Link2Icon;
                    return (
                      <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                        <Icon className="h-3.5 w-3.5" /> {link.label || link.platform}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {sessions.length > 0 && (
          <>
            <h2 className="mt-12 text-xl font-semibold tracking-tight">Sessions</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {sessions.map((s) => (
                <SessionCard key={s.id} session={s} eventId={(s as { eventId?: string }).eventId ?? ''} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
