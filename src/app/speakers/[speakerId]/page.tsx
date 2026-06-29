'use cache'

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SpeakerSessions } from './(components)/SpeakerSessions';
import { Speaker, SpeakerLink } from '@/src/types';
import { cacheLife } from 'next/cache';

export default async function SpeakerDetailPage({
  params,
}: {
  params: Promise<{ speakerId: string }>
}) {
  cacheLife({ stale: 60 * 60 * 24, revalidate: 60 * 60 * 12, expire: 60 * 60 * 24 * 7 })
  const { speakerId } = await params;

  const speakerRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/speakers/${speakerId}`);
  if (!speakerRes.ok) throw new Error("Failed to fetch speaker");

  const speaker = await speakerRes.json();
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
            {speaker["base64Picture"] ? (
              <img
                src={speaker["base64Picture"]}
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
                  {speaker.links.map((link: SpeakerLink) => (
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

        <div>
          <h2 className="text-base font-semibold">Sessions</h2>
          <div className="mt-4">
            <SpeakerSessions speakerId={speakerId} />
          </div>
        </div>
      </section>
    </div>
  )
}
