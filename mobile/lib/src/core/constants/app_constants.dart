class AppConstants {
  // App Name
  static const String appName = 'Life Flow';

  // Firebase Firestore Collection Names (matching firestore.rules and web architecture)
  static const String collectionUsers = 'users';
  static const String collectionDonors = 'donors';
  static const String collectionVerifications = 'verifications';
  static const String collectionEmergencies = 'emergencies'; // Blood requests
  static const String collectionSettings = 'settings';
  static const String collectionAnalytics = 'analytics';
  static const String collectionAuditLogs = 'auditLogs';

  // Local Storage Box Names (Hive)
  static const String hiveUserBox = 'user_box';
  static const String hiveOfflineCacheBox = 'offline_cache_box';

  // Shared Preferences / Secure Storage Keys
  static const String keyAuthToken = 'auth_token';
  static const String keyBiometricsEnabled = 'biometrics_enabled';
  static const String keyDarkMode = 'dark_mode';

  // Emergency urgency categories
  static const String urgencyCritical = 'critical';
  static const String urgencyUrgent = 'urgent';
  static const String urgencyStandard = 'standard';

  // Default Asset Paths
  static const String lottieBloodDrop = 'assets/lottie/blood_drop.json';
  static const String imageLogo = 'assets/images/logo.png';
  static const String imageDefaultAvatar = 'assets/images/default_avatar.png';
}
