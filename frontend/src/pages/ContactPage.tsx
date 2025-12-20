import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { BackButton } from '../components/common/BackButton';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await api.post('/contact', formData);
            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                subject: 'General Inquiry',
                message: ''
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <div className="max-w-[1440px] mx-auto px-4 py-8">
                <BackButton className="mb-6 text-gray-400 hover:text-white" />

                <div className="text-center max-w-3xl mx-auto py-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        Contact <span className="text-primary-500">Us</span>
                    </h1>
                    <p className="text-xl text-gray-400">
                        We’re here to help. Reach out to SafaiPak for any questions or support.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700">
                            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary-900/30 rounded-lg text-primary-500">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Email Support</h3>
                                        <p className="text-gray-400">faizan.learner@gmail.com</p>
                                        <p className="text-sm text-gray-500 mt-1">Response time: Within 24 hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary-900/30 rounded-lg text-primary-500">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Phone</h3>
                                        <p className="text-gray-400">+92 308 5101230</p>
                                        <p className="text-sm text-gray-500 mt-1">Mon-Fri from 9am to 6pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary-900/30 rounded-lg text-primary-500">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Service Area</h3>
                                        <p className="text-gray-400">Available across Pakistan</p>
                                        <p className="text-sm text-gray-500 mt-1">Main Office: Islamabad, Pakistan</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                            <p className="text-gray-400 text-sm italic">
                                "Your information is secure and will only be used to respond to your query."
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
                        <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

                        {success && (
                            <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg flex items-center gap-3 text-green-400">
                                <CheckCircle size={20} />
                                <span>Message sent successfully! We'll get back to you soon.</span>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Full Name</label>
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                        className="bg-gray-900 border-gray-600 text-white placeholder-gray-500 focus:border-primary-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Email Address</label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        required
                                        className="bg-gray-900 border-gray-600 text-white placeholder-gray-500 focus:border-primary-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Subject</label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="General Inquiry">General Inquiry</option>
                                    <option value="Booking Support">Booking Support</option>
                                    <option value="Provider Support">Provider Support</option>
                                    <option value="Feedback">Feedback</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="How can we help you?"
                                    required
                                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary-600 hover:bg-primary-500 text-white py-3 text-lg flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                                {loading ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
