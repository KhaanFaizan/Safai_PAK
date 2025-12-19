import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { DollarSign, Calendar, Star, TrendingUp } from 'lucide-react';

const ProviderDashboard = () => {
    const { user } = useContext(AuthContext)!;

    // TODO: Fetch real stats from API
    const stats = [
        { label: 'Total Earnings', value: 'PKR 45,000', icon: DollarSign, color: 'bg-green-100 text-green-600' },
        { label: 'Active Bookings', value: '12', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
        { label: 'Rating', value: '4.8', icon: Star, color: 'bg-yellow-100 text-yellow-600' },
        { label: 'Completed Jobs', value: '156', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
    ];

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Welcome back, {user?.name}</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="p-6 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activity (Placeholder) */}
            <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">Recent Bookings</h2>
                <div className="text-center py-8 text-gray-500">
                    No recent activity to show.
                </div>
            </Card>
        </div>
    );
};

export default ProviderDashboard;
