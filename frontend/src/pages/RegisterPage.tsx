import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Eye, EyeOff, User, Mail, Phone, MapPin, Briefcase, Lock, Check } from 'lucide-react';

const RegisterPage = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        password: '',
        confirmPassword: '',
        role: 'customer', // Default to customer
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleSelect = (role: string) => {
        setFormData({ ...formData, role });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                city: formData.city,
                password: formData.password,
                role: formData.role,
            });
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
            <div className="w-full max-w-2xl bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl opacity-0 animate-fade-in-up">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Register</h2>
                    <p className="text-gray-400">Join us today! Create your account.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => handleRoleSelect('customer')}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.role === 'customer'
                                ? 'border-primary-500 bg-primary-900/20 text-white'
                                : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
                                }`}
                        >
                            <User size={32} className={formData.role === 'customer' ? 'text-primary-500' : 'text-gray-500'} />
                            <span className="font-bold">Customer</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRoleSelect('provider')}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.role === 'provider'
                                ? 'border-primary-500 bg-primary-900/20 text-white'
                                : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
                                }`}
                        >
                            <Briefcase size={32} className={formData.role === 'provider' ? 'text-primary-500' : 'text-gray-500'} />
                            <span className="font-bold">Service Provider</span>
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Name</label>
                            <div className="relative">
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    className="pl-10 bg-gray-900 border-gray-700 text-white focus:border-primary-500"
                                />
                                <User size={18} className="absolute left-3 top-3 text-gray-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                            <div className="relative">
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="user@example.com"
                                    className="pl-10 bg-gray-900 border-gray-700 text-white focus:border-primary-500"
                                />
                                <Mail size={18} className="absolute left-3 top-3 text-gray-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Phone</label>
                            <div className="relative">
                                <Input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="0300-1234567"
                                    className="pl-10 bg-gray-900 border-gray-700 text-white focus:border-primary-500"
                                />
                                <Phone size={18} className="absolute left-3 top-3 text-gray-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">City</label>
                            <div className="relative">
                                <Input
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    placeholder="Lahore"
                                    className="pl-10 bg-gray-900 border-gray-700 text-white focus:border-primary-500"
                                />
                                <MapPin size={18} className="absolute left-3 top-3 text-gray-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Create a password"
                                    className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white focus:border-primary-500"
                                />
                                <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-500 hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
                            <div className="relative">
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirm your password"
                                    className="pl-10 bg-gray-900 border-gray-700 text-white focus:border-primary-500"
                                />
                                <Check size={18} className="absolute left-3 top-3 text-gray-500" />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full py-4 text-lg shadow-lg shadow-primary-900/20" isLoading={loading}>
                        Register
                    </Button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
