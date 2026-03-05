import { api } from './api';
import type { Review } from '../types';

export const reviewService = {
  async getAll(): Promise<Review[]> {
    const response = await api.get('/reviews');
    return response.data;
  },

  async getByService(serviceId: string): Promise<Review[]> {
    const response = await api.get(`/reviews/service/${serviceId}`);
    return response.data;
  },

  async create(review: Omit<Review, 'id' | 'date'>): Promise<Review> {
    const response = await api.post('/reviews', review);
    return response.data;
  },

  async getAverageRating(serviceId: string): Promise<{ average: number }> {
    const response = await api.get(`/reviews/service/${serviceId}/average`);
    return response.data;
  }
};