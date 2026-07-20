/**
 * Emergency Broadcast Service
 * Manages emergency blood requests and notifications
 */

import { db } from '@/lib/firebase';
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { getCompatibleDonors } from '@/utils/bloodMatch';

const EMERGENCIES_COLLECTION = 'emergencies';
const DONORS_COLLECTION = 'donors';

// Emergency urgency levels
export const URGENCY_LEVEL = {
    CRITICAL: 'critical',   // Life-threatening, needed within hours
    URGENT: 'urgent',       // Needed within 24 hours
    STANDARD: 'standard'    // Needed within a few days
};

// Emergency status
export const EMERGENCY_STATUS = {
    ACTIVE: 'active',
    FULFILLED: 'fulfilled',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired'
};

/**
 * Create new emergency blood request
 */
export const createEmergency = async (emergencyData, createdBy) => {
    try {
        const emergency = {
            bloodGroup: emergencyData.bloodGroup,
            unitsNeeded: emergencyData.unitsNeeded || 1,
            hospital: emergencyData.hospital,
            city: emergencyData.city,
            contactName: emergencyData.contactName,
            contactPhone: emergencyData.contactPhone,
            urgency: emergencyData.urgency || URGENCY_LEVEL.URGENT,
            notes: emergencyData.notes || '',
            patientName: emergencyData.patientName || '',

            // System fields
            status: EMERGENCY_STATUS.ACTIVE,
            active: true,
            createdBy,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            expiresAt: getExpiryDate(emergencyData.urgency),

            // Tracking
            viewCount: 0,
            responseCount: 0,
            notifiedDonors: []
        };

        const docRef = await addDoc(collection(db, EMERGENCIES_COLLECTION), emergency);

        return {
            id: docRef.id,
            ...emergency,
            success: true
        };
    } catch (error) {
        console.error('Error creating emergency:', error);
        throw error;
    }
};

/**
 * Get expiry date based on urgency
 */
const getExpiryDate = (urgency) => {
    const now = new Date();
    switch (urgency) {
        case URGENCY_LEVEL.CRITICAL:
            return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
        case URGENCY_LEVEL.URGENT:
            return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
        case URGENCY_LEVEL.STANDARD:
        default:
            return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    }
};

/**
 * Get all active emergencies
 */
