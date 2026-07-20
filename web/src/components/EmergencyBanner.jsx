import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { AlertTriangle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';

const EmergencyBanner = () => {
    const [alert, setAlert] = useState(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'emergency'), (doc) => {
            if (doc.exists() && doc.data().active) {
                setAlert(doc.data());
                setIsVisible(true);
            } else {
                setAlert(null);
            }
        });

        return () => unsub();
    }, []);

    if (!alert || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="w-full sticky top-0 z-50 shadow-md"
            >
                <Alert variant="destructive" className="rounded-none border-0 border-b border-red-200 bg-red-50 text-red-900 px-4 py-3 flex items-start sm:items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse mt-0.5 sm:mt-0" />
                    <div className="flex-1">
                        <AlertTitle className="text-red-800 font-bold flex items-center gap-2">
                            EMERGENCY ALERT: {alert.city ? `Blood Needed in ${alert.city}` : 'Urgent Blood Need'}
                        </AlertTitle>
                        <AlertDescription className="text-red-700 text-sm mt-1">
                            {alert.message}
                        </AlertDescription>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-red-400 hover:text-red-700 transition-colors p-1"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    {alert.contact && (
                        <a
                            href={`tel:${alert.contact}`}
                            className="hidden sm:inline-flex bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm hover:bg-red-700 ml-4 whitespace-nowrap"
                        >
                            Call Now: {alert.contact}
                        </a>
                    )}
                </Alert>
            </motion.div>
        </AnimatePresence>
    );
};

export default EmergencyBanner;
