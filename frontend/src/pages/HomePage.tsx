import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';

const HomePage = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-primary-900 text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('heroTitle')}</h1>
                    <p className="text-xl md:text-2xl text-primary-100 mb-10">
                        {t('heroSubtitle')}
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button
                            className="bg-white text-primary-900 hover:bg-gray-100 text-lg px-8 py-3"
                            onClick={() => navigate('/services')}
                        >
                            {t('bookNow')}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Preview */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                        <div className="h-12 w-12 bg-primary-100 rounded-lg mb-4 flex items-center justify-center text-primary-600 font-bold text-xl">1</div>
                        <h3 className="text-xl font-bold mb-2">Verified Providers</h3>
                        <p className="text-gray-600">All our service providers are thoroughly vetted for your safety.</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                        <div className="h-12 w-12 bg-primary-100 rounded-lg mb-4 flex items-center justify-center text-primary-600 font-bold text-xl">2</div>
                        <h3 className="text-xl font-bold mb-2">Instant Booking</h3>
                        <p className="text-gray-600">Select a service, choose a time, and get confirmation within minutes.</p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                        <div className="h-12 w-12 bg-primary-100 rounded-lg mb-4 flex items-center justify-center text-primary-600 font-bold text-xl">3</div>
                        <h3 className="text-xl font-bold mb-2">Quality Guaranteed</h3>
                        <p className="text-gray-600">Rate your experience. We ensure high standards for every job.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