export const getActiveEmergencies = async () => {
    try {
        const q = query(
            collection(db, EMERGENCIES_COLLECTION),
            where('active', '==', true),
            orderBy('createdAt', 'desc'),
            limit(20)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting active emergencies:', error);
        throw error;
    }
};

/**
 * Subscribe to real-time emergency updates
 */
export const subscribeToEmergencies = (callback, options = {}) => {
    const { bloodGroup = null, city = null, limitCount = 10 } = options;

    let q = query(
        collection(db, EMERGENCIES_COLLECTION),
        where('active', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
    );

    return onSnapshot(q, (snapshot) => {
        let emergencies = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Client-side filtering (Firestore has query limitations)
        if (bloodGroup) {
            emergencies = emergencies.filter(e => e.bloodGroup === bloodGroup);
        }
        if (city) {
            emergencies = emergencies.filter(e =>
                e.city.toLowerCase().includes(city.toLowerCase())
            );
        }

        callback(emergencies);
    });
};

/**
 * Get matching donors for an emergency
 */
export const getMatchingDonors = async (emergencyId) => {
    try {
        // Get emergency details
        const emergencies = await getActiveEmergencies();
        const emergency = emergencies.find(e => e.id === emergencyId);

        if (!emergency) {
            throw new Error('Emergency not found');
        }

        // Get compatible blood types
        const compatibleTypes = getCompatibleDonors(emergency.bloodGroup);

        // Fetch donors with compatible blood types
        const donorPromises = compatibleTypes.map(async (bloodType) => {
            const q = query(
                collection(db, DONORS_COLLECTION),
                where('bloodGroup', '==', bloodType),
                where('active', '==', true)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });

        const donorArrays = await Promise.all(donorPromises);
        let allDonors = donorArrays.flat();

        // Filter by city if specified
        if (emergency.city) {
            allDonors = allDonors.filter(donor =>
                donor.city?.toLowerCase() === emergency.city.toLowerCase()
            );
        }

        // Sort by eligibility
        allDonors.sort((a, b) => {
            const daysA = getDaysSinceDonation(a);
            const daysB = getDaysSinceDonation(b);
            return daysB - daysA; // Most eligible first
        });

        return allDonors;
    } catch (error) {
        console.error('Error getting matching donors:', error);
        throw error;
    }
};

const getDaysSinceDonation = (donor) => {
    if (!donor.lastDonationDate) return 999; // Never donated = most eligible
    const lastDate = donor.lastDonationDate.toDate?.() || new Date(donor.lastDonationDate);
    return Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Update emergency status
 */
export const updateEmergencyStatus = async (emergencyId, status, notes = '') => {
    try {
        const emergencyRef = doc(db, EMERGENCIES_COLLECTION, emergencyId);

        await updateDoc(emergencyRef, {
            status,
            active: status === EMERGENCY_STATUS.ACTIVE,
            statusNotes: notes,
            updatedAt: serverTimestamp()
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating emergency status:', error);
        throw error;
    }
};

/**
 * Mark emergency as fulfilled
 */
export const fulfillEmergency = async (emergencyId, fulfilledBy = null) => {
    return updateEmergencyStatus(emergencyId, EMERGENCY_STATUS.FULFILLED,
        fulfilledBy ? `Fulfilled by donor ${fulfilledBy}` : 'Blood requirement fulfilled'
    );
};

/**
 * Cancel emergency
 */
export const cancelEmergency = async (emergencyId, reason = '') => {
    return updateEmergencyStatus(emergencyId, EMERGENCY_STATUS.CANCELLED, reason);
};

/**
 * Increment view count
 */
export const incrementViewCount = async (emergencyId) => {
    try {
        const emergencyRef = doc(db, EMERGENCIES_COLLECTION, emergencyId);
        // Note: Use increment() for production to avoid race conditions
        const emergencies = await getActiveEmergencies();
        const emergency = emergencies.find(e => e.id === emergencyId);

        if (emergency) {
            await updateDoc(emergencyRef, {
                viewCount: (emergency.viewCount || 0) + 1
            });
        }
    } catch (error) {
        console.error('Error incrementing view count:', error);
    }
};

/**
 * Record donor response to emergency
 */
export const recordDonorResponse = async (emergencyId, donorId, responseType = 'clicked') => {
    try {
        const emergencyRef = doc(db, EMERGENCIES_COLLECTION, emergencyId);
        const emergencies = await getActiveEmergencies();
        const emergency = emergencies.find(e => e.id === emergencyId);

        if (emergency) {
            const responses = emergency.donorResponses || [];
            responses.push({
                donorId,
                responseType, // 'clicked', 'called', 'messaged'
                timestamp: new Date().toISOString()
            });

            await updateDoc(emergencyRef, {
                donorResponses: responses,
                responseCount: responses.length
            });
        }
    } catch (error) {
        console.error('Error recording donor response:', error);
    }
};

/**
 * Generate WhatsApp message for emergency
 */
export const generateWhatsAppMessage = (emergency) => {
    const message = `🚨 *URGENT BLOOD NEEDED*

🩸 Blood Group: *${emergency.bloodGroup}*
🏥 Hospital: ${emergency.hospital}
📍 City: ${emergency.city}
${emergency.patientName ? `👤 Patient: ${emergency.patientName}` : ''}
⚡ Urgency: ${emergency.urgency.toUpperCase()}

📞 Contact: ${emergency.contactPhone}
${emergency.notes ? `📝 Notes: ${emergency.notes}` : ''}

If you can help, please contact immediately!

_via SmartBloodLife Blood Donor Finder_`;

    return encodeURIComponent(message);
};

export default {
    URGENCY_LEVEL,
    EMERGENCY_STATUS,
    createEmergency,
    getActiveEmergencies,
    subscribeToEmergencies,
    getMatchingDonors,
    updateEmergencyStatus,
    fulfillEmergency,
    cancelEmergency,
    incrementViewCount,
    recordDonorResponse,
    generateWhatsAppMessage
};
