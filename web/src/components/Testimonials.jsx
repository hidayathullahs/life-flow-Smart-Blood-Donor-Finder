import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star, MapPin, Droplet } from 'lucide-react';

/*
 * SAMPLE TESTIMONIALS - Replace with real testimonials from your users
 * 
 * To add real testimonials:
 * 1. Collect feedback from actual donors/recipients
 * 2. Get their permission to display their story
 * 3. Replace the data below with real information
 * 
 * For production, consider storing testimonials in Firestore
 * and fetching them dynamically.
 */
const TESTIMONIALS = [
    {
        id: 1,
        name: "Priya S.",
        location: "Mumbai",
        bloodGroup: "O+",
        // Using UI Avatars API - generates initials-based avatar
        image: "https://ui-avatars.com/api/?name=Priya+S&background=dc2626&color=fff&size=128",
        story: "My father needed O+ blood urgently at 2 AM. SmartBloodLife connected me with a verified donor in just 15 minutes. The donor was at the hospital within an hour. Forever grateful!",
        rating: 5,
        type: "recipient",
        isSample: true // Flag to indicate this is sample data
    },
    {
        id: 2,
        name: "Rajesh K.",
        location: "Delhi",
        bloodGroup: "A-",
        image: "https://ui-avatars.com/api/?name=Rajesh+K&background=3b82f6&color=fff&size=128",
        story: "I've donated blood 8 times through SmartBloodLife. The platform makes it so easy to find people who need my blood type. Knowing I've saved lives gives me immense satisfaction.",
        rating: 5,
        type: "donor",
        isSample: true
    },
    {
        id: 3,
        name: "Dr. Ananya R.",
        location: "Bangalore",
        bloodGroup: "B+",
        image: "https://ui-avatars.com/api/?name=Dr+Ananya&background=10b981&color=fff&size=128",
        story: "As a doctor, I've seen how critical timely blood donation is. SmartBloodLife has revolutionized emergency blood requests at our hospital. Response time reduced by 60%.",
        rating: 5,
        type: "doctor",
        isSample: true
    },
    {
        id: 4,
        name: "Mohammed A.",
        location: "Hyderabad",
        bloodGroup: "AB+",
        image: "https://ui-avatars.com/api/?name=Mohammed+A&background=8b5cf6&color=fff&size=128",
        story: "During my wife's delivery, we needed AB+ blood which is rare. SmartBloodLife found 3 donors in our city within 30 minutes. Both mother and baby are healthy today!",
        rating: 5,
        type: "recipient",
        isSample: true
    }
];

const TestimonialCard = ({ testimonial, isActive }) => (
    <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: isActive ? 1 : 0.5, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className={`relative bg-white dark:bg-slate-800/50 rounded-3xl p-6 sm:p-8 shadow-xl border dark:border-slate-700 ${isActive ? 'scale-100' : 'scale-95'} transition-transform`}
    >
        {/* Quote Icon */}
        <div className="absolute -top-4 left-6 bg-primary text-white p-3 rounded-xl shadow-lg">
            <Quote className="h-5 w-5" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4 pt-2">
            {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
        </div>

        {/* Story */}
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6 italic">
            {"\""}{testimonial.story}{"\""}
        </p>

        {/* Author */}
        <div className="flex items-center gap-4">
            <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
            />
            <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-white">{testimonial.name}</h4>
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {testimonial.location}
                    </span>
                    <span className="flex items-center gap-1">
                        <Droplet className="h-3 w-3 text-primary" />
                        {testimonial.bloodGroup}
                    </span>
                </div>
            </div>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${testimonial.type === 'donor'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : testimonial.type === 'doctor'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-primary/10 text-primary'
                }`}>
                {testimonial.type === 'donor' ? '🩸 Donor' : testimonial.type === 'doctor' ? '👨‍⚕️ Doctor' : '🙏 Recipient'}
            </span>
        </div>
    </motion.div>
);

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-rotate testimonials
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToPrevious = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    const goToNext = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    };

    return (
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4"
                    >
                        💬 Real Stories
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white"
                    >
                        Lives Saved, Stories Shared
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-600 dark:text-slate-400 mt-3 max-w-2xl mx-auto"
                    >
                        Hear from donors, recipients, and healthcare professionals about their experience with SmartBloodLife
                    </motion.p>
                </div>

                {/* Testimonial Carousel */}
                <div className="max-w-3xl mx-auto relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={goToPrevious}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 z-10 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-shadow border dark:border-slate-700"
                    >
                        <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 z-10 p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-shadow border dark:border-slate-700"
                    >
                        <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </button>

                    {/* Cards */}
                    <AnimatePresence mode="wait">
                        <TestimonialCard
                            key={currentIndex}
                            testimonial={TESTIMONIALS[currentIndex]}
                            isActive={true}
                        />
                    </AnimatePresence>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {TESTIMONIALS.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setIsAutoPlaying(false);
                                    setCurrentIndex(index);
                                }}
                                className={`h-2 rounded-full transition-all ${index === currentIndex
                                    ? 'w-8 bg-primary'
                                    : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-primary/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
