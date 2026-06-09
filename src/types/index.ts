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
  fullName?: string;
  profilePicture?: string;
}

export interface Speaker {
  id: string;
  fullName: string;
  profilePicture?: string;
  biography?: string;
  externalLinks?: string[];
  sessions?: SessionSummary[];
}

export interface SpeakerCreate {
  fullName: string;
  profilePicture?: string;
  biography?: string;
  externalLinks?: string[];
}

export interface SessionSummary {
  id?: string;
  title?: string;
  starttime?: string;
  endtime?: string;
  isLive?: boolean;
  room?: Room;
  speakers?: SpeakerSummary[];
}

export interface Session {
  id: string;
  title: string;
  description?: string;
  starttime: string;
  endtime: string;
  capacity?: number;
  isLive?: boolean;
  room: Room;
  speakers: SpeakerSummary[];
  eventId: string;
}

export interface SessionCreate {
  title: string;
  description?: string;
  starttime: string;
  endtime: string;
  capacity?: number;
  roomId: string;
  speakerIds: string[];
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  location: string;
  sessions?: SessionSummary[];
}

export interface EventCreate {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
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
