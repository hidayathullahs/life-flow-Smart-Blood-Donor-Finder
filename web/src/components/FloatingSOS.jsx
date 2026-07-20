import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, X, Droplet, MessageCircle } from 'lucide-react';

const FloatingSOS = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-20 right-0 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border dark:border-slate-700 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    <span className="font-bold">Emergency Help</span>
                                </div>
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                {"Need blood urgently? We're here to help 24/7."}
                            </p>

                            {/* Quick Actions */}
                            <div className="space-y-2">
                                <Link
                                    to="/search"
                                    className="flex items-center gap-3 w-full p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-colors"
                                    onClick={() => setIsExpanded(false)}
                                >
                                    <Droplet className="h-5 w-5" />
                                    <span className="font-medium">Find Donor Now</span>
                                </Link>

                                <a
                                    href="tel:104"
                                    className="flex items-center gap-3 w-full p-3 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 rounded-xl transition-colors"
                                >
                                    <Phone className="h-5 w-5" />
                                    <div>
                                        <span className="font-medium block">Blood Bank Helpline</span>
                                        <span className="text-xs opacity-75">Call 104 (India)</span>
                                    </div>
                                </a>

                                {/* SmartBloodLife Support WhatsApp */}
                                <a
                                    href="https://wa.me/916382475871?text=I%20need%20blood%20urgently%20-%20via%20SmartBloodLife"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 w-full p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl transition-colors"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    <div>
                                        <span className="font-medium block">WhatsApp Support</span>
                                        <span className="text-xs opacity-75">Chat with SmartBloodLife team</span>
                                    </div>
                                </a>
                            </div>

                            {/* Emergency Numbers */}
                            <div className="pt-3 border-t dark:border-slate-700">
                                <p className="text-xs text-slate-500 mb-2">Emergency Numbers:</p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">112 (Emergency)</span>
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">104 (Health)</span>
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">108 (Ambulance)</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main SOS Button */}
            <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`
                    relative flex items-center justify-center
                    w-16 h-16 rounded-full
                    bg-gradient-to-br from-red-500 to-red-600
                    text-white shadow-lg
                    hover:shadow-red-500/40 hover:shadow-xl
                    transition-all duration-300
                    ${isExpanded ? 'rotate-45' : ''}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Pulsing rings */}
                <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
                <span className="absolute inset-2 rounded-full bg-red-500 animate-ping opacity-20 animation-delay-150" />

                {/* Icon */}
                {isExpanded ? (
                    <X className="h-7 w-7 relative z-10" />
                ) : (
                    <div className="relative z-10 text-center">
                        <AlertTriangle className="h-6 w-6 mx-auto" />
                        <span className="text-[10px] font-bold">SOS</span>
                    </div>
                )}
            </motion.button>
        </div>
    );
};

export default FloatingSOS;
