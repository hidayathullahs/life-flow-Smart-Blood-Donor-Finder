import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:smart_blood_life/src/core/theme/app_theme.dart';
import 'package:smart_blood_life/src/data/repositories/auth_repository.dart';
import 'package:smart_blood_life/src/presentation/providers/theme_provider.dart';
import 'package:smart_blood_life/src/presentation/widgets/bottom_nav_bar.dart';
import 'package:smart_blood_life/src/presentation/widgets/custom_components.dart';

class UserProfileScreen extends ConsumerStatefulWidget {
  const UserProfileScreen({super.key});

  @override
  ConsumerState<UserProfileScreen> createState() => _UserProfileScreenState();
}

class _UserProfileScreenState extends ConsumerState<UserProfileScreen> {
  final _authRepo = AuthRepository();
  final _user = FirebaseAuth.instance.currentUser;

  void _handleLogout() async {
    await _authRepo.signOut();
    if (mounted) {
      context.go('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = ref.watch(darkModeProvider);
    final displayName = _user?.displayName ?? 'Blood Donor';
    final email = _user?.email ?? 'donor@smartbloodlife.com';

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Profile'),
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(24.0, 16.0, 24.0, 110.0), // bottom nav padding
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 20),
                
                // Profile Avatar & Name Header
                Container(
                  padding: const EdgeInsets.all(28.0),
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: isDarkMode ? AppTheme.darkCard : Colors.white,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(
                      color: isDarkMode ? Colors.white.withOpacity(0.05) : Colors.grey.shade100,
                      width: 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(isDarkMode ? 0.2 : 0.03),
                        blurRadius: 12,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      CircleAvatar(
                        radius: 46,
                        backgroundColor: AppTheme.bloodRed.withOpacity(0.1),
                        child: const CircleAvatar(
                          radius: 40,
                          backgroundColor: AppTheme.bloodRed,
                          child: Icon(Icons.person, color: Colors.white, size: 40),
                        ),
                      ),
                      const SizedBox(height: 18),
                      Text(
                        displayName,
                        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        email,
                        style: TextStyle(
                          fontSize: 14, 
                          color: isDarkMode ? Colors.white54 : Colors.grey.shade600,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 20),
                      
                      // Mini stats banner
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildMiniStat('Donations', '3', Icons.favorite_outline),
                          Container(width: 1.5, height: 30, color: isDarkMode ? Colors.white10 : Colors.grey.shade200),
                          _buildMiniStat('Streak', '120d', Icons.flash_on_outlined),
                          Container(width: 1.5, height: 30, color: isDarkMode ? Colors.white10 : Colors.grey.shade200),
                          _buildMiniStat('Status', 'Active', Icons.check_circle_outline),
                        ],
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 24),
                
                // Settings List Card
                Container(
                  decoration: BoxDecoration(
                    color: isDarkMode ? AppTheme.darkCard : Colors.white,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(
                      color: isDarkMode ? Colors.white.withOpacity(0.05) : Colors.grey.shade100,
                      width: 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(isDarkMode ? 0.2 : 0.03),
                        blurRadius: 12,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      SwitchListTile(
                        title: const Text('Dark Mode', style: TextStyle(fontWeight: FontWeight.bold)),
                        secondary: const Icon(Icons.dark_mode_outlined, color: AppTheme.bloodRed),
                        value: isDarkMode,
                        activeColor: AppTheme.bloodRed,
                        onChanged: (_) => ref.read(darkModeProvider.notifier).toggleTheme(),
                      ),
                      Divider(height: 1, color: isDarkMode ? Colors.white10 : Colors.grey.shade100),
                      ListTile(
                        leading: const Icon(Icons.history, color: AppTheme.bloodRed),
                        title: const Text('Donation History', style: TextStyle(fontWeight: FontWeight.bold)),
                        trailing: Icon(Icons.arrow_forward_ios, size: 14, color: isDarkMode ? Colors.white24 : Colors.grey.shade400),
                        onTap: () => context.push('/history'),
                      ),
                      Divider(height: 1, color: isDarkMode ? Colors.white10 : Colors.grey.shade100),
                      ListTile(
                        leading: const Icon(Icons.badge_outlined, color: AppTheme.bloodRed),
                        title: const Text('Digital Blood Card', style: TextStyle(fontWeight: FontWeight.bold)),
                        trailing: Icon(Icons.arrow_forward_ios, size: 14, color: isDarkMode ? Colors.white24 : Colors.grey.shade400),
                        onTap: () => context.push('/digital-card'),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 32),
                
                PrimaryButton(
                  label: 'Sign Out',
                  icon: Icons.logout_outlined,
                  onPressed: _handleLogout,
                ),
              ],
            ),
          ),
          
          // Bottom Navigation Bar
          const Align(
            alignment: Alignment.bottomCenter,
            child: AppBottomNavigationBar(currentPath: '/profile'),
          ),
        ],
      ),
    );
  }

  Widget _buildMiniStat(String label, String value, IconData icon) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Column(
      children: [
        Row(
          children: [
            Icon(icon, size: 14, color: AppTheme.bloodRed),
            const SizedBox(width: 4),
            Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 11, 
            color: isDark ? Colors.white38 : Colors.grey.shade500,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}
