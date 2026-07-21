import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:smart_blood_life/src/core/theme/app_theme.dart';

// ─────────────────────────────────────────────────────────
// SmartMatchPill  – matches the website's "Smart Match Active" badge
// ─────────────────────────────────────────────────────────
class SmartMatchPill extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color? color;

  const SmartMatchPill({
    super.key,
    this.label = 'Smart Match Active',
    this.icon = Icons.auto_awesome,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final c = color ?? AppTheme.secondaryBlue;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: c.withOpacity(isDark ? 0.15 : 0.08),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: c.withOpacity(0.25)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: c),
          const SizedBox(width: 5),
          Text(
            label.toUpperCase(),
            style: TextStyle(
              color: c,
              fontSize: 10,
              fontWeight: FontWeight.w900,
              letterSpacing: 0.8,
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────
// PulsingDot  – animated green availability dot (mirrors website)
// ─────────────────────────────────────────────────────────
class PulsingDot extends StatefulWidget {
  final Color color;
  final double size;

  const PulsingDot({
    super.key,
    this.color = AppTheme.successGreen,
    this.size = 8,
  });

  @override
  State<PulsingDot> createState() => _PulsingDotState();
}

class _PulsingDotState extends State<PulsingDot>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _anim;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
    _anim = Tween<double>(begin: 0.4, end: 1.0).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _anim,
      builder: (_, __) => Opacity(
        opacity: _anim.value,
        child: Container(
          width: widget.size,
          height: widget.size,
          decoration: BoxDecoration(
            color: widget.color,
            shape: BoxShape.circle,
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────
// EliteDonorBadge  – gold ribbon for donors with 5+ donations (matches web)
// ─────────────────────────────────────────────────────────
class EliteDonorBadge extends StatelessWidget {
  const EliteDonorBadge({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFF59E0B), Color(0xFFD97706)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFF59E0B).withOpacity(0.3),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('⭐', style: TextStyle(fontSize: 10)),
          SizedBox(width: 4),
          Text(
            'ELITE',
            style: TextStyle(
              color: Colors.white,
              fontSize: 10,
              fontWeight: FontWeight.w900,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────
// StatCardWidget  – matches web's glassmorphic stat card with gradient icon
// ─────────────────────────────────────────────────────────
class StatCardWidget extends StatelessWidget {
  final String label;
  final num value;
  final IconData icon;
  final List<Color> gradient;
  final String suffix;

  const StatCardWidget({
    super.key,
    required this.label,
    required this.value,
    required this.icon,
    required this.gradient,
    this.suffix = '',
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.all(20),
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
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: gradient,
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(14),
              boxShadow: [
                BoxShadow(
                  color: gradient.first.withOpacity(0.35),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Icon(icon, color: Colors.white, size: 22),
          ),
          const SizedBox(height: 16),
          AnimatedCountUp(
            targetValue: value,
            suffix: suffix,
            style: const TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.bold,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: isDark ? Colors.white54 : Colors.grey.shade600,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────
// ResultsCountBanner  – shows number of results with smart-match context
// ─────────────────────────────────────────────────────────
class ResultsCountBanner extends StatelessWidget {
  final int count;
  final String bloodGroup;

  const ResultsCountBanner({
    super.key,
    required this.count,
    required this.bloodGroup,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      color: isDark ? AppTheme.darkBg : const Color(0xFFF8FAFC),
      child: Row(
        children: [
          Text(
            '$count ',
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 15,
              color: AppTheme.bloodRed,
            ),
          ),
          Text(
            bloodGroup == 'All'
                ? 'verified donors found'
                : '$bloodGroup donors found',
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 14,
              color: isDark ? Colors.white70 : Colors.black87,
            ),
          ),
          const Spacer(),
          const SmartMatchPill(),
        ],
      ),
    );
  }
}

class PrimaryButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  final IconData? icon;
  final bool isLoading;

  const PrimaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: const LinearGradient(
          colors: [AppTheme.bloodRed, AppTheme.accentRed],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: AppTheme.bloodRed.withOpacity(0.25),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: isLoading ? null : onPressed,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            height: 54,
            alignment: Alignment.center,
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: isLoading
                ? const SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      color: Colors.white,
                      strokeWidth: 2.5,
                    ),
                  )
                : Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (icon != null) ...[
                        Icon(icon, color: Colors.white, size: 20),
                        const SizedBox(width: 8),
                      ],
                      Text(
                        label,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
          ),
        ),
      ),
    );
  }
}

class SecondaryButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  final IconData? icon;
  final bool isLoading;

  const SecondaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? Colors.white.withOpacity(0.15) : Colors.grey.shade300,
          width: 1.5,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: isLoading ? null : onPressed,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            height: 54,
            alignment: Alignment.center,
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: isLoading
                ? SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      color: Theme.of(context).colorScheme.primary,
                      strokeWidth: 2.5,
                    ),
                  )
                : Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (icon != null) ...[
                        Icon(
                          icon,
                          color: Theme.of(context).colorScheme.onSurface,
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                      ],
                      Text(
                        label,
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.onSurface,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
          ),
        ),
      ),
    );
  }
}

