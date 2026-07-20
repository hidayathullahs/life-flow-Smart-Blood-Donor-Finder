import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:go_router/go_router.dart';
import 'package:smart_blood_life/src/core/theme/app_theme.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1600),
    );

    _scaleAnimation = Tween<double>(begin: 0.7, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: const Interval(0.3, 1.0, curve: Curves.easeIn)),
    );

    _controller.forward();
    _checkAuthState();
  }

  void _checkAuthState() async {
    await Future.delayed(const Duration(milliseconds: 1800));
    if (!mounted) return;
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (mounted) {
        context.go(user != null ? '/home' : '/login');
      }
    } catch (e) {
      if (mounted) context.go('/login');
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      backgroundColor: isDark ? AppTheme.darkBg : AppTheme.lightBg,
      body: Stack(
        children: [
          // Background subtle glowing circles
          Positioned(
            top: -100,
            left: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppTheme.bloodRed.withValues(alpha: 0.08),
              ),
            ),
          ),
          Positioned(
            bottom: -150,
            right: -50,
            child: Container(
              width: 400,
              height: 400,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppTheme.bloodRed.withValues(alpha: 0.05),
              ),
            ),
          ),
          
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Animated App Icon Container
                ScaleTransition(
                  scale: _scaleAnimation,
                  child: FadeTransition(
                    opacity: _fadeAnimation,
                    child: Container(
                      width: 140,
                      height: 140,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isDark ? AppTheme.darkCard : Colors.white,
                        borderRadius: BorderRadius.circular(32),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: isDark ? 0.4 : 0.08),
                            blurRadius: 32,
                            offset: const Offset(0, 16),
                          ),
                        ],
                        border: Border.all(
                          color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.grey.shade100,
                          width: 1.5,
                        ),
                      ),
                      child: Image.asset(
                        'assets/images/logo.png',
                        fit: BoxFit.contain,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 36),
                
                // Animated App Title Text
                FadeTransition(
                  opacity: _fadeAnimation,
                  child: Column(
                    children: [
                      Text(
                        'LIFE FLOW',
                        style: Theme.of(context).textTheme.displaySmall?.copyWith(
                          color: AppTheme.bloodRed,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 2.0,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'SMART BLOOD DONOR FINDER',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.5,
                          color: isDark ? Colors.white54 : Colors.black45,
                        ),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 64),
                
                // Sleek progress indicator
                SizedBox(
                  width: 50,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: const LinearProgressIndicator(
                      color: AppTheme.bloodRed,
                      backgroundColor: Colors.transparent,
                      minHeight: 3,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
