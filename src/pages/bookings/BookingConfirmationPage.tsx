import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, Mail } from 'lucide-react';
import { bookingService } from '../../services/booking.service';
import type { Booking, Service } from '../../types';
import { serviceService } from '../../services/service.service';

export const BookingConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadBookingDetails(id);
    }
  }, [id]);

  const loadBookingDetails = async (bookingId: string) => {
    try {
      const bookingData = await bookingService.getById(bookingId);
      setBooking(bookingData);
      
      const serviceData = await serviceService.getById(bookingData.serviceId);
      setService(serviceData);
    } catch (error) {
      console.error('Error loading booking details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Cargando confirmación...</div>;
  }

  if (!booking || !service) {
    return <div className="text-center p-8">No se encontró la reserva</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          ¡Reserva Confirmada!
        </h1>
        <p className="text-gray-600 mb-8">
          Hemos enviado los detalles a tu correo electrónico
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <h2 className="text-xl font-semibold mb-4">Detalles de la reserva</h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-medium w-24">Servicio:</span>
              <span>{service.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium w-20">Cliente:</span>
              <span>{booking.clientName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="font-medium w-20">Email:</span>
              <span>{booking.clientEmail}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium w-20">Fecha:</span>
              <span>{new Date(booking.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="font-medium w-20">Hora:</span>
              <span>{booking.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium w-24">Precio:</span>
              <span className="text-lg font-bold text-green-600">${service.price}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium w-24">Estado:</span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                {booking.status === 'pending' ? 'Pendiente de confirmación' : booking.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            to="/services"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Ver más servicios
          </Link>
          <Link
            to="/my-bookings"
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
          >
            Mis reservas
          </Link>
        </div>
      </div>
    </div>
  );
};