import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ServiceListing from './pages/ServiceListing';
import ServiceDetails from './pages/ServiceDetails';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import { Button } from './components/ui/Button';

// Provider Pages
import ProviderLayout from './components/layouts/ProviderLayout';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderServices from './pages/provider/ProviderServices';
import ProviderBookings from './pages/provider/ProviderBookings';
import ProviderEarnings from './pages/provider/ProviderEarnings';

// Admin Pages
import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProviders from './pages/admin/AdminProviders';
import AdminAllUsers from './pages/admin/AdminAllUsers';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import HowItWorksPage from './pages/HowItWorksPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import { Loader } from './components/ui/Loader';

const AppContent = () => {
  const { loading } = useContext(AuthContext)!;
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  const showFooter = !['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/services" element={<ServiceListing />} />
          <Route path="/services/:id" element={<ServiceDetails />} />

          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/book/:serviceId" element={<BookingPage />} />
            <Route path="/bookings" element={<MyBookings />} />
          </Route>

          {/* Provider Routes */}
          <Route element={<ProtectedRoute allowedRoles={['provider']} />}>
            <Route element={<ProviderLayout />}>
              <Route path="/provider/dashboard" element={<ProviderDashboard />} />
              <Route path="/provider/services" element={<ProviderServices />} />
              <Route path="/provider/bookings" element={<ProviderBookings />} />
              <Route path="/provider/earnings" element={<ProviderEarnings />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/providers" element={<AdminProviders />} />
              <Route path="/admin/all-users" element={<AdminAllUsers />} />
            </Route>
          </Route>
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    // Main App Provider Wrapper
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <AppContent />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
