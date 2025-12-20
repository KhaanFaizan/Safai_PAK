import { useEffect, useState, useContext } from 'react';
import api from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { Input } from '../../components/ui/Input';
import { Plus, Trash2, Edit } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

interface Service {
    _id: string;
    name: string;
    price: number;
    category: string;
    duration: string;
    description: string;
}

const ProviderServices = () => {
    const { user } = useContext(AuthContext)!;
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

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
            // TODO: Backend should have endpoint to get "my services" or we filter client side?
            // Existing serviceController `getServices` has provider filter logic if we pass provider ID?
            // Actually, best to add "GET /services?user={id}" or assume auth provider sees all for now and we filter.
            // Let's try fetching all and filtering by user._id for MVP. 
            // Ideally backend should have `GET /services/my-services`. 
            const { data } = await api.get('/services');
            // Data is { services: [], page, pages }
            const myServices = data.services.filter((s: any) => s.user?._id === user?._id || s.user === user?._id);
            setServices(myServices);
        } catch (error) {
            console.error('Error fetching services', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/services/${id}`);
            setServices(services.filter(s => s._id !== id));
        } catch (error) {
            alert('Failed to delete service');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/services', {
                ...formData,
                price: Number(formData.price)
            });
            setServices([...services, data]);
            setShowForm(false);
            setFormData({ name: '', description: '', price: '', duration: '', category: 'Cleaning' });
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to create service');
        }
    };

    if (loading) return <Loader />;

    const canAddService = user?.isVerified && !user?.isSuspended;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Manage Services</h1>
                {canAddService ? (
                    <Button onClick={() => setShowForm(!showForm)}>
                        <Plus size={20} className="mr-2" />
                        Add Service
                    </Button>
                ) : (
                    <div className="text-sm text-gray-500 italic bg-gray-100 px-4 py-2 rounded-lg">
                        {user?.isSuspended ? 'Account Suspended' : 'Verification Pending'}
                    </div>
                )}
            </div>

            {/* Quick Add Form (Collapsible) */}
            {showForm && (
                <Card className="mb-8 p-6 bg-gray-50 border-primary-200">
                    <h3 className="font-bold mb-4">Add New Service</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Service Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Category</label>
                            <select
                                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary-500"
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
                        <Input
                            label="Price (PKR)"
                            type="number"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                        <Input
                            label="Duration (e.g. 2 hours)"
                            value={formData.duration}
                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                            required
                        />
                        <div className="md:col-span-2">
                            <Input
                                label="Description"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
                            <Button type="submit">Create Service</Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Services List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <Card key={service._id} className="relative group">
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded uppercase font-bold">
                                    {service.category}
                                </span>
                                <span className="font-bold text-gray-900">PKR {service.price}</span>
                            </div>
                            <h3 className="text-lg font-bold mb-1">{service.name}</h3>
                            <p className="text-gray-500 text-sm h-10 line-clamp-2">{service.description}</p>
                            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                Duration: {service.duration}
                            </p>
                        </div>
                        <div className="flex border-t border-gray-100">
                            <button className="flex-1 py-3 text-sm text-gray-600 hover:bg-gray-50 font-medium flex items-center justify-center gap-2">
                                <Edit size={16} /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(service._id)}
                                className="flex-1 py-3 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center justify-center gap-2 border-l border-gray-100"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
            {services.length === 0 && !loading && (
                <p className="text-gray-500 text-center">You haven't listed any services yet.</p>
            )}
        </div>
    );
};

export default ProviderServices;
