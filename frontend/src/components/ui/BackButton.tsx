import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button, cn } from './Button';

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
        <Button
            variant="outline" // Using outline for a clean but distinct look
            onClick={handleBack}
            className={cn(
                "border py-2 px-3 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors mb-4 text-gray-700 border-gray-300",
                className
            )}
        >
            <ArrowLeft size={16} />
            {label}
        </Button>
    );
};