class BloodGroupBadge extends StatelessWidget {
  final String bloodGroup;
  final double size;

  const BloodGroupBadge({
    super.key,
    required this.bloodGroup,
    this.size = 48,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: const LinearGradient(
          colors: [AppTheme.bloodRed, AppTheme.accentRed],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: AppTheme.bloodRed.withOpacity(0.2),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      alignment: Alignment.center,
      child: Text(
        bloodGroup,
        style: TextStyle(
          color: Colors.white,
          fontSize: size * 0.35,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}

class VerificationBadge extends StatelessWidget {
  final double size;

  const VerificationBadge({
    super.key,
    this.size = 18,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: 'Verified donor',
      child: Container(
        padding: const EdgeInsets.all(2),
        decoration: const BoxDecoration(
          color: AppTheme.secondaryBlue,
          shape: BoxShape.circle,
        ),
        child: Icon(
          Icons.check,
          color: Colors.white,
          size: size - 4,
        ),
      ),
    );
  }
}

class GlassmorphicCard extends StatelessWidget {
  final Widget child;
  final double blur;
  final double opacity;
  final Color? color;
  final BorderRadius? borderRadius;
  final EdgeInsetsGeometry? padding;
  final BorderSide? borderSide;

  const GlassmorphicCard({
    super.key,
    required this.child,
    this.blur = 10,
    this.opacity = 0.05,
    this.color,
    this.borderRadius,
    this.padding,
    this.borderSide,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final fallbackColor = color ?? (isDark ? Colors.white : Colors.black);
    final finalBorderRadius = borderRadius ?? BorderRadius.circular(24);

    return ClipRRect(
      borderRadius: finalBorderRadius,
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
        child: Container(
          padding: padding ?? const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: fallbackColor.withOpacity(opacity),
            borderRadius: finalBorderRadius,
            border: Border.fromBorderSide(
              borderSide ??
                  BorderSide(
                    color: isDark
                        ? Colors.white.withOpacity(0.08)
                        : Colors.black.withOpacity(0.05),
                    width: 1.5,
                  ),
            ),
          ),
          child: child,
        ),
      ),
    );
  }
}

class ShimmerLoading extends StatefulWidget {
  final double width;
  final double height;
  final BorderRadius? borderRadius;

  const ShimmerLoading({
    super.key,
    required this.width,
    required this.height,
    this.borderRadius,
  });

  @override
  State<ShimmerLoading> createState() => _ShimmerLoadingState();
}

class _ShimmerLoadingState extends State<ShimmerLoading> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            borderRadius: widget.borderRadius ?? BorderRadius.circular(12),
            gradient: LinearGradient(
              colors: isDark
                  ? [
                      const Color(0xFF1E293B),
                      const Color(0xFF334155),
                      const Color(0xFF1E293B),
                    ]
                  : [
                      const Color(0xFFE2E8F0),
                      const Color(0xFFF1F5F9),
                      const Color(0xFFE2E8F0),
                    ],
              stops: const [0.0, 0.5, 1.0],
              begin: Alignment(-2.0 + (_controller.value * 4.0), -0.5),
              end: Alignment(0.0 + (_controller.value * 4.0), 0.5),
            ),
          ),
        );
      },
    );
  }
}

class AnimatedCountUp extends StatefulWidget {
  final num targetValue;
  final TextStyle? style;
  final Duration duration;
  final String prefix;
  final String suffix;

  const AnimatedCountUp({
    super.key,
    required this.targetValue,
    this.style,
    this.duration = const Duration(milliseconds: 1500),
    this.prefix = '',
    this.suffix = '',
  });

  @override
  State<AnimatedCountUp> createState() => _AnimatedCountUpState();
}

