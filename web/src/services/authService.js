import { auth, db } from '@/lib/firebase';
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ROLES, hasRole as checkRole } from '@/utils/roles';

// User state observers
const observers = [];

const notifyObservers = (user) => {
    observers.forEach(callback => callback(user));
};

/**
 * Get user profile with role from Firestore
 */
const getUserWithRole = async (firebaseUser) => {
    if (!firebaseUser) return null;

    const isPrimaryAdmin = firebaseUser.email?.toLowerCase().trim() === 'smartbloodlife@gmail.com';

    try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const data = userDoc.data();
            const role = isPrimaryAdmin ? ROLES.SUPER_ADMIN : (data.role || ROLES.DONOR);

            if (isPrimaryAdmin && data.role !== ROLES.SUPER_ADMIN) {
                await setDoc(userDocRef, { role: ROLES.SUPER_ADMIN }, { merge: true });
            }

            return {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || 'SmartBloodLife Admin',
                emailVerified: firebaseUser.emailVerified,
                photoURL: firebaseUser.photoURL,
                ...data,
                role
            };
        }

        // User exists in Auth but not in Firestore - create profile
        const defaultProfile = {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'SmartBloodLife Admin',
            role: isPrimaryAdmin ? ROLES.SUPER_ADMIN : ROLES.DONOR,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        await setDoc(userDocRef, defaultProfile);

        return {
            uid: firebaseUser.uid,
            ...defaultProfile
        };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: isPrimaryAdmin ? ROLES.SUPER_ADMIN : ROLES.PUBLIC
        };
    }
};

/**
 * Create user profile in Firestore
 */
const createUserProfile = async (uid, data) => {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
        ...data,
        role: data.role || ROLES.DONOR,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
};

export const authService = {
    /**
     * Login with email and password
     */
    login: async (email, password) => {
        const isPrimaryAdmin = email?.toLowerCase().trim() === 'smartbloodlife@gmail.com';
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const userWithRole = await getUserWithRole(result.user);
            notifyObservers(userWithRole);
            return userWithRole;
        } catch (error) {
            console.error('Login error:', error);
            // If primary admin account does not exist in Firebase Auth yet, auto-provision it
            if (isPrimaryAdmin && (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential')) {
                try {
                    const registerResult = await createUserWithEmailAndPassword(auth, email, password);
                    await updateProfile(registerResult.user, { displayName: 'SmartBloodLife Admin' });
                    const userWithRole = await getUserWithRole(registerResult.user);
                    notifyObservers(userWithRole);
                    return userWithRole;
                } catch (regErr) {
                    console.error('Admin auto-registration error:', regErr);
                    throw error;
                }
            }
            throw error;
        }
    },

    /**
     * Register new user
     */
    register: async (email, password, displayName, additionalData = {}) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name
            if (displayName) {
                await updateProfile(result.user, { displayName });
            }

            // Create user profile in Firestore
            await createUserProfile(result.user.uid, {
                email,
                displayName: displayName || email.split('@')[0],
                role: ROLES.DONOR, // New users are donors by default
                ...additionalData
            });

            const userWithRole = await getUserWithRole(result.user);
            notifyObservers(userWithRole);
            return userWithRole;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    /**
     * Logout current user
     */
    logout: async () => {
        try {
            await signOut(auth);
            notifyObservers(null);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    /**
     * Send password reset email
     */
    resetPassword: async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.error('Password reset error:', error);
            throw error;
        }
    },

    /**
     * Subscribe to auth state changes
     */
    subscribe: (callback) => {
        observers.push(callback);

        return onAuthStateChanged(auth, async (firebaseUser) => {
            const userWithRole = await getUserWithRole(firebaseUser);
            callback(userWithRole);
        });
    },

    /**
     * Get current user
     */
    getCurrentUser: async () => {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return null;
        return getUserWithRole(firebaseUser);
    },

    /**
     * Check if current user has specific role
     */
    hasRole: async (requiredRole) => {
        const user = await authService.getCurrentUser();
        if (!user) return false;

        return checkRole(user.role, requiredRole);
    },

    /**
     * Check if current user is admin
     */
    isAdmin: async () => {
        const user = await authService.getCurrentUser();
        return user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN;
    },

    /**
     * Update user role (admin only)
     */
    updateUserRole: async (uid, newRole) => {
        const currentUser = await authService.getCurrentUser();
        if (currentUser?.role !== ROLES.SUPER_ADMIN && currentUser?.role !== ROLES.ADMIN) {
            throw new Error('Unauthorized: Only admins can update roles');
        }

        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, {
            role: newRole,
            updatedAt: serverTimestamp()
        }, { merge: true });
    }
};

export default authService;
