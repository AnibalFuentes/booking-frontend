import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Mail, User, ArrowLeft } from 'lucide-react';
import { serviceService } from '../../services/service.service';
import type { Service } from '../../types';
import { bookingService } from '../../services/booking.service';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: searchParams.get('serviceId') || '',
    clientName: '',
    clientEmail: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const data = await serviceService.getAll();
    setServices(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newBooking = await bookingService.create(formData);
      alert('¡Reserva creada exitosamente!');
      navigate(`/booking-confirmation/${newBooking.id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => s.id === formData.serviceId);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <button
        onClick={() => navigate('/services')}
        className="flex items-center gap-2 text-blue-600 mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a servicios
      </button>

      <h1 className="text-3xl font-bold mb-6">Nueva Reserva</h1>

      {selectedService && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-blue-800 mb-2">Servicio seleccionado:</h2>
          <p className="text-blue-700">{selectedService.name} - ${selectedService.price}</p>
          <p className="text-sm text-blue-600">Duración: {selectedService.duration} minutos</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg shadow-md p-6">
        <div>
          <label className="block mb-2 font-medium">Servicio *</label>
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={formData.serviceId}
            onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
            required
          >
            <option value="">Selecciona un servicio</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - ${service.price} ({service.duration} min)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Nombre completo *</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={formData.clientName}
              onChange={(e) => setFormData({...formData, clientName: e.target.value})}
              required
              placeholder="Ej: Juan Pérez"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Email *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="email"
              className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={formData.clientEmail}
              onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
              required
              placeholder="ejemplo@correo.com"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Fecha *</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="date"
              className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Hora *</label>
          <div className="relative">
            <Clock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="time"
              className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 font-semibold text-lg"
        >
          {loading ? 'Procesando...' : 'Confirmar Reserva'}
        </button>
      </form>
    </div>
  );
};