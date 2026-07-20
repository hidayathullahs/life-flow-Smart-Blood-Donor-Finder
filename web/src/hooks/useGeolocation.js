/**
 * Geolocation Hook
 * Handles user location detection with permission handling
 */

import { useState, useEffect, useCallback } from 'react';

// Major Indian cities with coordinates
const INDIAN_CITIES = {
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Delhi': { lat: 28.6139, lng: 77.2090 },
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Kolkata': { lat: 22.5726, lng: 88.3639 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867 },
    'Pune': { lat: 18.5204, lng: 73.8567 },
    'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'Jaipur': { lat: 26.9124, lng: 75.7873 },
    'Lucknow': { lat: 26.8467, lng: 80.9462 },
    'Surat': { lat: 21.1702, lng: 72.8311 },
    'Kanpur': { lat: 26.4499, lng: 80.3319 },
    'Nagpur': { lat: 21.1458, lng: 79.0882 },
    'Indore': { lat: 22.7196, lng: 75.8577 },
    'Thane': { lat: 19.2183, lng: 72.9781 },
    'Bhopal': { lat: 23.2599, lng: 77.4126 },
    'Visakhapatnam': { lat: 17.6868, lng: 83.2185 },
    'Patna': { lat: 25.5941, lng: 85.1376 },
    'Vadodara': { lat: 22.3072, lng: 73.1812 },
    'Coimbatore': { lat: 11.0168, lng: 76.9558 }
};

// Calculate distance between two points (in km)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const toRad = (deg) => deg * (Math.PI / 180);

export const useGeolocation = (options = {}) => {
    const {
        enableHighAccuracy = false,
        timeout = 10000,
        maximumAge = 300000, // 5 minutes cache
        autoDetect = true
    } = options;

    const [location, setLocation] = useState(null);
    const [city, setCity] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'granted', 'denied', 'prompt'

    // Check permission status
    useEffect(() => {
        if ('permissions' in navigator) {
            navigator.permissions.query({ name: 'geolocation' })
                .then((result) => {
                    setPermissionStatus(result.state);
                    result.onchange = () => setPermissionStatus(result.state);
                })
                .catch(() => {
                    // Permissions API not supported
                    setPermissionStatus('prompt');
                });
        }
    }, []);

    // Get current position
    const getCurrentPosition = useCallback(() => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
                return;
            }

            setLoading(true);
            setError(null);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    setLocation(coords);
                    setLoading(false);
                    resolve(coords);
                },
                (err) => {
                    setError(err.message);
                    setLoading(false);
                    reject(err);
                },
                {
                    enableHighAccuracy,
                    timeout,
                    maximumAge
                }
            );
        });
    }, [enableHighAccuracy, timeout, maximumAge]);

    // Find nearest city from coordinates
    const findNearestCity = useCallback((lat, lng) => {
        let nearestCity = null;
        let minDistance = Infinity;

        Object.entries(INDIAN_CITIES).forEach(([cityName, coords]) => {
            const distance = calculateDistance(lat, lng, coords.lat, coords.lng);
            if (distance < minDistance) {
                minDistance = distance;
                nearestCity = {
                    name: cityName,
                    distance: Math.round(distance),
                    coords
                };
            }
        });

        return nearestCity;
    }, []);


    // Detect location and find nearest city
    const detectLocation = useCallback(async () => {
        try {
            const coords = await getCurrentPosition();
            const nearestCity = findNearestCity(coords.lat, coords.lng);
            setCity(nearestCity);
            return { coords, city: nearestCity };
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [getCurrentPosition, findNearestCity]);

    // Set city manually
    const setManualCity = useCallback((cityName) => {
        const cityCoords = INDIAN_CITIES[cityName];
        if (cityCoords) {
            setCity({
                name: cityName,
                distance: 0,
                coords: cityCoords,
                manual: true
            });
            setLocation(cityCoords);
        }
    }, []);

    // Auto-detect on mount if enabled
    useEffect(() => {
        if (autoDetect && permissionStatus === 'granted') {
            detectLocation().catch(() => {
                // Silent fail for auto-detect
            });
        }
    }, [autoDetect, permissionStatus, detectLocation]);

    // Calculate distance from current location
    const getDistanceFrom = useCallback((targetLat, targetLng) => {
        if (!location) return null;
        return calculateDistance(location.lat, location.lng, targetLat, targetLng);
    }, [location]);

    return {
        location,
        city,
        error,
        loading,
        permissionStatus,

        // Actions
        detectLocation,
        setManualCity,
        getDistanceFrom,

        // Utilities
        INDIAN_CITIES: Object.keys(INDIAN_CITIES),
        getCityCoords: (cityName) => INDIAN_CITIES[cityName]
    };
};

export default useGeolocation;
