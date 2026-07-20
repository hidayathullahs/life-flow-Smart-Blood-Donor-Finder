import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:smart_blood_life/src/core/theme/app_theme.dart';
import 'package:smart_blood_life/src/data/models/emergency_model.dart';
import 'package:smart_blood_life/src/data/repositories/emergency_repository.dart';
import 'package:smart_blood_life/src/core/constants/app_constants.dart';

class HospitalPanelScreen extends StatefulWidget {
  const HospitalPanelScreen({super.key});

  @override
  State<HospitalPanelScreen> createState() => _HospitalPanelScreenState();
}

class _HospitalPanelScreenState extends State<HospitalPanelScreen> {
  final _emergencyRepo = EmergencyRepository();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hospital Panel'),
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: FirebaseFirestore.instance
            .collection(AppConstants.collectionEmergencies)
            .snapshots(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
            return const Center(child: Text('No requests created yet.'));
          }

          final allRequests = snapshot.data!.docs
              .map((doc) => EmergencyModel.fromFirestore(doc))
              .toList();

          return ListView.builder(
            padding: const EdgeInsets.all(16.0),
            itemCount: allRequests.length,
            itemBuilder: (context, index) {
              final req = allRequests[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 12.0),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Patient: ${req.patientName.isNotEmpty ? req.patientName : "Anonymous"}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: req.active ? Colors.green.shade50 : Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              req.status.toUpperCase(),
                              style: TextStyle(
                                color: req.active ? Colors.green.shade900 : Colors.grey.shade600,
                                fontWeight: FontWeight.bold,
                                fontSize: 10,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text('Hospital: ${req.hospital} • Blood: ${req.bloodGroup}'),
                      Text('Units Requested: ${req.unitsNeeded} Units'),
                      const SizedBox(height: 12),
                      if (req.active)
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            TextButton(
                              onPressed: () => _emergencyRepo.cancelEmergency(req.id),
                              child: const Text('Cancel Request', style: TextStyle(color: Colors.redAccent)),
                            ),
                            const SizedBox(width: 8),
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppTheme.bloodRed,
                                foregroundColor: Colors.white,
                                minimumSize: const Size(120, 36),
                              ),
                              onPressed: () => _emergencyRepo.fulfillEmergency(req.id),
                              child: const Text('Mark Fulfilled', style: TextStyle(fontSize: 12)),
                            ),
                          ],
                        ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
