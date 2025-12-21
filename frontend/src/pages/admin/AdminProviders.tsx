import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { CheckCircle, XCircle, Search, Filter, Shield, AlertTriangle } from 'lucide-react';
import { Input } from '../../components/ui/Input';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    city: string;
    isVerified: boolean;
}

const AdminProviders = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, verified, pending
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data.filter((u: any) => u.role === 'provider'));
        } catch (error) {
            console.error('Error fetching users', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleVerification = async (id: string, currentStatus: boolean) => {
        if (!window.confirm(currentStatus
            ? "Are you sure you want to revoke this provider's verification? This will restrict their access."
            : "Are you sure you want to verify this provider? This will granting them full access to accept bookings."
        )) return;

        setProcessingId(id);
        try {
            const { data } = await api.put(`/users/${id}/verify`, { isVerified: !currentStatus });
            setUsers(users.map(u => u._id === id ? { ...u, isVerified: data.isVerified } : u));
        } catch (error) {
            alert('Failed to update verification status');
        } finally {
            setProcessingId(null);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ? true :
            filter === 'verified' ? user.isVerified :
                !user.isVerified;
        return matchesSearch && matchesFilter;
    });

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Shield className="text-primary-500" size={28} />
                        Verify Providers
                    </h1>
                    <p className="text-gray-400 mt-1">Review and manage provider verification requests.</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            placeholder="Search name or email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500"
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 border-b border-gray-700 pb-1">
                {['all', 'pending', 'verified'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 text-sm font-medium capitalize transition-all border-b-2 ${filter === f
                                ? 'border-primary-500 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Providers List */}
            <div className="grid gap-4">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <div
                            key={user._id}
                            className={`p-5 rounded-xl border transition-all ${user.isVerified
                                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                    : 'bg-gray-800/80 border-primary-900/50 hover:border-primary-500/30'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${user.isVerified ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-500'
                                        }`}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-white text-lg">{user.name}</h3>
                                            {user.isVerified ? (
                                                <span className="bg-green-900/30 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-500/30 font-medium flex items-center gap-1">
                                                    <CheckCircle size={12} /> Verified
                                                </span>
                                            ) : (
                                                <span className="bg-yellow-900/30 text-yellow-500 text-xs px-2 py-0.5 rounded-full border border-yellow-500/30 font-medium flex items-center gap-1">
                                                    <AlertTriangle size={12} /> Pending Review
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1 space-y-1 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
                                            <span>{user.email}</span>
                                            <span className="hidden md:inline text-gray-600">•</span>
                                            <span>{user.phone}</span>
                                            <span className="hidden md:inline text-gray-600">•</span>
                                            <span>{user.city}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-0 border-gray-700">
                                    {user.isVerified ? (
                                        <Button
                                            variant="secondary"
                                            disabled={processingId === user._id}
                                            className="w-full md:w-auto bg-gray-700 text-gray-300 hover:bg-red-900/30 hover:text-red-400 hover:border-red-500/30 border border-gray-600 transition-all"
                                            onClick={() => toggleVerification(user._id, true)}
                                        >
                                            <XCircle size={16} className="mr-2" />
                                            {processingId === user._id ? 'Processing...' : 'Revoke Access'}
                                        </Button>
                                    ) : (
                                        <Button
                                            disabled={processingId === user._id}
                                            className="w-full md:w-auto bg-green-600 hover:bg-green-500 border-0 text-white shadow-lg shadow-green-900/20"
                                            onClick={() => toggleVerification(user._id, false)}
                                        >
                                            <CheckCircle size={16} className="mr-2" />
                                            {processingId === user._id ? 'Verifying...' : 'Approve Provider'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-800 rounded-2xl border border-gray-700 border-dashed text-center">
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-500">
                            <Filter size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No providers found</h3>
                        <p className="text-gray-400 max-w-sm mx-auto">
                            We couldn't find any providers matching your current filters or search query.
                        </p>
                        {filter !== 'all' && (
                            <button
                                onClick={() => setFilter('all')}
                                className="mt-6 text-primary-400 font-medium hover:text-primary-300 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProviders;