class _AnimatedCountUpState extends State<AnimatedCountUp> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    );
    _animation = Tween<double>(begin: 0.0, end: widget.targetValue.toDouble()).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutQuad),
    );
    _controller.forward();
  }

  @override
  void didUpdateWidget(covariant AnimatedCountUp oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.targetValue != widget.targetValue) {
      _animation = Tween<double>(
        begin: _animation.value,
        end: widget.targetValue.toDouble(),
      ).animate(
        CurvedAnimation(parent: _controller, curve: Curves.easeOutQuad),
      );
      _controller.forward(from: 0.0);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        final val = _animation.value;
        final isInt = widget.targetValue is int;
        final displayStr = isInt ? val.toInt().toString() : val.toStringAsFixed(1);

        return Text(
          '${widget.prefix}$displayStr${widget.suffix}',
          style: widget.style,
        );
      },
    );
  }
}

class DonorCardWidget extends StatelessWidget {
  final String name;
  final String bloodGroup;
  final String city;
  final bool verified;
  final int age;
  final String gender;
  final bool isEligible;
  final VoidCallback onCall;
  final VoidCallback onWhatsApp;
  final VoidCallback onTap;

  const DonorCardWidget({
    super.key,
    required this.name,
    required this.bloodGroup,
    required this.city,
    required this.verified,
    required this.age,
    required this.gender,
    required this.isEligible,
    required this.onCall,
    required this.onWhatsApp,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Semantics(
      label: 'Donor card: $name, blood group $bloodGroup, ${verified ? "verified" : "unverified"}, located in $city',
      button: true,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16.0),
        decoration: BoxDecoration(
          color: isDark ? AppTheme.darkCard : Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isDark ? Colors.white.withOpacity(0.04) : Colors.black.withOpacity(0.03),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(isDark ? 0.15 : 0.02),
              blurRadius: 16,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(24),
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      BloodGroupBadge(bloodGroup: bloodGroup, size: 52),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Flexible(
                                  child: Text(
                                    name,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 17,
                                      letterSpacing: -0.3,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                if (verified) ...[
                                  const SizedBox(width: 6),
                                  const VerificationBadge(size: 16),
                                ],
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '$city • $age Years • $gender',
                              style: TextStyle(
                                color: isDark ? Colors.white60 : Colors.black54,
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                // Pulsing dot + Availability (matches web animated indicator)
                                if (isEligible) ...[
                                  const PulsingDot(),
                                  const SizedBox(width: 5),
                                  const Text(
                                    'Available Now',
                                    style: TextStyle(
                                      color: AppTheme.successGreen,
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ] else ...[
                                  Container(
                                    width: 8,
                                    height: 8,
                                    decoration: BoxDecoration(
                                      color: isDark ? Colors.white30 : Colors.grey.shade400,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  const SizedBox(width: 5),
                                  Text(
                                    'On Cooldown',
                                    style: TextStyle(
                                      color: isDark ? AppTheme.warningOrange : const Color(0xFFE65100),
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                                const SizedBox(width: 8),
                                // Fast response chip
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: isDark ? const Color(0xFF0F2618) : const Color(0xFFE8F5E9),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(
                                        Icons.flash_on,
                                        color: isDark ? AppTheme.successGreen : const Color(0xFF2E7D32),
                                        size: 12,
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        'Fast Response',
                                        style: TextStyle(
                                          color: isDark ? AppTheme.successGreen : const Color(0xFF2E7D32),
                                          fontSize: 11,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Divider(height: 1, color: isDark ? Colors.white.withOpacity(0.05) : Colors.grey.shade100),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.phone_outlined, color: AppTheme.secondaryBlue),
                        style: IconButton.styleFrom(
                          backgroundColor: isDark ? const Color(0xFF17253D) : const Color(0xFFEFF6FF),
                          padding: const EdgeInsets.all(12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        onPressed: onCall,
                        tooltip: 'Call donor',
                      ),
                      const SizedBox(width: 12),
                      IconButton(
                        icon: const Icon(Icons.chat_bubble_outline, color: AppTheme.successGreen),
                        style: IconButton.styleFrom(
                          backgroundColor: isDark ? const Color(0xFF10261A) : const Color(0xFFECFDF5),
                          padding: const EdgeInsets.all(12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        onPressed: onWhatsApp,
                        tooltip: 'WhatsApp donor',
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.bloodRed,
                            foregroundColor: Colors.white,
                            elevation: 0,
                            minimumSize: const Size(double.infinity, 44),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          onPressed: onTap,
                          child: const Text('View Profile', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
