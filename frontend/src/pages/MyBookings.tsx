import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Loader } from '../components/ui/Loader';
import { Button } from '../components/ui/Button';
import { BackButton } from '../components/common/BackButton';
import { Calendar, Clock, MapPin, DollarSign, Search, Filter, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface Booking {
    _id: string;
    scheduledDate: string;
    status: string;
    address: string;
    service: {
        _id: string;
        name: string;
        price: number;
        category: string;
    }
}

const MyBookings = () => {

    const navigate = useNavigate();

    // Data States
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/bookings');
                setBookings(data);
                setFilteredBookings(data);
            } catch (error) {
                console.error('Failed to fetch bookings');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    // Filter Logic
    useEffect(() => {
        let result = bookings;

        // Apply Status Filter
        if (statusFilter !== 'All') {
            result = result.filter(b => b.status.toLowerCase() === statusFilter.toLowerCase());
        }

        // Apply Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(b =>
                b.service?.name.toLowerCase().includes(query) ||
                b.address.toLowerCase().includes(query)
            );
        }

        setFilteredBookings(result);
    }, [bookings, statusFilter, searchQuery]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'completed': return { bg: 'bg-green-900/40', text: 'text-green-400', border: 'border-green-800', icon: CheckCircle };
            case 'accepted': return { bg: 'bg-blue-900/40', text: 'text-blue-400', border: 'border-blue-800', icon: CheckCircle };
            case 'cancelled': return { bg: 'bg-red-900/40', text: 'text-red-400', border: 'border-red-800', icon: XCircle };
            case 'pending': return { bg: 'bg-yellow-900/40', text: 'text-yellow-400', border: 'border-yellow-800', icon: Clock };
            default: return { bg: 'bg-gray-800', text: 'text-gray-400', border: 'border-gray-700', icon: AlertCircle };
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await api.put(`/bookings/${bookingId}/status`, { status: 'cancelled' });

            // Update state to reflect change
            setBookings(prev => prev.map(b =>
                b._id === bookingId ? { ...b, status: 'cancelled' } : b
            ));
        } catch (error) {
            console.error('Failed to cancel booking', error);
            alert('Failed to cancel booking');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <Loader />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
            <div className="max-w-[1440px] mx-auto px-4 py-8">
                <BackButton className="mb-6 text-gray-400 hover:text-white" />

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">My Bookings</h1>
                        <p className="text-gray-400 mt-1">Manage and track your service requests</p>
                    </div>
                    <Button onClick={() => navigate('/services')} className="bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/20">
                        Book New Service
                    </Button>
                </div>

                {/* Filters & Search */}
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                        {['All', 'Pending', 'Accepted', 'Completed', 'Cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${statusFilter === status
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            placeholder="Search service name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none placeholder-gray-500"
                        />
                        <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
                    </div>
                </div>

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800 rounded-2xl border border-dashed border-gray-700">
                        <div className="mx-auto h-16 w-16 text-gray-600 mb-4 bg-gray-900 rounded-full flex items-center justify-center">
                            <Filter size={32} />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">
                            {bookings.length === 0 ? 'No bookings found' : 'No bookings found'}
                        </h3>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">
                            {bookings.length === 0
                                ? "You haven't booked any services yet. Explore our services and book your first one today!"
                                : "We couldn't find any bookings matching your current filters."}
                        </p>
                        {bookings.length === 0 && (
                            <Button onClick={() => navigate('/services')} className="bg-gray-700 hover:bg-gray-600">
                                Browse Services
                            </Button>
                        )}
                        {bookings.length > 0 && (
                            <Button onClick={() => { setStatusFilter('All'); setSearchQuery(''); }} variant="outline" className="border-gray-600 text-gray-300">
                                Clear Filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredBookings.map((booking) => {
                            const styles = getStatusStyles(booking.status);
                            const StatusIcon = styles.icon;

                            return (
                                <div
                                    key={booking._id}
                                    className="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700 hover:border-primary-500/50 transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">

                                        {/* Left: Date & Info */}
                                        <div className="flex-1 flex gap-4 md:gap-6">
                                            {/* Date Badge */}
                                            <div className="hidden md:flex flex-col items-center justify-center bg-gray-900 border border-gray-700 rounded-xl w-20 h-20 text-center shrink-0">
                                                <span className="text-xs text-gray-400 uppercase font-bold">
                                                    {new Date(booking.scheduledDate).toLocaleString('default', { month: 'short' })}
                                                </span>
                                                <span className="text-2xl font-bold text-white">
                                                    {new Date(booking.scheduledDate).getDate()}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(booking.scheduledDate).getFullYear()}
                                                </span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                                                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border ${styles.bg} ${styles.text} ${styles.border}`}>
                                                        <StatusIcon size={12} /> {booking.status}
                                                    </span>
                                                    <span className="md:hidden text-gray-400 text-xs flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {new Date(booking.scheduledDate).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-primary-500 transition-colors mb-2 break-words">
                                                    {booking.service?.name}
                                                </h3>

                                                <div className="flex flex-col sm:flex-row gap-x-6 gap-y-1 text-sm text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign size={14} className="text-gray-500 shrink-0" />
                                                        <span className="font-medium text-gray-300">PKR {booking.service?.price}</span>
                                                    </div>
                                                    {booking.address && (
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <MapPin size={14} className="text-gray-500 shrink-0" />
                                                            <span className="break-words">{booking.address}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-gray-700 w-full md:w-auto mt-4 md:mt-0">
                                            {booking.status === 'pending' && (
                                                <Button
                                                    variant="danger"
                                                    className="text-sm py-2 px-4 bg-red-900/20 text-red-400 border border-red-900 hover:bg-red-900/40 w-full md:w-auto whitespace-nowrap"
                                                    onClick={() => handleCancelBooking(booking._id)}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                className="text-sm py-2 px-4 border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 hover:bg-gray-700 w-full md:w-auto justify-center whitespace-nowrap"
                                                onClick={() => navigate(`/services/${booking.service?._id}`)}
                                            >
                                                View Service
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
