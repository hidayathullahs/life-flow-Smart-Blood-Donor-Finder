import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const EmptyState = ({
    title = "No Donors Found",
    message = "We couldn't find any donors matching your criteria.",
    actionLabel = "Clear Filters",
    onAction
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <SearchX className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 max-w-md mb-6">{message}</p>
            {onAction && (
                <Button onClick={onAction} variant="outline">
                    {actionLabel}
                </Button>
            )}
            {!onAction && (
                <Button asChild variant="outline">
                    <Link to="/">Go Home</Link>
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
