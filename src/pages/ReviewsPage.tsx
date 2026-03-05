import React, { useState, useEffect } from "react";
import { reviewService } from "../services/review.service";
import { serviceService } from "../services/service.service";
import type { Review, Service } from "../types";
import type { Star, User } from "lucide-react";

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [newReview, setNewReview] = useState({
    serviceId: "",
    clientName: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    loadServices();
    loadReviews();
  }, []);

  const loadServices = async () => {
    const data = await serviceService.getAll();
    setServices(data);
  };

  const loadReviews = async () => {
    const data = await reviewService.getAll();
    setReviews(data);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await reviewService.create(newReview);
      alert("Reseña enviada!");
      setNewReview({
        serviceId: "",
        clientName: "",
        rating: 5,
        comment: "",
      });
      loadReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Reseñas</h1>

      {/* Formulario de nueva reseña */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Deja tu reseña</h2>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <select
              className="w-full p-2 border rounded"
              value={newReview.serviceId}
              onChange={(e) =>
                setNewReview({ ...newReview, serviceId: e.target.value })
              }
              required
            >
              <option value="">Selecciona un servicio</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full pl-10 p-2 border rounded"
                value={newReview.clientName}
                onChange={(e) =>
                  setNewReview({ ...newReview, clientName: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">
              Calificación: {newReview.rating} estrellas
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: parseInt(e.target.value) })
              }
              className="w-full"
            />
          </div>

          <div>
            <textarea
              placeholder="Tu comentario"
              className="w-full p-2 border rounded"
              rows={3}
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Enviar Reseña
          </button>
        </form>
      </div>

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {reviews.map((review) => {
          const service = services.find((s) => s.id === review.serviceId);
          return (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold">{review.clientName}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex">{renderStars(review.rating)}</div>
              </div>
              {service && (
                <p className="text-sm text-blue-600 mb-2">
                  Servicio: {service.name}
                </p>
              )}
              <p className="text-gray-700">{review.comment}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
