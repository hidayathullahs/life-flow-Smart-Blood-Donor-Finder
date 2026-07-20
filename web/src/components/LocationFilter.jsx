import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, ChevronDown, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeolocation } from '@/hooks/useGeolocation';

const RADIUS_OPTIONS = [
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
    { value: 25, label: '25 km' },
    { value: 50, label: '50 km' },
    { value: 100, label: '100 km' },
    { value: null, label: 'Any distance' }
];

const LocationFilter = ({
    onLocationChange,
    onRadiusChange,
    className = ''
}) => {
    const {
        location,
        city,
        loading,
        error,
        permissionStatus,
        detectLocation,
        setManualCity,
        INDIAN_CITIES
    } = useGeolocation({ autoDetect: false });

    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [showRadiusDropdown, setShowRadiusDropdown] = useState(false);
    const [selectedRadius, setSelectedRadius] = useState(25);
    const [searchQuery, setSearchQuery] = useState('');

    // Notify parent of location changes
    useEffect(() => {
        if (location && city) {
            onLocationChange?.({
                ...location,
                cityName: city.name
            });
        }
    }, [location, city, onLocationChange]);

    // Notify parent of radius changes
    useEffect(() => {
        onRadiusChange?.(selectedRadius);
    }, [selectedRadius, onRadiusChange]);

    // Handle detect location
    const handleDetectLocation = async () => {
        try {
            await detectLocation();
        } catch (err) {
            console.error('Location detection failed:', err);
        }
    };

    // Handle city selection
    const handleCitySelect = (cityName) => {
        setManualCity(cityName);
        setShowCityDropdown(false);
        setSearchQuery('');
    };

    // Handle radius selection
    const handleRadiusSelect = (radius) => {
        setSelectedRadius(radius);
        setShowRadiusDropdown(false);
    };

    // Clear location
    const handleClearLocation = () => {
        onLocationChange?.(null);
        setSearchQuery('');
    };

    // Filter cities by search query
    const filteredCities = INDIAN_CITIES.filter(cityName =>
        cityName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`flex flex-wrap items-center gap-3 ${className}`}>
            {/* Location Selector */}
            <div className="relative">
                <Button
                    variant="outline"
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    className="gap-2 dark:bg-slate-800 dark:border-slate-700"
                >
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="max-w-32 truncate">
                        {city?.name || 'Select City'}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
                </Button>

                {/* City Dropdown */}
                <AnimatePresence>
                    {showCityDropdown && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-lg shadow-xl border dark:border-slate-700 z-50 overflow-hidden"
                        >
                            {/* Detect Location Button */}
                            <button
                                onClick={handleDetectLocation}
                                disabled={loading}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 border-b dark:border-slate-700 transition-colors"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                ) : (
                                    <Navigation className="h-4 w-4 text-primary" />
                                )}
                                <span className="text-sm font-medium text-primary">
                                    {loading ? 'Detecting...' : 'Use my location'}
                                </span>
                            </button>

                            {/* Search Input */}
                            <div className="p-2 border-b dark:border-slate-700">
                                <input
                                    type="text"
                                    placeholder="Search city..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-md border dark:border-slate-700 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>

                            {/* City List */}
                            <div className="max-h-48 overflow-y-auto">
                                {filteredCities.map((cityName) => (
                                    <button
                                        key={cityName}
                                        onClick={() => handleCitySelect(cityName)}
                                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${city?.name === cityName ? 'bg-primary/5 dark:bg-primary/10 text-primary font-medium' : 'text-slate-700 dark:text-slate-300'
                                            }`}
                                    >
                                        {cityName}
                                    </button>
                                ))}
                                {filteredCities.length === 0 && (
                                    <div className="px-4 py-3 text-sm text-slate-500 text-center">
                                        No cities found
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Radius Selector */}
            {city && (
                <div className="relative">
                    <Button
                        variant="outline"
                        onClick={() => setShowRadiusDropdown(!showRadiusDropdown)}
                        className="gap-2 dark:bg-slate-800 dark:border-slate-700"
                    >
                        <span>{selectedRadius ? `Within ${selectedRadius} km` : 'Any distance'}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${showRadiusDropdown ? 'rotate-180' : ''}`} />
                    </Button>

                    {/* Radius Dropdown */}
                    <AnimatePresence>
                        {showRadiusDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-slate-900 rounded-lg shadow-xl border dark:border-slate-700 z-50 overflow-hidden"
                            >
                                {RADIUS_OPTIONS.map((option) => (
                                    <button
                                        key={option.value || 'any'}
                                        onClick={() => handleRadiusSelect(option.value)}
                                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${selectedRadius === option.value ? 'bg-primary/5 dark:bg-primary/10 text-primary font-medium' : 'text-slate-700 dark:text-slate-300'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Clear Button */}
            {city && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearLocation}
                    className="h-9 w-9 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}

            {/* Error Message */}
            {error && permissionStatus === 'denied' && (
                <span className="text-xs text-amber-600 dark:text-amber-400">
                    Location access denied
                </span>
            )}
        </div>
    );
};

export default LocationFilter;
