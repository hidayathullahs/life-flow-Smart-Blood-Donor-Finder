/**
 * Analytics Service
 * Provides aggregated statistics for the admin dashboard
 */

import { db } from '@/lib/firebase';
import {
    collection,
    query,
    where,
    getDocs,
    getCountFromServer,
    orderBy,
    limit
} from 'firebase/firestore';
import { getDonorStatus, DONOR_STATUS } from '@/utils/donorStatus';

const DONORS_COLLECTION = 'donors';
const EMERGENCIES_COLLECTION = 'emergencies';
const VERIFICATIONS_COLLECTION = 'verifications';

/**
 * Get overall dashboard statistics
 */
export const getDashboardStats = async () => {
    try {
        // Total donors
        const totalDonorsQuery = query(collection(db, DONORS_COLLECTION));
        const totalDonorsSnapshot = await getCountFromServer(totalDonorsQuery);
        const totalDonors = totalDonorsSnapshot.data().count;

        // Active donors
        const activeDonorsQuery = query(
            collection(db, DONORS_COLLECTION),
            where('active', '==', true)
        );
        const activeDonorsSnapshot = await getCountFromServer(activeDonorsQuery);
        const activeDonors = activeDonorsSnapshot.data().count;

        // Verified donors
        const verifiedDonorsQuery = query(
            collection(db, DONORS_COLLECTION),
            where('verified', '==', true)
        );
        const verifiedDonorsSnapshot = await getCountFromServer(verifiedDonorsQuery);
        const verifiedDonors = verifiedDonorsSnapshot.data().count;

        // Active emergencies
        const activeEmergenciesQuery = query(
            collection(db, EMERGENCIES_COLLECTION),
            where('active', '==', true)
        );
        const activeEmergenciesSnapshot = await getCountFromServer(activeEmergenciesQuery);
        const activeEmergencies = activeEmergenciesSnapshot.data().count;

        // Pending verifications
        const pendingVerificationsQuery = query(
            collection(db, VERIFICATIONS_COLLECTION),
            where('status', '==', 'pending')
        );
        const pendingVerificationsSnapshot = await getCountFromServer(pendingVerificationsQuery);
        const pendingVerifications = pendingVerificationsSnapshot.data().count;

        return {
            totalDonors,
            activeDonors,
            verifiedDonors,
            inactiveDonors: totalDonors - activeDonors,
            activeEmergencies,
            pendingVerifications,
            verificationRate: totalDonors > 0 ? Math.round((verifiedDonors / totalDonors) * 100) : 0
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
};

/**
 * Get blood group distribution
 */
export const getBloodGroupDistribution = async () => {
    try {
        const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        const distribution = {};

        for (const bloodGroup of bloodGroups) {
            const q = query(
                collection(db, DONORS_COLLECTION),
                where('bloodGroup', '==', bloodGroup),
                where('active', '==', true)
            );
            const snapshot = await getCountFromServer(q);
            distribution[bloodGroup] = snapshot.data().count;
        }

        // Calculate totals and percentages
        const total = Object.values(distribution).reduce((a, b) => a + b, 0);
        const withPercentages = Object.entries(distribution).map(([group, count]) => ({
            bloodGroup: group,
            count,
            percentage: total > 0 ? Math.round((count / total) * 100) : 0
        }));

        return withPercentages.sort((a, b) => b.count - a.count);
    } catch (error) {
        console.error('Error fetching blood group distribution:', error);
        throw error;
    }
};

/**
 * Get city distribution
 */
export const getCityDistribution = async () => {
    try {
        const q = query(
            collection(db, DONORS_COLLECTION),
            where('active', '==', true)
        );
        const snapshot = await getDocs(q);

        const cityCount = {};
        snapshot.docs.forEach(doc => {
            const city = doc.data().city || 'Unknown';
            cityCount[city] = (cityCount[city] || 0) + 1;
        });

        // Convert to array and sort
        const cityArray = Object.entries(cityCount)
            .map(([city, count]) => ({ city, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 20); // Top 20 cities

        return cityArray;
    } catch (error) {
        console.error('Error fetching city distribution:', error);
        throw error;
    }
};

/**
 * Get eligibility breakdown
 */
export const getEligibilityBreakdown = async () => {
    try {
        const q = query(
            collection(db, DONORS_COLLECTION),
            where('active', '==', true)
        );
        const snapshot = await getDocs(q);

        const breakdown = {
            [DONOR_STATUS.ELIGIBLE]: 0,
            [DONOR_STATUS.COOLING]: 0,
            [DONOR_STATUS.FIRST_TIME]: 0,
            [DONOR_STATUS.INACTIVE]: 0
        };

        snapshot.docs.forEach(doc => {
            const donor = { id: doc.id, ...doc.data() };
            const status = getDonorStatus(donor);
            if (breakdown[status.status] !== undefined) {
                breakdown[status.status]++;
            }
        });

        const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

        return {
            eligible: breakdown[DONOR_STATUS.ELIGIBLE],
            cooling: breakdown[DONOR_STATUS.COOLING],
            firstTime: breakdown[DONOR_STATUS.FIRST_TIME],
            inactive: breakdown[DONOR_STATUS.INACTIVE],
            total,
            eligiblePercentage: total > 0 ? Math.round((breakdown[DONOR_STATUS.ELIGIBLE] / total) * 100) : 0
        };
    } catch (error) {
        console.error('Error fetching eligibility breakdown:', error);
        throw error;
    }
};

/**
 * Get recent activity (latest donors, emergencies)
 */
export const getRecentActivity = async () => {
    try {
        // Recent donors
        const recentDonorsQuery = query(
            collection(db, DONORS_COLLECTION),
            orderBy('createdAt', 'desc'),
            limit(5)
        );
        const recentDonorsSnapshot = await getDocs(recentDonorsQuery);
        const recentDonors = recentDonorsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            type: 'donor'
        }));

        // Recent emergencies
        const recentEmergenciesQuery = query(
            collection(db, EMERGENCIES_COLLECTION),
            orderBy('createdAt', 'desc'),
            limit(5)
        );
        const recentEmergenciesSnapshot = await getDocs(recentEmergenciesQuery);
        const recentEmergencies = recentEmergenciesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            type: 'emergency'
        }));

        // Combine and sort by date
        const allActivity = [...recentDonors, ...recentEmergencies]
            .sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || new Date(0);
                const dateB = b.createdAt?.toDate?.() || new Date(0);
                return dateB - dateA;
            })
            .slice(0, 10);

        return allActivity;
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        throw error;
    }
};

