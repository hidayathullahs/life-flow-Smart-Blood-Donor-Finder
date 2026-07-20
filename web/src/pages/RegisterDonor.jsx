import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Heart,
    User,
    Mail,
    Phone,
    MapPin,
    Droplet,
    Calendar,
    CheckCircle,
    AlertCircle,
    Loader2,
    ArrowRight,
    Shield,
    Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-toastify';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const CITIES = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata',
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Coimbatore', 'Kochi',
    'Indore', 'Bhopal', 'Visakhapatnam', 'Nagpur', 'Surat', 'Vadodara'
];

const RegisterDonor = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        bloodGroup: '',
        city: '',
        age: '',
        weight: '',
        lastDonation: '',
        conditions: [],
        agreeToTerms: false
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const MEDICAL_CONDITIONS = [
        { id: 'none', label: 'None of the below' },
        { id: 'diabetes', label: 'Diabetes' },
        { id: 'hypertension', label: 'High Blood Pressure' },
        { id: 'heart', label: 'Heart Disease' },
        { id: 'hiv', label: 'HIV/AIDS' },
        { id: 'hepatitis', label: 'Hepatitis B/C' }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleConditionChange = (conditionId) => {
        setFormData(prev => {
            if (conditionId === 'none') {
                return { ...prev, conditions: ['none'] };
            }
            const newConditions = prev.conditions.filter(c => c !== 'none');
            if (newConditions.includes(conditionId)) {
                return { ...prev, conditions: newConditions.filter(c => c !== conditionId) };
            }
            return { ...prev, conditions: [...newConditions, conditionId] };
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
            newErrors.phone = 'Invalid Indian phone number';
        }
        if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.age) {
            newErrors.age = 'Age is required';
        } else if (parseInt(formData.age) < 18 || parseInt(formData.age) > 65) {
            newErrors.age = 'Age must be between 18 and 65';
        }
        if (!formData.weight) {
            newErrors.weight = 'Weight is required';
        } else if (parseInt(formData.weight) < 50) {
            newErrors.weight = 'Minimum weight is 50 kg';
        }
        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);

        try {
            // Add donor to Firestore
            await addDoc(collection(db, 'donors'), {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                bloodGroup: formData.bloodGroup,
                city: formData.city,
                age: parseInt(formData.age),
                weight: parseInt(formData.weight),
                lastDonation: formData.lastDonation || null,
                conditions: formData.conditions,
                isAvailable: true,
                isVerified: false,
                registeredAt: serverTimestamp(),
                donationCount: 0
            });

            setSuccess(true);
            toast.success('🎉 Registration successful! You are now a donor.');

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                bloodGroup: '',
                city: '',
                age: '',
                weight: '',
                lastDonation: '',
                conditions: [],
                agreeToTerms: false
            });

        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50 dark:from-slate-950 dark:to-slate-900 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
                >
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        {"You're a Hero! 🎉"}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Thank you for registering as a blood donor. Your willingness to help can save lives!
                    </p>
                    <div className="space-y-3">
                        <Button
                            onClick={() => setSuccess(false)}
                            className="w-full bg-primary hover:bg-red-700"
                        >
                            Register Another Donor
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.href = '/'}
                            className="w-full"
                        >
                            Back to Home
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-full text-red-700 dark:text-red-400 text-sm font-medium mb-4">
                        <Heart className="h-4 w-4" />
                        Become a Life Saver
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Register as a <span className="text-primary">Blood Donor</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Join our community of verified donors. Your single donation can save up to 3 lives.
                    </p>
                </motion.div>

                {/* Benefits */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
                >
                    {[
                        { icon: Shield, title: 'Verified Profile', desc: 'Your info is kept secure' },
                        { icon: Clock, title: 'Quick Process', desc: 'Takes only 2 minutes' },
                        { icon: Heart, title: 'Save Lives', desc: 'Help those in emergency' }
                    ].map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800/50 rounded-xl">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <benefit.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">{benefit.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{benefit.desc}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <User className="h-4 w-4 inline mr-2" />
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition`}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <Mail className="h-4 w-4 inline mr-2" />
                                Email Address *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition`}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <Phone className="h-4 w-4 inline mr-2" />
                                Phone Number *
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-4 py-3 rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-sm">
                                    +91
                                </span>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit mobile number"
                                    maxLength={10}
                                    className={`flex-1 px-4 py-3 rounded-r-xl border ${errors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition`}
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>

                        {/* Blood Group */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <Droplet className="h-4 w-4 inline mr-2" />
                                Blood Group *
                            </label>
                            <select
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.bloodGroup ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition`}
                            >
                                <option value="">Select blood group</option>
                                {BLOOD_GROUPS.map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                            {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>}
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <MapPin className="h-4 w-4 inline mr-2" />
                                City *
                            </label>
                            <select
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.city ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition`}
                            >
                                <option value="">Select your city</option>
                                {CITIES.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>

                        {/* Age */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                <Calendar className="h-4 w-4 inline mr-2" />
                                Age *
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Your age (18-65)"
                                min={18}
                                max={65}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.age ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition`}
                            />
                            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                        </div>

                        {/* Weight */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Weight (kg) *
                            </label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                placeholder="Minimum 50 kg"
                                min={45}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.weight ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition`}
                            />
                            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
                        </div>

                        {/* Last Donation */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Last Donation Date (if any)
                            </label>
                            <input
                                type="date"
                                name="lastDonation"
                                value={formData.lastDonation}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                            />
                        </div>
                    </div>

                    {/* Medical Conditions */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                            <AlertCircle className="h-4 w-4 inline mr-2" />
                            Medical Conditions (if any)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {MEDICAL_CONDITIONS.map(condition => (
                                <label
                                    key={condition.id}
                                    className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition ${formData.conditions.includes(condition.id)
                                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.conditions.includes(condition.id)}
                                        onChange={() => handleConditionChange(condition.id)}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${formData.conditions.includes(condition.id)
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-slate-300 dark:border-slate-600'
                                        }`}>
                                        {formData.conditions.includes(condition.id) && (
                                            <CheckCircle className="h-3 w-3" />
                                        )}
                                    </div>
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{condition.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="mt-6">
                        <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${errors.agreeToTerms ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                            }`}>
                            <input
                                type="checkbox"
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                                className="mt-1"
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                I confirm that I am eligible to donate blood and the information provided is accurate.
                                I agree to be contacted when someone needs my blood type.
                            </span>
                        </label>
                        {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>}
                    </div>

                    {/* Submit Button */}
                    <motion.div
                        className="mt-8"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 text-lg bg-gradient-to-r from-primary to-rose-500 hover:from-red-700 hover:to-rose-600 rounded-xl shadow-lg shadow-primary/30"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Registering...
                                </>
                            ) : (
                                <>
                                    Register as Donor
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </motion.div>
                </motion.form>
            </div>
        </div>
    );
};

export default RegisterDonor;
