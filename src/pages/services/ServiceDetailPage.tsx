import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, DollarSign, Users, Star, ArrowLeft } from 'lucide-react';
import { serviceService } from '../../services/service.service';
import type { Review, Service } from '../../types';
import { reviewService } from '../../services/review.service';

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadServiceData(id);
    }
  }, [id]);

  const loadServiceData = async (serviceId: string) => {
    try {
      const [serviceData, reviewsData, avgRating] = await Promise.all([
        serviceService.getById(serviceId),
        reviewService.getByService(serviceId),
        reviewService.getAverageRating(serviceId)
      ]);
      
      setService(serviceData);
      setReviews(reviewsData);
      setAverageRating(avgRating.average);
    } catch (error) {
      console.error('Error loading service details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    navigate(`/booking?serviceId=${id}`);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Cargando detalles...</div>;
  }

  if (!service) {
    return <div className="text-center p-8">Servicio no encontrado</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => navigate('/services')}
        className="flex items-center gap-2 text-blue-600 mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a servicios
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{service.name}</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-600 mb-4">{service.description}</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Duración: <strong>{service.duration} minutos</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Precio: <strong>${service.price}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Capacidad máxima: <strong>{service.maxCapacity} personas</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>Calificación promedio: <strong>{averageRating} / 5</strong></span>
              </div>
            </div>

            <button
              onClick={handleBookNow}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
            >
              Reservar ahora
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Reseñas ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-500">No hay reseñas aún para este servicio</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold">{review.clientName}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};