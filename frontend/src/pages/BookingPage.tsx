import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Button } from '../components/ui/Button';
import { BackButton } from '../components/common/BackButton';


import { Loader } from '../components/ui/Loader';
import { Calendar, Clock, MapPin, Phone, FileText, AlertCircle, Info } from 'lucide-react';

// Images
import houseCleaning from '../assets/images/house-cleaning-service.jpeg';
import pestControl from '../assets/images/Pest-control-service.jpeg';
import agriSpray from '../assets/images/Agriculture-spray-service.jpeg';
import deepSanitation from '../assets/images/Deep-sanitation-services.jpg';
import officeCleaning from '../assets/images/office-cleaning-service.jpeg';

const serviceImages: Record<string, string> = {
    'House Cleaning': houseCleaning,
    'Pest Control': pestControl,
    'Agricultural Services': agriSpray,
    'Deep Sanitation': deepSanitation,
    'Office Cleaning': officeCleaning,
};

// Define Service Interface locally if not shared clearly yet, or use any
interface ServiceDetails {
    _id: string;
    name: string;
    price: number;
    category: string;
    duration?: string;
    description: string;
}

const BookingPage = () => {
    const { serviceId } = useParams();

    const navigate = useNavigate();

    // Data States
    const [service, setService] = useState<ServiceDetails | null>(null);
    const [initLoading, setInitLoading] = useState(true);

    // Form States
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('09:00 AM - 12:00 PM');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');

    // UI States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchService = async () => {
            try {
                const { data } = await api.get(`/services/${serviceId}`);
                setService(data);
            } catch (e) {
                setError('Failed to load service details.');
            } finally {
                setInitLoading(false);
            }
        };
        if (serviceId) fetchService();
    }, [serviceId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Combine fields into backend expectation
            // Currently backend expects: serviceId, scheduledDate, address
            // We'll append extra info to address or notes if backend supports it.
            // Ideally backend would have more fields, but for now we pack it to save data.

            // Construct a rich address string if backend only sees 'address'
            const richAddress = `${address}\n\n[Contact: ${phone}]`;
            // Append notes if not standard
            const finalAddress = notes ? `${richAddress}\n[Notes: ${notes}]` : richAddress;

            await api.post('/bookings', {
                serviceId,
                scheduledDate: date, // Ideally ISO with time, but keeping date string for now + implicit time slot? 
                // Or better: Append time slot to notes? 
                // Let's assume standard date is enough or backend ignores time. 
                // We'll save TimeSlot in notes/address for provider reference.
                address: `${finalAddress}\n[Time Slot: ${timeSlot}]`
            });

            navigate('/bookings');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (initLoading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <Loader />
        </div>
    );

    if (!service) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
            <div className="text-center">
                <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
                <h2 className="text-xl font-bold">Service Not Found</h2>
                <Button onClick={() => navigate('/services')} className="mt-4 bg-gray-700">Back to Services</Button>
            </div>
        </div>
    );

    // Calculate today's date for min attribute
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-20">
            <div className="max-w-[1440px] mx-auto px-4 py-8">
                <BackButton className="mb-6 text-gray-400 hover:text-white" />

                <h1 className="text-3xl font-bold mb-8">Confirm Booking</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Booking Form */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <FileText className="text-primary-500" size={24} />
                                Booking Details
                            </h2>

                            {error && (
                                <div className="bg-red-900/30 border border-red-800 text-red-300 p-4 rounded-xl mb-6 flex items-start gap-3">
                                    <AlertCircle size={20} className="mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                                            <Calendar size={16} /> Scheduled Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            min={today}
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all [color-scheme:dark]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                                            <Clock size={16} /> Preferred Time Slot
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={timeSlot}
                                                onChange={(e) => setTimeSlot(e.target.value)}
                                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option>09:00 AM - 12:00 PM</option>
                                                <option>12:00 PM - 03:00 PM</option>
                                                <option>03:00 PM - 06:00 PM</option>
                                                <option>06:00 PM - 09:00 PM</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                                                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                                        <MapPin size={16} /> Service Address <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter complete street address, house number, and landmark..."
                                        rows={3}
                                        className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-600 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                                        <Phone size={16} /> Contact Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="0300-1234567"
                                        className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                                        <Info size={16} /> Special Instructions (Optional)
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Any specific requests or directions for the provider..."
                                        rows={2}
                                        className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-600 resize-none"
                                    />
                                </div>

                                <div className="pt-6 border-t border-gray-700 flex gap-4">
                                    <Button type="submit" isLoading={loading} className="flex-1 bg-primary-600 hover:bg-primary-500 text-white py-4 text-lg rounded-xl">
                                        Confirm Booking
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Summary Card */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden sticky top-24">
                            <div className="h-48 relative">
                                <img
                                    src={serviceImages[service.category] || houseCleaning}
                                    alt={service.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-gray-600">
                                    {service.category}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-white">{service.name}</h3>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                                    {service.description}
                                </p>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                                        <span className="text-gray-400">Service Fee</span>
                                        <span className="text-xl font-bold text-white">
                                            Rs. {service.price.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                                        <span className="text-gray-400">Duration</span>
                                        <span className="text-white font-medium">
                                            {service.duration ? `${service.duration} hours` : 'Standard'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-gray-300 font-bold">Total</span>
                                        <span className="text-2xl font-bold text-primary-500">
                                            Rs. {service.price.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-gray-900/50 p-4 rounded-xl text-xs text-gray-500 flex gap-2">
                                    <Info size={16} className="flex-shrink-0" />
                                    <p>
                                        Upon confirmation, the provider will be notified. Payment will be collected after service completion.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
