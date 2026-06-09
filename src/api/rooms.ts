import type { Room, RoomCreate } from '../types/index';
import { customFetch } from './client';

export const getRooms = (): Promise<Room[]> =>
  customFetch<Room[]>('/rooms');

export const getRoom = (roomId: string): Promise<Room> =>
  customFetch<Room>(`/rooms/${roomId}`);

export const createRoom = (data: RoomCreate): Promise<Room> =>
  customFetch<Room>('/rooms', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateRoom = (roomId: string, data: RoomCreate): Promise<void> =>
  customFetch<void>(`/rooms/${roomId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteRoom = (roomId: string): Promise<void> =>
  customFetch<void>(`/rooms/${roomId}`, { method: 'DELETE' });
