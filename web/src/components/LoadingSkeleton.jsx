import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';

const LoadingSkeleton = ({ count = 6 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <Card key={i} className="overflow-hidden border-t-4 border-t-gray-200">
                    <CardHeader className="space-y-2">
                        <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="h-5 w-20 bg-gray-100 rounded animate-pulse" />
                            <div className="h-5 w-24 bg-gray-100 rounded animate-pulse" />
                        </div>
                        <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                    </CardContent>
                    <CardFooter className="gap-2">
                        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};

export default LoadingSkeleton;
