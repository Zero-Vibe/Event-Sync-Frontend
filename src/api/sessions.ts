import type { Session, SessionCreate } from '../types/index';
import { customFetch } from './client';

export const getSessions = (
  eventId: string,
  params?: { roomId?: string; live?: boolean }
): Promise<Session[]> => {
  const qs = new URLSearchParams();
  if (params?.roomId) qs.set('roomId', params.roomId);
  if (params?.live !== undefined) qs.set('live', String(params.live));
  const q = qs.toString();
  return customFetch<Session[]>(
    `/events/${eventId}/sessions${q ? `?${q}` : ''}`
  );
};

export const getSession = (eventId: string, sessionId: string): Promise<Session> =>
  customFetch<Session>(`/events/${eventId}/sessions/${sessionId}`);

export const createSession = (eventId: string, data: SessionCreate): Promise<Session> =>
  customFetch<Session>(`/events/${eventId}/sessions`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateSession = (
  eventId: string,
  sessionId: string,
  data: SessionCreate
): Promise<Session> =>
  customFetch<Session>(`/events/${eventId}/sessions/${sessionId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteSession = (eventId: string, sessionId: string): Promise<void> =>
  customFetch<void>(`/events/${eventId}/sessions/${sessionId}`, {
    method: 'DELETE',
  });
