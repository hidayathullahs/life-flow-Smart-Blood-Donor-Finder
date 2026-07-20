/**
 * Smart Blood Matching Engine
 * Determines compatible donors based on blood type compatibility rules
 */

// Blood Type Compatibility Matrix
// Key = Recipient blood type, Value = Array of compatible donor types
const RECIPIENT_COMPATIBILITY = {
    'O-': ['O-'],
    'O+': ['O-', 'O+'],
    'A-': ['O-', 'A-'],
    'A+': ['O-', 'O+', 'A-', 'A+'],
    'B-': ['O-', 'B-'],
    'B+': ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] // Universal recipient
};

// Key = Donor blood type, Value = Array of compatible recipient types
const DONOR_COMPATIBILITY = {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal donor
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+']
};

// Blood type rarity in India (approximate percentages)
const BLOOD_TYPE_RARITY = {
    'O+': { percentage: 37.12, rarity: 'common' },
    'B+': { percentage: 32.26, rarity: 'common' },
    'A+': { percentage: 22.88, rarity: 'common' },
    'AB+': { percentage: 7.74, rarity: 'uncommon' },
    'O-': { percentage: 2.0, rarity: 'rare' },
    'B-': { percentage: 1.5, rarity: 'rare' },
    'A-': { percentage: 1.0, rarity: 'rare' },
    'AB-': { percentage: 0.5, rarity: 'very_rare' }
};

/**
 * Get all blood types that can donate TO the given recipient
 * @param {string} recipientBloodType - The recipient's blood type
 * @returns {string[]} Array of compatible donor blood types
 */
export const getCompatibleDonors = (recipientBloodType) => {
    const normalized = recipientBloodType?.toUpperCase().trim();
    return RECIPIENT_COMPATIBILITY[normalized] || [];
};

/**
 * Get all blood types that can RECEIVE from the given donor
 * @param {string} donorBloodType - The donor's blood type
 * @returns {string[]} Array of compatible recipient blood types
 */
export const getCompatibleRecipients = (donorBloodType) => {
    const normalized = donorBloodType?.toUpperCase().trim();
    return DONOR_COMPATIBILITY[normalized] || [];
};

/**
 * Check if two blood types are compatible
 * @param {string} donorType - Donor's blood type
 * @param {string} recipientType - Recipient's blood type
 * @returns {boolean}
 */
export const isCompatible = (donorType, recipientType) => {
    const compatibleDonors = getCompatibleDonors(recipientType);
    return compatibleDonors.includes(donorType?.toUpperCase().trim());
};

/**
 * Get blood type rarity info
 */
export const getBloodTypeRarity = (bloodType) => {
    const normalized = bloodType?.toUpperCase().trim();
    return BLOOD_TYPE_RARITY[normalized] || { percentage: 0, rarity: 'unknown' };
};

/**
 * Get rarity badge color
 */
export const getRarityBadgeColor = (rarity) => {
    const colors = {
        'common': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        'uncommon': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
        'rare': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
        'very_rare': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[rarity] || colors['common'];
};

/**
 * Smart Match Algorithm
 * Finds and sorts compatible donors based on multiple factors
 * 
 * @param {string} patientBloodType - Patient's blood type
 * @param {Array} allDonors - All available donors
 * @param {Object} options - Sorting and filtering options
 * @returns {Array} Sorted array of compatible donors
 */
export const smartMatch = (patientBloodType, allDonors, options = {}) => {
    const {
        patientLocation = null,      // { lat, lng }
        maxDistanceKm = null,        // Maximum distance in km
        includeEmergency = false,    // Include emergency-eligible donors
        sortBy = 'priority'          // 'priority' | 'distance' | 'eligibility'
    } = options;

    // Get compatible blood types
    const compatibleTypes = getCompatibleDonors(patientBloodType);

    if (compatibleTypes.length === 0) {
        return [];
    }

    // Filter to compatible donors
    let matchedDonors = allDonors.filter(donor => {
        const donorType = donor.bloodGroup?.toUpperCase().trim();
        return compatibleTypes.includes(donorType);
    });

    // Calculate scores for each donor
    matchedDonors = matchedDonors.map(donor => {
        const score = calculateDonorScore(donor, {
            patientBloodType,
            patientLocation,
            includeEmergency
        });

        return { ...donor, _matchScore: score };
    });

    // Filter by distance if specified
    if (patientLocation && maxDistanceKm) {
        matchedDonors = matchedDonors.filter(donor => {
            if (!donor.location?.lat || !donor.location?.lng) return true;
            const distance = calculateDistance(
                patientLocation.lat, patientLocation.lng,
                donor.location.lat, donor.location.lng
            );
            donor._distanceKm = distance;
            return distance <= maxDistanceKm;
        });
    }

    // Sort by criteria
    switch (sortBy) {
        case 'distance':
            matchedDonors.sort((a, b) => (a._distanceKm || 999) - (b._distanceKm || 999));
            break;
        case 'eligibility':
            // Sort by days since last donation (descending)
            matchedDonors.sort((a, b) => {
                const daysA = getDaysSinceDonation(a);
                const daysB = getDaysSinceDonation(b);
                return daysB - daysA;
            });
            break;
        case 'priority':
        default:
            // Sort by match score (descending)
            matchedDonors.sort((a, b) => b._matchScore - a._matchScore);
    }

    return matchedDonors;
};

/**
 * Calculate donor priority score
 */
const calculateDonorScore = (donor, options) => {
    let score = 0;
    const { patientBloodType } = options;

    // Perfect blood type match (same type) gets bonus
    if (donor.bloodGroup?.toUpperCase() === patientBloodType?.toUpperCase()) {
        score += 30;
    }

    // Verified donors get priority
    if (donor.verified) {
        score += 25;
    }

    // Eligibility score (more days since donation = higher score)
    const daysSince = getDaysSinceDonation(donor);
    if (daysSince === null) {
        // First-time donor
        score += 15;
    } else if (daysSince >= 90) {
        score += 20;
    } else if (daysSince >= 56) {
        score += 10; // Emergency eligible
    }

    // Active donors (recently updated)
    if (donor.lastActiveAt || donor.updatedAt) {
        const lastActive = donor.lastActiveAt?.toDate?.() || donor.updatedAt?.toDate?.() || new Date(donor.lastActiveAt || donor.updatedAt);
        const daysSinceActive = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceActive < 30) {
            score += 15;
        } else if (daysSinceActive < 90) {
            score += 10;
        }
    }

    // Elite donor status
    if (donor.isEliteDonor) {
        score += 10;
    }

    return score;
};

/**
 * Get days since last donation
 */
const getDaysSinceDonation = (donor) => {
    if (!donor.lastDonationDate) return null;

    const lastDate = donor.lastDonationDate.toDate?.() || new Date(donor.lastDonationDate);
    return Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const toRad = (deg) => deg * (Math.PI / 180);

/**
 * Get all blood types
 */
export const getAllBloodTypes = () => Object.keys(RECIPIENT_COMPATIBILITY);

export default {
    getCompatibleDonors,
    getCompatibleRecipients,
    isCompatible,
    getBloodTypeRarity,
    getRarityBadgeColor,
    smartMatch,
    getAllBloodTypes
};
