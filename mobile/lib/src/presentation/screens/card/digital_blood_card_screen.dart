import 'dart:math';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:go_router/go_router.dart';
import 'package:smart_blood_life/src/core/theme/app_theme.dart';
import 'package:smart_blood_life/src/presentation/widgets/bottom_nav_bar.dart';

class DigitalBloodCardScreen extends StatefulWidget {
  const DigitalBloodCardScreen({super.key});

  @override
  State<DigitalBloodCardScreen> createState() => _DigitalBloodCardScreenState();
}

class _DigitalBloodCardScreenState extends State<DigitalBloodCardScreen> with SingleTickerProviderStateMixin {
  late AnimationController _flipController;
  late Animation<double> _flipAnimation;
  bool _isFront = true;

  @override
  void initState() {
    super.initState();
    _flipController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _flipAnimation = Tween<double>(begin: 0.0, end: pi).animate(
      CurvedAnimation(parent: _flipController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _flipController.dispose();
    super.dispose();
  }

  void _toggleCard() {
    if (_isFront) {
      _flipController.forward();
    } else {
      _flipController.reverse();
    }
    setState(() => _isFront = !_isFront);
  }

  void _downloadPdfCard(BuildContext context, String name, String bloodGroup, String uid) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        build: (pw.Context context) {
          return pw.Center(
            child: pw.Container(
              width: 350,
              height: 220,
              padding: const pw.EdgeInsets.all(24.0),
              decoration: pw.BoxDecoration(
                color: PdfColor.fromHex('#E53935'),
                borderRadius: pw.BorderRadius.circular(16),
              ),
              child: pw.Column(
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    children: [
                      pw.Text('LIFE FLOW',
                          style: pw.TextStyle(color: PdfColors.white, fontWeight: pw.FontWeight.bold, fontSize: 14)),
                      pw.Text('VERIFIED DONOR',
                          style: pw.TextStyle(color: PdfColors.white, fontWeight: pw.FontWeight.bold, fontSize: 10)),
                    ],
                  ),
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text(name.toUpperCase(),
                          style: pw.TextStyle(color: PdfColors.white, fontWeight: pw.FontWeight.bold, fontSize: 18)),
                      pw.SizedBox(height: 4),
                      pw.Text('ID: ${uid.toUpperCase()}',
                          style: pw.TextStyle(color: const PdfColor(1.0, 1.0, 1.0, 0.8), fontSize: 10)),
                    ],
                  ),
                  pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    children: [
                      pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.start,
                        children: [
                          pw.Text('BLOOD GROUP',
                              style: pw.TextStyle(color: const PdfColor(1.0, 1.0, 1.0, 0.8), fontSize: 9)),
                          pw.Text(bloodGroup,
                              style: pw.TextStyle(color: PdfColors.white, fontWeight: pw.FontWeight.bold, fontSize: 16)),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );

    try {
      await Printing.layoutPdf(
        onLayout: (PdfPageFormat format) async => pdf.save(),
        name: 'SmartBloodLife_Card_${uid.substring(0, 6)}.pdf',
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to generate PDF: $e'), backgroundColor: Colors.redAccent),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final user = FirebaseAuth.instance.currentUser;
    final uid = user?.uid ?? 'GUEST-ID';
    final name = user?.displayName ?? 'Verified Blood Donor';
    const bloodGroup = 'O+'; 

    final qrData = 'smartbloodlife://verify?uid=$uid&name=${Uri.encodeComponent(name)}';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Digital Blood Card'),
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(24.0, 16.0, 24.0, 110.0), // Padding for custom bottom nav
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Membership Pass',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w900,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Tap your donor card to flip and view medical details.',
                  style: TextStyle(color: isDark ? Colors.white54 : Colors.grey.shade600, fontSize: 13),
                ),
                const SizedBox(height: 28),
                
                // Interactive 3D Flip Card Widget
                GestureDetector(
                  onTap: _toggleCard,
                  child: Center(
                    child: AnimatedBuilder(
                      animation: _flipAnimation,
                      builder: (context, child) {
                        final angle = _flipAnimation.value;
                        final isBackView = angle >= pi / 2;
                        
                        return Transform(
                          transform: Matrix4.identity()
                            ..setEntry(3, 2, 0.001) // perspective
                            ..rotateY(angle),
                          alignment: Alignment.center,
                          child: isBackView
                              ? Transform(
                                  transform: Matrix4.identity()..rotateY(pi),
                                  alignment: Alignment.center,
                                  child: _buildCardBack(isDark, name, uid),
                                )
                              : _buildCardFront(isDark, name, uid, qrData),
                        );
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 36),
                
                Text(
                  'Quick Actions',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Download a printable PDF copy or scan barcode/QR signatures at partner centers.',
                  style: TextStyle(color: isDark ? Colors.white38 : Colors.grey.shade600, fontSize: 13),
                ),
                const SizedBox(height: 24),
                
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.download_outlined),
                        label: const Text('Download PDF'),
                        style: ElevatedButton.styleFrom(
                          minimumSize: const Size(double.infinity, 50),
                        ),
                        onPressed: () => _downloadPdfCard(context, name, bloodGroup, uid),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: OutlinedButton.icon(
                        icon: const Icon(Icons.qr_code_scanner, color: AppTheme.bloodRed),
                        label: const Text('Scan QR Code'),
                        style: OutlinedButton.styleFrom(
                          minimumSize: const Size(double.infinity, 50),
                          foregroundColor: AppTheme.bloodRed,
                          side: const BorderSide(color: AppTheme.bloodRed, width: 1.5),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        onPressed: () => context.push('/qr-scanner'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          
          // Bottom Navigation Bar
          const Align(
            alignment: Alignment.bottomCenter,
            child: AppBottomNavigationBar(currentPath: '/digital-card'),
          ),
        ],
      ),
    );
  }

  Widget _buildCardFront(bool isDark, String name, String uid, String qrData) {
    return Container(
      width: double.infinity,
      height: 230,
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
            color: AppTheme.bloodRed.withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'LIFE FLOW',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w900,
                  fontSize: 16,
                  letterSpacing: 1.5,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.verified, color: Colors.white, size: 12),
                    SizedBox(width: 4),
                    Text(
                      'VERIFIED',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name.toUpperCase(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'DONOR ID: ${uid.substring(0, 8).toUpperCase()}',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.75),
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'BLOOD GROUP',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.65),
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 2),
                  const Text(
                    'O Positive (O+)',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.all(6.0),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: 6,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: QrImageView(
                  data: qrData,
                  version: QrVersions.auto,
                  size: 64.0,
                  eyeStyle: const QrEyeStyle(
                    eyeShape: QrEyeShape.square,
                    color: Color(0xFF0F172A),
                  ),
                  dataModuleStyle: const QrDataModuleStyle(
                    dataModuleShape: QrDataModuleShape.square,
                    color: Color(0xFF0F172A),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCardBack(bool isDark, String name, String uid) {
    return Container(
      width: double.infinity,
      height: 230,
      padding: const EdgeInsets.all(24.0),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: isDark 
            ? [const Color(0xFF1E293B), const Color(0xFF0F172A)]
            : [const Color(0xFF0F172A), const Color(0xFF1E293B)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'MEDICAL RECORD',
                style: TextStyle(
                  color: Colors.white70,
                  fontWeight: FontWeight.w900,
                  fontSize: 12,
                  letterSpacing: 1.5,
                ),
              ),
              Icon(Icons.info_outline, color: Colors.white.withValues(alpha: 0.5), size: 18),
            ],
          ),
          
          Column(
            children: [
              _buildBackRow('Allergies', 'None Registered'),
              const SizedBox(height: 8),
              _buildBackRow('Eligibility', 'Eligible to Donate'),
              const SizedBox(height: 8),
              _buildBackRow('Emergency Contacts', '+91 98765 43210'),
              const SizedBox(height: 8),
              _buildBackRow('Last Donation', '12 Jan 2026'),
            ],
          ),
          
          Center(
            child: Text(
              'Tap to Flip Back',
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.4),
                fontSize: 10,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBackRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(color: Colors.white60, fontSize: 12, fontWeight: FontWeight.w500),
        ),
        Text(
          value,
          style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }
}
