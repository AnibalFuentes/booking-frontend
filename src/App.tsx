import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ReviewsPage } from "./pages/reviews/ReviewsPage";
import { ServicesPage } from "./pages/services/ServicesPage";
import { BookingPage } from "./pages/bookings/BookingPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-xl font-bold text-blue-600">
                BookingApp
              </Link>
              <div className="flex space-x-4">
                <Link to="/services" className="hover:text-blue-600 transition">
                  Servicios
                </Link>
                <Link to="/booking" className="hover:text-blue-600 transition">
                  Reservar
                </Link>
                <Link to="/reviews" className="hover:text-blue-600 transition">
                  Reseñas
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<ServicesPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
