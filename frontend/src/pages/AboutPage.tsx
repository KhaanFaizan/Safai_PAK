import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { BackButton } from '../components/common/BackButton';
import { ShieldCheck, Heart, Users, TrendingUp, Award, CheckCircle } from 'lucide-react';

const AboutPage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <div className="max-w-[1440px] mx-auto px-4 py-8">
                <BackButton className="mb-6 text-gray-400 hover:text-white" />

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto py-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        About <span className="text-primary-500">SafaiPak</span>
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        Connecting you with verified sanitation, pest control, and agricultural service providers across Pakistan.
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    <div className="bg-gray-800 p-10 rounded-3xl border border-gray-700 hover:border-primary-500/30 transition-colors">
                        <div className="h-14 w-14 bg-primary-900/30 rounded-xl mb-6 flex items-center justify-center text-primary-500">
                            <TrendingUp size={32} />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            Our mission is to provide safe, reliable, and affordable services to every home and business in Pakistan. We strive to create a seamless platform where quality meets convenience.
                        </p>
                    </div>

                    <div className="bg-gray-800 p-10 rounded-3xl border border-gray-700 hover:border-primary-500/30 transition-colors">
                        <div className="h-14 w-14 bg-primary-900/30 rounded-xl mb-6 flex items-center justify-center text-primary-500">
                            <Award size={32} />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            To become Pakistan’s most trusted platform for connecting customers with verified service professionals, setting the standard for quality and reliability in the service industry.
                        </p>
                    </div>
                </div>

                {/* Core Values */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: ShieldCheck, title: "Trust & Verification", desc: "We rigorously vet every provider to ensure your safety and peace of mind." },
                            { icon: Heart, title: "Customer First", desc: "Your satisfaction is our top priority. We are engaged to delivering excellence." },
                            { icon: CheckCircle, title: "Transparency", desc: "Honest pricing and clear communication at every step of the process." },
                            { icon: Users, title: "Community Support", desc: "Empowering local professionals to grow their businesses with dignity." }
                        ].map((value, idx) => (
                            <div key={idx} className="bg-gray-800 p-8 rounded-2xl border border-gray-700 text-center hover:-translate-y-1 transition-transform duration-300">
                                <div className="h-12 w-12 bg-gray-900 rounded-full mx-auto mb-6 flex items-center justify-center text-primary-500 border border-gray-700">
                                    <value.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                <p className="text-gray-400 text-sm">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trust Section */}
                <div className="mb-24 bg-gradient-to-br from-gray-800 to-gray-900 p-12 rounded-3xl border border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-primary-900/20 blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-8">Why Pakistan Trusts Us</h2>
                        <div className="grid sm:grid-cols-3 gap-8">
                            <div className="p-6">
                                <h3 className="text-4xl font-bold text-primary-500 mb-2">100%</h3>
                                <p className="text-gray-300 font-medium">Verified Providers</p>
                            </div>
                            <div className="p-6">
                                <h3 className="text-4xl font-bold text-primary-500 mb-2">24/7</h3>
                                <p className="text-gray-300 font-medium">Customer Support</p>
                            </div>
                            <div className="p-6">
                                <h3 className="text-4xl font-bold text-primary-500 mb-2">50+</h3>
                                <p className="text-gray-300 font-medium">Cities Covered</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center py-16 border-t border-gray-800">
                    <h2 className="text-3xl font-bold mb-6">Join the SafaiPak Community</h2>
                    <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
                        Whether you need a service or want to provide one, we are here to make it happen.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            onClick={() => navigate('/services')}
                            className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 text-lg"
                        >
                            Book a Service
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/register?role=provider')}
                            className="border-gray-500 text-white hover:bg-gray-800 hover:border-white px-8 py-3 text-lg transition-colors"
                        >
                            Become a Provider
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
