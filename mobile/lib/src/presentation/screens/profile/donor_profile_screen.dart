import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:smart_blood_life/src/core/theme/app_theme.dart';
import 'package:smart_blood_life/src/data/models/donor_model.dart';
import 'package:smart_blood_life/src/core/constants/app_constants.dart';
import 'package:smart_blood_life/src/presentation/widgets/custom_components.dart';
import 'package:url_launcher/url_launcher.dart';

class DonorProfileScreen extends StatelessWidget {
  final String donorId;
  const DonorProfileScreen({super.key, required this.donorId});

  void _callPhone(String phone) async {
    final uri = Uri.parse('tel:$phone');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  void _launchWhatsApp(String phone, String name) async {
    final message = 'Hello $name, I found your contact on SmartBloodLife. We urgently need assistance.';
    final uri = Uri.parse('https://wa.me/$phone?text=${Uri.encodeComponent(message)}');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Donor Profile'),
      ),
      body: FutureBuilder<DocumentSnapshot>(
        future: FirebaseFirestore.instance.collection(AppConstants.collectionDonors).doc(donorId).get(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: AppTheme.bloodRed));
          }
          if (!snapshot.hasData || !snapshot.data!.exists) {
            return const Center(child: Text('Donor profile not found.', style: TextStyle(color: Colors.grey)));
          }

          final donor = DonorModel.fromFirestore(snapshot.data!);

          return SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              children: [
                const SizedBox(height: 10),
                
                // Donor Info Header Card
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 32.0, horizontal: 16.0),
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: isDark ? AppTheme.darkCard : Colors.white,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(
                      color: isDark ? Colors.white.withOpacity(0.05) : Colors.grey.shade100,
                      width: 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(isDark ? 0.2 : 0.03),
                        blurRadius: 12,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Stack(
                        alignment: Alignment.bottomRight,
                        children: [
                          BloodGroupBadge(bloodGroup: donor.bloodGroup, size: 90),
                          if (donor.verified)
                            const Positioned(
                              right: 2,
                              bottom: 2,
                              child: VerificationBadge(size: 26),
                            ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Text(
                        donor.name,
                        style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppTheme.bloodRed.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          'Active Donor in ${donor.city}',
                          style: const TextStyle(
                            fontSize: 13, 
                            fontWeight: FontWeight.bold, 
                            color: AppTheme.bloodRed,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 20),
                
                // Spec Grid/List
                Container(
                  decoration: BoxDecoration(
                    color: isDark ? AppTheme.darkCard : Colors.white,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(
                      color: isDark ? Colors.white.withOpacity(0.05) : Colors.grey.shade100,
                      width: 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(isDark ? 0.2 : 0.03),
                        blurRadius: 12,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      _buildSpecRow(context, 'Age', '${donor.age} Years'),
                      Divider(height: 1, color: isDark ? Colors.white10 : Colors.grey.shade100),
                      _buildSpecRow(context, 'Gender', donor.gender),
                      Divider(height: 1, color: isDark ? Colors.white10 : Colors.grey.shade100),
                      _buildSpecRow(context, 'Weight', '${donor.weight} kg'),
                      Divider(height: 1, color: isDark ? Colors.white10 : Colors.grey.shade100),
                      _buildSpecRow(context, 'Eligibility', donor.isEligibleToDonate ? 'Eligible to Donate' : 'On Cooloff Period'),
                      Divider(height: 1, color: isDark ? Colors.white10 : Colors.grey.shade100),
                      _buildSpecRow(context, 'Last Donation', donor.lastDonationDate != null 
                          ? '${donor.lastDonationDate!.day}/${donor.lastDonationDate!.month}/${donor.lastDonationDate!.year}'
                          : 'Never Donated'),
                    ],
                  ),
                ),
                
                const SizedBox(height: 32),
                
                // Action contact buttons row
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue.shade600,
                          foregroundColor: Colors.white,
                          minimumSize: const Size(double.infinity, 52),
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        onPressed: () => _callPhone(donor.phone),
                        icon: const Icon(Icons.phone),
                        label: const Text('Call Phone', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green.shade600,
                          foregroundColor: Colors.white,
                          minimumSize: const Size(double.infinity, 52),
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        onPressed: () => _launchWhatsApp(donor.whatsapp ?? donor.phone, donor.name),
                        icon: const Icon(Icons.chat_bubble_outline),
                        label: const Text('WhatsApp', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildSpecRow(BuildContext context, String label, String value) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label, 
            style: TextStyle(
              fontWeight: FontWeight.bold, 
              fontSize: 15,
              color: isDark ? Colors.white70 : Colors.black87,
            ),
          ),
          Text(
            value, 
            style: TextStyle(
              fontSize: 15, 
              color: isDark ? Colors.white60 : Colors.black54,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
