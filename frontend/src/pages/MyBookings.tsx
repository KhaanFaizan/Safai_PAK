import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { Button } from '../components/ui/Button';
import { BackButton } from '../components/common/BackButton';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, Clock, MapPin, DollarSign, AlertCircle } from 'lucide-react';

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
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/bookings');
                setBookings(data);
            } catch (error) {
                console.error('Failed to fetch bookings');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'accepted': return 'bg-primary-100 text-primary-800 border-primary-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-[1440px] mx-auto px-4 py-12">
            <BackButton className="mb-6" />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{t('myBookings')}</h1>
                <Button variant="outline" onClick={() => navigate('/services')}>
                    Book New Service
                </Button>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="mx-auto h-16 w-16 text-gray-400 mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Calendar size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{t('noBookings')}</h3>
                    <p className="text-gray-500 mb-6">Looks like you haven't booked any services yet.</p>
                    <Button onClick={() => navigate('/services')}>Browse Services</Button>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <Card key={booking._id} className="group hover:border-primary-200 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                {/* Left Content */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                        <span className="text-gray-400 text-sm flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(booking.scheduledDate).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors mb-2">
                                        {booking.service?.name}
                                    </h3>

                                    <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={16} className="text-gray-400" />
                                            <span className="font-semibold">PKR {booking.service?.price}</span>
                                        </div>
                                        {booking.address && (
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-gray-400" />
                                                <span className="truncate max-w-xs">{booking.address}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Actions */}
                                <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                                    {booking.status === 'pending' && (
                                        <Button variant="danger" className="text-sm py-2">
                                            Cancel
                                        </Button>
                                    )}
                                    <Button variant="outline" className="text-sm py-2" onClick={() => navigate(`/services/${booking.service?._id}`)}>
                                        View Service
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
