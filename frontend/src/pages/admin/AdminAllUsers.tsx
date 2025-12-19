import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { Input } from '../../components/ui/Input';
import { User, Shield, Briefcase, Mail, Phone, MapPin } from 'lucide-react';

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    city: string;
    createdAt: string;
    isSuspended?: boolean;
}

const AdminAllUsers = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSuspension = async (id: string, currentStatus: boolean) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'activate' : 'suspend'} this user?`)) return;

        try {
            const { data } = await api.put(`/users/${id}/suspend`);
            setUsers(users.map(u => u._id === id ? { ...u, isSuspended: data.isSuspended } : u));
        } catch (error) {
            alert('Failed to update suspension status');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' ? true : user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1"><Shield size={12} /> Admin</span>;
            case 'provider':
                return <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1"><Briefcase size={12} /> Provider</span>;
            default:
                return <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1"><User size={12} /> Customer</span>;
        }
    };

    if (loading) return <Loader />;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-2xl font-bold text-gray-900">All Users (Admin View)</h1>
                <div className="flex gap-2 w-full md:w-auto">
                    <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full md:w-64"
                    />
                </div>
            </div>

            <div className="flex gap-2 mb-6">
                {['all', 'customer', 'provider', 'admin'].map(role => (
                    <button
                        key={role}
                        onClick={() => setRoleFilter(role)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${roleFilter === role ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        {role}
                    </button>
                ))}
            </div>

            <div className="grid gap-4">
                {filteredUsers.map(user => (
                    <Card key={user._id} className={`p-4 ${user.isSuspended ? 'opacity-75 bg-gray-50' : ''}`}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className={`font-bold text-lg ${user.isSuspended ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{user.name}</h3>
                                    {getRoleBadge(user.role)}
                                    {user.isSuspended && <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded uppercase font-bold">Suspended</span>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Mail size={14} /> {user.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={14} /> {user.phone || 'N/A'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} /> {user.city || 'N/A'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">ID: {user._id}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {user.isSuspended ? (
                                    <button
                                        onClick={() => toggleSuspension(user._id, true)}
                                        className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                                    >
                                        Activate
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => toggleSuspension(user._id, false)}
                                        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                                    >
                                        Suspend
                                    </button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">No users found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAllUsers;
