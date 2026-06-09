import type { Event, EventCreate } from '../../types';
import { customFetch } from './client';

export const getEvents = (): Promise<Event[]> =>
  customFetch<Event[]>('/events');

export const getEvent = (eventId: string): Promise<Event> =>
  customFetch<Event>(`/events/${eventId}`);

export const createEvent = (data: EventCreate): Promise<Event> =>
  customFetch<Event>('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateEvent = (eventId: string, data: EventCreate): Promise<Event> =>
  customFetch<Event>(`/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteEvent = (eventId: string): Promise<void> =>
  customFetch<void>(`/events/${eventId}`, { method: 'DELETE' });
