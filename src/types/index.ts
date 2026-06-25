// ─── Session timing helpers ────────────────────────────────────────────────────
/** True when current time is between startTime and endTime (inclusive). */
export const isLive = (startTime?: string, endTime?: string): boolean => {
  if (!startTime || !endTime) return false;
  const now = Date.now();
  return now >= new Date(startTime).getTime() && now <= new Date(endTime).getTime();
};

/** True when current time is past endTime. */
export const isEnded = (endTime?: string): boolean => {
  if (!endTime) return false;
  return Date.now() > new Date(endTime).getTime();
};

/** True when current time is before startTime. */
export const isUpcoming = (startTime?: string): boolean => {
  if (!startTime) return false;
  return Date.now() < new Date(startTime).getTime();
};

// ─── Room ──────────────────────────────────────────────────────────────────────
export interface Room {
  id: string;
  name: string;
  sessions?: SessionSummary[];
}

export interface RoomCreate {
  name: string;
}

// ─── Speaker ───────────────────────────────────────────────────────────────────
export interface SpeakerSummary {
  id?: string;
  firstName?: string;
  lastName?: string;
  pictureUrl?: string;
}

export interface SpeakerLink {
  id: string;
  platform: string;
  url: string;
  label: string;
  speakerId: string;
}

export interface Speaker {
  id: string;
  firstName: string;
  lastName: string;
  pictureUrl?: string;
  biography?: string;
  links: SpeakerLink[];
  sessions?: SessionSummary[];
}

export interface SpeakerCreate {
  fullName: string;
  pictureUrl?: string;
  biography?: string;
  links?: string[];
}

// ─── Session ───────────────────────────────────────────────────────────────────
export interface SessionSummary {
  id?: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  room?: Room;
  speakers?: SpeakerSummary[];
}

export interface Session {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  capacity?: number;
  room: Room;
  speakers: SpeakerSummary[];
  eventId: string;
}

export interface SessionCreate {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  capacity?: number;
  roomId: string;
  speakerIds: string[];
}

// ─── Event ─────────────────────────────────────────────────────────────────────
export interface Event {
  id: string;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  sessions?: SessionSummary[];
}

export interface EventCreate {
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
}

export interface Question {
  id: string;
  content: string;
  user?: { id: string; name: string; email?: string } | null;
  upvotes: number;
  createdAt: string;
  sessionId: string;
}

export interface QuestionCreate {
  content: string;
  isAnonymous: boolean;
}

// ─── Auth ──────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  accessToken?: string;
  tokenType?: string;
  expiresIn?: number;
}

export interface ApiError {
  code: number;
  message: string;
}
