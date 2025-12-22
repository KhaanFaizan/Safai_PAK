import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext)!;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data.token, { _id: data._id, name: data.name, email: data.email, role: data.role });

            if (data.role === 'provider') {
                navigate('/provider/dashboard');
            } else if (data.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/services');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please checks your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
            <div className="w-full max-w-md opacity-0 animate-fade-in-up">
                {/* Header Logo/Text */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
                    <p className="text-gray-400">Welcome back! Please enter your details.</p>
                </div>

                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-start gap-2">
                            <span>•</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                            <div className="relative">
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter your email"
                                    className="pl-10 bg-gray-900 border-gray-700 text-white focus:border-primary-500"
                                />
                                <Mail size={18} className="absolute left-3 top-3 text-gray-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white focus:border-primary-500"
                                />
                                <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-gray-300">
                                <input type="checkbox" className="rounded border-gray-600 bg-gray-900 text-primary-600 focus:ring-primary-500" />
                                Remember me
                            </label>
                            <a href="#" className="text-primary-400 hover:underline">Forgot password?</a>
                        </div>

                        <Button type="submit" className="w-full py-3 text-lg shadow-lg shadow-primary-900/20" isLoading={loading}>
                            Login <ArrowRight size={18} className="ml-2 inline" />
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-400 font-medium hover:text-primary-300 transition-colors">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
