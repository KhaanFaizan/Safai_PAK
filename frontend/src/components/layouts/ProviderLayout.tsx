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
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-primary-900 text-white flex-shrink-0 hidden md:flex md:flex-col">
                <div className="p-6 border-b border-primary-800 flex items-center gap-2">
                    <LayoutDashboard className="text-primary-300" size={28} />
                    <h2 className="text-2xl font-bold">Provider Panel</h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-primary-800 text-white'
                                    : 'text-primary-100 hover:bg-primary-800'
                                    }`}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-primary-800">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center">
                            <span className="font-bold text-lg text-white">{user?.name?.charAt(0).toUpperCase() || 'P'}</span>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-medium text-sm text-white truncate">{user?.name}</p>
                            <p className="text-xs text-primary-300 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        className="w-full justify-start text-red-100 bg-red-900/20 hover:bg-red-900/40 border-0"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} className="mr-2" />
                        {t('logout')}
                    </Button>
                </div>
            </aside>

            {/* Mobile Header */}

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ProviderLayout;
