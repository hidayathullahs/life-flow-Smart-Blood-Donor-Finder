/**
 * Donor Verification Service
 * Handles donor verification status, phone OTP, and document verification
 */

import { db } from '@/lib/firebase';
import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    query,
    where,
    getDocs,
    serverTimestamp
} from 'firebase/firestore';

const VERIFICATIONS_COLLECTION = 'verifications';
const DONORS_COLLECTION = 'donors';

// Verification Levels
export const VERIFICATION_LEVEL = {
    NONE: 'none',
    PHONE: 'phone',           // Phone verified
    DOCUMENT: 'document',     // ID document uploaded
    FULL: 'full'              // Admin verified
};

// Verification Status
export const VERIFICATION_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

/**
 * Get donor verification status
 */
export const getVerificationStatus = async (donorId) => {
    try {
        const verificationRef = doc(db, VERIFICATIONS_COLLECTION, donorId);
        const verificationDoc = await getDoc(verificationRef);

        if (!verificationDoc.exists()) {
            return {
                level: VERIFICATION_LEVEL.NONE,
                phoneVerified: false,
                documentVerified: false,
                adminVerified: false,
                status: null
            };
        }

        const data = verificationDoc.data();

        // Determine verification level
        let level = VERIFICATION_LEVEL.NONE;
        if (data.adminVerified) {
            level = VERIFICATION_LEVEL.FULL;
        } else if (data.documentVerified) {
            level = VERIFICATION_LEVEL.DOCUMENT;
        } else if (data.phoneVerified) {
            level = VERIFICATION_LEVEL.PHONE;
        }

        return {
            level,
            phoneVerified: data.phoneVerified || false,
            documentVerified: data.documentVerified || false,
            adminVerified: data.adminVerified || false,
            status: data.status || null,
            verifiedAt: data.verifiedAt,
            verifiedBy: data.verifiedBy,
            phone: data.phone,
            documentUrl: data.documentUrl
        };
    } catch (error) {
        console.error('Error getting verification status:', error);
        throw error;
    }
};

/**
 * Start phone verification
 * Note: In production, integrate with SMS service (Twilio, Firebase Auth Phone)
 */
export const startPhoneVerification = async (donorId, phoneNumber) => {
    try {
        const verificationRef = doc(db, VERIFICATIONS_COLLECTION, donorId);

        // Generate 6-digit OTP (in production, use secure random)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await setDoc(verificationRef, {
            phone: phoneNumber,
            otp: otp, // In production, hash this
            otpExpiresAt: expiresAt,
            phoneVerified: false,
            updatedAt: serverTimestamp()
        }, { merge: true });

        // TODO: In production, send SMS via Twilio/Firebase
        console.log(`[DEV] OTP for ${phoneNumber}: ${otp}`);

        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        console.error('Error starting phone verification:', error);
        throw error;
    }
};

/**
 * Verify phone OTP
 */
export const verifyPhoneOTP = async (donorId, otp) => {
    try {
        const verificationRef = doc(db, VERIFICATIONS_COLLECTION, donorId);
        const verificationDoc = await getDoc(verificationRef);

        if (!verificationDoc.exists()) {
            throw new Error('Verification not started');
        }

        const data = verificationDoc.data();

        // Check expiry
        if (data.otpExpiresAt && new Date() > data.otpExpiresAt.toDate()) {
            throw new Error('OTP expired. Please request a new one.');
        }

        // Check OTP
        if (data.otp !== otp) {
            throw new Error('Invalid OTP');
        }

        // Mark phone as verified
        await updateDoc(verificationRef, {
            phoneVerified: true,
            phoneVerifiedAt: serverTimestamp(),
            otp: null, // Clear OTP
            otpExpiresAt: null,
            updatedAt: serverTimestamp()
        });

        // Update donor record
        const donorRef = doc(db, DONORS_COLLECTION, donorId);
        await updateDoc(donorRef, {
            phoneVerified: true,
            updatedAt: serverTimestamp()
        });

        return { success: true, message: 'Phone verified successfully' };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
};

/**
 * Submit document for verification
 */
export const submitDocument = async (donorId, documentUrl, documentType) => {
    try {
        const verificationRef = doc(db, VERIFICATIONS_COLLECTION, donorId);

        await setDoc(verificationRef, {
            documentUrl,
            documentType, // 'id_proof', 'donation_certificate', etc.
            documentSubmittedAt: serverTimestamp(),
            documentVerified: false,
            status: VERIFICATION_STATUS.PENDING,
            updatedAt: serverTimestamp()
        }, { merge: true });

        return { success: true, message: 'Document submitted for verification' };
    } catch (error) {
        console.error('Error submitting document:', error);
        throw error;
    }
};

/**
 * Admin: Approve or reject verification
 */
export const processVerification = async (donorId, adminId, approved, notes = '') => {
    try {
        const verificationRef = doc(db, VERIFICATIONS_COLLECTION, donorId);

        const updateData = {
            status: approved ? VERIFICATION_STATUS.APPROVED : VERIFICATION_STATUS.REJECTED,
            adminVerified: approved,
            documentVerified: approved,
            verifiedAt: serverTimestamp(),
            verifiedBy: adminId,
            adminNotes: notes,
            updatedAt: serverTimestamp()
        };

        await updateDoc(verificationRef, updateData);

        // Update donor record
        const donorRef = doc(db, DONORS_COLLECTION, donorId);
        await updateDoc(donorRef, {
            verified: approved,
            verifiedAt: approved ? serverTimestamp() : null,
            updatedAt: serverTimestamp()
        });

        return {
            success: true,
            message: approved ? 'Donor verified successfully' : 'Verification rejected'
        };
    } catch (error) {
        console.error('Error processing verification:', error);
        throw error;
    }
};

/**
 * Get all pending verifications (for admin)
 */
export const getPendingVerifications = async () => {
    try {
        const q = query(
            collection(db, VERIFICATIONS_COLLECTION),
            where('status', '==', VERIFICATION_STATUS.PENDING)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting pending verifications:', error);
        throw error;
    }
};

/**
 * Get verification badge info
 */
export const getVerificationBadgeInfo = (verificationLevel) => {
    const badges = {
        [VERIFICATION_LEVEL.FULL]: {
            label: 'Verified',
            icon: 'BadgeCheck',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
            description: 'Identity verified by admin'
        },
        [VERIFICATION_LEVEL.DOCUMENT]: {
            label: 'Pending Review',
            icon: 'FileCheck',
            color: 'text-amber-600',
            bgColor: 'bg-amber-100 dark:bg-amber-900/30',
            description: 'Documents submitted, awaiting review'
        },
        [VERIFICATION_LEVEL.PHONE]: {
            label: 'Phone Verified',
            icon: 'Phone',
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
            description: 'Phone number verified'
        },
        [VERIFICATION_LEVEL.NONE]: {
            label: 'Unverified',
            icon: 'AlertCircle',
            color: 'text-gray-400',
            bgColor: 'bg-gray-100 dark:bg-gray-800',
            description: 'Not yet verified'
        }
    };

    return badges[verificationLevel] || badges[VERIFICATION_LEVEL.NONE];
};

export default {
    VERIFICATION_LEVEL,
    VERIFICATION_STATUS,
    getVerificationStatus,
    startPhoneVerification,
    verifyPhoneOTP,
    submitDocument,
    processVerification,
    getPendingVerifications,
    getVerificationBadgeInfo
};
