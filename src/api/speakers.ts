import type { Speaker, SpeakerCreate, SpeakerSummary } from '../types/index';
import { customFetch } from './client';

export const getSpeakers = (): Promise<SpeakerSummary[]> =>
  customFetch<SpeakerSummary[]>('/speakers');

export const getSpeaker = (speakerId: string): Promise<Speaker> =>
  customFetch<Speaker>(`/speakers/${speakerId}`);

export const createSpeaker = (data: SpeakerCreate): Promise<Speaker> =>
  customFetch<Speaker>('/speakers', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateSpeaker = (speakerId: string, data: SpeakerCreate): Promise<void> =>
  customFetch<void>(`/speakers/${speakerId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteSpeaker = (speakerId: string): Promise<void> =>
  customFetch<void>(`/speakers/${speakerId}`, { method: 'DELETE' });
