import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, Users, LogOut, Verified, Shield } from 'lucide-react';
import { Button } from '../ui/Button';

const AdminLayout = () => {
    const { logout, user } = useContext(AuthContext)!;
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0 hidden md:flex md:flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-gray-700 flex items-center gap-2">
                    <Shield className="text-primary-500" size={28} />
                    <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link to="/admin/providers" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
                        <Verified size={20} />
                        <span className="font-medium">Verify Providers</span>
                    </Link>
                    <Link to="/admin/all-users" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
                        <Users size={20} />
                        <span className="font-medium">All Users</span>
                    </Link>
                </nav>

                <div className="p-6 border-t border-gray-700">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
                            <span className="font-bold text-lg text-white">{user?.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                            <p className="font-medium text-sm text-white">{user?.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={handleLogout}
                        className="w-full justify-start text-red-400 bg-red-900/10 hover:bg-red-900/20 border border-red-900/20 transition-all shadow-none"
                    >
                        <LogOut size={18} className="mr-2" /> Logout
                    </Button>
                </div>
            </aside>

            {/* Mobile Header (TODO: Add functionality if time permits) */}

            {/* Main Content */}
            <main className="flex-1">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
