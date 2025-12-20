import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { BackButton } from '../components/common/BackButton';
import { useLanguage } from '../context/LanguageContext';
import { Search, DollarSign } from 'lucide-react';

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

interface Service {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    // Mocking an image for now, or if model has it.
}

const ServiceListing = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/services');
            setServices(data.services || []);
        } catch (err) {
            setError(t('error'));
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loader />;

    return (
        <div className="max-w-[1440px] mx-auto px-4 py-8">
            <BackButton className="mb-6" />
            {/* Header / Search */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">{t('services')}</h1>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('search')}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && <div className="text-red-500 text-center">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map(service => (
                    <Card key={service._id} className="flex flex-col h-full hover:shadow-lg transition-transform hover:-translate-y-1">
                        {/* Placeholder Image */}
                        <div className="h-48 overflow-hidden rounded-t-lg mb-4">
                            <img
                                src={serviceImages[service.category] || houseCleaning}
                                alt={service.name}
                                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-primary-600 bg-primary-50 px-2 py-1 rounded">
                                    {service.category}
                                </span>
                                <div className="flex items-center text-gray-700 font-bold">
                                    <DollarSign size={16} />
                                    {service.price}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">{service.description}</p>
                        </div>
                        <Button onClick={() => navigate(`/services/${service._id}`)} className="w-full mt-auto">
                            {t('description')}
                        </Button>
                    </Card>
                ))}
            </div>

            {filteredServices.length === 0 && !loading && (
                <p className="text-center text-gray-500 mt-12">No services found.</p>
            )}
        </div>
    );
};

export default ServiceListing;
