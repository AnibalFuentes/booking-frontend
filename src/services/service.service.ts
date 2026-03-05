import type { Service } from '../types';
import { api } from './api';

export const serviceService = {
  async getAll(): Promise<Service[]> {
    const response = await api.get('/services');
    return response.data;
  },

  async getById(id: string): Promise<Service> {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  async create(service: Omit<Service, 'id'>): Promise<Service> {
    const response = await api.post('/services', service);
    return response.data;
  }
};