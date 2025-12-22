import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { Loader } from '../../components/ui/Loader';
import { Users, Briefcase, UserCheck, Shield, ChevronRight, Activity } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        stats: {
            totalUsers: number;
            totalProviders: number;
            pendingProviders: number;
            verifiedProviders: number;
        };
        recentUsers: any[];
    }>({
        stats: { totalUsers: 0, totalProviders: 0, pendingProviders: 0, verifiedProviders: 0 },
        recentUsers: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: users } = await api.get('/users');
            const providers = users.filter((u: any) => u.role === 'provider');

            // Get last 5 users for activity feed
            const recent = [...users].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

            setData({
                stats: {
                    totalUsers: users.length,
                    totalProviders: providers.length,
                    pendingProviders: providers.filter((p: any) => !p.isVerified).length,
                    verifiedProviders: providers.filter((p: any) => p.isVerified).length,
                },
                recentUsers: recent
            });
        } catch (error) {
            console.error('Error fetching admin stats', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center opacity-0 animate-fade-in-up">
                <div>
                    <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
                    <p className="text-gray-400 mt-1">Summary of system performance and metrics.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="opacity-0 animate-fade-in-up delay-100">
                    <StatCard
                        title="Total Users"
                        value={data.stats.totalUsers}
                        icon={<Users size={24} />}
                        color="text-blue-400"
                        bg="bg-blue-900/20"
                        border="border-blue-500/30"
                    />
                </div>
                <div className="opacity-0 animate-fade-in-up delay-200">
                    <StatCard
                        title="Total Providers"
                        value={data.stats.totalProviders}
                        icon={<Briefcase size={24} />}
                        color="text-purple-400"
                        bg="bg-purple-900/20"
                        border="border-purple-500/30"
                    />
                </div>
                <div className="opacity-0 animate-fade-in-up delay-300">
                    <StatCard
                        title="Pending Verification"
                        value={data.stats.pendingProviders}
                        icon={<UserCheck size={24} />}
                        color="text-yellow-400"
                        bg="bg-yellow-900/20"
                        border="border-yellow-500/30"
                    />
                </div>
                <div className="opacity-0 animate-fade-in-up delay-400">
                    <StatCard
                        title="Verified Providers"
                        value={data.stats.verifiedProviders}
                        icon={<Shield size={24} />}
                        color="text-green-400"
                        bg="bg-green-900/20"
                        border="border-green-500/30"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Quick Actions */}
                <div className="lg:col-span-2 space-y-6 opacity-0 animate-fade-in-up delay-300">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Activity className="text-primary-500" size={20} /> Quick Actions
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <QuickActionCard
                            title="Verify Providers"
                            desc="Review pending provider applications."
                            onClick={() => navigate('/admin/providers')}
                            urgent={data.stats.pendingProviders > 0}
                        />
                        <QuickActionCard
                            title="Manage Users"
                            desc="View, edit, or suspend user accounts."
                            onClick={() => navigate('/admin/all-users')}
                        />
                    </div>

                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mt-6">
                        <h3 className="font-bold text-white text-lg mb-4">System Health</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Server Status</span>
                                    <span className="text-green-400 font-bold">Online</span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-full animate-pulse"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Database Connection</span>
                                    <span className="text-green-400 font-bold">Stable</span>
                                </div>
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Recent Activity */}
                <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden self-start opacity-0 animate-fade-in-up delay-500">
                    <div className="p-4 border-b border-gray-700 bg-gray-800/50">
                        <h3 className="font-bold text-white">Recent Activity</h3>
                    </div>
                    <div className="divide-y divide-gray-700">
                        {data.recentUsers.map((user) => (
                            <div key={user._id} className="p-4 flex items-center gap-3 hover:bg-gray-700/50 transition-colors">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${user.role === 'provider' ? 'bg-purple-900/50 text-purple-400' : 'bg-blue-900/50 text-blue-400'
                                    }`}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                                        <span className="text-[10px] text-gray-600">•</span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {data.recentUsers.length === 0 && (
                            <div className="p-8 text-center text-gray-500 text-sm">No recent activity.</div>
                        )}
                    </div>
                    <div className="p-3 bg-gray-800/50 border-t border-gray-700 text-center">
                        <button onClick={() => navigate('/admin/all-users')} className="text-xs font-medium text-primary-400 hover:text-primary-300">
                            View All Activity
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Components
const StatCard = ({ title, value, icon, color, bg, border }: any) => (
    <div className={`p-6 rounded-2xl border ${bg} ${border} backdrop-blur-sm`}>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
            <div className={`p-2 rounded-lg ${bg} ${color}`}>
                {icon}
            </div>
        </div>
        <p className="text-3xl font-bold text-white">{value}</p>
    </div>
);

const QuickActionCard = ({ title, desc, onClick, urgent }: any) => (
    <div
        onClick={onClick}
        className={`group p-6 rounded-2xl bg-gray-800 border cursor-pointer transition-all hover:-translate-y-1 ${urgent ? 'border-yellow-500/50 hover:border-yellow-500' : 'border-gray-700 hover:border-gray-500'
            }`}
    >
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">{title}</h3>
                <p className="text-sm text-gray-400">{desc}</p>
            </div>
            <div className={`p-2 rounded-full ${urgent ? 'bg-yellow-500/20 text-yellow-500' : 'bg-gray-700 text-gray-400 group-hover:bg-primary-900/50 group-hover:text-primary-400'}`}>
                <ChevronRight size={20} />
            </div>
        </div>
    </div>
);

export default AdminDashboard;
