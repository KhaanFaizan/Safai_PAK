import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { BackButton } from '../components/common/BackButton';
import { Search, DollarSign, Filter, SlidersHorizontal, Star } from 'lucide-react';

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
}

const ServiceListing = () => {

    const navigate = useNavigate();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    // Filters & Sorting
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortOption, setSortOption] = useState('recommended');

    const categories = ['All', 'House Cleaning', 'Pest Control', 'Agricultural Services', 'Deep Sanitation', 'Office Cleaning'];

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/services');
            setServices(data.services || []);
        } catch (err) {
            setError('Failed to fetch services');
        } finally {
            setLoading(false);
        }
    };

    const getFilteredAndSortedServices = () => {
        let result = [...services];

        // 1. Search
        if (searchTerm) {
            result = result.filter(s =>
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 2. Filter by Category
        if (selectedCategory !== 'All') {
            result = result.filter(s => s.category === selectedCategory);
        }

        // 3. Sort
        if (sortOption === 'price_low') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price_high') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'name_asc') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }

        return result;
    };

    const displayedServices = getFilteredAndSortedServices();

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <Loader />
        </div>
    );

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <div className="max-w-[1440px] mx-auto px-4 py-8">
                <BackButton className="mb-6 text-gray-400 hover:text-white" />

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-gray-800 pb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            Explore <span className="text-primary-500">Services</span>
                        </h1>
                        <p className="text-gray-400">Find the perfect professional for your needs</p>
                    </div>
                </div>

                {/* Filters & Search Bar */}
                <div className="flex flex-col lg:flex-row gap-6 mb-10">
                    {/* Search */}
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for services..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Controls */}
                    <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0">
                        {/* Sort Dropdown */}
                        <div className="relative min-w-[200px]">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SlidersHorizontal size={18} className="text-gray-400" />
                            </div>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="w-full pl-10 pr-8 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                            >
                                <option value="recommended">Recommended</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="name_asc">Name: A to Z</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {error && <div className="text-red-500 text-center py-8">{error}</div>}

                {/* Service Grid */}
                {displayedServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayedServices.map((service) => (
                            <div
                                key={service._id}
                                className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary-900/10 hover:-translate-y-1 flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="relative h-48 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10 opacity-60" />
                                    <img
                                        src={serviceImages[service.category] || houseCleaning}
                                        alt={service.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <span className="absolute top-3 right-3 z-20 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-gray-700">
                                        {service.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1" title={service.name}>
                                            {service.name}
                                        </h3>
                                    </div>

                                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
                                        {service.description}
                                    </p>

                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill="currentColor" />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-500">4.9 (120+ reviews)</span>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700/50">
                                        <div className="flex items-center text-white font-bold text-lg">
                                            <span className="text-primary-500 mr-1">Rs.</span>
                                            {service.price}
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => navigate(`/services/${service._id}`)}
                                            className="bg-primary-600 hover:bg-primary-500 text-white"
                                        >
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-800/30 rounded-3xl border border-gray-800">
                        <Filter className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No services found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
                        <Button
                            variant="outline"
                            className="mt-6 border-gray-600 text-gray-300 hover:text-white"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('All');
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceListing;
