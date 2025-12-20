import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button'; // Assuming Button is in ui/Button
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { cn } from '../ui/Button';

interface BackButtonProps {
    label?: string;
    customFallbackRoute?: string;
    className?: string;
}

export const BackButton = ({ label = 'Back', customFallbackRoute, className }: BackButtonProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useContext(AuthContext);
    const { user } = auth || {};

    const handleBack = () => {
        // Simple check: if we have history state, we assume it's safe to go back.
        // However, standard window.history.length includes the current page + previous pages + forward pages.
        // Checking window.history.state?.idx > 0 is a decent proxy for "did I come from somewhere inside this session history?"
        // But a strictly reliable way without tracking is hard.
        // We'll prioritize the customFallback if provided, then role default, then safe navigation.

        if (customFallbackRoute) {
            navigate(customFallbackRoute);
            return;
        }

        // If we want to prefer "back" when possible:
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            // Fallback Logic
            let fallback = '/'; // Default for guest

            if (user?.role === 'customer') {
                fallback = '/services';
            } else if (user?.role === 'provider') {
                fallback = '/provider/dashboard';
            } else if (user?.role === 'admin') {
                fallback = '/admin/dashboard';
            }

            navigate(fallback);
        }
    };

    return (
        <button
            onClick={handleBack}
            className={cn(
                "inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6", // Added adequate bottom margin
                className
            )}
        >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {label}
        </button>
    );
};
