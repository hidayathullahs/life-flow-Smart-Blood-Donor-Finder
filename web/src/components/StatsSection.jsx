import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Heart, MapPin, Activity } from 'lucide-react';
import { donorService } from '@/services/donorService';

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (!isInView) return;

        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, isInView]);

    return (
        <span ref={ref} className="tabular-nums">
            {count.toLocaleString()}{suffix}
        </span>
    );
};

const StatCard = ({ icon: Icon, value, label, suffix = '', delay = 0, gradient }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="relative group"
    >
        <div className={`absolute inset-0 ${gradient} rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>
        <div className="relative bg-white/80 backdrop-blur-sm border border-slate-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className={`w-14 h-14 ${gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="h-7 w-7 text-white" />
            </div>
            <div className="text-4xl font-bold text-slate-900 mb-1">
                <AnimatedCounter end={value} suffix={suffix} />
            </div>
            <div className="text-slate-500 font-medium">{label}</div>
        </div>
    </motion.div>
);

const StatsSection = () => {
    const [stats, setStats] = useState({
        totalDonors: 0,
        livesSaved: 0,
        cities: 0,
        activeToday: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await donorService.getStats();
                setStats({
                    totalDonors: data.totalDonors,
                    livesSaved: data.totalDonations * 3, // Each donation saves up to 3 lives
                    cities: data.uniqueCities,
                    activeToday: data.activeDonors
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
                setStats({
                    totalDonors: 0,
                    livesSaved: 0,
                    cities: 0,
                    activeToday: 0
                });
            }
        };

        fetchStats();
    }, []);

    const statsData = [
        {
            icon: Users,
            value: stats.totalDonors,
            label: "Registered Donors",
            gradient: "bg-gradient-to-br from-red-500 to-rose-600",
            delay: 0
        },
        {
            icon: Heart,
            value: stats.livesSaved,
            label: "Lives Saved",
            gradient: "bg-gradient-to-br from-pink-500 to-red-500",
            delay: 0.1
        },
        {
            icon: MapPin,
            value: stats.cities,
            label: "Cities Covered",
            suffix: "+",
            gradient: "bg-gradient-to-br from-orange-500 to-red-500",
            delay: 0.2
        },
        {
            icon: Activity,
            value: stats.activeToday,
            label: "Active Today",
            gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
            delay: 0.3
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-100 rounded-full blur-3xl opacity-30"></div>

            <div className="container mx-auto px-4 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-semibold mb-4">
                        <Activity className="h-4 w-4" />
                        Live Platform Stats
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Making a Difference, One Drop at a Time
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        Join thousands of donors across India who are saving lives every day through SmartBloodLife.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {statsData.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
