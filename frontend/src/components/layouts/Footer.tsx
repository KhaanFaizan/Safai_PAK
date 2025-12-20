import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

const Footer = () => {
    const { t } = useLanguage();
    const { user } = useContext(AuthContext)!;

    return (
        <footer className="bg-gray-900 border-t border-gray-800 pt-16 pb-8">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="text-2xl font-bold text-primary-500 tracking-tight">
                            Safai<span className="text-white">Pak</span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Connecting verified sanitation experts with communities across Pakistan. Professional, reliable, and just a click away.
                        </p>
                        <div className="flex items-center gap-4 text-gray-500">
                            <a href="#" className="hover:text-primary-400 transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-primary-400 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-primary-400 transition-colors"><Instagram size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link to="/services" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Services</Link></li>
                            <li><Link to="/how-it-works" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">How It Works</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">About Us</Link></li>
                            <li><Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* User Actions */}
                    <div>
                        <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">For You</h3>
                        <ul className="space-y-3">
                            {!user ? (
                                <>
                                    <li><Link to="/login" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Login</Link></li>
                                    <li><Link to="/register" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Register</Link></li>
                                    <li><Link to="/register?role=provider" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Become a Provider</Link></li>
                                </>
                            ) : (
                                <>
                                    {user.role === 'customer' && <li><Link to="/dashboard" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Customer Dashboard</Link></li>}
                                    {user.role === 'provider' && <li><Link to="/provider/dashboard" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Provider Dashboard</Link></li>}
                                    {user.role === 'admin' && <li><Link to="/admin/dashboard" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Admin Dashboard</Link></li>}
                                    <li><Link to="/bookings" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">My Bookings</Link></li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Contact & Trust */}
                    <div>
                        <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Contact & Trust</h3>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Mail size={18} className="text-primary-500" />
                                <span>faizan.learner@gmail.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Phone size={18} className="text-primary-500" />
                                <span>+92 308 5101230</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <MapPin size={18} className="text-primary-500" />
                                <span>Lahore, Pakistan</span>
                            </li>
                        </ul>
                        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg flex items-center gap-3">
                            <ShieldCheck className="text-primary-500 h-8 w-8" />
                            <div>
                                <p className="text-xs font-bold text-gray-200 uppercase">Verified Platform</p>
                                <p className="text-xs text-gray-500">All providers vetted</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} SafaiPak. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <Link to="#" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
