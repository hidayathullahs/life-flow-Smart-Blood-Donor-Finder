import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, Heart } from 'lucide-react';

const AnnouncementBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-primary via-rose-500 to-primary text-white shadow-lg"
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-4 py-3 text-sm sm:text-base">
                        {/* Decorative icon */}
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Sparkles className="h-5 w-5 hidden sm:block" />
                        </motion.div>

                        {/* Message */}
                        <div className="flex items-center gap-2 flex-wrap justify-center">
                            <span className="font-medium">
                                Every blood donation can save up to 3 lives!
                            </span>
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full font-semibold transition-colors"
                            >
                                Become a Donor
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* Animated heart */}
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="hidden sm:block"
                        >
                            <Heart className="h-5 w-5 fill-white/50" />
                        </motion.div>

                        {/* Close button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
                            aria-label="Close banner"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AnnouncementBanner;
