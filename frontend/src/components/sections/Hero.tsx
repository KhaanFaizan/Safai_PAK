import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Clock, Star } from 'lucide-react';

const Hero = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    return (
        <section className="bg-gray-900 px-4 pt-20 pb-24 md:pt-32 md:pb-32 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-primary-900 opacity-20 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary-900 opacity-20 blur-3xl pointer-events-none"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <span className="inline-block py-1 px-3 rounded-full bg-primary-900/50 border border-primary-700 text-primary-300 text-sm font-semibold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    Trusted by 1000+ Families
                </span>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                    Premium <span className="text-primary-500">Home Services</span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                    Verified pest control, sanitation, and cleaning services across Pakistan. We ensure a safe, clean, and healthy environment for your home.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
                    <Button
                        className="text-lg px-8 py-4 h-auto shadow-xl shadow-primary-900/50 hover:shadow-primary-900/80 hover:-translate-y-1 transition-all duration-300 bg-primary-600 hover:bg-primary-500 border-transparent text-white"
                        onClick={() => navigate('/services')}
                    >
                        Book a Service
                    </Button>
                    <Button
                        variant="outline"
                        className="text-lg px-8 py-4 h-auto border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white"
                        onClick={() => navigate('/register?role=provider')}
                    >
                        Become a Provider
                    </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 text-gray-400 text-sm font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 border-t border-gray-800 pt-10 mt-10 max-w-2xl mx-auto">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="text-primary-500" size={20} />
                        <span>Verified Providers</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Star className="text-primary-500" size={20} />
                        <span>Safe & Approved Treatments</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="text-primary-500" size={20} />
                        <span>Fast Response</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
