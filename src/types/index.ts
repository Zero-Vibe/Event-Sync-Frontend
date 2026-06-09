export interface Room {
  id: string;
  name: string;
  sessions?: SessionSummary[];
}

export interface RoomCreate {
  name: string;
}

export interface SpeakerSummary {
  id?: string;
  firstName?: string;
  lastName?: string;
  pictureUrl?: string;
}

export interface Speaker {
  id: string;
  firstName: string;
  lastName: string;
  pictureUrl?: string;
  biography?: string;
  links?: string[];
  sessions?: SessionSummary[];
}

export interface SpeakerCreate {
  fullName: string;
  pictureUrl?: string;
  biography?: string;
  links?: string[];
}

export interface SessionSummary {
  id?: string;
  title?: string;
  startTime?: string;
  endTime?: string;
  isLive?: boolean;
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
  isLive?: boolean;
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
  authorName?: string | null;
  upvotes: number;
  createdAt: string;
  sessionId: string;
}

export interface QuestionCreate {
  content: string;
  authorName?: string | null;
}

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
