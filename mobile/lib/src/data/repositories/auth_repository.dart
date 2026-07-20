import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:local_auth/local_auth.dart';
import 'package:smart_blood_life/src/core/constants/app_constants.dart';
import 'package:smart_blood_life/src/data/models/user_model.dart';
import 'package:smart_blood_life/src/core/security/secure_storage.dart';

class AuthRepository {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  final LocalAuthentication _localAuth = LocalAuthentication();

  // Stream of User Auth State
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  // Get current Firebase User
  User? get currentUser => _auth.currentUser;

  // Fetch complete custom User Profile from Firestore
  Future<UserModel?> getUserProfile(String uid) async {
    try {
      final doc = await _firestore.collection(AppConstants.collectionUsers).doc(uid).get();
      if (doc.exists) {
        return UserModel.fromFirestore(doc);
      }
      return null;
    } catch (e) {
      debugPrint('Error getting user profile: $e');
      return null;
    }
  }

  // Helper to handle FirebaseAuth errors
  String _handleAuthException(dynamic e) {
    if (e is FirebaseAuthException) {
      switch (e.code) {
        case 'user-not-found':
          return 'No account found for that email.';
        case 'wrong-password':
          return 'Incorrect password. Please try again.';
        case 'invalid-credential':
          // New Firebase SDK consolidates user-not-found + wrong-password
          return 'Invalid email or password.';
        case 'email-already-in-use':
          return 'An account already exists for that email.';
        case 'invalid-email':
          return 'The email address is not valid.';
        case 'weak-password':
          return 'Password must be at least 6 characters.';
        case 'operation-not-allowed':
          return 'This sign-in method is not enabled.';
        case 'user-disabled':
          return 'Your account has been disabled. Contact support.';
        case 'network-request-failed':
          return 'Network error. Please check your internet connection.';
        case 'too-many-requests':
          return 'Too many login attempts. Please wait a moment and try again.';
        case 'account-exists-with-different-credential':
          return 'An account already exists with a different sign-in method.';
        case 'requires-recent-login':
          return 'Please log in again to complete this action.';
        default:
          final errStr = e.toString();
          if (errStr.contains('10') || errStr.contains('sign_in_failed')) {
            return 'Google Sign-In configuration issue (ApiException 10). Please register the app SHA-1 fingerprint in Firebase Console.';
          }
          return e.message ?? 'An unknown authentication error occurred.';
      }
    }
    final errStr = e.toString();
    if (errStr.contains('10') || errStr.contains('sign_in_failed')) {
      return 'Google Sign-In configuration issue (ApiException 10). Please register the app SHA-1 fingerprint in Firebase Console.';
    }
    return e.toString();
  }

  // 1. Email & Password Login
  Future<UserCredential> signInWithEmail(String email, String password) async {
    try {
      final cred = await _auth.signInWithEmailAndPassword(email: email, password: password);
      final user = cred.user;
      if (user != null) {
        final token = await user.getIdToken();
        if (token != null) {
          await SecureStorage.saveToken(token);
        }
        final isPrimaryAdmin = user.email?.toLowerCase().trim() == 'smartbloodlife@gmail.com';
        // Update last login and elevate primary admin
        await _firestore.collection(AppConstants.collectionUsers).doc(user.uid).set({
          'lastLogin': FieldValue.serverTimestamp(),
          'updatedAt': FieldValue.serverTimestamp(),
          if (isPrimaryAdmin) 'role': 'super_admin',
        }, SetOptions(merge: true));
      }
      return cred;
    } catch (e) {
      debugPrint('Sign in error: $e');
      throw _handleAuthException(e);
    }
  }

  // 2. Email Sign Up
  Future<UserCredential> signUpWithEmail(String name, String email, String password, String phone, String bloodGroup) async {
    try {
      final cred = await _auth.createUserWithEmailAndPassword(email: email, password: password);
      final uid = cred.user!.uid;

      final newUser = UserModel(
        id: uid,
        name: name,
        email: email,
        phone: phone,
        role: 'donor',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        lastLogin: DateTime.now(),
        bloodGroup: bloodGroup,
        verified: false,
      );

      await _firestore.collection(AppConstants.collectionUsers).doc(uid).set(newUser.toMap());
      return cred;
    } catch (e) {
      debugPrint('Sign up error: $e');
      throw _handleAuthException(e);
    }
  }

