import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from './Button';

interface BackButtonProps {
    to?: string;
    label?: string;
    className?: string;
}

export const BackButton = ({ to, label = 'Back', className }: BackButtonProps) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <button
            onClick={handleBack}
            className={cn(
                "group flex items-center gap-2 text-sm font-medium transition-colors mb-6",
                "text-gray-600 hover:text-gray-900", // Default light mode colors
                className
            )}
        >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span>{label}</span>
        </button>
    );
};
