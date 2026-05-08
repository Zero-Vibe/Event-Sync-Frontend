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
  startTime: string; // ISO
  endTime: string;
  track: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  isLive?: boolean;
  capacityFilled: number; // 0-100
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

export const speakers: Speaker[] = [
  {
    id: "s1",
    name: "Maya Patel",
    title: "Principal Engineer",
    company: "Stripe",
    bio: "Maya leads infrastructure for payment systems at Stripe. She's spoken at QCon and Strange Loop about distributed consensus and building resilient systems at scale.",
    avatar: "https://i.pravatar.cc/300?img=47",
    twitter: "mayap",
    github: "mayap",
    linkedin: "mayapatel",
    sessionIds: ["sess-1", "sess-7"],
  },
  {
    id: "s2",
    name: "Daniel Okafor",
    title: "Staff AI Researcher",
    company: "Anthropic",
    bio: "Daniel works on alignment and interpretability. Previously at DeepMind, he co-authored seminal papers on RLHF and constitutional AI methods.",
    avatar: "https://i.pravatar.cc/300?img=12",
    twitter: "danokafor",
    website: "danokafor.dev",
    sessionIds: ["sess-2"],
  },
  {
    id: "s3",
    name: "Liu Wei",
    title: "VP of Design",
    company: "Linear",
    bio: "Liu has shaped product design at Linear, Notion, and Figma. She writes about systems thinking, taste, and the craft of building software.",
    avatar: "https://i.pravatar.cc/300?img=44",
    twitter: "liuweidesign",
    sessionIds: ["sess-3", "sess-8"],
  },
  {
    id: "s4",
    name: "Marcus Reyes",
    title: "Founder & CEO",
    company: "Resend",
    bio: "Marcus is a serial founder building developer tools. He's passionate about API design, indie hacking, and the future of email.",
    avatar: "https://i.pravatar.cc/300?img=33",
    twitter: "marcusreyes",
    github: "mreyes",
    sessionIds: ["sess-4"],
  },
  {
    id: "s5",
    name: "Sofia Bergmann",
    title: "Security Lead",
    company: "Cloudflare",
    bio: "Sofia hunts vulnerabilities and builds defenses for edge networks. Frequent contributor to OWASP and Black Hat speaker.",
    avatar: "https://i.pravatar.cc/300?img=23",
    twitter: "sofiasec",
    sessionIds: ["sess-5"],
  },
  {
    id: "s6",
    name: "Arjun Mehta",
    title: "Open Source Maintainer",
    company: "Vercel",
    bio: "Core contributor to Next.js. Arjun cares deeply about developer experience, build performance, and React internals.",
    avatar: "https://i.pravatar.cc/300?img=15",
    twitter: "arjunm",
    github: "arjun-mehta",
    sessionIds: ["sess-6"],
  },
];

export const rooms: Room[] = [
  { id: "r1", name: "Aurora Hall", capacity: 800, floor: "Ground floor", color: "violet" },
  { id: "r2", name: "Nebula Stage", capacity: 400, floor: "Level 2", color: "emerald" },
  { id: "r3", name: "Pulsar Room", capacity: 200, floor: "Level 2", color: "amber" },
  { id: "r4", name: "Quantum Lab", capacity: 80, floor: "Level 3", color: "rose" },
];

