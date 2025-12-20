import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useLanguage } from '../context/LanguageContext';
import { Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        password: '',
        confirmPassword: '',
        role: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.role === 'admin') {
            alert("Admin registration is restricted. Please contact support to request administrative access.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
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
            // On success, redirect to login
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
            <Card className="w-full max-w-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">{t('register')}</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label={t('name')}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                    />

                    <Input
                        label={t('email')}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="user@example.com"
                    />

                    <Input
                        label={t('phone')}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0300-1234567"
                    />

                    <Input
                        label={t('city') || 'City'}
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="Lahore"
                    />

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">{t('role') || 'I am a'}</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
                            required
                        >
                            <option value="" disabled>Select Role</option>
                            <option value="customer">Customer</option>
                            <option value="provider">Service Provider</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="relative">
                        <Input
                            label={t('password')}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <Button type="submit" className="w-full" isLoading={loading}>
                        {t('register')}
                    </Button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 hover:underline">
                        {t('login')}
                    </Link>
                </p>
            </Card>
        </div>
    );
};

export default RegisterPage;
