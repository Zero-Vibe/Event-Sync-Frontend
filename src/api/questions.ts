import type { Question, QuestionCreate } from '../../types';
import { customFetch } from './client';

export const getQuestions = (eventId: string, sessionId: string): Promise<Question[]> =>
  customFetch<Question[]>(`/events/${eventId}/sessions/${sessionId}/questions`);

export const createQuestion = (
  eventId: string,
  sessionId: string,
  data: QuestionCreate
): Promise<Question> =>
  customFetch<Question>(`/events/${eventId}/sessions/${sessionId}/questions`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const voteQuestion = (
  eventId: string,
  sessionId: string,
  questionId: string,
  upvote: boolean
): Promise<Question> =>
  customFetch<Question>(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/vote?upvote=${upvote}`,
    { method: 'POST' }
  );