const today = new Date();
const iso = (h: number, m = 0, dayOffset = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

export const sessions: Session[] = [
  {
    id: "sess-1",
    eventId: "e1",
    title: "Designing Payment Systems for a Billion Users",
    description:
      "A deep dive into how modern payment infrastructure handles consistency, latency, and resilience at planetary scale. We'll walk through the architectural tradeoffs behind moving trillions of dollars annually, from idempotency keys to multi-region failover.",
    speakerIds: ["s1"],
    roomId: "r1",
    startTime: iso(9, 0),
    endTime: iso(9, 50),
    track: "Infrastructure",
    level: "Advanced",
    isLive: true,
    capacityFilled: 87,
    questions: [
      { id: "q1", author: "Jordan", text: "How do you handle reconciliation when a downstream provider goes silent?", upvotes: 42, createdAt: iso(9, 12) },
      { id: "q2", author: "Anonymous", text: "What's your approach to schema evolution across regions?", upvotes: 28, createdAt: iso(9, 15) },
      { id: "q3", author: "Priya", text: "Do you use deterministic simulation testing? If so, what's the ROI?", upvotes: 19, createdAt: iso(9, 18) },
      { id: "q4", author: "Sam", text: "How big is the on-call burden for a service this critical?", upvotes: 12, createdAt: iso(9, 22) },
    ],
  },
  {
    id: "sess-2",
    eventId: "e1",
    title: "Interpretability: Looking Inside Modern LLMs",
    description: "What can we learn by probing the internal representations of transformer models? A tour of recent advances in mechanistic interpretability.",
    speakerIds: ["s2"],
    roomId: "r2",
    startTime: iso(10, 0),
    endTime: iso(10, 45),
    track: "AI",
    level: "Intermediate",
    capacityFilled: 64,
  },
  {
    id: "sess-3",
    eventId: "e1",
    title: "Taste, Craft, and the Long Game of Product Design",
    description: "Liu shares the philosophy behind Linear's design language and how to cultivate taste inside a fast-growing engineering team.",
    speakerIds: ["s3"],
    roomId: "r1",
    startTime: iso(11, 0),
    endTime: iso(11, 45),
    track: "Design",
    level: "Beginner",
    capacityFilled: 92,
  },
  {
    id: "sess-4",
    eventId: "e1",
    title: "Email Is Not Dead — Building APIs Developers Love",
    description: "Lessons from building Resend, including API design heuristics, onboarding friction, and pricing for developers.",
    speakerIds: ["s4"],
    roomId: "r3",
    startTime: iso(13, 30),
    endTime: iso(14, 15),
    track: "DevTools",
    level: "Intermediate",
    capacityFilled: 71,
  },
  {
    id: "sess-5",
    eventId: "e1",
    title: "Defending the Edge: Real-World Attack Patterns",
    description: "A walkthrough of recent edge attacks observed in the wild and the layered defenses that stopped them.",
    speakerIds: ["s5"],
    roomId: "r2",
    startTime: iso(14, 30),
    endTime: iso(15, 15),
    track: "Security",
    level: "Advanced",
    capacityFilled: 55,
  },
  {
    id: "sess-6",
    eventId: "e1",
    title: "What's New in React Server Components",
    description: "A practical tour of RSC, streaming, and the future of the React component model.",
    speakerIds: ["s6"],
    roomId: "r1",
    startTime: iso(15, 30),
    endTime: iso(16, 30),
    track: "Frontend",
    level: "Intermediate",
    capacityFilled: 78,
  },
  {
    id: "sess-7",
    eventId: "e1",
    title: "Workshop: Distributed Systems from Scratch",
    description: "Hands-on workshop building a small replicated key-value store. Bring a laptop with Go installed.",
    speakerIds: ["s1"],
    roomId: "r4",
    startTime: iso(10, 0, 1),
    endTime: iso(12, 0, 1),
    track: "Workshop",
    level: "Advanced",
    capacityFilled: 100,
  },
  {
    id: "sess-8",
    eventId: "e1",
    title: "Design Reviews That Don't Suck",
    description: "Frameworks and rituals for running design critiques that actually improve work.",
    speakerIds: ["s3"],
    roomId: "r3",
    startTime: iso(13, 0, 1),
    endTime: iso(13, 45, 1),
    track: "Design",
    level: "Beginner",
    capacityFilled: 41,
  },
];

export const events: EventItem[] = [
  {
    id: "e1",
    name: "EventSync Summit 2026",
    tagline: "Where the future of software meets",
    description:
      "Three days of talks, workshops, and hallway conversations with the people building tomorrow's tools. Featuring 60+ speakers across infrastructure, AI, design, and security.",
    startDate: iso(8, 0),
    endDate: iso(18, 0, 2),
    location: "Moscone Center West",
    city: "San Francisco, CA",
    cover: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=80",
    attendees: 4200,
    tracks: ["Infrastructure", "AI", "Design", "DevTools", "Security", "Frontend"],
    isLive: true,
  },
  {
    id: "e2",
    name: "RenderConf Berlin",
    tagline: "Frontend, performance, and the modern web",
    description: "A community-driven conference focused on the craft of building beautiful, performant interfaces.",
    startDate: iso(9, 0, 30),
    endDate: iso(18, 0, 31),
    location: "Funkhaus Berlin",
    city: "Berlin, Germany",
    cover: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80",
    attendees: 1200,
    tracks: ["Frontend", "Design", "Performance"],
  },
  {
    id: "e3",
    name: "DataOps World Tokyo",
    tagline: "Pipelines, platforms, and practitioners",
    description: "The premier gathering for data engineers, platform teams, and analytics leaders in APAC.",
    startDate: iso(9, 0, 60),
    endDate: iso(18, 0, 62),
    location: "Tokyo International Forum",
    city: "Tokyo, Japan",
    cover: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80",
    attendees: 2800,
    tracks: ["Data", "Infrastructure", "AI"],
  },
  {
    id: "e4",
    name: "OpenSource Days Lisbon",
    tagline: "Maintainers, contributors, and community",
    description: "A celebration of the people behind the libraries we use every day.",
    startDate: iso(9, 0, 90),
    endDate: iso(18, 0, 91),
    location: "LX Factory",
    city: "Lisbon, Portugal",
    cover: "https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&w=1600&q=80",
    attendees: 900,
    tracks: ["Open Source", "DevTools", "Community"],
  },
  {
    id: "e5",
    name: "ShipIt NYC",
    tagline: "A founder & builder summit",
    description: "Two days of unfiltered stories from founders shipping product against the odds.",
    startDate: iso(9, 0, 120),
    endDate: iso(18, 0, 121),
    location: "Brooklyn Navy Yard",
    city: "New York, NY",
    cover: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1600&q=80",
    attendees: 1600,
    tracks: ["Startup", "Product", "Design"],
  },
  {
    id: "e6",
    name: "SecureCon London",
    tagline: "Defending modern infrastructure",
    description: "The leading European conference for security engineers, red teams, and platform defenders.",
    startDate: iso(9, 0, 150),
    endDate: iso(18, 0, 152),
    location: "ExCeL London",
    city: "London, UK",
    cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1600&q=80",
    attendees: 3100,
    tracks: ["Security", "Infrastructure"],
  },
];

// Helpers
export const getEvent = (id: string) => events.find((e) => e.id === id);
export const getSession = (id: string) => sessions.find((s) => s.id === id);
export const getSpeaker = (id: string) => speakers.find((s) => s.id === id);
export const getRoom = (id: string) => rooms.find((r) => r.id === id);
export const sessionsForEvent = (eventId: string) => sessions.filter((s) => s.eventId === eventId);
export const sessionsForRoom = (roomId: string) => sessions.filter((s) => s.roomId === roomId);
export const sessionsForSpeaker = (speakerId: string) =>
  sessions.filter((s) => s.speakerIds.includes(speakerId));

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
export const formatDateRange = (s: string, e: string) => {
  const sd = new Date(s);
  const ed = new Date(e);
  const sameMonth = sd.getMonth() === ed.getMonth();
  const month = sd.toLocaleString([], { month: "short" });
  const month2 = ed.toLocaleString([], { month: "short" });
  if (sameMonth) return `${month} ${sd.getDate()}–${ed.getDate()}, ${ed.getFullYear()}`;
  return `${month} ${sd.getDate()} – ${month2} ${ed.getDate()}, ${ed.getFullYear()}`;
};
