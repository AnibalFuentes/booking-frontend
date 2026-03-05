import React, { useState, useEffect, useCallback } from 'react';
import { Star, User, Filter } from 'lucide-react';
import type { Review, Service } from '../../types';
import { reviewService } from '../../services/review.service';
import { serviceService } from '../../services/service.service';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>('all');
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    serviceId: '',
    clientName: '',
    rating: 5,
    comment: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [averageRatings, setAverageRatings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Primero declaramos todas las funciones
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [reviewsData, servicesData] = await Promise.all([
        reviewService.getAll(),
        serviceService.getAll()
      ]);
      
      setReviews(reviewsData);
      setServices(servicesData);
      
      // Cargar promedios para cada servicio
      const averages: Record<string, number> = {};
      for (const service of servicesData) {
        try {
          const avg = await reviewService.getAverageRating(service.id);
          averages[service.id] = avg.average;
        } catch (error) {
          console.error(`Error loading average for service ${service.id}:`, error);
          averages[service.id] = 0;
        }
      }
      setAverageRatings(averages);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed as it only uses setState functions

  const filterReviews = useCallback(() => {
    if (selectedService === 'all') {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter(r => r.serviceId === selectedService));
    }
  }, [selectedService, reviews]); // Dependencies: selectedService and reviews

  // Luego usamos los useEffect
  useEffect(() => {
    loadData();
  }, [loadData]); // Include loadData in dependencies

  useEffect(() => {
    filterReviews();
  }, [filterReviews]); // Include filterReviews in dependencies

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await reviewService.create(newReview);
      alert('¡Reseña enviada exitosamente!');
      setNewReview({
        serviceId: '',
        clientName: '',
        rating: 5,
        comment: ''
      });
      setShowForm(false);
      loadData(); // Recargar datos
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error al enviar la reseña');
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getServiceName = (serviceId: string) => {
    return services.find(s => s.id === serviceId)?.name || 'Servicio no encontrado';
  };

  if (loading && services.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando reseñas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reseñas de Servicios</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancelar' : 'Escribir reseña'}
        </button>
      </div>

      {/* Resumen de calificaciones por servicio */}
      {services.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {services.map(service => (
            <div key={service.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-2">{service.name}</h3>
              <div className="flex items-center justify-between">
                <div className="flex">{renderStars(Math.round(averageRatings[service.id] || 0))}</div>
                <span className="text-lg font-bold">
                  {(averageRatings[service.id] || 0).toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {reviews.filter(r => r.serviceId === service.id).length} reseñas
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Filtro por servicio */}
      <div className="mb-6 flex items-center gap-2">
        <Filter className="w-5 h-5 text-gray-500" />
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todas las reseñas</option>
          {services.map(service => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      {/* Formulario de nueva reseña */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border-2 border-blue-200">
          <h2 className="text-xl font-semibold mb-4">Nueva Reseña</h2>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Servicio *</label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={newReview.serviceId}
                onChange={(e) => setNewReview({...newReview, serviceId: e.target.value})}
                required
              >
                <option value="">Selecciona un servicio</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium">Tu nombre *</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ej: María González"
                  className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={newReview.clientName}
                  onChange={(e) => setNewReview({...newReview, clientName: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Calificación: {newReview.rating} estrellas</label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={newReview.rating}
                onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="flex justify-between px-1">
                <span className="text-sm">1 estrella</span>
                <span className="text-sm">5 estrellas</span>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">Comentario *</label>
              <textarea
                placeholder="Cuéntanos tu experiencia..."
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                rows={4}
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Publicar reseña
            </button>
          </form>
        </div>
      )}

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No hay reseñas disponibles para mostrar
          </p>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-semibold text-lg">{review.clientName}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {new Date(review.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex">{renderStars(review.rating)}</div>
              </div>
              
              <p className="text-sm text-blue-600 mb-2 font-medium">
                Servicio: {getServiceName(review.serviceId)}
              </p>
              
              <p className="text-gray-700 mb-3">{review.comment}</p>
              
              <div className="text-sm text-gray-400">
                ID de reseña: {review.id}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};