  // 3. Google Sign-In
  Future<UserCredential> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) {
        throw 'Google Sign-In cancelled by user.';
      }
      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );
      final cred = await _auth.signInWithCredential(credential);
      final user = cred.user;
      if (user != null) {
        final profile = await getUserProfile(user.uid);
        if (profile == null) {
          final newUser = UserModel(
            id: user.uid,
            name: user.displayName ?? 'Google User',
            email: user.email ?? '',
            phone: user.phoneNumber ?? '',
            role: 'donor',
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
            lastLogin: DateTime.now(),
            photoUrl: user.photoURL,
            verified: false,
          );
          await _firestore.collection(AppConstants.collectionUsers).doc(user.uid).set(newUser.toMap());
        } else {
          // User exists, update last login
          await _firestore.collection(AppConstants.collectionUsers).doc(user.uid).set({
            'lastLogin': FieldValue.serverTimestamp(),
            'updatedAt': FieldValue.serverTimestamp(),
            'photoUrl': user.photoURL ?? profile.photoUrl,
          }, SetOptions(merge: true));
        }
      }
      return cred;
    } catch (e) {
      debugPrint('Google Login error: $e');
      throw _handleAuthException(e);
    }
  }

  // 4. Biometric Authenticate
  Future<bool> authenticateWithBiometrics() async {
    try {
      final bool canAuthenticateWithBiometrics = await _localAuth.canCheckBiometrics;
      final bool canAuthenticate = canAuthenticateWithBiometrics || await _localAuth.isDeviceSupported();
      if (!canAuthenticate) return false;

      return await _localAuth.authenticate(
        localizedReason: 'Authenticate to log in to SmartBloodLife securely.',
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: true,
        ),
      );
    } catch (e) {
      debugPrint('Biometric authentication error: $e');
      return false;
    }
  }

  // 5. Phone OTP Auth: Request verification code
  Future<void> verifyPhoneNumber({
    required String phoneNumber,
    required Function(PhoneAuthCredential) verificationCompleted,
    required Function(FirebaseAuthException) verificationFailed,
    required Function(String, int?) codeSent,
    required Function(String) codeAutoRetrievalTimeout,
  }) async {
    await _auth.verifyPhoneNumber(
      phoneNumber: phoneNumber,
      verificationCompleted: verificationCompleted,
      verificationFailed: verificationFailed,
      codeSent: codeSent,
      codeAutoRetrievalTimeout: codeAutoRetrievalTimeout,
      timeout: const Duration(seconds: 60),
    );
  }

  // 6. Phone OTP Auth: Sign in with credentials
  Future<UserCredential> signInWithPhoneCredential(AuthCredential credential) async {
    try {
      final cred = await _auth.signInWithCredential(credential);
      final user = cred.user;
      if (user != null) {
        final profile = await getUserProfile(user.uid);
        if (profile == null) {
          final newUser = UserModel(
            id: user.uid,
            name: 'Phone User',
            email: '',
            phone: user.phoneNumber ?? '',
            role: 'donor',
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
            lastLogin: DateTime.now(),
            verified: false,
          );
          await _firestore.collection(AppConstants.collectionUsers).doc(user.uid).set(newUser.toMap());
        } else {
          await _firestore.collection(AppConstants.collectionUsers).doc(user.uid).set({
            'lastLogin': FieldValue.serverTimestamp(),
            'updatedAt': FieldValue.serverTimestamp(),
          }, SetOptions(merge: true));
        }
      }
      return cred;
    } catch (e) {
      debugPrint('Phone Sign in error: $e');
      throw _handleAuthException(e);
    }
  }

  // 7. Send Forgot Password Reset Link
  Future<void> sendForgotPasswordReset(String email) async {
    try {
      await _auth.sendPasswordResetEmail(email: email);
    } catch (e) {
      throw _handleAuthException(e);
    }
  }

  // 8. Logout
  Future<void> signOut() async {
    await _auth.signOut();
    await _googleSignIn.signOut();
    await SecureStorage.deleteToken();
  }
}
