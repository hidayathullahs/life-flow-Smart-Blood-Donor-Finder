import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { ROLES, hasRole, permissions } from '@/utils/roles';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = authService.subscribe((user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Login
    const login = async (email, password) => {
        setError(null);
        try {
            const user = await authService.login(email, password);
            return user;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Register
    const register = async (email, password, displayName, additionalData) => {
        setError(null);
        try {
            const user = await authService.register(email, password, displayName, additionalData);
            return user;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Logout
    const logout = async () => {
        setError(null);
        try {
            await authService.logout();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Reset password
    const resetPassword = async (email) => {
        setError(null);
        try {
            await authService.resetPassword(email);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Permission checks
    const userRole = currentUser?.role || ROLES.PUBLIC;

    const canManageDonors = permissions.canManageDonors(userRole);
    const canDeleteDonors = permissions.canDeleteDonors(userRole);
    const canVerifyDonors = permissions.canVerifyDonors(userRole);
    const canAccessDashboard = permissions.canAccessDashboard(userRole);
    const canCreateEmergency = permissions.canCreateEmergency(userRole);
    const canViewAnalytics = permissions.canViewAnalytics(userRole);
    const canManageSettings = permissions.canManageSettings(userRole);

    const isAdmin = userRole === ROLES.ADMIN || userRole === ROLES.SUPER_ADMIN;
    const isSuperAdmin = userRole === ROLES.SUPER_ADMIN;
    const isVerifiedDonor = userRole === ROLES.VERIFIED_DONOR;
    const isAuthenticated = !!currentUser;

    const value = {
        // User state
        currentUser,
        loading,
        error,

        // Auth actions
        login,
        register,
        logout,
        resetPassword,

        // Role info
        userRole,
        isAdmin,
        isSuperAdmin,
        isVerifiedDonor,
        isAuthenticated,

        // Permission checks
        canManageDonors,
        canDeleteDonors,
        canVerifyDonors,
        canAccessDashboard,
        canCreateEmergency,
        canViewAnalytics,
        canManageSettings,

        // Generic role check
        hasRole: (requiredRole) => hasRole(userRole, requiredRole)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
