import React, { useState } from 'react';
import { bookingService } from '../services/booking.service';
import { serviceService } from '../services/service.service';
import type { Service } from '../types';
import { Calendar, Clock, Mail, User } from 'lucide-react';

export const BookingPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    serviceId: '',
    clientName: '',
    clientEmail: '',
    date: '',
    time: ''
  });

  const loadServices = async () => {
    const data = await serviceService.getAll();
    setServices(data);
  };

  React.useEffect(() => {
    loadServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newBooking = await bookingService.create(formData);
      alert('Reserva creada exitosamente!');
      setFormData({
        serviceId: '',
        clientName: '',
        clientEmail: '',
        date: '',
        time: ''
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error al crear la reserva');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Nueva Reserva</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Servicio</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.serviceId}
            onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
            required
          >
            <option value="">Selecciona un servicio</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - ${service.price}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Nombre</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 p-2 border rounded"
              value={formData.clientName}
              onChange={(e) => setFormData({...formData, clientName: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="email"
              className="w-full pl-10 p-2 border rounded"
              value={formData.clientEmail}
              onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2">Fecha</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="date"
              className="w-full pl-10 p-2 border rounded"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2">Hora</label>
          <div className="relative">
            <Clock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="time"
              className="w-full pl-10 p-2 border rounded"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
        >
          Confirmar Reserva
        </button>
      </form>
    </div>
  );
};