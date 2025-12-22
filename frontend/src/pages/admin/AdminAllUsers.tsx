import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Loader } from '../../components/ui/Loader';
import { BackButton } from '../../components/ui/BackButton';
import { Input } from '../../components/ui/Input';
import { User, Shield, Briefcase, Mail, Phone, MapPin, Search, Ban, CheckCircle, SlidersHorizontal } from 'lucide-react';

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
    const [processingId, setProcessingId] = useState<string | null>(null);

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
        if (!window.confirm(currentStatus
            ? "Are you sure you want to activate this user? They will regain access to their account."
            : "Are you sure you want to suspend this user? They will not be able to login."
        )) return;

        setProcessingId(id);
        try {
            const { data } = await api.put(`/users/${id}/suspend`);
            setUsers(users.map(u => u._id === id ? { ...u, isSuspended: data.isSuspended } : u));
        } catch (error) {
            alert('Failed to update suspension status');
        } finally {
            setProcessingId(null);
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
                return <span className="bg-red-900/30 text-red-400 border border-red-500/30 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Shield size={12} /> Admin</span>;
            case 'provider':
                return <span className="bg-purple-900/30 text-purple-400 border border-purple-500/30 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Briefcase size={12} /> Provider</span>;
            default:
                return <span className="bg-blue-900/30 text-blue-400 border border-blue-500/30 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><User size={12} /> Customer</span>;
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <BackButton to="/admin/dashboard" className="text-gray-400 hover:text-white" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 opacity-0 animate-fade-in-up">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <User className="text-primary-500" size={28} />
                        Manage Users
                    </h1>
                    <p className="text-gray-400 mt-1">View, search, and manage all registered users.</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500"
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 border-b border-gray-700 pb-1 overflow-x-auto opacity-0 animate-fade-in-up delay-100">
                {['all', 'customer', 'provider', 'admin'].map(role => (
                    <button
                        key={role}
                        onClick={() => setRoleFilter(role)}
                        className={`px-4 py-2 text-sm font-medium capitalize transition-all border-b-2 whitespace-nowrap ${roleFilter === role
                            ? 'border-primary-500 text-primary-400'
                            : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                            }`}
                    >
                        {role}
                    </button>
                ))}
            </div>

            {/* Users List */}
            <div className="grid gap-4">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                        <div
                            key={user._id}
                            style={{ animationDelay: `${index * 100}ms` }}
                            className={`p-5 rounded-xl border transition-all opacity-0 animate-fade-in-up ${user.isSuspended
                                ? 'bg-gray-800/50 border-gray-700 opacity-75 grayscale-[0.5]'
                                : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex-1 w-full">
                                    <div className="flex items-center justify-between md:justify-start gap-3 mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${user.isSuspended ? 'bg-gray-700 text-gray-400' : 'bg-primary-900/30 text-primary-400 border border-primary-500/20'
                                                }`}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h3 className={`font-bold text-lg break-all ${user.isSuspended ? 'text-gray-400 line-through decoration-red-500/50' : 'text-white'}`}>
                                                        {user.name}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {getRoleBadge(user.role)}
                                                        {user.isSuspended && (
                                                            <span className="bg-red-900/30 text-red-500 border border-red-500/30 text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                                                Suspended
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-400 mt-2 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 md:divide-x md:divide-gray-700">
                                                    <div className="flex items-center gap-2 pr-4 break-all min-w-0">
                                                        <Mail size={14} className="text-gray-500 shrink-0" /> <span className="truncate">{user.email}</span>
                                                    </div>
                                                    {user.phone && (
                                                        <div className="flex items-center gap-2 md:px-4 shrink-0">
                                                            <Phone size={14} className="text-gray-500 shrink-0" /> {user.phone}
                                                        </div>
                                                    )}
                                                    {user.city && (
                                                        <div className="flex items-center gap-2 md:pl-4 shrink-0">
                                                            <MapPin size={14} className="text-gray-500 shrink-0" /> {user.city}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-0 border-gray-700">
                                    {user.role !== 'admin' && ( // Prevent suspending other admins for safety
                                        user.isSuspended ? (
                                            <button
                                                disabled={processingId === user._id}
                                                onClick={() => toggleSuspension(user._id, true)}
                                                className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processingId === user._id ? <Loader className="h-4 w-4" /> : <CheckCircle size={16} />}
                                                Re-Activate User
                                            </button>
                                        ) : (
                                            <button
                                                disabled={processingId === user._id}
                                                onClick={() => toggleSuspension(user._id, false)}
                                                className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-red-900/30 text-gray-300 hover:text-red-400 hover:border-red-500/30 border border-transparent rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processingId === user._id ? <Loader className="h-4 w-4" /> : <Ban size={16} />}
                                                Suspend Access
                                            </button>
                                        )
                                    )}
                                    {user.role === 'admin' && (
                                        <div className="px-4 py-2 text-sm text-gray-500 italic">
                                            Role Immutable
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-800 rounded-2xl border border-gray-700 border-dashed text-center">
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-500">
                            <SlidersHorizontal size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No users found</h3>
                        <p className="text-gray-400 max-w-sm mx-auto">
                            No users match your current search or filter criteria.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAllUsers;
