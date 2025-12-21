import { useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import { LayoutDashboard, Briefcase, Calendar, DollarSign, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

const ProviderLayout = () => {
    const { user, logout } = useContext(AuthContext)!;

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
        <div className="flex min-h-screen bg-gray-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0 hidden md:flex md:flex-col sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
                <div className="p-6 border-b border-gray-700 flex items-center gap-2">
                    <LayoutDashboard className="text-primary-500" size={28} />
                    <h2 className="text-3xl font-bold text-white">Provider Panel</h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-gray-700/50 text-white border-l-4 border-primary-500'
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-primary-400' : ''} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-gray-700">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
                            <span className="font-bold text-lg text-primary-400">{user?.name?.charAt(0).toUpperCase() || 'P'}</span>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-medium text-sm text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        className="w-full justify-start text-red-400 bg-red-500/10 hover:bg-red-500/20 border-red-500/20"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} className="mr-2" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default ProviderLayout;
