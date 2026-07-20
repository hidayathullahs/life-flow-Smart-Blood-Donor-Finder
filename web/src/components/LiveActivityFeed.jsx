import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Droplet, MapPin, Clock, Heart } from 'lucide-react';

import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';

// Fallback empty state if no data


const ActivityItem = ({ activity, index }) => {
    const isDonation = activity.type === 'donation';

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border dark:border-slate-700"
        >
            {/* Icon */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${isDonation
                ? 'bg-green-100 dark:bg-green-900/30'
                : 'bg-primary/10'
                }`}>
                {isDonation ? (
                    <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                    <Activity className="h-5 w-5 text-primary" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                    <span className="text-primary">{activity.name}</span>
                    {isDonation ? ' donated blood' : ' joined as donor'}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                        <Droplet className="h-3 w-3" />
                        {activity.bloodGroup}
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {activity.city}
                    </span>
                </div>
            </div>

            {/* Time */}
            <div className="flex-shrink-0 flex items-center gap-1 text-xs text-slate-400 whitespace-nowrap">
                <Clock className="h-3 w-3" />
                {activity.time}
            </div>
        </motion.div>
    );
};

const LiveActivityFeed = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Query latest donors
        const q = query(
            collection(db, 'donors'),
            orderBy('registeredAt', 'desc'),
            limit(5)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newActivities = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    type: 'registration',
                    name: data.name ? data.name.split(' ')[0] + ' ' + (data.name.split(' ')[1]?.[0] || '') + '.' : 'Anonymous',
                    bloodGroup: data.bloodGroup || 'Unknown',
                    city: data.city || 'India',
                    time: data.registeredAt?.toDate ? formatDistanceToNow(data.registeredAt.toDate(), { addSuffix: true }) : 'Just now'
                };
            });

            setActivities(newActivities);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching live activities:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading || activities.length === 0) return null; // Don't show if no data

    return (
        <section className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 mb-2"
                        >
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">Live Activity</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white"
                        >
                            Community in Action
                        </motion.h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium"
                    >
                        <Activity className="h-4 w-4" />
                        <span>Real-time Updates</span>
                    </motion.div>
                </div>

                {/* Activity Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence mode="popLayout">
                        {activities.map((activity, index) => (
                            <ActivityItem
                                key={activity.id || index}
                                activity={activity}
                                index={index}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Bottom Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 flex flex-wrap justify-center gap-8 text-center"
                >
                    {/* Bottom stats removed until we have real aggregation data */}
                </motion.div>
            </div>
        </section>
    );
};

export default LiveActivityFeed;
