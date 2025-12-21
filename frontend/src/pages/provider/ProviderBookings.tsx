import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { Calendar, MapPin, User, Phone, CheckCircle, XCircle, Filter, Inbox } from 'lucide-react';

interface Booking {
    _id: string;
    scheduledDate: string;
    status: string;
    address: string;
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    service: {
        name: string;
        price: number;
    }
}

const ProviderBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            // Optimistic update
            setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
            await api.put(`/bookings/${id}/status`, { status });
        } catch (error) {
            alert('Failed to update status');
            fetchBookings(); // Revert on failure
        }
    };

    const filteredBookings = filter === 'all'
        ? bookings
        : bookings.filter(b => b.status === filter);

    if (loading) return <Loader />;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-900/30 text-green-400 border-green-500/30';
            case 'pending': return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30';
            case 'cancelled': return 'bg-red-900/30 text-red-400 border-red-500/30';
            case 'accepted': return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
            default: return 'bg-gray-700 text-gray-400';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manage Bookings</h1>
                    <p className="text-gray-400 text-sm">Track and manage your service appointments.</p>
                </div>

                <div className="flex flex-wrap gap-2 bg-gray-800 p-1 rounded-lg border border-gray-700">
                    {['all', 'pending', 'accepted', 'completed', 'cancelled'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${filter === f
                                    ? 'bg-gray-700 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredBookings.map(booking => (
                    <div key={booking._id} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all shadow-sm">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Service & Customer Info */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{booking.service?.name || "Unknown Service"}</h3>
                                        <p className="text-primary-400 font-medium">PKR {booking.service?.price?.toLocaleString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-primary-400">
                                            <Calendar size={16} />
                                        </div>
                                        <span className="text-sm font-medium">{new Date(booking.scheduledDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-primary-400">
                                            <MapPin size={16} />
                                        </div>
                                        <span className="text-sm truncate max-w-[200px]">{booking.address}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-primary-400">
                                            <User size={16} />
                                        </div>
                                        <span className="text-sm">{booking.customer?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-primary-400">
                                            <Phone size={16} />
                                        </div>
                                        <span className="text-sm">{booking.customer?.phone || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex lg:flex-col items-center lg:justify-center gap-3 border-t lg:border-t-0 lg:border-l border-gray-700 pt-4 lg:pt-0 lg:pl-6 min-w-[200px]">
                                {booking.status === 'pending' && (
                                    <>
                                        <Button
                                            size="sm"
                                            className="w-full bg-green-600 hover:bg-green-700 border-transparent"
                                            onClick={() => updateStatus(booking._id, 'accepted')}
                                        >
                                            <CheckCircle size={16} className="mr-2" /> Accept Booking
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="w-full border-red-500/30 text-red-400 hover:bg-red-900/20"
                                            onClick={() => updateStatus(booking._id, 'cancelled')}
                                        >
                                            <XCircle size={16} className="mr-2" /> Reject
                                        </Button>
                                    </>
                                )}
                                {booking.status === 'accepted' && (
                                    <Button
                                        className="w-full"
                                        onClick={() => updateStatus(booking._id, 'completed')}
                                    >
                                        <CheckCircle size={16} className="mr-2" /> Mark Completed
                                    </Button>
                                )}
                                {['completed', 'cancelled'].includes(booking.status) && (
                                    <span className="text-sm text-gray-500 italic">No actions available</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredBookings.length === 0 && (
                    <div className="text-center py-20 bg-gray-800/50 border border-gray-700 border-dashed rounded-2xl">
                        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                            <Inbox size={32} />
                        </div>
                        <h3 className="text-xl font-medium text-white">No bookings found</h3>
                        <p className="text-gray-400 mt-2">
                            {filter === 'all'
                                ? "You haven't received any bookings yet."
                                : `No bookings with status "${filter}".`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderBookings;
