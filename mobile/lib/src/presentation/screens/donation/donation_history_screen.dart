import 'package:flutter/material.dart';
import 'package:smart_blood_life/src/core/theme/app_theme.dart';
import 'package:smart_blood_life/src/presentation/widgets/custom_components.dart';

class DonationHistoryScreen extends StatelessWidget {
  const DonationHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {


    return Scaffold(
      appBar: AppBar(
        title: const Text('Donation History'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Points card Redesign
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24.0),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppTheme.bloodRed, AppTheme.accentRed],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(28),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.bloodRed.withValues(alpha: 0.25),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'TOTAL IMPACT POINTS',
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.8),
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.5,
                        ),
                      ),
                      const SizedBox(height: 6),
                      const AnimatedCountUp(
                        targetValue: 1250,
                        style: TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: -0.5),
                        suffix: ' PTS',
                      ),
                    ],
                  ),
                  const CircleAvatar(
                    radius: 28,
                    backgroundColor: Colors.white24,
                    child: Icon(Icons.emoji_events, color: Colors.white, size: 32),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 36),
            
            const Text(
              'Earned Badges',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, letterSpacing: -0.5),
            ),
            const SizedBox(height: 16),
            
            // Badge Grid Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildBadge(context, 'Lifesaver', Icons.favorite, AppTheme.bloodRed),
                _buildBadge(context, 'First Blood', Icons.water_drop, AppTheme.warningOrange),
                _buildBadge(context, 'Regular', Icons.loop, AppTheme.secondaryBlue),
                _buildBadge(context, 'Pioneer', Icons.star, Colors.purple),
              ],
            ),
            const SizedBox(height: 40),
            
            const Text(
              'Donation Timeline',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, letterSpacing: -0.5),
            ),
            const SizedBox(height: 20),
            
            // Vertical Timeline visualization
            _buildTimelineItem(
              context,
              title: 'Voluntary Blood Donation',
              date: '12 Jan 2026',
              status: 'Verified donation at Apollo Center',
              points: '+250 PTS',
              isFirst: true,
              isLast: false,
            ),
            _buildTimelineItem(
              context,
              title: 'Emergency SOS Donation',
              date: '05 Oct 2025',
              status: 'Critical request matched in Chennai',
              points: '+500 PTS',
              isFirst: false,
              isLast: false,
            ),
            _buildTimelineItem(
              context,
              title: 'Camp Donation (Apollo)',
              date: '14 Jun 2025',
              status: 'Summer blood collection camp',
              points: '+250 PTS',
              isFirst: false,
              isLast: true,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBadge(BuildContext context, String name, IconData icon, Color color) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Expanded(
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? AppTheme.darkCard : Colors.white,
              shape: BoxShape.circle,
              border: Border.all(
                color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.grey.shade100,
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.02),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 8),
          Text(
            name, 
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineItem(
    BuildContext context, {
    required String title,
    required String date,
    required String status,
    required String points,
    required bool isFirst,
    required bool isLast,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Timeline graphics column
          Column(
            children: [
              Container(
                width: 16,
                height: 16,
                decoration: const BoxDecoration(
                  color: AppTheme.bloodRed,
                  shape: BoxShape.circle,
                ),
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2.5,
                    color: AppTheme.bloodRed.withValues(alpha: 0.2),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 20),
          
          // Details Card column
          Expanded(
            child: Container(
              margin: const EdgeInsets.only(bottom: 24.0),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: isDark ? AppTheme.darkCard : Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.grey.shade100,
                  width: 1.5,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.02),
                    blurRadius: 12,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '$date • $status',
                          style: TextStyle(
                            color: isDark ? Colors.white54 : Colors.black54,
                            fontSize: 12,
                            height: 1.3,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    points,
                    style: const TextStyle(color: AppTheme.successGreen, fontWeight: FontWeight.bold, fontSize: 15),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
