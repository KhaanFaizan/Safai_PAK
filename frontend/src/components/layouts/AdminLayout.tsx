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
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-primary-900 text-white flex-shrink-0 hidden md:flex md:flex-col">
                <div className="p-6 border-b border-primary-800 flex items-center gap-2">
                    <Shield className="text-primary-300" size={28} />
                    <h2 className="text-2xl font-bold">Admin Panel</h2>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-primary-100 hover:bg-primary-800 rounded-lg transition-colors">
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link to="/admin/providers" className="flex items-center gap-3 px-4 py-3 text-primary-100 hover:bg-primary-800 rounded-lg transition-colors">
                        <Verified size={20} />
                        <span className="font-medium">Verify Providers</span>
                    </Link>
                    <Link to="/admin/all-users" className="flex items-center gap-3 px-4 py-3 text-primary-100 hover:bg-primary-800 rounded-lg transition-colors">
                        <Users size={20} />
                        <span className="font-medium">All Users</span>
                    </Link>
                </nav>

                <div className="p-6 border-t border-primary-800">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center">
                            <span className="font-bold text-lg">{user?.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                            <p className="font-medium text-sm">{user?.name}</p>
                            <p className="text-xs text-primary-300 capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={handleLogout}
                        className="w-full justify-start text-red-100 bg-red-900/20 hover:bg-red-900/40 border-0"
                    >
                        <LogOut size={18} className="mr-2" /> Logout
                    </Button>
                </div>
            </aside>

            {/* Mobile Header (TODO: Add functionality if time permits) */}

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
