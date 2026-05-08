"use client";

import { useState } from "react";

interface Speaker {
    id: string;
    fullName: string;
    role?: string;
    initials: string;
    avatarColor: "purple" | "teal" | "coral" | "blue";
}

interface Question {
    id: string;
    content: string;
    authorName: string | null;
    upvotes: number;
    votedByMe?: boolean;
}

interface SessionDetailProps {
    session: {
        id: string;
        title: string;
        description: string;
        endTime: string;   
        startTime: string; 
        room: string;
        track?: string;
        capacity: number;
        capacityFilled: number;
        isLive: boolean;
        speakers: Speaker[];
        questions: Question[];
    };
}

const avatarColors: Record<Speaker["avatarColor"], string> = {
    purple: "bg-violet-100 text-violet-800",
    teal: "bg-emerald-100 text-emerald-800",
    coral: "bg-orange-100 text-orange-800",
    blue: "bg-blue-100 text-blue-800",
};

function LiveBadge() {
    return (
        <span className="inline-flex items-center gap-1.5 bg-red-500 text-white text-[11px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Live
        </span>
    );
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
    return (
        <div className="flex items-center gap-3 border border-gray-100 dark:border-white/10 rounded-xl p-3.5 hover:border-gray-300 dark:hover:border-white/20 transition-colors cursor-pointer">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${avatarColors[speaker.avatarColor]}`}>
                {speaker.initials}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight">{speaker.fullName}</p>
                {speaker.role && (
                    <p className="text-xs text-gray-400 mt-0.5">{speaker.role}</p>
                )}
            </div>
        </div>
    );
}

function QuestionCard({
    question,
    onVote,
}: {
    question: Question;
    onVote: (id: string) => void;
}) {
    return (
        <div className="flex gap-3 border border-gray-100 dark:border-white/10 rounded-lg p-3">
            <div className="flex flex-col items-center gap-1 min-w-[32px]">
                <button
                    onClick={() => onVote(question.id)}
                    aria-label="Upvote"
                    className={`w-7 h-7 flex items-center justify-center rounded-md border text-xs transition-all
            ${question.votedByMe
                            ? "border-violet-400 text-violet-600 bg-violet-50 dark:bg-violet-900/30"
                            : "border-gray-200 dark:border-white/10 text-gray-400 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                        }`}
                >
                    ▲
                </button>
                <span className="text-xs font-medium text-gray-500">{question.upvotes}</span>
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{question.content}</p>
                <p className="text-xs text-gray-400 mt-1">— {question.authorName ?? "Anonyme"}</p>
            </div>
        </div>
    );
}


export default function SessionDetailPage({ session }: SessionDetailProps) {
    const [isFav, setIsFav] = useState(false);
    const [questions, setQuestions] = useState<Question[]>(session.questions);
    const [questionText, setQuestionText] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [newQuestionId, setNewQuestionId] = useState<string | null>(null);

    const capacityPct = Math.round((session.capacityFilled / session.capacity) * 100);

    function handleVote(id: string) {
        setQuestions((prev) =>
            prev
                .map((q) =>
                    q.id === id
                        ? { ...q, upvotes: q.votedByMe ? q.upvotes - 1 : q.upvotes + 1, votedByMe: !q.votedByMe }
                        : q
                )
                .sort((a, b) => b.upvotes - a.upvotes)
        );
    }

    function handleSubmit() {
        const text = questionText.trim();
        if (!text) return;
        const newQ: Question = {
            id: crypto.randomUUID(),
            content: text,
            authorName: authorName.trim() || null,
            upvotes: 1,
            votedByMe: true,
        };
        setQuestions((prev) => [newQ, ...prev].sort((a, b) => b.upvotes - a.upvotes));
        setNewQuestionId(newQ.id);
        setQuestionText("");
        setAuthorName("");
        setTimeout(() => setNewQuestionId(null), 1500);
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 font-sans">

            <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
                <div className="flex items-center gap-2 flex-wrap">
                    {session.isLive && <LiveBadge />}
                    <span className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 text-xs px-2.5 py-1 rounded-md border border-gray-200 dark:border-white/10">
                        🚪 {session.room}
                    </span>
                    {session.track && (
                        <span className="inline-flex items-center gap-1 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs px-2.5 py-1 rounded-md">
                            🏷 {session.track}
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setIsFav((f) => !f)}
                    className={`flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-md border transition-all
            ${isFav
                            ? "border-pink-300 text-pink-500 bg-pink-50 dark:bg-pink-900/20"
                            : "border-gray-200 dark:border-white/10 text-gray-500 hover:border-gray-400 dark:hover:border-white/30"
                        }`}
                >
                    <span>{isFav ? "♥" : "♡"}</span>
                    <span>{isFav ? "Dans vos favoris" : "Ajouter aux favoris"}</span>
                </button>
            </div>

            <h1 className="font-serif text-3xl leading-snug text-gray-900 dark:text-gray-50 mb-3">
                {session.title}
            </h1>

            <div className="flex items-center gap-3 text-sm text-gray-400 flex-wrap mb-4">
                <span>🕐 {session.startTime} – {session.endTime}</span>
                <span className="text-gray-200 dark:text-white/20">·</span>
                <span>👥 {session.capacity} places</span>
            </div>

            <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>Capacité</span>
                    <span>{session.capacityFilled} / {session.capacity}</span>
                </div>
                <div className="h-1 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-violet-500 rounded-full transition-all"
                        style={{ width: `${capacityPct}%` }}
                    />
                </div>
            </div>

            <hr className="border-gray-100 dark:border-white/10 mb-6" />

            <p className="text-xs font-medium tracking-widest uppercase text-gray-300 dark:text-gray-500 mb-3">
                À propos de cette session
            </p>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 mb-6">
                {session.description}
            </p>

            <hr className="border-gray-100 dark:border-white/10 mb-6" />

            <p className="text-xs font-medium tracking-widest uppercase text-gray-300 dark:text-gray-500 mb-3">
                Intervenants
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {session.speakers.map((s) => (
                    <SpeakerCard key={s.id} speaker={s} />
                ))}
            </div>

            <hr className="border-gray-100 dark:border-white/10 mb-6" />

            {session.isLive ? (
                <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-5">
                        <LiveBadge />
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Questions &amp; Réponses</p>
                            <p className="text-xs text-gray-400">Posez vos questions en direct · triées par votes</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mb-5">
                        <textarea
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            placeholder="Votre question pour les intervenants…"
                            rows={3}
                            className="w-full text-sm border border-gray-200 dark:border-white/10 rounded-lg p-3 resize-none bg-white dark:bg-white/5 text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:border-violet-400 transition-colors"
                        />
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                placeholder="Votre prénom (optionnel)"
                                className="flex-1 text-sm border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 bg-white dark:bg-white/5 text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:border-violet-400 transition-colors"
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={!questionText.trim()}
                                className="bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                            >
                                Envoyer
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        {questions.map((q) => (
                            <div
                                key={q.id}
                                className={`transition-all duration-700 ${newQuestionId === q.id ? "ring-1 ring-violet-300 rounded-lg" : ""}`}
                            >
                                <QuestionCard question={q} onVote={handleVote} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="border border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-6 text-center">
                    <p className="text-sm text-gray-400">Le Q&amp;A ouvrira au début de la session.</p>
                </div>
            )}

        </div>
    );
}