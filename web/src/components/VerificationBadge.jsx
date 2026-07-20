import React from 'react';
import { BadgeCheck, Phone, FileCheck, AlertCircle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Verification Badge Component
 * Displays donor verification status with appropriate icon and styling
 */

const iconMap = {
    'BadgeCheck': BadgeCheck,
    'Phone': Phone,
    'FileCheck': FileCheck,
    'AlertCircle': AlertCircle,
    'Shield': Shield
};

const VerificationBadge = ({
    level = 'none',
    size = 'md',
    showLabel = true,
    showTooltip = true,
    className = ''
}) => {
    const badges = {
        full: {
            label: 'Verified',
            icon: 'BadgeCheck',
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
            borderColor: 'border-blue-200 dark:border-blue-800',
            description: 'Identity verified by admin'
        },
        document: {
            label: 'Pending',
            icon: 'FileCheck',
            color: 'text-amber-600 dark:text-amber-400',
            bgColor: 'bg-amber-100 dark:bg-amber-900/30',
            borderColor: 'border-amber-200 dark:border-amber-800',
            description: 'Documents under review'
        },
        phone: {
            label: 'Phone Verified',
            icon: 'Phone',
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
            borderColor: 'border-green-200 dark:border-green-800',
            description: 'Phone number verified'
        },
        none: {
            label: 'Unverified',
            icon: 'AlertCircle',
            color: 'text-gray-400 dark:text-gray-500',
            bgColor: 'bg-gray-100 dark:bg-gray-800',
            borderColor: 'border-gray-200 dark:border-gray-700',
            description: 'Not yet verified'
        }
    };

    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6'
    };

    const paddingClasses = {
        sm: 'px-1.5 py-0.5 text-xs',
        md: 'px-2 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm'
    };

    const badge = badges[level] || badges.none;
    const IconComponent = iconMap[badge.icon] || AlertCircle;

    // Icon-only badge (for compact display)
    if (!showLabel) {
        return (
            <div className={`relative group ${className}`}>
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`${badge.bgColor} ${badge.color} rounded-full p-1`}
                >
                    <IconComponent className={sizeClasses[size]} />
                </motion.div>

                {showTooltip && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        {badge.description}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                    </div>
                )}
            </div>
        );
    }

    // Full badge with label
    return (
        <div className={`relative group ${className}`}>
            <motion.div
                whileHover={{ scale: 1.02 }}
                className={`
                    inline-flex items-center gap-1.5 
                    ${badge.bgColor} ${badge.color} 
                    ${paddingClasses[size]}
                    rounded-full border ${badge.borderColor}
                    font-medium
                `}
            >
                <IconComponent className={sizeClasses[size]} />
                <span>{badge.label}</span>
            </motion.div>

            {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    {badge.description}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                </div>
            )}
        </div>
    );
};

/**
 * Elite Donor Badge
 * Special badge for donors with 5+ donations
 */
export const EliteDonorBadge = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6'
    };

    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            className={`
                inline-flex items-center gap-1.5 
                bg-gradient-to-r from-amber-100 to-yellow-100 
                dark:from-amber-900/30 dark:to-yellow-900/30
                text-amber-700 dark:text-amber-300
                px-2 py-1 rounded-full text-xs font-bold
                border border-amber-200 dark:border-amber-800
                ${className}
            `}
        >
            <Shield className={sizeClasses[size]} />
            <span>Elite Donor</span>
        </motion.div>
    );
};

/**
 * Verification Status Indicator (for donor cards)
 */
export const VerificationIndicator = ({ verified, phoneVerified, className = '' }) => {
    if (verified) {
        return (
            <div className={`flex items-center gap-1 text-blue-600 dark:text-blue-400 ${className}`}>
                <BadgeCheck className="h-4 w-4" />
                <span className="text-xs font-medium">Verified</span>
            </div>
        );
    }

    if (phoneVerified) {
        return (
            <div className={`flex items-center gap-1 text-green-600 dark:text-green-400 ${className}`}>
                <Phone className="h-4 w-4" />
                <span className="text-xs font-medium">Phone Verified</span>
            </div>
        );
    }

    return null;
};

export default VerificationBadge;
