import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Mail, User, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { serviceService } from '../../services/service.service';
import { bookingService } from '../../services/booking.service';
import type { Booking, Service } from '../../types';

export const MyBookingsPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const data = await serviceService.getAll();
    setServices(data);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const data = await bookingService.getByEmail(email);
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('¿Estás seguro de cancelar esta reserva?')) {
      try {
        await bookingService.updateStatus(bookingId, 'cancelled');
        // Recargar reservas
        const updatedBookings = await bookingService.getByEmail(email);
        setBookings(updatedBookings);
      } catch (error) {
        console.error('Error cancelling booking:', error);
      }
    }
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.name || 'Servicio no encontrado';
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded"><CheckCircle className="w-4 h-4" /> Confirmada</span>;
      case 'pending':
        return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-2 py-1 rounded"><AlertCircle className="w-4 h-4" /> Pendiente</span>;
      case 'cancelled':
        return <span className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded"><XCircle className="w-4 h-4" /> Cancelada</span>;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Mis Reservas</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Ingresa tu email"
              className="w-full pl-10 p-3 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {searched && (
        <div>
          {bookings.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No se encontraron reservas para este email
            </p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-6 bg-white shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {getServiceName(booking.serviceId)}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{booking.clientName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{booking.clientEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{booking.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                  
                  {booking.status !== 'cancelled' && booking.status !== 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Cancelar reserva
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};