import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { Menu, X, User, Globe, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext)!;
    const { t, language, toggleLanguage } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    const closeMenu = () => setIsMobileMenuOpen(false);

    const isActive = (path: string) => location.pathname === path;

    const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
        <Link
            to={to}
            onClick={closeMenu}
            className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${isActive(to)
                ? 'text-primary-400 bg-gray-800'
                : 'text-gray-300 hover:text-primary-400 hover:bg-gray-800'
                }`}
        >
            {children}
        </Link>
    );

    return (
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold text-primary-500 tracking-tight" onClick={closeMenu}>
                            Safai<span className="text-white">Pak</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <NavLink to="/services">{t('services')}</NavLink>
                        <NavLink to="/how-it-works">How it Works</NavLink>

                        {/* Conditional Links based on Role */}
                        {user?.role === 'customer' && (
                            <NavLink to="/bookings">{t('myBookings')}</NavLink>
                        )}

                        {user?.role === 'provider' && (
                            <>
                                <NavLink to="/provider/dashboard">{t('dashboard')}</NavLink>
                                <NavLink to="/provider/services">My Services</NavLink>
                            </>
                        )}

                        {user?.role === 'admin' && (
                            <NavLink to="/admin/dashboard">Admin Panel</NavLink>
                        )}

                        {!user && (
                            <Link to="/register?role=provider" className="text-gray-300 hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors">Contact Us</Link>
                        )}

                        <Link to="#" className="text-gray-300 hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors">About</Link>
                    </nav>

                    {/* Right Actions (Desktop) */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1.5 text-gray-400 hover:text-primary-400 text-sm font-medium transition-colors px-2 py-1 rounded-md"
                        >
                            <Globe size={18} />
                            <span>{language === 'en' ? 'EN' : 'UR'}</span>
                        </button>

                        <div className="h-6 w-px bg-gray-700" />

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
                                    <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-primary-400 border border-gray-700">
                                        <User size={16} />
                                    </div>
                                    <span className="hidden lg:inline">{user.name.split(' ')[0]}</span>
                                </div>
                                <Button onClick={handleLogout} variant="secondary" className="px-3 py-1.5 h-auto text-sm bg-gray-800 text-white hover:bg-gray-700 border-gray-700 hover:border-gray-600">
                                    {t('logout')}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="secondary" className="px-4 py-2 h-auto text-sm border-gray-700 bg-gray-800 hover:bg-gray-700 text-white hover:border-gray-600">
                                        {t('login')}
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="px-4 py-2 h-auto text-sm shadow-md shadow-primary-900/20 bg-primary-600 hover:bg-primary-500 text-white border-transparent">
                                        {t('register')}
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="text-gray-400 hover:text-primary-400"
                        >
                            <span className="font-bold text-xs">{language === 'en' ? 'UR' : 'EN'}</span>
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-400 hover:text-white focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-800 bg-gray-900 absolute top-16 left-0 w-full shadow-lg h-screen z-40 animate-in slide-in-from-top-2">
                    <div className="px-4 py-4 space-y-3">
                        {user && (
                            <div className="flex items-center gap-3 px-3 py-3 bg-gray-800 rounded-lg mb-4 border border-gray-700">
                                <div className="h-10 w-10 rounded-full bg-primary-900/30 flex items-center justify-center text-primary-400 font-bold text-lg border border-primary-900/50">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-white">{user.name}</p>
                                    <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <Link to="/services" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary-400">{t('services')}</Link>
                            <Link to="/how-it-works" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary-400">How it Works</Link>

                            {user?.role === 'customer' && (
                                <Link to="/bookings" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary-400">{t('myBookings')}</Link>
                            )}

                            {user?.role === 'provider' && (
                                <>
                                    <Link to="/provider/dashboard" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary-400">{t('dashboard')}</Link>
                                    <Link to="/provider/services" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary-400">My Services</Link>
                                </>
                            )}

                            {user?.role === 'admin' && (
                                <Link to="/admin/dashboard" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary-400">Admin Panel</Link>
                            )}

                            {!user && (
                                <Link to="/register?role=provider" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary-400">Contact Us</Link>
                            )}
                            <Link to="#" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary-400">About</Link>
                        </div>

                        <div className="pt-4 border-t border-gray-800 mt-4">
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-base font-medium text-red-400 bg-red-900/20 hover:bg-red-900/30 rounded-md transition-colors"
                                >
                                    <LogOut size={18} />
                                    {t('logout')}
                                </button>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link to="/login" onClick={closeMenu}>
                                        <Button variant="secondary" className="w-full justify-center bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:border-gray-600">
                                            {t('login')}
                                        </Button>
                                    </Link>
                                    <Link to="/register" onClick={closeMenu}>
                                        <Button className="w-full justify-center bg-primary-600 border-transparent hover:bg-primary-500 text-white">
                                            {t('register')}
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
