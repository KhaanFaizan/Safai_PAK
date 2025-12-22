import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Loader } from '../../components/ui/Loader';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Calendar, Star, TrendingUp, AlertTriangle, Clock, Briefcase, CheckCircle } from 'lucide-react';

interface Booking {
    _id: string;
    scheduledDate: string;
    status: string;
    service: {
        name: string;
        price: number;
    };
    customer: {
        name: string;
    };
}

const ProviderDashboard = () => {
    const { user } = useContext(AuthContext)!;
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        earnings: 0,
        activeBookings: 0,
        completedJobs: 0,
        rating: 4.8
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: bookings } = await api.get('/bookings');

                const earnings = bookings
                    .filter((b: Booking) => b.status === 'completed')
                    .reduce((sum: number, b: Booking) => sum + (b.service?.price || 0), 0);

                const activeBookings = bookings.filter((b: Booking) =>
                    ['pending', 'accepted'].includes(b.status)
                ).length;

                const completedJobs = bookings.filter((b: Booking) => b.status === 'completed').length;

                setStats({
                    earnings,
                    activeBookings,
                    completedJobs,
                    rating: 4.8
                });

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Loader />;

    const dashboardCards = [
        {
            title: 'Total Earnings',
            value: `PKR ${stats.earnings.toLocaleString()}`,
            description: 'View your financial summary',
            icon: DollarSign,
            path: '/provider/earnings'
        },
        {
            title: 'Active Bookings',
            value: stats.activeBookings.toString(),
            description: 'Manage current jobs',
            icon: Calendar,
            path: '/provider/bookings'
        },
        {
            title: 'My Services',
            value: 'Manage',
            description: 'Update your service listings',
            icon: Briefcase,
            path: '/provider/services'
        },
        {
            title: 'Performance',
            value: `${stats.rating} ⭐`,
            description: 'View ratings & reviews',
            icon: Star,
            path: '#'
        },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <header className="text-center md:text-left opacity-0 animate-fade-in-up">
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                    Welcome, <span className="text-primary-400">{user?.name}</span>
                </h1>
                <p className="text-gray-400">Manage your business, bookings, and earnings from one place.</p>

                {/* Status Pills */}
                <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                    {user?.isSuspended && (
                        <div className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full flex items-center gap-2 text-red-400">
                            <AlertTriangle size={16} />
                            <span className="text-sm font-bold">Account Suspended</span>
                        </div>
                    )}
                    {!user?.isVerified && !user?.isSuspended && (
                        <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full flex items-center gap-2 text-yellow-400">
                            <Clock size={16} />
                            <span className="text-sm font-bold">Verification Pending</span>
                        </div>
                    )}
                    {user?.isVerified && !user?.isSuspended && (
                        <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full flex items-center gap-2 text-green-400">
                            <CheckCircle size={16} />
                            <span className="text-sm font-bold">Verified Provider</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Action Grid - The styling requested by user */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            style={{ animationDelay: `${index * 100}ms` }}
                            onClick={() => navigate(card.path)}
                            className="
                                group cursor-pointer
                                bg-gray-800 border border-gray-700 rounded-2xl p-8
                                flex flex-col items-center text-center
                                hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-900/10 hover:-translate-y-1
                                transition-all duration-300 opacity-0 animate-fade-in-up
                            "
                        >
                            <div className="
                                w-16 h-16 mb-6 rounded-full 
                                bg-gray-900 border border-gray-700 
                                flex items-center justify-center 
                                text-primary-400 group-hover:text-primary-300 group-hover:border-primary-500/30 group-hover:scale-110
                                transition-all duration-300
                            ">
                                <Icon size={28} strokeWidth={1.5} />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-200 transition-colors">
                                {card.title}
                            </h3>

                            <div className="text-3xl font-extrabold text-white mb-3 tracking-tight">
                                {card.value}
                            </div>

                            <p className="text-sm text-gray-500 font-medium group-hover:text-gray-400 transition-colors">
                                {card.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Stats Row (Optional, kept minimal) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 opacity-0 animate-fade-in-up delay-300">
                <div onClick={() => navigate('/provider/bookings')} className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:bg-gray-800 transition-colors group">
                    <div>
                        <h4 className="text-gray-400 font-medium mb-1">Response Rate</h4>
                        <p className="text-2xl font-bold text-white">100%</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                        <TrendingUp size={20} />
                    </div>
                </div>

                <div onClick={() => navigate('/provider/bookings?filter=completed')} className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:bg-gray-800 transition-colors group">
                    <div>
                        <h4 className="text-gray-400 font-medium mb-1">Jobs Completed</h4>
                        <p className="text-2xl font-bold text-white">{stats.completedJobs}</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <CheckCircle size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
