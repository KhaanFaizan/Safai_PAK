import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Button } from '../components/ui/Button';
import { BackButton } from '../components/common/BackButton';
import { Loader } from '../components/ui/Loader';
import { CheckCircle, Clock, Star, Shield, ThumbsUp, Leaf } from 'lucide-react';

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

interface ServiceDetail {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration?: string;
    category: string;
    user: {
        _id: string;
        name: string;
        rating: number;
        numReviews: number;
    }
}

const ServiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState<ServiceDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const { data } = await api.get(`/services/${id}`);
                setService(data);
            } catch (err) {
                // Handle error
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <Loader />
        </div>
    );

    if (!service) return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
            <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
            <Button onClick={() => navigate('/services')} className="bg-gray-700">Back to Services</Button>
        </div>
    );

    const features = [
        { icon: Shield, text: "Verified Provider" },
        { icon: Leaf, text: "Eco-friendly Products" },
        { icon: ThumbsUp, text: "Satisfaction Guarantee" },
        { icon: Clock, text: "Timely Service" }
    ];

    const reviews = [
        { user: "Ahmed K.", rating: 5, text: "Excellent service! Highly recommended.", date: "2 days ago" },
        { user: "Sara M.", rating: 4, text: "Good job, but arrived slightly late.", date: "1 week ago" },
        { user: "Bilal R.", rating: 5, text: "Very professional and clean work.", date: "2 weeks ago" }
    ];

    return (
        <div className="bg-gray-900 min-h-screen text-white pb-20">
            <div className="max-w-[1440px] mx-auto px-4 py-8">
                <BackButton className="mb-6 text-gray-400 hover:text-white" />

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Main Content */}
                    <div className="lg:col-span-2">
                        {/* Hero Image */}
                        <div className="h-[400px] rounded-2xl overflow-hidden shadow-2xl relative mb-8 group">
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80 z-10" />
                            <img
                                src={serviceImages[service.category] || houseCleaning}
                                alt={service.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute bottom-6 left-6 z-20">
                                <span className="inline-block bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                                    {service.category}
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold text-white shadow-sm">{service.name}</h1>
                            </div>
                        </div>

                        {/* Overview Section */}
                        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 mb-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center text-yellow-400 gap-1 bg-gray-900/50 px-3 py-1 rounded-full border border-gray-700">
                                    <Star size={16} fill="currentColor" />
                                    <span className="font-bold text-sm">4.8</span>
                                    <span className="text-gray-400 text-xs">(120 Reviews)</span>
                                </div>
                                <span className="text-gray-500">•</span>
                                <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                                    <CheckCircle size={14} /> Available Now
                                </span>
                            </div>

                            <h3 className="text-xl font-bold mb-4">Description</h3>
                            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap mb-8 text-lg">
                                {service.description}
                            </p>

                            <h3 className="text-xl font-bold mb-6">Service Features</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {features.map((feature, idx) => (
                                    <div key={idx} className="bg-gray-900 p-4 rounded-xl border border-gray-700 flex flex-col items-center text-center gap-3 hover:border-primary-500/30 transition-colors">
                                        <feature.icon className="text-primary-500" size={24} />
                                        <span className="text-sm font-medium text-gray-300">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                            <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>
                            <div className="space-y-6">
                                {reviews.map((review, idx) => (
                                    <div key={idx} className="border-b border-gray-700 last:border-0 pb-6 last:pb-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center font-bold text-white">
                                                    {review.user.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white">{review.user}</h4>
                                                    <div className="flex text-yellow-400 text-xs">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-600" : ""} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-gray-500 text-xs">{review.date}</span>
                                        </div>
                                        <p className="text-gray-400 mt-2">{review.text}</p>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-6 border-gray-600 text-gray-300 hover:text-white">
                                View All Reviews
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Booking Card */}
                            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">Total Price</p>
                                        <h2 className="text-3xl font-bold text-white">
                                            <span className="text-primary-500 mr-1">Rs.</span>
                                            {service.price.toLocaleString()}
                                        </h2>
                                    </div>
                                </div>

                                <div className="bg-gray-900 rounded-xl p-4 mb-6 border border-gray-700">
                                    <div className="flex items-center gap-3 text-gray-300 mb-2">
                                        <Clock size={18} className="text-primary-500" />
                                        <span>Duration: <span className="font-bold text-white">{service.duration || 'Standard'}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <CheckCircle size={18} className="text-primary-500" />
                                        <span>Satisfaction Guaranteed</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full text-lg py-4 bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/20 mb-4"
                                    onClick={() => navigate(`/book/${service._id}`)}
                                >
                                    Book Now
                                </Button>
                                <p className="text-center text-xs text-gray-500">No payment required until completion</p>
                            </div>

                            {/* Provider Card */}
                            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                                <h4 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-4">Service Provider</h4>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 bg-gray-700 rounded-full overflow-hidden border-2 border-primary-500">
                                        {/* Placeholder for provider image */}
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                                            {service.user?.name?.charAt(0) || 'P'}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                            {service.user?.name || 'Provider'}
                                            <CheckCircle size={14} className="text-blue-500" />
                                        </h3>
                                        <p className="text-sm text-gray-400">Verified Partner</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-center">
                                    <div className="bg-gray-900 p-2 rounded-lg">
                                        <span className="block font-bold text-white">{service.user?.rating?.toFixed(1) || '4.9'}</span>
                                        <span className="text-xs text-gray-500">Rating</span>
                                    </div>
                                    <div className="bg-gray-900 p-2 rounded-lg">
                                        <span className="block font-bold text-white">{service.user?.numReviews || '50+'}</span>
                                        <span className="text-xs text-gray-500">Jobs</span>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full mt-4 border-gray-600 text-gray-300 hover:text-white text-sm">
                                    View Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetails;
