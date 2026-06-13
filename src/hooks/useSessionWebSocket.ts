'use client';

import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { Question } from '@/src/types';

interface UseSessionWebSocketOptions {
  sessionId: string;
  enabled: boolean;
  onNewQuestion: (question: Question) => void;
  onVoteUpdate: (question: Question) => void;
}
export function useSessionWebSocket({
  sessionId,
  enabled,
  onNewQuestion,
  onVoteUpdate,
}: UseSessionWebSocketOptions): void {
  const onNewQuestionRef = useRef(onNewQuestion);
  const onVoteUpdateRef  = useRef(onVoteUpdate);
  onNewQuestionRef.current = onNewQuestion;
  onVoteUpdateRef.current  = onVoteUpdate;

  useEffect(() => {
    if (!enabled || !sessionId) return;

    const token   = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

    const client = new Client({
      webSocketFactory: () => new SockJS(`${baseUrl}/ws`),

      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},

      reconnectDelay: 5_000,

      onConnect: () => {
        client.subscribe(
          `/topic/sessions/${sessionId}/questions`,
          (message) => {
            try {
              const question: Question = JSON.parse(message.body);
              onNewQuestionRef.current(question);
            } catch {
            }
          }
        );

        client.subscribe(
          `/topic/sessions/${sessionId}/votes`,
          (message) => {
            try {
              const question: Question = JSON.parse(message.body);
              onVoteUpdateRef.current(question);
            } catch {
              // message malformé — on ignore
            }
          }
        );
      },

      onStompError: (frame) => {
        console.error('[WS] Erreur STOMP :', frame.headers['message']);
      },

      onDisconnect: () => {
        console.info('[WS] Déconnecté, tentative de reconnexion…');
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [sessionId, enabled]);
}
