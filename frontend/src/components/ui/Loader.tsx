
import { Loader2 } from 'lucide-react';

interface LoaderProps {
    className?: string;
}

export const Loader = ({ className }: LoaderProps) => {
    return (
        <div className={`flex items-center justify-center p-8 ${className || ''}`}>
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
    );
};
