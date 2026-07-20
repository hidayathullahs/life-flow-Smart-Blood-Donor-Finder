import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, CheckCircle, Gift, Award, Clock } from 'lucide-react';

const BENEFITS = [
    { icon: Heart, text: "Save up to 3 lives per donation" },
    { icon: Gift, text: "Help someone in an emergency" },
    { icon: Award, text: "Get notified when your blood type is needed" },
    { icon: Clock, text: "Takes only 30-45 minutes" }
];

const BecomeDonorCTA = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-rose-500/5 dark:from-primary/10 dark:to-rose-500/10" />

            {/* Decorative Blobs */}
            <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border dark:border-slate-800 overflow-hidden">
                        <div className="grid lg:grid-cols-2">
                            {/* Left Content */}
                            <div className="p-8 lg:p-12">
                                <motion.span
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium mb-4"
                                >
                                    <Heart className="h-4 w-4" />
                                    Become a Hero
                                </motion.span>

                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4"
                                >
                                    Register as a{' '}
                                    <span className="text-primary">Blood Donor</span>
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-slate-600 dark:text-slate-400 mb-8"
                                >
                                    Join thousands of verified donors who are making a difference.
                                    Your one donation can save multiple lives in emergencies.
                                </motion.p>

                                {/* Benefits */}
                                <div className="space-y-4 mb-8">
                                    {BENEFITS.map((benefit, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                                <benefit.icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <span className="text-slate-700 dark:text-slate-300">{benefit.text}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-rose-500 text-white font-semibold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-1 group"
                                    >
                                        Register as Donor
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Right Visual */}
                            <div className="relative bg-gradient-to-br from-primary to-rose-500 p-8 lg:p-12 flex items-center justify-center">
                                {/* Decorative circles */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/10 rounded-full" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full" />
                                </div>

                                {/* Central Content */}
                                <div className="relative z-10 text-center text-white">
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="mb-6"
                                    >
                                        <Heart className="h-24 w-24 mx-auto fill-white/20" />
                                    </motion.div>

                                    <h3 className="text-5xl font-bold mb-2">1 Pint</h3>
                                    <p className="text-xl text-white/80">can save</p>
                                    <h3 className="text-6xl font-bold mt-2 mb-4">3 Lives</h3>

                                    <div className="flex items-center justify-center gap-2 text-sm text-white/70">
                                        <CheckCircle className="h-4 w-4" />
                                        <span>Join our community of life-savers</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BecomeDonorCTA;
