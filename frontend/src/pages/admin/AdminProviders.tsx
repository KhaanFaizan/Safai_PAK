import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { CheckCircle, XCircle, Search } from 'lucide-react';
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
        try {
            const { data } = await api.put(`/users/${id}/verify`, { isVerified: !currentStatus });
            setUsers(users.map(u => u._id === id ? { ...u, isVerified: data.isVerified } : u));
        } catch (error) {
            alert('Failed to update verification status');
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
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Manage Providers</h1>
                <div className="flex gap-2 w-full md:w-auto">
                    <Input
                        placeholder="Search providers..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full md:w-64"
                    />
                </div>
            </div>

            <div className="flex gap-2 mb-6">
                {['all', 'pending', 'verified'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="grid gap-4">
                {filteredUsers.map(user => (
                    <Card key={user._id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
                                {user.isVerified ? (
                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                        Verified
                                    </span>
                                ) : (
                                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-bold">
                                        Pending
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500">{user.email} • {user.phone} • {user.city}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            {user.isVerified ? (
                                <Button
                                    variant="secondary"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                    onClick={() => toggleVerification(user._id, true)}
                                >
                                    <XCircle size={16} className="mr-2" /> Revoke
                                </Button>
                            ) : (
                                <Button
                                    className="bg-green-600 hover:bg-green-700 border-transparent text-white"
                                    onClick={() => toggleVerification(user._id, false)}
                                >
                                    <CheckCircle size={16} className="mr-2" /> Approve
                                </Button>
                            )}
                        </div>
                    </Card>
                ))}
                {filteredUsers.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">No providers found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProviders;
