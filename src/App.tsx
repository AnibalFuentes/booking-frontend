import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Calendar, Star, List, Home } from 'lucide-react';
import { ServicesPage } from './pages/services/ServicesPage';
import { ServiceDetailPage } from './pages/services/ServiceDetailPage';
import { BookingPage } from './pages/bookings/BookingPage';
import { BookingConfirmationPage } from './pages/bookings/BookingConfirmationPage';
import { MyBookingsPage } from './pages/bookings/MyBookingsPage';
import { ReviewsPage } from './pages/reviews/ReviewsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
                <Home className="w-5 h-5" />
                BookingApp
              </Link>
              
              <div className="flex space-x-6">
                <Link 
                  to="/services" 
                  className="flex items-center gap-1 hover:text-blue-600 transition group"
                >
                  <List className="w-4 h-4 group-hover:scale-110 transition" />
                  <span>Servicios</span>
                </Link>
                
                <Link 
                  to="/booking" 
                  className="flex items-center gap-1 hover:text-blue-600 transition group"
                >
                  <Calendar className="w-4 h-4 group-hover:scale-110 transition" />
                  <span>Reservar</span>
                </Link>
                
                <Link 
                  to="/my-bookings" 
                  className="flex items-center gap-1 hover:text-blue-600 transition group"
                >
                  <Calendar className="w-4 h-4 group-hover:scale-110 transition" />
                  <span>Mis Reservas</span>
                </Link>
                
                <Link 
                  to="/reviews" 
                  className="flex items-center gap-1 hover:text-blue-600 transition group"
                >
                  <Star className="w-4 h-4 group-hover:scale-110 transition" />
                  <span>Reseñas</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="py-8">
          <Routes>
            <Route path="/" element={<ServicesPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/booking-confirmation/:id" element={<BookingConfirmationPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
          </Routes>
        </main>

        <footer className="bg-white border-t mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-gray-600">
            <p>© 2024 BookingApp - Todos los derechos reservados</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;