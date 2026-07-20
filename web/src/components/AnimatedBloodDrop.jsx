import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBloodDrop = () => {
    // Floating particles around the blood drop
    const particles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        delay: i * 0.3,
        duration: 2 + Math.random() * 2,
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
    }));

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Background glow */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    className="w-64 h-64 bg-red-400/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            {/* Floating particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute w-3 h-3 bg-gradient-to-br from-red-400 to-rose-500 rounded-full opacity-60"
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{
                        x: [0, particle.x, 0],
                        y: [0, particle.y, 0],
                        opacity: [0, 0.6, 0],
                        scale: [0, 1, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{
                        left: '50%',
                        top: '50%',
                    }}
                />
            ))}

            {/* Main blood drop */}
            <motion.div
                className="relative z-10"
                animate={{
                    y: [0, -10, 0],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <svg
                    width="120"
                    height="160"
                    viewBox="0 0 120 160"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-2xl"
                >
                    {/* Main drop shape with gradient */}
                    <defs>
                        <linearGradient id="bloodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="50%" stopColor="#dc2626" />
                            <stop offset="100%" stopColor="#b91c1c" />
                        </linearGradient>
                        <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </linearGradient>
                        <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#dc2626" floodOpacity="0.3" />
                        </filter>
                    </defs>

                    {/* Main blood drop */}
                    <motion.path
                        d="M60 10 C60 10, 10 70, 10 100 C10 130, 35 155, 60 155 C85 155, 110 130, 110 100 C110 70, 60 10, 60 10 Z"
                        fill="url(#bloodGradient)"
                        filter="url(#dropShadow)"
                        animate={{
                            d: [
                                "M60 10 C60 10, 10 70, 10 100 C10 130, 35 155, 60 155 C85 155, 110 130, 110 100 C110 70, 60 10, 60 10 Z",
                                "M60 8 C60 8, 8 72, 8 102 C8 132, 33 157, 60 157 C87 157, 112 132, 112 102 C112 72, 60 8, 60 8 Z",
                                "M60 10 C60 10, 10 70, 10 100 C10 130, 35 155, 60 155 C85 155, 110 130, 110 100 C110 70, 60 10, 60 10 Z",
                            ],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Highlight reflection */}
                    <ellipse
                        cx="40"
                        cy="80"
                        rx="15"
                        ry="25"
                        fill="url(#highlightGradient)"
                        transform="rotate(-20, 40, 80)"
                    />

                    {/* Small highlight */}
                    <circle cx="35" cy="60" r="5" fill="white" fillOpacity="0.3" />
                </svg>

                {/* Pulse ring */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className="w-32 h-32 border-2 border-red-400/30 rounded-full"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut",
                        }}
                    />
                </motion.div>
            </motion.div>

            {/* "Every Drop Counts" text */}
            <motion.div
                className="absolute bottom-0 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                <p className="text-lg font-semibold text-red-600 dark:text-red-400">Every Drop Counts</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Save lives today</p>
            </motion.div>
        </div>
    );
};

export default AnimatedBloodDrop;
