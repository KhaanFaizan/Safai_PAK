import { useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LayoutDashboard, Briefcase, Calendar, DollarSign, LogOut, User } from 'lucide-react';
import { Button } from '../ui/Button';

const ProviderLayout = () => {
    const { user, logout } = useContext(AuthContext)!;
    const { t } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/provider/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/provider/services', icon: Briefcase, label: 'Services' },
        { path: '/provider/bookings', icon: Calendar, label: 'Bookings' },
        { path: '/provider/earnings', icon: DollarSign, label: 'Earnings' },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <Link to="/" className="text-2xl font-bold text-primary-600">SafaiPak</Link>
                    <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded text-gray-500 ml-2">Provider</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                            {user?.name?.charAt(0) || 'P'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-2 text-sm" onClick={handleLogout}>
                        <LogOut size={16} />
                        {t('logout')}
                    </Button>
                </div>
            </aside>

            {/* Mobile Header (TODO: Add drawer later if needed) */}

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default ProviderLayout;
