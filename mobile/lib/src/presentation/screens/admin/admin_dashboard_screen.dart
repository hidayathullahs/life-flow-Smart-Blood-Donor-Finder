import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:smart_blood_life/src/core/theme/app_theme.dart';
import 'package:smart_blood_life/src/data/models/donor_model.dart';
import 'package:smart_blood_life/src/data/repositories/donor_repository.dart';
import 'package:smart_blood_life/src/core/constants/app_constants.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  final _donorRepo = DonorRepository();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Dashboard'),
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance
            .collection(AppConstants.collectionDonors)
            .snapshots(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
            return const Center(child: Text('No donors registered.'));
          }

          final allDonors = snapshot.data!.docs.map((doc) => DonorModel.fromFirestore(doc)).toList();
          final pendingDonors = allDonors.where((d) => !d.verified).toList();

          return DefaultTabController(
            length: 2,
            child: Column(
              children: [
                const TabBar(
                  labelColor: AppTheme.bloodRed,
                  unselectedLabelColor: Colors.grey,
                  indicatorColor: AppTheme.bloodRed,
                  tabs: [
                    Tab(text: 'Pending Verification'),
                    Tab(text: 'All Registered Donors'),
                  ],
                ),
                Expanded(
                  child: TabBarView(
                    children: [
                      // Pending tab
                      pendingDonors.isEmpty
                          ? const Center(child: Text('No pending verifications.'))
                          : ListView.builder(
                              padding: const EdgeInsets.all(16.0),
                              itemCount: pendingDonors.length,
                              itemBuilder: (context, index) {
                                final donor = pendingDonors[index];
                                return Card(
                                  margin: const EdgeInsets.only(bottom: 12.0),
                                  child: Padding(
                                    padding: const EdgeInsets.all(16.0),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(donor.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                                        const SizedBox(height: 4),
                                        Text('Blood Group: ${donor.bloodGroup} • City: ${donor.city}'),
                                        Text('Phone: ${donor.phone}'),
                                        const SizedBox(height: 12),
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.end,
                                          children: [
                                            TextButton(
                                              onPressed: () => _donorRepo.rejectDonor(donor.id),
                                              child: const Text('Reject', style: TextStyle(color: Colors.redAccent)),
                                            ),
                                            const SizedBox(width: 8),
                                            ElevatedButton(
                                              style: ElevatedButton.styleFrom(
                                                backgroundColor: Colors.green,
                                                foregroundColor: Colors.white,
                                                minimumSize: const Size(100, 36),
                                              ),
                                              onPressed: () => _donorRepo.approveDonor(donor.id),
                                              child: const Text('Approve', style: TextStyle(fontSize: 12)),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                      
                      // All donors tab
                      ListView.builder(
                        padding: const EdgeInsets.all(16.0),
                        itemCount: allDonors.length,
                        itemBuilder: (context, index) {
                          final donor = allDonors[index];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12.0),
                            child: ListTile(
                              title: Text(donor.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                              subtitle: Text('${donor.bloodGroup} • ${donor.city} • ${donor.verified ? "Verified" : "Pending"}'),
                              trailing: IconButton(
                                icon: const Icon(Icons.delete_outline, color: Colors.redAccent),
                                onPressed: () => _donorRepo.rejectDonor(donor.id),
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
