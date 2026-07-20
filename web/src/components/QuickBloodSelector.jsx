import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplet } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Blood group colors with gradient
const BLOOD_GROUP_STYLES = {
    'O-': 'from-purple-500 to-purple-600', // Universal donor - special
    'O+': 'from-red-500 to-red-600',
    'A+': 'from-rose-500 to-rose-600',
    'A-': 'from-pink-500 to-pink-600',
    'B+': 'from-orange-500 to-orange-600',
    'B-': 'from-amber-500 to-amber-600',
    'AB+': 'from-emerald-500 to-emerald-600',
    'AB-': 'from-teal-500 to-teal-600'
};

const QuickBloodSelector = ({ className = '' }) => {
    return (
        <div className={`w-full ${className}`}>
            <div className="text-center mb-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                    <Droplet className="h-4 w-4 text-primary" />
                    Quick Search - Select Blood Type
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {BLOOD_GROUPS.map((bloodGroup, index) => (
                    <motion.div
                        key={bloodGroup}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            to={`/search?bloodGroup=${encodeURIComponent(bloodGroup)}`}
                            className={`
                                relative group flex items-center justify-center
                                w-14 h-14 sm:w-16 sm:h-16 rounded-2xl
                                bg-gradient-to-br ${BLOOD_GROUP_STYLES[bloodGroup]}
                                text-white font-bold text-lg sm:text-xl
                                shadow-lg hover:shadow-xl
                                transition-all duration-300
                                overflow-hidden
                            `}
                        >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Pulse ring on hover */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-white/30 scale-100 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all" />

                            <span className="relative z-10">{bloodGroup}</span>

                            {/* Universal donor badge */}
                            {bloodGroup === 'O-' && (
                                <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-[8px] font-bold px-1 rounded-full">
                                    ⭐
                                </span>
                            )}
                        </Link>
                    </motion.div>
                ))}
            </div>

            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">
                O- is the universal donor • AB+ is the universal recipient
            </p>
        </div>
    );
};

export default QuickBloodSelector;
