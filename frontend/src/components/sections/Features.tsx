import { ShieldCheck, Zap, ThumbsUp } from 'lucide-react';

const Features = () => {
    return (
        <section className="py-24 px-4 bg-gray-900 border-t border-gray-800">
            <div className="max-w-[1440px] mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700 hover:border-primary-500/50 hover:bg-gray-800/80 transition duration-300 group">
                        <div className="h-14 w-14 bg-gray-900 rounded-xl mb-6 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform duration-300 border border-gray-700 group-hover:border-primary-500/30">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary-400 transition-colors">Verified Providers</h3>
                        <p className="text-gray-400 leading-relaxed">
                            All our service providers are thoroughly vetted, background-checked, and trained to ensure your absolute safety and peace of mind.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700 hover:border-primary-500/50 hover:bg-gray-800/80 transition duration-300 group">
                        <div className="h-14 w-14 bg-gray-900 rounded-xl mb-6 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform duration-300 border border-gray-700 group-hover:border-primary-500/30">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary-400 transition-colors">Instant Booking</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Need help fast? Select a service, choose your preferred time slot, and get instant confirmation within minutes. No waiting involved.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700 hover:border-primary-500/50 hover:bg-gray-800/80 transition duration-300 group">
                        <div className="h-14 w-14 bg-gray-900 rounded-xl mb-6 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform duration-300 border border-gray-700 group-hover:border-primary-500/30">
                            <ThumbsUp size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary-400 transition-colors">Quality Guaranteed</h3>
                        <p className="text-gray-400 leading-relaxed">
                            We stand by our work. Rate your experience after every job. We ensure high standards and address any concerns immediately.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
