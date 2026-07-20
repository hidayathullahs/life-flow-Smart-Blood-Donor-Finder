import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Droplet, Clock, Heart, AlertCircle, Stethoscope } from 'lucide-react';

const FAQ_DATA = [
    {
        icon: Droplet,
        question: "Who can donate blood?",
        answer: "Anyone between 18-65 years old, weighing more than 50kg, and in good health can donate blood. You should not have donated blood in the last 3 months (for men) or 4 months (for women). Certain medical conditions may temporarily or permanently disqualify you."
    },
    {
        icon: Clock,
        question: "How long does blood donation take?",
        answer: "The entire process takes about 30-45 minutes. The actual blood collection only takes 8-10 minutes. The rest of the time is spent on registration, health screening, and post-donation refreshments."
    },
    {
        icon: Heart,
        question: "Is blood donation safe?",
        answer: "Yes, blood donation is completely safe. Sterile, single-use equipment is used for each donation, so there's no risk of infection. Most people feel fine after donating, though some may experience mild dizziness or bruising."
    },
    {
        icon: AlertCircle,
        question: "How often can I donate blood?",
        answer: "Men can donate every 3 months (90 days) and women can donate every 4 months (120 days). This gives your body enough time to replenish the donated blood cells."
    },
    {
        icon: Stethoscope,
        question: "What happens to my donated blood?",
        answer: "Your blood is tested, processed, and separated into components (red cells, plasma, platelets). It's then stored and distributed to hospitals. One donation can help up to 3 different patients!"
    },
    {
        icon: HelpCircle,
        question: "How does SmartBloodLife verify donors?",
        answer: "We have a multi-step verification process: phone number verification via OTP, optional ID document upload, and badge system based on donation history. Verified donors get a blue checkmark on their profile."
    }
];

const FAQItem = ({ item, isOpen, onToggle }) => (
    <motion.div
        layout
        className="border dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/50 shadow-sm"
    >
        <button
            onClick={onToggle}
            className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isOpen ? 'bg-primary text-white' : 'bg-primary/10 text-primary'} transition-colors`}>
                <item.icon className="h-5 w-5" />
            </div>
            <span className="flex-1 font-medium text-slate-900 dark:text-white">{item.question}</span>
            <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="px-5 pb-5 pl-[4.5rem] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.answer}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4"
                    >
                        <HelpCircle className="h-4 w-4" />
                        Common Questions
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white"
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-600 dark:text-slate-400 mt-3 max-w-2xl mx-auto"
                    >
                        Everything you need to know about blood donation and using SmartBloodLife
                    </motion.p>
                </div>

                {/* FAQ List */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {FAQ_DATA.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <FAQItem
                                item={item}
                                isOpen={openIndex === index}
                                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mt-12"
                >
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {"Still have questions? We're here to help!"}
                    </p>
                    <a
                        href="mailto:support@smartbloodlife.com"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
                    >
                        Contact Support
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQSection;
