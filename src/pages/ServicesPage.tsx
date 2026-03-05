import React, { useEffect, useState } from 'react';
import { serviceService } from '../services/service.service';
import type { Service } from '../types';
import { Clock, DollarSign, Users } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await serviceService.getAll();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Cargando servicios...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Nuestros Servicios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{service.duration} minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>${service.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Capacidad: {service.maxCapacity} personas</span>
              </div>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Reservar ahora
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};