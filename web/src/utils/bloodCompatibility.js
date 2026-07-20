/**
 * Blood Compatibility Logic
 * 
 * Blood Type Compatibility Chart:
 * - O- is the universal donor (can donate to all)
 * - AB+ is the universal recipient (can receive from all)
 */

// Who can this blood type DONATE TO?
const canDonateTo = {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+'],
};

// Who can this blood type RECEIVE FROM?
const canReceiveFrom = {
    'O-': ['O-'],
    'O+': ['O-', 'O+'],
    'A-': ['O-', 'A-'],
    'A+': ['O-', 'O+', 'A-', 'A+'],
    'B-': ['O-', 'B-'],
    'B+': ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
};

// Special badges for blood types
const bloodTypeInfo = {
    'O-': {
        badge: 'Universal Donor',
        description: 'Can donate to all blood types. Only 7% of population.',
        rarity: 'Rare',
        color: 'from-amber-500 to-orange-600'
    },
    'O+': {
        badge: 'Most Common',
        description: 'Most common blood type. Can donate to all positive types.',
        rarity: 'Common',
        color: 'from-red-500 to-rose-600'
    },
    'A-': {
        badge: 'Rare Type',
        description: 'Only 6% of population has this type.',
        rarity: 'Rare',
        color: 'from-purple-500 to-violet-600'
    },
    'A+': {
        badge: 'Second Most Common',
        description: 'Second most common. About 34% of population.',
        rarity: 'Common',
        color: 'from-red-500 to-rose-600'
    },
    'B-': {
        badge: 'Very Rare',
        description: 'Only 1.5% of population has this type.',
        rarity: 'Very Rare',
        color: 'from-indigo-500 to-purple-600'
    },
    'B+': {
        badge: 'Less Common',
        description: 'About 9% of population.',
        rarity: 'Less Common',
        color: 'from-rose-500 to-red-600'
    },
    'AB-': {
        badge: 'Rarest Type',
        description: 'Rarest blood type. Only 0.6% of population.',
        rarity: 'Extremely Rare',
        color: 'from-fuchsia-500 to-pink-600'
    },
    'AB+': {
        badge: 'Universal Recipient',
        description: 'Can receive from all blood types. About 3% of population.',
        rarity: 'Rare',
        color: 'from-emerald-500 to-teal-600'
    },
};

/**
 * Get list of blood types this donor can donate to
 */
export const getCompatibleRecipients = (bloodType) => {
    return canDonateTo[bloodType] || [];
};

/**
 * Get list of blood types this person can receive from
 */
export const getCompatibleDonors = (bloodType) => {
    return canReceiveFrom[bloodType] || [];
};

/**
 * Check if a donor can donate to a recipient
 */
export const canDonate = (donorType, recipientType) => {
    const compatible = canDonateTo[donorType] || [];
    return compatible.includes(recipientType);
};

/**
 * Get blood type information (badge, description, rarity)
 */
export const getBloodTypeInfo = (bloodType) => {
    return bloodTypeInfo[bloodType] || {
        badge: '',
        description: 'Standard blood type.',
        rarity: 'Unknown',
        color: 'from-gray-500 to-slate-600'
    };
};

/**
 * Get all blood types
 */
export const getAllBloodTypes = () => {
    return ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
};

/**
 * Calculate compatibility score (higher = more versatile)
 */
export const getCompatibilityScore = (bloodType) => {
    const donateTo = (canDonateTo[bloodType] || []).length;
    const receiveFrom = (canReceiveFrom[bloodType] || []).length;
    return { donateTo, receiveFrom, total: donateTo + receiveFrom };
};
