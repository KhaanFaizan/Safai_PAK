import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { UserPlus, Search, Calendar, Star, Briefcase, ShieldCheck, List, TrendingUp, CheckCircle, Lock, Globe, MessageSquare } from 'lucide-react';
import { BackButton } from '../components/common/BackButton';

const HowItWorksPage = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <div className="max-w-[1440px] mx-auto px-4 py-8">
                <BackButton className="mb-6 text-gray-400 hover:text-white" />

                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto py-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
                        How <span className="text-primary-500">SafaiPak</span> Works
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        SafaiPak makes it easy to find, book, and manage verified sanitation and pest control services across Pakistan.
                    </p>
                </div>

                {/* Customer Flow */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold text-center mb-12">For Customers</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: UserPlus, title: "1. Sign Up", desc: "Create a free account to get started." },
                            { icon: Search, title: "2. Browse Services", desc: "Explore verified providers in your area." },
                            { icon: Calendar, title: "3. Book Instantly", desc: "Select a time that works for you." },
                            { icon: Star, title: "4. Rate & Review", desc: "Share your experience with the community." }
                        ].map((step, idx) => (
                            <div key={idx} className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-primary-500/50 transition duration-300 text-center group">
                                <div className="h-16 w-16 bg-gray-900 rounded-full mx-auto mb-6 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform border border-gray-700">
                                    <step.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="text-gray-400 text-sm">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Button onClick={() => navigate('/services')} className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 text-lg">
                            Book a Service
                        </Button>
                    </div>
                </div>

                {/* Provider Flow */}
                <div className="mb-24 bg-gray-800/50 rounded-3xl p-8 md:p-16 border border-gray-800">
                    <h2 className="text-3xl font-bold text-center mb-12">For Service Providers</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Briefcase, title: "1. Register", desc: "Sign up as a professional provider." },
                            { icon: ShieldCheck, title: "2. Get Verified", desc: "Pass our admin verification process." },
                            { icon: List, title: "3. List Services", desc: "Set your prices and offerings." },
                            { icon: TrendingUp, title: "4. Grow Business", desc: "Get bookings and earn revenue." }
                        ].map((step, idx) => (
                            <div key={idx} className="bg-gray-900 p-6 rounded-xl border border-gray-700 text-left">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-primary-900/30 rounded-lg text-primary-400">
                                        <step.icon size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold">{step.title}</h3>
                                </div>
                                <p className="text-gray-400 text-sm pl-[52px]">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Button onClick={() => navigate('/register?role=provider')} className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 text-lg">
                            Become a Provider
                        </Button>
                    </div>
                </div>

                {/* Trust & Benefits */}
                <div className="grid md:grid-cols-2 gap-16 mb-24">
                    <div>
                        <h2 className="text-3xl font-bold mb-8">Why Choose SafaiPak?</h2>
                        <ul className="space-y-6">
                            {[
                                { icon: CheckCircle, text: "100% Verified Local Professionals" },
                                { icon: Calendar, text: "Easy Booking Management System" },
                                { icon: Globe, text: "Bilingual Support (English & Urdu)" },
                                { icon: Lock, text: "Secure & Transparent Pricing" }
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-4 text-gray-300">
                                    <item.icon className="text-primary-500 flex-shrink-0" size={24} />
                                    <span className="text-lg">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-8">Trust & Safety</h2>
                        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
                            <div className="flex gap-4 mb-6">
                                <ShieldCheck className="text-primary-500 h-10 w-10 flex-shrink-0" />
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Admin Verified</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">Every provider on our platform undergoes a strict verification process by our administration team before they can list any services.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <MessageSquare className="text-primary-500 h-10 w-10 flex-shrink-0" />
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Community Reviews</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">Read authentic reviews from other customers to make informed decisions about who you hire.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center py-16 border-t border-gray-800">
                    <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
                    <div className="flex justify-center gap-4">
                        <Button onClick={() => navigate('/register')} className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3">
                            Join Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorksPage;
