import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
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

// Navbar Component
const Navbar = () => {
  const { user, logout } = useContext(AuthContext)!;
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">SafaiPak</Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {(!user || user.role === 'customer') && (
                <>
                  <Link to="/services" className="text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 font-medium">{t('services')}</Link>
                  {user && <Link to="/bookings" className="text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 font-medium">{t('myBookings')}</Link>}
                </>
              )}
              {user?.role === 'provider' && (
                <Link to="/provider/dashboard" className="text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 font-medium">{t('dashboard')}</Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 font-medium">Admin Panel</Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={toggleLanguage} className="px-3 py-1 text-sm">
              {language === 'en' ? 'Urdu' : 'English'}
            </Button>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {t('welcome')}, {user.name}
                </span>
                <Button onClick={handleLogout} variant="secondary" className="text-sm">
                  {t('logout')}
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login"><Button variant="outline">{t('login')}</Button></Link>
                <Link to="/register"><Button>{t('register')}</Button></Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

function App() {
  return (
    // Main App Provider Wrapper
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
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
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