/**
 * Get emergency response metrics
 */
export const getEmergencyMetrics = async () => {
    try {
        // All emergencies
        const allEmergenciesQuery = query(collection(db, EMERGENCIES_COLLECTION));
        const allEmergenciesSnapshot = await getDocs(allEmergenciesQuery);

        let totalEmergencies = 0;
        let fulfilledEmergencies = 0;
        let totalResponses = 0;
        let totalViews = 0;

        allEmergenciesSnapshot.docs.forEach(doc => {
            const data = doc.data();
            totalEmergencies++;
            if (data.status === 'fulfilled') fulfilledEmergencies++;
            totalResponses += data.responseCount || 0;
            totalViews += data.viewCount || 0;
        });

        return {
            total: totalEmergencies,
            fulfilled: fulfilledEmergencies,
            fulfillmentRate: totalEmergencies > 0 ? Math.round((fulfilledEmergencies / totalEmergencies) * 100) : 0,
            avgResponsesPerEmergency: totalEmergencies > 0 ? Math.round(totalResponses / totalEmergencies) : 0,
            avgViewsPerEmergency: totalEmergencies > 0 ? Math.round(totalViews / totalEmergencies) : 0
        };
    } catch (error) {
        console.error('Error fetching emergency metrics:', error);
        throw error;
    }
};

export default {
    getDashboardStats,
    getBloodGroupDistribution,
    getCityDistribution,
    getEligibilityBreakdown,
    getRecentActivity,
    getEmergencyMetrics
};
