// ─── Session status ────────────────────────────────────────────────────────────
export enum SessionStatus {
  PUBLISHED = 'PUBLISHED',
  LIVE      = 'LIVE',
  ENDED     = 'ENDED',
}

export const isLive   = (s?: SessionStatus) => s === SessionStatus.LIVE;
export const isEnded  = (s?: SessionStatus) => s === SessionStatus.ENDED;

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
  /** Replaces isLive boolean */
  status?: SessionStatus;
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
  /** Replaces isLive boolean */
  status?: SessionStatus;
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

// ─── Question ──────────────────────────────────────────────────────────────────
export interface Question {
  id: string;
  content: string;
  authorName?: string | null;
  upvotes: number;
  createdAt: string;
  sessionId: string;
}

export interface QuestionCreate {
  content: string;
  authorName?: string | null;
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
