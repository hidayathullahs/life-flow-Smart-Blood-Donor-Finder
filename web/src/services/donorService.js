import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, getDocs, where, setDoc, getDoc } from 'firebase/firestore';

const COLLECTION_NAME = 'donors';

export const donorService = {
    // 1. Fetch All Active Donors (For Search Page)
    getAllActiveDonors: async () => {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where("isAvailable", "==", true)
            );
            const querySnapshot = await getDocs(q);
            // Sort in memory to avoid index requirement
            return querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => (b.registeredAt?.toMillis?.() || 0) - (a.registeredAt?.toMillis?.() || 0));
        } catch (error) {
            console.error("Error getting active donors:", error);
            throw error;
        }
    },

    // 2. Real-time Subscription (For Admin Dashboard)
    subscribeToAllDonors: (callback, onError) => {
        const q = query(collection(db, COLLECTION_NAME), orderBy("registeredAt", "desc"));
        return onSnapshot(q,
            (snapshot) => {
                const donors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(donors);
            },
            (error) => {
                console.error("Error subscribing to donors:", error);
                if (onError) onError(error);
            }
        );
    },

    // 3. Create Donor
    createDonor: async (data) => {
        try {
            const newDonor = {
                ...data,
                registeredAt: serverTimestamp(),
                isAvailable: true,
                donationCount: 0,
            };
            const docRef = await addDoc(collection(db, COLLECTION_NAME), newDonor);
            return docRef.id;
        } catch (error) {
            console.error("Error adding donor:", error);
            throw error;
        }
    },

    // 4. Update Donor
    updateDonor: async (id, data) => {
        try {
            const donorRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(donorRef, data);
        } catch (error) {
            console.error("Error updating donor:", error);
            throw error;
        }
    },

    // 5. Delete Donor
    deleteDonor: async (id) => {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
        } catch (error) {
            console.error("Error deleting donor:", error);
            throw error;
        }
    },

    // 6. Toggle Active Status
    toggleStatus: async (id, currentStatus) => {
        try {
            const donorRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(donorRef, { isAvailable: !currentStatus });
        } catch (error) {
            console.error("Error toggling status:", error);
            throw error;
        }
    },

    // 7. Get Platform Stats (For Home Page)
    getStats: async () => {
        try {
            const snapshot = await getDocs(collection(db, COLLECTION_NAME));
            const donors = snapshot.docs.map(doc => doc.data());

            const totalDonors = donors.length;
            const activeDonors = donors.filter(d => d.isAvailable).length;
            const totalDonations = donors.reduce((acc, d) => acc + (Number(d.donationCount) || 0), 0);
            const uniqueCities = new Set(donors.map(d => d.city?.trim().toLowerCase()).filter(Boolean)).size;

            return {
                totalDonors,
                activeDonors,
                totalDonations,
                uniqueCities
            };
        } catch (error) {
            console.error("Error fetching stats:", error);
            return { totalDonors: 0, activeDonors: 0, totalDonations: 0, uniqueCities: 0 };
        }
    },

    // 8. Update System Settings (Emergency, etc.)
    updateSettings: async (id, data) => {
        try {
            const docRef = doc(db, 'settings', id);
            await setDoc(docRef, data, { merge: true });
        } catch (error) {
            console.error("Error updating settings:", error);
            throw error;
        }
    },

    // 9. Get System Settings
    getSettings: async (id) => {
        try {
            const docRef = doc(db, 'settings', id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data() : null;
        } catch (error) {
            console.error("Error fetching settings:", error);
            return null;
        }
    }
};
