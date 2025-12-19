import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { Users, Briefcase, UserCheck } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProviders: 0,
        pendingProviders: 0,
        verifiedProviders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/users'); // Uses the admin-only route we just made

            const users = data;
            const providers = users.filter((u: any) => u.role === 'provider');

            setStats({
                totalUsers: users.length,
                totalProviders: providers.length,
                pendingProviders: providers.filter((p: any) => !p.isVerified).length,
                verifiedProviders: providers.filter((p: any) => p.isVerified).length,
            });
        } catch (error) {
            console.error('Error fetching admin stats', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Platform Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Users</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <Users size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-l-4 border-l-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Providers</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProviders}</h3>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                            <Briefcase size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-l-4 border-l-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pending Verification</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingProviders}</h3>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                            <UserCheck size={24} />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-l-4 border-l-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Verified Providers</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.verifiedProviders}</h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full text-green-600">
                            <VerifiedIcon />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const VerifiedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-verified"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
)

export default AdminDashboard;
