import { speakers, sessions, rooms, events } from "@/src/data/mock";

export const getEvent = (id: string) => events.find((e) => e.id === id);
export const getSession = (id: string) => sessions.find((s) => s.id === id);
export const getSpeaker = (id: string) => speakers.find((s) => s.id === id);
export const getRoom = (id: string) => rooms.find((r) => r.id === id);
export const sessionsForEvent = (eventId: string) => sessions.filter((s) => s.eventId === eventId);
export const sessionsForRoom = (roomId: string) => sessions.filter((s) => s.roomId === roomId);
export const sessionsForSpeaker = (speakerId: string) =>
  sessions.filter((s) => s.speakerIds.includes(speakerId));
