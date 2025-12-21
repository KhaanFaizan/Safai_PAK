import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Menu, X, User, LogOut } from 'lucide-react';


const Navbar = () => {
    const { user, logout } = useContext(AuthContext)!;
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
            className={`px-3 py-2 rounded-md font-medium text-base transition-colors ${isActive(to)
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
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-3xl font-bold text-primary-500 tracking-tight" onClick={closeMenu}>
                            Safai<span className="text-white">Pak</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex flex-1 justify-center items-center space-x-8">
                        {user?.role !== 'provider' && (
                            <>
                                <NavLink to="/services">Services</NavLink>
                                <NavLink to="/how-it-works">How it Works</NavLink>
                            </>
                        )}

                        {/* Conditional Links based on Role */}
                        {user?.role === 'customer' && (
                            <NavLink to="/bookings">My Bookings</NavLink>
                        )}

                        {user?.role === 'provider' && (
                            <>
                                <NavLink to="/provider/dashboard">Dashboard</NavLink>
                                <NavLink to="/provider/services">My Services</NavLink>
                            </>
                        )}

                        {user?.role === 'admin' && (
                            <NavLink to="/admin/dashboard">Admin Panel</NavLink>
                        )}

                        {user?.role !== 'provider' && (
                            <>
                                {!user && (
                                    <NavLink to="/contact">Contact Us</NavLink>
                                )}
                                <NavLink to="/about">About</NavLink>
                            </>
                        )}
                    </nav>

                    <div className="hidden md:flex items-center space-x-4">


                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-base font-medium text-gray-200">
                                    <div className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center text-primary-400 border border-gray-700">
                                        <User size={18} />
                                    </div>
                                    <span className="hidden lg:inline">{user.name.split(' ')[0]}</span>
                                </div>
                                <Button onClick={handleLogout} variant="secondary" className="px-4 py-2 h-auto text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 border-gray-700 hover:border-gray-600">
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <Button variant="secondary" className="px-5 py-2.5 h-auto text-base font-medium border-gray-700 bg-gray-800 hover:bg-gray-700 text-white hover:border-gray-600">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="px-5 py-2.5 h-auto text-base font-medium shadow-lg shadow-primary-900/20 bg-primary-600 hover:bg-primary-500 text-white border-transparent">
                                        Register
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden gap-4">
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
                            {user?.role !== 'provider' && (
                                <>
                                    <Link to="/services" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary-400">Services</Link>
                                    <Link to="/how-it-works" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary-400">How it Works</Link>
                                </>
                            )}

                            {user?.role === 'customer' && (
                                <Link to="/bookings" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary-400">My Bookings</Link>
                            )}

                            {user?.role === 'provider' && (
                                <>
                                    <Link to="/provider/dashboard" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary-400">Dashboard</Link>
                                    <Link to="/provider/services" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary-400">My Services</Link>
                                </>
                            )}

                            {user?.role === 'admin' && (
                                <Link to="/admin/dashboard" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary-400">Admin Panel</Link>
                            )}

                            {user?.role !== 'provider' && (
                                <>
                                    {!user && (
                                        <Link to="/contact" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary-400">Contact Us</Link>
                                    )}
                                    <Link to="/about" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-primary-400">About</Link>
                                </>
                            )}
                        </div>

                        <div className="pt-4 border-t border-gray-800 mt-4">
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-base font-medium text-red-400 bg-red-900/20 hover:bg-red-900/30 rounded-md transition-colors"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link to="/login" onClick={closeMenu}>
                                        <Button variant="secondary" className="w-full justify-center bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:border-gray-600">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/register" onClick={closeMenu}>
                                        <Button className="w-full justify-center bg-primary-600 border-transparent hover:bg-primary-500 text-white">
                                            Register
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
