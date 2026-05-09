export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  sessionIds: string[];
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  floor: string;
  color: string;
}

export interface Question {
  id: string;
  author: string;
  text: string;
  upvotes: number;
  createdAt: string;
}

export interface Session {
  id: string;
  eventId: string;
  title: string;
  description: string;
  speakerIds: string[];
  roomId: string;
  startTime: string;
  endTime: string;
  track: string;
  level: Level;
  isLive?: boolean;
  capacityFilled: number;
  questions?: Question[];
}

export interface EventItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  city: string;
  cover: string;
  attendees: number;
  tracks: string[];
  isLive?: boolean;
}

export type Level = "Beginner" | "Intermediate" | "Advanced";
