'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SessionCard } from '@/src/components/SessionCard';
import { PageLoader, ErrorMessage } from '@/src/components/ui';
import { useApi } from '@/src/hooks/useApi';
import { getSpeaker } from '@/src/api/speakers';

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            {speaker.pictureUrl ? (
              <img
                src={speaker.pictureUrl}
                alt={speaker.firstName}
                className="h-20 w-20 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-muted text-2xl font-semibold">
                {speaker.firstName + " " + speaker.lastName}
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Speaker</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                {speaker.firstName + " " + speaker.lastName}
              </h1>
              {speaker.links && speaker.links.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {speaker.links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {link.label || link.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        {speaker.biography && (
          <div>
            <h2 className="text-base font-semibold">Bio</h2>
            <p className="mt-3 leading-relaxed text-sm text-muted-foreground">
              {speaker.biography}
            </p>
          </div>
        )}

        {sessions.length > 0 && (
          <div>
            <h2 className="text-base font-semibold">Sessions</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {sessions.map((s) => (
                <SessionCard
                  key={s.id}
                  session={s}
                  eventId={(s as { eventId?: string }).eventId ?? ''}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
