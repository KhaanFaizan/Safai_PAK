import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useLanguage } from '../context/LanguageContext';
import { Loader } from '../components/ui/Loader';

const BookingPage = () => {
    const { serviceId } = useParams();
    const { t } = useLanguage();
    const navigate = useNavigate();

    // States
    const [serviceName, setServiceName] = useState('');
    const [date, setDate] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [initLoading, setInitLoading] = useState(true);

    useEffect(() => {
        // Fetch service name for context
        const fetchSvc = async () => {
            try {
                const { data } = await api.get(`/services/${serviceId}`);
                setServiceName(data.name);
            } catch (e) {
                // Ignore
            } finally {
                setInitLoading(false);
            }
        };
        if (serviceId) fetchSvc();
    }, [serviceId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/bookings', {
                serviceId,
                scheduledDate: date,
                address
            });
            navigate('/bookings'); // Go to history
        } catch (error) {
            alert('Booking failed');
        } finally {
            setLoading(false);
        }
    };

    if (initLoading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-xl mx-auto p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('bookNow')}</h2>
                <p className="text-gray-500 mb-8">Service: <span className="font-semibold text-primary-600">{serviceName}</span></p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Input
                            label="Scheduled Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Input
                            label={t('address')}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            placeholder="Full street address"
                        />
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full" isLoading={loading}>
                            {t('confirm')} Booking
                        </Button>
                        <button
                            type="button"
                            className="w-full text-center text-gray-500 text-sm mt-4 hover:underline"
                            onClick={() => navigate(-1)}
                        >
                            {t('cancel')}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default BookingPage;
