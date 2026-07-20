
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Heart, UserPlus, Phone, ShieldCheck, Activity, Droplet, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import StatsSection from '@/components/StatsSection';
import AnnouncementBanner from '@/components/AnnouncementBanner';

import QuickBloodSelector from '@/components/QuickBloodSelector';
import FloatingSOS from '@/components/FloatingSOS';

import BecomeDonorCTA from '@/components/BecomeDonorCTA';
import FAQSection from '@/components/FAQSection';
import LiveActivityFeed from '@/components/LiveActivityFeed';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Floating SOS Emergency Button */}
            <FloatingSOS />

            {/* Announcement Banner */}
            <AnnouncementBanner />

            {/* Hero Section */}
            <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-20 overflow-hidden dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Text Content */}
                        <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium"
                            >
                                <Droplet className="h-4 w-4 fill-current" />
                                Save Lives Today
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
                            >
                                Find Emergency Blood Donors <span className="text-primary">Near You in India</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
                            >
                                Connect with eligible blood donors instantly. SmartBloodLife helps you find verified donors in your city when every second counts.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2"
                            >
                                <Button size="lg" className="h-14 px-8 text-base rounded-full shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 bg-primary hover:bg-red-700" asChild>
                                    <Link to="/search">
                                        <Search className="mr-2 h-5 w-5" />
                                        Search Donors
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300" asChild>
                                    <Link to="/register">
                                        <UserPlus className="mr-2 h-5 w-5" />
                                        Register as Donor
                                    </Link>
                                </Button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-100 dark:border-slate-700 mt-8"
                            >
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">24/7</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Available</p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">100%</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Verified</p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Fast</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Response</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Hero Visual - Blood Donation Image with Animation */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex-1 w-full max-w-xl lg:max-w-none relative"
                        >
                            {/* Animated Background Glow */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    opacity: [0.3, 0.5, 0.3]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-primary/30 via-rose-400/30 to-primary/30 rounded-3xl blur-3xl"
                            />

                            {/* Floating Image Container */}
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="relative"
                            >
                                {/* Decorative Ring */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-4 border-2 border-dashed border-primary/20 rounded-[2rem]"
                                />

                                {/* Image with Gradient Border */}
                                <div className="relative p-1 bg-gradient-to-br from-primary via-rose-400 to-primary rounded-3xl shadow-2xl shadow-primary/20">
                                    <img
                                        src="/images/blood-donation.jpg"
                                        alt="Blood donation - Save lives"
                                        className="w-full h-auto rounded-[1.25rem] object-cover"
                                    />
                                </div>

                                {/* Floating Hearts */}
                                <motion.div
                                    animate={{
                                        y: [0, -20, 0],
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                                    className="absolute -top-4 -right-4 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center"
                                >
                                    <Heart className="h-5 w-5 text-primary fill-primary/50" />
                                </motion.div>

                                <motion.div
                                    animate={{
                                        y: [0, -15, 0],
                                        scale: [1, 1.1, 1],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                                    className="absolute -bottom-2 -left-2 w-8 h-8 bg-rose-400/20 rounded-full flex items-center justify-center"
                                >
                                    <Heart className="h-4 w-4 text-rose-500 fill-rose-500/50" />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Quick Blood Group Selector */}
            <section className="py-12 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-900/50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <QuickBloodSelector />
                    </motion.div>
                </div>
            </section>

            {/* How BloodLink Works Section */}
            <section className="py-24 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                            ⚡ Quick & Easy
                        </motion.span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">How to Find a Blood Donor Fast</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg">
                            SmartBloodLife is the fastest way to <strong>find blood donors in India</strong>. Follow these simple steps to connect with verified donors near you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Search className="h-8 w-8 text-primary" />}
                            title="Search by Blood Group"
                            desc="Filter donors by blood type and location to find the perfect match quickly."
                            step="1"
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="h-8 w-8 text-primary" />}
                            title="Verified Donors Only"
                            desc="All donors are verified and eligible (90+ days since last donation)."
                            step="2"
                        />
                        <FeatureCard
                            icon={<Phone className="h-8 w-8 text-primary" />}
                            title="Instant Contact"
                            desc="Call or message donors directly via phone or WhatsApp with one click."
                            step="3"
                        />
                    </div>

                    <div className="mt-20 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-12">Why SmartBloodLife is the Best Blood Donation Platform in India</h2>
                        <div className="grid md:grid-cols-3 gap-8 text-left">
                            <div className="space-y-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-primary" />
                                    Real-time Donor Availability
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Our advanced algorithm helps you <strong>find emergency blood donors</strong> who are currently active and available to donate. No more calling outdated numbers.
                                </p>
                            </div>
                            <div className="space-y-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    100% Free & Direct Contact
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    We believe in saving lives, not making profits. Connect directly with donors for <strong>A+, O+, B-</strong>, and other blood groups without any middleman.
                                </p>
                            </div>
                            <div className="space-y-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Droplet className="h-5 w-5 text-primary" />
                                    Verified Donors in Major Cities
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Whether you need <strong>blood donors in Mumbai, Delhi, or Bangalore</strong>, our network of verified volunteers is ready to help in medical emergencies.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Statistics Section */}
            <StatsSection />

            <LiveActivityFeed />

            {/* Testimonials Section - Removed until real user feedback is available */}

            {/* Become a Donor CTA */}
            <BecomeDonorCTA />

            {/* FAQ Section */}
            <FAQSection />

            {/* Final CTA Section */}
            <section className="py-20 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl p-8 md:p-16 text-center border border-slate-100 dark:border-slate-800 max-w-5xl mx-auto"
                    >
                        <div className="mx-auto bg-red-50 dark:bg-red-900/30 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                            <Heart className="h-10 w-10 text-primary fill-primary" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Every Drop Counts</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                            Join our community of verified blood donors and help save lives in your area.
                            Your small act of kindness can make a world of difference.
                        </p>
                        <Button size="lg" className="h-14 px-10 text-lg font-semibold rounded-full shadow-xl shadow-red-500/20 hover:scale-105 transition-all bg-primary hover:bg-red-700" asChild>
                            <Link to="/search">
                                Start Searching <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, step }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: step ? step * 0.1 : 0 }}
        className="relative p-8 rounded-[2rem] bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 group"
    >
        {/* Step Number */}
        {step && (
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                {step}
            </div>
        )}

        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    </motion.div>
);

export default Home;
