import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:smart_blood_life/src/core/theme/app_theme.dart';

class AppBottomNavigationBar extends StatelessWidget {
  final String currentPath;

  const AppBottomNavigationBar({
    super.key,
    required this.currentPath,
  });

  Widget _buildNavItem({
    required BuildContext context,
    required IconData icon,
    required IconData activeIcon,
    required String label,
    required String path,
  }) {
    final isActive = currentPath == path;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return InkWell(
      onTap: () {
        if (!isActive) {
          HapticFeedback.lightImpact();
          context.go(path);
        }
      },
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedScale(
              scale: isActive ? 1.15 : 1.0,
              duration: const Duration(milliseconds: 200),
              child: Icon(
                isActive ? activeIcon : icon,
                color: isActive
                    ? AppTheme.bloodRed
                    : (isDark ? Colors.white60 : Colors.black45),
                size: 24,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                color: isActive
                    ? AppTheme.bloodRed
                    : (isDark ? Colors.white60 : Colors.black45),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Stack(
      alignment: Alignment.bottomCenter,
      clipBehavior: Clip.none,
      children: [
        // Navigation bar container
        Container(
          height: 80,
          margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
            color: isDark ? AppTheme.darkCard.withOpacity(0.95) : Colors.white.withOpacity(0.95),
            borderRadius: BorderRadius.circular(28),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(isDark ? 0.3 : 0.08),
                blurRadius: 24,
                offset: const Offset(0, 8),
              ),
            ],
            border: Border.all(
              color: isDark ? Colors.white.withOpacity(0.05) : Colors.grey.shade100,
              width: 1.5,
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(
                context: context,
                icon: Icons.home_outlined,
                activeIcon: Icons.home,
                label: 'Home',
                path: '/home',
              ),
              _buildNavItem(
                context: context,
                icon: Icons.search_outlined,
                activeIcon: Icons.search,
                label: 'Search',
                path: '/search',
              ),
              
              // Spacing for the floating SOS button
              const SizedBox(width: 48),
              
              _buildNavItem(
                context: context,
                icon: Icons.credit_card_outlined,
                activeIcon: Icons.credit_card,
                label: 'Donor Card',
                path: '/digital-card',
              ),
              _buildNavItem(
                context: context,
                icon: Icons.person_outline,
                activeIcon: Icons.person,
                label: 'Profile',
                path: '/profile',
              ),
            ],
          ),
        ),
        
        // Floating SOS Button in the Center
        Positioned(
          top: -24,
          child: GestureDetector(
            onTap: () => context.push('/emergency-request'),
            child: Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(
                  colors: [AppTheme.bloodRed, AppTheme.accentRed],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.bloodRed.withOpacity(0.4),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  ),
                ],
                border: Border.all(
                  color: isDark ? AppTheme.darkBg : Colors.white,
                  width: 3.5,
                ),
              ),
              child: const Icon(
                Icons.emergency,
                color: Colors.white,
                size: 28,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
