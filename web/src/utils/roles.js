/**
 * Role-Based Access Control System
 * Defines user roles and permission helpers for SmartBloodLife
 */

// Role Constants
export const ROLES = {
    SUPER_ADMIN: 'super_admin',  // Full system access
    ADMIN: 'admin',              // Manage donors, verify, moderate
    VERIFIED_DONOR: 'verified_donor',  // Verified blood donor
    DONOR: 'donor',              // Registered donor (unverified)
    PUBLIC: 'public'             // Anonymous user
};

// Permission Levels (higher = more access)
const ROLE_LEVELS = {
    [ROLES.SUPER_ADMIN]: 100,
    [ROLES.ADMIN]: 80,
    [ROLES.VERIFIED_DONOR]: 40,
    [ROLES.DONOR]: 20,
    [ROLES.PUBLIC]: 0
};

/**
 * Check if user has at least a certain role level
 * @param {string} userRole - Current user's role
 * @param {string} requiredRole - Minimum required role
 * @returns {boolean}
 */
export const hasRole = (userRole, requiredRole) => {
    const userLevel = ROLE_LEVELS[userRole] || 0;
    const requiredLevel = ROLE_LEVELS[requiredRole] || 0;
    return userLevel >= requiredLevel;
};

/**
 * Permission Helpers
 */
export const permissions = {
    // Can create/edit donors
    canManageDonors: (role) => hasRole(role, ROLES.ADMIN),

    // Can delete donors
    canDeleteDonors: (role) => hasRole(role, ROLES.ADMIN),

    // Can verify donors
    canVerifyDonors: (role) => hasRole(role, ROLES.ADMIN),

    // Can access admin dashboard
    canAccessDashboard: (role) => hasRole(role, ROLES.ADMIN),

    // Can view donor contact details
    canViewContactDetails: (role) => hasRole(role, ROLES.PUBLIC), // All can view

    // Can create emergency requests
    canCreateEmergency: (role) => hasRole(role, ROLES.ADMIN),

    // Can view analytics
    canViewAnalytics: (role) => hasRole(role, ROLES.ADMIN),

    // Can edit own profile (donor editing their own)
    canEditOwnProfile: (role) => hasRole(role, ROLES.DONOR),

    // Can manage system settings
    canManageSettings: (role) => hasRole(role, ROLES.SUPER_ADMIN),
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role) => {
    const names = {
        [ROLES.SUPER_ADMIN]: 'Super Admin',
        [ROLES.ADMIN]: 'Administrator',
        [ROLES.VERIFIED_DONOR]: 'Verified Donor',
        [ROLES.DONOR]: 'Donor',
        [ROLES.PUBLIC]: 'Guest'
    };
    return names[role] || 'Unknown';
};

/**
 * Get role badge color
 */
export const getRoleBadgeColor = (role) => {
    const colors = {
        [ROLES.SUPER_ADMIN]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        [ROLES.ADMIN]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        [ROLES.VERIFIED_DONOR]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        [ROLES.DONOR]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
        [ROLES.PUBLIC]: 'bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400'
    };
    return colors[role] || colors[ROLES.PUBLIC];
};

export default {
    ROLES,
    hasRole,
    permissions,
    getRoleDisplayName,
    getRoleBadgeColor
};
