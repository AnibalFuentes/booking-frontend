export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  maxCapacity: number;
}

export interface Booking {
  id: string;
  serviceId: string;
  clientName: string;
  clientEmail: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Review {
  id: string;
  serviceId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}