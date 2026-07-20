/**
 * Automatic Donor Status System
 * Calculates donor eligibility status based on last donation date
 */

import { differenceInDays } from 'date-fns';

// Status Constants
export const DONOR_STATUS = {
    ELIGIBLE: 'eligible',           // Can donate now (> 90 days since last)
    COOLING: 'cooling',             // Recently donated, waiting (< 90 days)
    FIRST_TIME: 'first_time',       // Never donated before
    EMERGENCY_ELIGIBLE: 'emergency', // Admin override for emergencies
    INACTIVE: 'inactive'            // No activity for 6+ months
};

// Status Configuration
const CONFIG = {
    COOLING_PERIOD_DAYS: 90,        // Standard interval between donations
    INACTIVE_THRESHOLD_DAYS: 180,   // Days without activity to mark inactive
    EMERGENCY_MIN_DAYS: 56          // Minimum days for emergency eligibility
};

/**
 * Parse donation date from various formats
 */
const parseDonationDate = (dateValue) => {
    if (!dateValue) return null;

    // Firestore Timestamp
    if (dateValue.toDate) {
        return dateValue.toDate();
    }
    // JavaScript Date
    if (dateValue instanceof Date) {
        return dateValue;
    }
    // String
    return new Date(dateValue);
};

/**
 * Calculate donor's current status
 * @param {Object} donor - Donor object with lastDonationDate and lastActiveAt
 * @param {boolean} isEmergencyOverride - Admin emergency override
 * @returns {Object} Status info
 */
export const getDonorStatus = (donor, isEmergencyOverride = false) => {
    const lastDonation = parseDonationDate(donor.lastDonationDate);
    const lastActive = parseDonationDate(donor.lastActiveAt || donor.updatedAt);
    const now = new Date();

    // Never donated
    if (!lastDonation) {
        return {
            status: DONOR_STATUS.FIRST_TIME,
            canDonate: true,
            daysSinceDonation: null,
            daysUntilEligible: 0,
            progress: 100,
            message: 'Ready to make their first donation!',
            badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
        };
    }

    const daysSinceDonation = differenceInDays(now, lastDonation);
    const daysUntilEligible = Math.max(0, CONFIG.COOLING_PERIOD_DAYS - daysSinceDonation);
    const progress = Math.min(100, (daysSinceDonation / CONFIG.COOLING_PERIOD_DAYS) * 100);

    // Emergency override by admin
    if (isEmergencyOverride && daysSinceDonation >= CONFIG.EMERGENCY_MIN_DAYS) {
        return {
            status: DONOR_STATUS.EMERGENCY_ELIGIBLE,
            canDonate: true,
            daysSinceDonation,
            daysUntilEligible: 0,
            progress: 100,
            message: 'Emergency eligibility approved by admin',
            badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
        };
    }

    // Check if inactive (no activity for 6+ months)
    if (lastActive) {
        const daysSinceActive = differenceInDays(now, lastActive);
        if (daysSinceActive > CONFIG.INACTIVE_THRESHOLD_DAYS) {
            return {
                status: DONOR_STATUS.INACTIVE,
                canDonate: daysSinceDonation >= CONFIG.COOLING_PERIOD_DAYS,
                daysSinceDonation,
                daysUntilEligible,
                progress,
                message: `Inactive for ${daysSinceActive} days. Contact to verify availability.`,
                badgeColor: 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'
            };
        }
    }

    // Eligible to donate
    if (daysSinceDonation >= CONFIG.COOLING_PERIOD_DAYS) {
        return {
            status: DONOR_STATUS.ELIGIBLE,
            canDonate: true,
            daysSinceDonation,
            daysUntilEligible: 0,
            progress: 100,
            message: 'Eligible to donate now',
            badgeColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        };
    }

    // Cooling period (recently donated)
    return {
        status: DONOR_STATUS.COOLING,
        canDonate: false,
        daysSinceDonation,
        daysUntilEligible,
        progress,
        message: `Eligible in ${daysUntilEligible} days`,
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
    };
};

/**
 * Get status display info
 */
export const getStatusDisplayInfo = (status) => {
    const info = {
        [DONOR_STATUS.ELIGIBLE]: {
            label: 'Eligible',
            icon: 'CheckCircle',
            color: 'green'
        },
        [DONOR_STATUS.COOLING]: {
            label: 'Cooling Period',
            icon: 'Clock',
            color: 'amber'
        },
        [DONOR_STATUS.FIRST_TIME]: {
            label: 'First-Time Donor',
            icon: 'Star',
            color: 'blue'
        },
        [DONOR_STATUS.EMERGENCY_ELIGIBLE]: {
            label: 'Emergency Eligible',
            icon: 'AlertTriangle',
            color: 'orange'
        },
        [DONOR_STATUS.INACTIVE]: {
            label: 'Inactive',
            icon: 'UserX',
            color: 'gray'
        }
    };

    return info[status] || info[DONOR_STATUS.ELIGIBLE];
};

/**
 * Filter donors by eligibility
 */
export const filterEligibleDonors = (donors, includeEmergency = false) => {
    return donors.filter(donor => {
        const status = getDonorStatus(donor);
        if (status.canDonate) return true;
        if (includeEmergency && status.status === DONOR_STATUS.COOLING && status.daysSinceDonation >= CONFIG.EMERGENCY_MIN_DAYS) {
            return true;
        }
        return false;
    });
};

/**
 * Sort donors by eligibility priority
 * Priority: Eligible > First-Time > Emergency > Cooling
 */
export const sortByEligibility = (donors) => {
    const priorityOrder = {
        [DONOR_STATUS.ELIGIBLE]: 1,
        [DONOR_STATUS.FIRST_TIME]: 2,
        [DONOR_STATUS.EMERGENCY_ELIGIBLE]: 3,
        [DONOR_STATUS.COOLING]: 4,
        [DONOR_STATUS.INACTIVE]: 5
    };

    return [...donors].sort((a, b) => {
        const statusA = getDonorStatus(a);
        const statusB = getDonorStatus(b);
        return (priorityOrder[statusA.status] || 99) - (priorityOrder[statusB.status] || 99);
    });
};

export default {
    DONOR_STATUS,
    getDonorStatus,
    getStatusDisplayInfo,
    filterEligibleDonors,
    sortByEligibility
};
