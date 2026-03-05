import { api } from './api';
import type { Booking } from '../types';

export const bookingService = {
  async getAll(): Promise<Booking[]> {
    const response = await api.get('/bookings');
    return response.data;
  },

  async getById(id: string): Promise<Booking> {
    const response = await api.get(/bookings/${id});
    return response.data;
  },

  async create(booking: Omit<Booking, 'id' | 'status'>): Promise<Booking> {
    const response = await api.post('/bookings', booking);
    return response.data;
  },

  async updateStatus(id: string, status: Booking['status']): Promise<Booking> {
    const response = await api.patch(/bookings/${id}/status, { status });
    return response.data;
  },

  async getByEmail(email: string): Promise<Booking[]> {
    const response = await api.get(/bookings/email/${email});
    return response.data;
  }
};