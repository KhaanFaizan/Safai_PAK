import { useEffect, useState, useContext } from 'react';
import api from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { Input } from '../../components/ui/Input';
import { Plus, Trash2, Edit2, X, AlertTriangle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { BackButton } from '../../components/ui/BackButton';

interface Service {
    _id: string;
    name: string;
    price: number;
    category: string;
    duration: string;
    description: string;
    user?: any;
}

const ProviderServices = () => {
    const { user } = useContext(AuthContext)!;
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
        category: 'Cleaning' // Default
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const { data } = await api.get('/services');
            // Filter services for current provider
            const myServices = data.services.filter((s: any) => s.user?._id === user?._id || s.user === user?._id);
            setServices(myServices);
        } catch (error) {
            console.error('Error fetching services', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        try {
            await api.delete(`/services/${id}`);
            setServices(services.filter(s => s._id !== id));
        } catch (error) {
            alert('Failed to delete service');
        }
    };

    const handleEditClick = (service: Service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price.toString(),
            duration: service.duration,
            category: service.category
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', price: '', duration: '', category: 'Cleaning' });
        setEditingService(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: Number(formData.price)
            };

            if (editingService) {
                // Update existing service
                const { data } = await api.put(`/services/${editingService._id}`, payload);
                setServices(services.map(s => s._id === editingService._id ? data : s));
            } else {
                // Create new service
                const { data } = await api.post('/services', payload);
                setServices([...services, data]);
            }
            resetForm();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to save service');
        }
    };

    if (loading) return <Loader />;

    const canAddService = user?.isVerified && !user?.isSuspended;

    return (
        <div className="space-y-8">
            <BackButton to="/provider/dashboard" className="text-gray-400 hover:text-white" />
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">My Services</h1>
                    <p className="text-gray-400">Manage the services you offer to customers.</p>
                </div>

                {canAddService ? (
                    <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
                        {showForm ? <X size={20} className="mr-2" /> : <Plus size={20} className="mr-2" />}
                        {showForm ? 'Cancel' : 'Add Service'}
                    </Button>
                ) : (
                    <div className="flex items-center gap-2 text-sm text-yellow-400 bg-yellow-900/20 px-4 py-2 rounded-lg border border-yellow-500/30">
                        <AlertTriangle size={16} />
                        {user?.isSuspended ? 'Account Suspended' : 'Verification Pending'}
                    </div>
                )}
            </div>

            {/* Service Form (Collapsible) */}
            {showForm && (
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl animate-in slide-in-from-top-4">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
                        {editingService ? 'Edit Service' : 'Add New Service'}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Input
                                label="Service Name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="bg-gray-900 border-gray-700 text-white focus:border-primary-500"
                                placeholder="e.g. Full House Cleaning"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-300">Category</label>
                            <select
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="House Cleaning">House Cleaning</option>
                                <option value="Pest Control">Pest Control</option>
                                <option value="Agricultural Services">Agricultural Services</option>
                                <option value="Deep Sanitation">Deep Sanitation</option>
                                <option value="Office Cleaning">Office Cleaning</option>
                            </select>
                        </div>
                        <div>
                            <Input
                                label="Price (PKR)"
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                required
                                className="bg-gray-900 border-gray-700 text-white focus:border-primary-500"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <Input
                                label="Duration"
                                value={formData.duration}
                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                required
                                className="bg-gray-900 border-gray-700 text-white focus:border-primary-500"
                                placeholder="e.g. 2 hours"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                            <textarea
                                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all h-32 resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                                placeholder="Describe your service in detail..."
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                            <Button type="button" variant="secondary" onClick={resetForm} className="bg-gray-700 hover:bg-gray-600 border-transparent text-white">
                                Cancel
                            </Button>
                            <Button type="submit">
                                {editingService ? 'Update Service' : 'Create Service'}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <div
                        key={service._id}
                        className="group bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-gray-600 hover:shadow-lg transition-all duration-300 flex flex-col"
                    >
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-primary-900/30 text-primary-400 text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wide border border-primary-500/20">
                                    {service.category}
                                </span>
                                <span className="text-lg font-bold text-white">PKR {service.price.toLocaleString()}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">{service.name}</h3>
                            <p className="text-gray-400 text-sm line-clamp-2 mb-4">{service.description}</p>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                                Duration: {service.duration}
                            </div>
                        </div>

                        <div className="flex border-t border-gray-700 bg-gray-900/30">
                            <button
                                onClick={() => handleEditClick(service)}
                                className="flex-1 py-3 text-sm text-gray-400 hover:text-white hover:bg-gray-700 font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <Edit2 size={16} /> Edit
                            </button>
                            <div className="w-px bg-gray-700"></div>
                            <button
                                onClick={() => handleDelete(service._id)}
                                className="flex-1 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 font-medium flex items-center justify-center gap-2 transition-colors"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {services.length === 0 && !loading && (
                <div className="text-center py-20 bg-gray-800/50 border border-gray-700 border-dashed rounded-2xl">
                    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                        <Plus size={32} />
                    </div>
                    <h3 className="text-xl font-medium text-white">No services listed yet</h3>
                    <p className="text-gray-400 mt-2 max-w-sm mx-auto mb-6">
                        Get started by adding your first service to start receiving bookings.
                    </p>
                    {canAddService && (
                        <Button onClick={() => setShowForm(true)}>
                            Create Service
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProviderServices;
