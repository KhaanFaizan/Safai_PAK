import { type ReactNode } from 'react';
import { cn } from './Button';

interface CardProps {
    className?: string;
    children: ReactNode;
}

export const Card = ({ className, children }: CardProps) => {
    return (
        <div className={cn('bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden', className)}>
            {children}
        </div>
    );
};
