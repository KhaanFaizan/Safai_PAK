import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { Calendar, Clock, MapPin, User, Phone, CheckCircle, XCircle } from 'lucide-react';

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
            await api.put(`/bookings/${id}/status`, { status });
            // Optimistic update
            setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const filteredBookings = filter === 'all'
        ? bookings
        : bookings.filter(b => b.status === filter);

    if (loading) return <Loader />;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
                <div className="flex gap-2">
                    {['all', 'pending', 'accepted', 'completed', 'cancelled'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredBookings.map(booking => (
                    <Card key={booking._id} className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            {/* Service & Customer Info */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">{booking.service?.name}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mt-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        {new Date(booking.scheduledDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        {booking.address}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User size={16} />
                                        {booking.customer?.name}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} />
                                        {booking.customer?.phone || 'N/A'}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col justify-center gap-2 min-w-[140px] border-l pl-6 border-gray-100">
                                {booking.status === 'pending' && (
                                    <>
                                        <Button size="sm" onClick={() => updateStatus(booking._id, 'accepted')}>
                                            <CheckCircle size={16} className="mr-2" /> Accept
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => updateStatus(booking._id, 'cancelled')}>
                                            <XCircle size={16} className="mr-2" /> Reject
                                        </Button>
                                    </>
                                )}
                                {booking.status === 'accepted' && (
                                    <Button variant="secondary" size="sm" onClick={() => updateStatus(booking._id, 'completed')}>
                                        Mark Completed
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
                {filteredBookings.length === 0 && (
                    <p className="text-center text-gray-500 py-12">No bookings found.</p>
                )}
            </div>
        </div>
    );
};

export default ProviderBookings;
