import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:smart_blood_life/src/core/theme/app_theme.dart';
import 'package:smart_blood_life/src/data/models/emergency_model.dart';
import 'package:smart_blood_life/src/data/models/donor_model.dart';
import 'package:smart_blood_life/src/data/repositories/donor_repository.dart';
import 'package:smart_blood_life/src/data/repositories/emergency_repository.dart';
import 'package:smart_blood_life/src/data/repositories/auth_repository.dart';
import 'package:smart_blood_life/src/presentation/providers/theme_provider.dart';
import 'package:smart_blood_life/src/presentation/widgets/bottom_nav_bar.dart';
import 'package:smart_blood_life/src/presentation/widgets/custom_components.dart';


class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final _donorRepo = DonorRepository();
  final _emergencyRepo = EmergencyRepository();
  final _authRepo = AuthRepository();
  
  Map<String, dynamic> _stats = {
    'totalDonors': 0,
    'activeDonors': 0,
    'totalDonations': 0,
    'uniqueCities': 0,
  };


  @override
  void initState() {
    super.initState();
    _fetchStats();
  }

  void _fetchStats() async {
    final stats = await _donorRepo.getStats();
    setState(() => _stats = stats);
  }

  void _handleLogout() async {
    await _authRepo.signOut();
    if (mounted) {
      context.go('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = ref.watch(darkModeProvider);
    final user = _authRepo.currentUser;
    final displayName = user?.displayName ?? 'Blood Donor';

    return Scaffold(
      body: Stack(
        children: [
          // Background glowing decorations
          Positioned(
            top: -120,
            left: -80,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppTheme.bloodRed.withOpacity(isDarkMode ? 0.05 : 0.03),
              ),
            ),
          ),
          
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 110), // Padding for custom bottom nav
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Smart Match Status Pills (top of screen, mirrors website's banner badges)
                  const Row(
                    children: [
                      SmartMatchPill(),
                      SizedBox(width: 8),
                      SmartMatchPill(
                        label: 'Live Stats',
                        icon: Icons.bar_chart,
                        color: AppTheme.bloodRed,
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  
                  // Personal Greeting Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Welcome back,',
                            style: TextStyle(
                              color: isDarkMode ? Colors.white60 : Colors.black54,
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            displayName,
                            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                              fontWeight: FontWeight.w900,
                              color: isDarkMode ? Colors.white : const Color(0xFF0F172A),
                              letterSpacing: -0.5,
                            ),
                          ),
                        ],
                      ),
                      
                      // App Bar Actions Row
                      Row(
                        children: [
                          IconButton(
                            icon: Icon(
                              isDarkMode ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
                              color: isDarkMode ? Colors.white70 : const Color(0xFF0F172A),
                            ),
                            style: IconButton.styleFrom(
                              backgroundColor: isDarkMode ? const Color(0xFF1E293B) : Colors.white,
                              padding: const EdgeInsets.all(10),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                                side: BorderSide(
                                  color: isDarkMode ? Colors.white10 : Colors.grey.shade100,
                                ),
                              ),
                            ),
                            onPressed: () => ref.read(darkModeProvider.notifier).toggleTheme(),
                          ),
                          const SizedBox(width: 8),
                          IconButton(
                            icon: Icon(
                              Icons.logout_outlined,
                              color: isDarkMode ? Colors.white70 : const Color(0xFF0F172A),
                            ),
                            style: IconButton.styleFrom(
                              backgroundColor: isDarkMode ? const Color(0xFF1E293B) : Colors.white,
                              padding: const EdgeInsets.all(10),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                                side: BorderSide(
                                  color: isDarkMode ? Colors.white10 : Colors.grey.shade100,
                                ),
                              ),
                            ),
                            onPressed: _handleLogout,
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  
                  // Emotional Hero Card with Lives Saved animated stats
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(28.0),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: isDarkMode 
                          ? [const Color(0xFF3B0712), const Color(0xFF0F172A)] 
                          : [const Color(0xFFFFF1F2), Colors.white],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(32),
                      border: Border.all(
                        color: AppTheme.bloodRed.withOpacity(isDarkMode ? 0.2 : 0.15),
                        width: 1.5,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.bloodRed.withOpacity(0.03),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppTheme.bloodRed.withOpacity(0.1),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(
                                Icons.favorite,
                                color: AppTheme.bloodRed,
                                size: 28,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'LIVES SAVED TOGETHER',
                                    style: TextStyle(
                                      color: AppTheme.bloodRed,
                                      fontWeight: FontWeight.w900,
                                      fontSize: 11,
                                      letterSpacing: 1.5,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  AnimatedCountUp(
                                    targetValue: _stats['totalDonations'] ?? 1420,
                                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                                      fontWeight: FontWeight.w900,
                                      letterSpacing: -1,
                                      color: isDarkMode ? Colors.white : const Color(0xFF0F172A),
                                    ),
                                    suffix: ' Lives Saved',
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                        Text(
                          'Your presence in our verified donor network ensures immediate medical safety. Broadcast emergency request or check nearby donors instantly.',
                          style: TextStyle(
                            color: isDarkMode ? Colors.white70 : Colors.black87,
                            fontSize: 14,
                            height: 1.4,
                          ),
                        ),
                        const SizedBox(height: 24),
                        PrimaryButton(
                          label: 'SOS - Request Blood Now',
                          icon: Icons.emergency_share,
                          onPressed: () => context.push('/emergency-request'),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 28),
                  
                  // ── 4-Stat Grid (matches website StatsSection) ──────────
                  Text(
                    'Network Directory',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Live platform statistics across India',
                    style: TextStyle(
                      fontSize: 13,
                      color: isDarkMode ? Colors.white54 : Colors.black45,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisSpacing: 14,
                    mainAxisSpacing: 14,
                    childAspectRatio: 1.3,
                    children: [
                      StatCardWidget(
                        label: 'Registered Donors',
                        value: _stats['totalDonors'] ?? 0,
                        icon: Icons.people_outline,
                        gradient: const [Color(0xFFE53935), Color(0xFFEF5350)],
                      ),
                      StatCardWidget(
                        label: 'Lives Saved',
                        value: (_stats['totalDonations'] ?? 0) * 3,
                        icon: Icons.favorite_outline,
                        gradient: const [Color(0xFFEC4899), Color(0xFFE53935)],
                      ),
                      StatCardWidget(
                        label: 'Cities Covered',
                        value: _stats['uniqueCities'] ?? 0,
                        icon: Icons.location_city_outlined,
                        gradient: const [Color(0xFFF97316), Color(0xFFE53935)],
                        suffix: '+',
                      ),
                      StatCardWidget(
                        label: 'Available Today',
                        value: _stats['activeDonors'] ?? 0,
                        icon: Icons.check_circle_outline,
                        gradient: const [Color(0xFF10B981), Color(0xFF059669)],
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 28),
                  
                  // Feature navigation shortcuts
                  Text(
                    'Quick Actions',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildNavBtn(context, 'Find Donors', Icons.search_outlined, '/search'),
                      const SizedBox(width: 12),
                      _buildNavBtn(context, 'Live Map', Icons.map_outlined, '/live-requests'),
                      const SizedBox(width: 12),
                      _buildNavBtn(context, 'Donor Card', Icons.badge_outlined, '/digital-card'),
                      const SizedBox(width: 12),
                      _buildNavBtn(context, 'AI assistant', Icons.android, '/ai-assistant'),
                    ],
                  ),
                  
                  const SizedBox(height: 28),

                  // Nearby Verified Donors List Section
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Nearby Verified Donors',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          letterSpacing: -0.5,
                        ),
                      ),
                      TextButton(
                        onPressed: () => context.push('/search'),
                        child: const Text('View All', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  StreamBuilder<List<DonorModel>>(
                    stream: _donorRepo.streamActiveDonors(),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const ShimmerLoading(width: double.infinity, height: 120);
                      }
                      if (!snapshot.hasData || snapshot.data!.isEmpty) {
                        return const Padding(
                          padding: EdgeInsets.symmetric(vertical: 16.0),
                          child: Center(
                            child: Text('No active verified donors nearby.', style: TextStyle(color: Colors.grey)),
                          ),
                        );
                      }
                      final list = snapshot.data!;
                      return Column(
                        children: list.take(3).map((donor) {
                          return DonorCardWidget(
                            name: donor.name,
                            bloodGroup: donor.bloodGroup,
                            city: donor.city,
                            verified: donor.verified,
                            age: donor.age,
                            gender: donor.gender,
                            isEligible: donor.isEligibleToDonate,
                            onCall: () async {
                              final uri = Uri(scheme: 'tel', path: donor.phone);
                              if (await canLaunchUrl(uri)) launchUrl(uri);
                            },
                            onWhatsApp: () async {
                              final phone = (donor.whatsapp ?? donor.phone).replaceAll(RegExp(r'[^0-9]'), '');
                              final uri = Uri.parse('https://wa.me/$phone');
                              if (await canLaunchUrl(uri)) launchUrl(uri, mode: LaunchMode.externalApplication);
                            },
                            onTap: () => context.push('/donor/${donor.id}'),
                          );
                        }).toList(),
                      );
                    },
                  ),
                  
                  const SizedBox(height: 28),

                  // Nearby Hospitals & Blood Banks Section
                  Text(
                    'Nearby Medical Centers',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  SizedBox(
                    height: 130,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      children: [
                        _buildHospitalCard(context, 'Apollo Blood Center', '1.2 km away', 'Verified Provider'),
                        _buildHospitalCard(context, 'Fortis General Hospital', '2.5 km away', 'Emergency Care'),
                        _buildHospitalCard(context, 'Red Cross Blood Bank', '3.8 km away', 'Verified Provider'),
                      ],
                    ),
                  ),

                  const SizedBox(height: 28),
                  
                  // Active Emergency Requests Section
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Active Emergency SOS',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          letterSpacing: -0.5,
                        ),
                      ),
                      TextButton(
                        onPressed: () => context.push('/live-requests'),
                        child: const Text('View Map', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Live Feed Stream Redesign
                  StreamBuilder<List<EmergencyModel>>(
                    stream: _emergencyRepo.streamActiveEmergencies(),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const ShimmerLoading(width: double.infinity, height: 100);
                      }
                      if (!snapshot.hasData || snapshot.data!.isEmpty) {
                        return Padding(
                          padding: const EdgeInsets.symmetric(vertical: 24.0),
                          child: Center(
                            child: Text(
                              'No active emergency requests right now.',
                              style: TextStyle(color: isDarkMode ? Colors.white38 : Colors.grey),
                            ),
                          ),
                        );
                      }
                      final list = snapshot.data!;
                      return ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: list.length > 3 ? 3 : list.length,
                        separatorBuilder: (c, i) => const SizedBox(height: 14),
                        itemBuilder: (context, index) {
                          final req = list[index];
                          final isHighUrgency = req.urgency.toLowerCase() == 'high' || req.urgency.toLowerCase() == 'critical';
                          
                          return Container(
                            decoration: BoxDecoration(
                              color: isDarkMode ? AppTheme.darkCard : Colors.white,
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(
                                color: isDarkMode ? Colors.white.withOpacity(0.05) : Colors.grey.shade100,
                                width: 1.5,
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(isDarkMode ? 0.2 : 0.02),
                                  blurRadius: 12,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: ListTile(
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              leading: BloodGroupBadge(bloodGroup: req.bloodGroup, size: 48),
                              title: Text(
                                '${req.unitsNeeded} Units Needed',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                              subtitle: Padding(
                                padding: const EdgeInsets.only(top: 4.0),
                                child: Text(
                                  '${req.hospital}, ${req.city}',
                                  style: TextStyle(
                                    color: isDarkMode ? Colors.white60 : Colors.black54,
                                    fontSize: 13,
                                  ),
                                ),
                              ),
                              trailing: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                decoration: BoxDecoration(
                                  color: isHighUrgency 
                                    ? AppTheme.bloodRed.withOpacity(0.1) 
                                    : AppTheme.warningOrange.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  req.urgency.toUpperCase(),
                                  style: TextStyle(
                                    color: isHighUrgency 
                                      ? AppTheme.bloodRed 
                                      : AppTheme.warningOrange,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 11,
                                  ),
                                ),
                              ),
                              onTap: () => context.push('/live-requests'),
                            ),
                          );
                        },
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
          
          // Custom Bottom Navigation Bar
          const Align(
            alignment: Alignment.bottomCenter,
            child: AppBottomNavigationBar(currentPath: '/home'),
          ),
        ],
      ),
    );
  }



  Widget _buildNavBtn(BuildContext context, String label, IconData icon, String route) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Expanded(
      child: GestureDetector(
        onTap: () => context.push(route),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16.0),
          decoration: BoxDecoration(
            color: isDark ? AppTheme.darkCard : Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: isDark ? Colors.white.withOpacity(0.05) : Colors.grey.shade100,
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(isDark ? 0.2 : 0.02),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            children: [
              Icon(icon, color: AppTheme.bloodRed, size: 26),
              const SizedBox(height: 6),
              Text(
                label,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHospitalCard(BuildContext context, String name, String distance, String status) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Container(
      width: 200,
      margin: const EdgeInsets.only(right: 16, bottom: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppTheme.darkCard : Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isDark ? Colors.white.withOpacity(0.05) : Colors.grey.shade100,
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.2 : 0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            name,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 6),
          Text(
            distance,
            style: TextStyle(color: isDark ? Colors.white60 : Colors.black54, fontSize: 12),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              const Icon(Icons.verified, color: AppTheme.secondaryBlue, size: 12),
              const SizedBox(width: 4),
              Text(
                status,
                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.secondaryBlue),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
