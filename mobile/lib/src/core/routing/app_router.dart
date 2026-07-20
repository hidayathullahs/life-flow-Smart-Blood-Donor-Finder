import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:smart_blood_life/src/core/theme/app_theme.dart';
import 'package:smart_blood_life/src/presentation/screens/splash/splash_screen.dart';
import 'package:smart_blood_life/src/presentation/screens/auth/login_screen.dart';
import 'package:smart_blood_life/src/presentation/screens/auth/forgot_password_screen.dart';
import 'package:smart_blood_life/src/presentation/screens/home/home_screen.dart';
import 'package:smart_blood_life/src/presentation/screens/search/donor_search_screen.dart';
import 'package:smart_blood_life/src/presentation/screens/profile/donor_profile_screen.dart';
import 'package:smart_blood_life/src/presentation/screens/profile/user_profile_screen.dart';
import 'package:smart_blood_life/src/presentation/screens/emergency/create_emergency_request_screen.dart';
import 'package:smart_blood_life/src/presentation/screens/emergency/live_requests_screen.dart';
import 'package:smart_blood_life/src/presentation/screens/card/digital_blood_card_screen.dart';
import 'package:smart_blood_life/src/presentation/screens/qr_scanner/qr_scanner_screen.dart';
import 'package:smart_blood_life/src/presentation/screens/donation/donation_history_screen.dart';
import 'package:smart_blood_life/src/presentation/screens/admin/admin_dashboard_screen.dart';
import 'package:smart_blood_life/src/presentation/screens/admin/hospital_panel_screen.dart';
import 'package:smart_blood_life/src/presentation/screens/admin/blood_bank_panel_screen.dart';
import 'package:smart_blood_life/src/presentation/screens/assistant/ai_assistant_screen.dart';
import 'package:smart_blood_life/src/presentation/screens/auth/register_donor_screen.dart';

/// Routes that do NOT require authentication
const _publicRoutes = {'/', '/login', '/forgot-password', '/register'};

class AppRouter {
  static final GoRouter router = GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final isAuthenticated = FirebaseAuth.instance.currentUser != null;
      final isPublic = _publicRoutes.contains(state.matchedLocation);

      // Unauthenticated user trying to access a protected route
      if (!isAuthenticated && !isPublic) {
        return '/login';
      }
      // Authenticated user trying to access login/register — send to home
      if (isAuthenticated && (state.matchedLocation == '/login' || state.matchedLocation == '/register')) {
        return '/home';
      }
      return null; // No redirect needed
    },
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/forgot-password',
        builder: (context, state) => const ForgotPasswordScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterDonorScreen(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/search',
        builder: (context, state) => const DonorSearchScreen(),
      ),
      GoRoute(
        path: '/donor/:id',
        builder: (context, state) {
          final donorId = state.pathParameters['id'] ?? '';
          return DonorProfileScreen(donorId: donorId);
        },
      ),
      GoRoute(
        path: '/emergency-request',
        builder: (context, state) => const CreateEmergencyRequestScreen(),
      ),
      GoRoute(
        path: '/live-requests',
        builder: (context, state) => const LiveRequestsScreen(),
      ),
      GoRoute(
        path: '/digital-card',
        builder: (context, state) => const DigitalBloodCardScreen(),
      ),
      GoRoute(
        path: '/qr-scanner',
        builder: (context, state) => const QrScannerScreen(),
      ),
      GoRoute(
        path: '/history',
        builder: (context, state) => const DonationHistoryScreen(),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const UserProfileScreen(),
      ),
      GoRoute(
        path: '/admin',
        builder: (context, state) => const AdminDashboardScreen(),
      ),
      GoRoute(
        path: '/hospital',
        builder: (context, state) => const HospitalPanelScreen(),
      ),
      GoRoute(
        path: '/blood-bank',
        builder: (context, state) => const BloodBankPanelScreen(),
      ),
      GoRoute(
        path: '/ai-assistant',
        builder: (context, state) => const AiAssistantScreen(),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(32.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppTheme.bloodRed.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.error_outline_rounded,
                    color: AppTheme.bloodRed,
                    size: 48,
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'Page Not Found',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),
                Text(
                  'The page you are looking for does not exist or has been moved.',
                  style: TextStyle(
                    color: Colors.grey.shade600,
                    fontSize: 15,
                    height: 1.5,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () => context.go('/home'),
                    icon: const Icon(Icons.home_outlined),
                    label: const Text('Go to Home'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
}

