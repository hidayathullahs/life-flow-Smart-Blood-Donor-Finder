import 'package:cloud_firestore/cloud_firestore.dart';

class EmergencyModel {
  final String id;
  final String bloodGroup;
  final int unitsNeeded;
  final String hospital;
  final String city;
  final String contactName;
  final String contactPhone;
  final String urgency; // 'critical', 'urgent', 'standard'
  final String notes;
  final String patientName;
  final String status; // 'active', 'fulfilled', 'cancelled', 'expired'
  final bool active;
  final String createdBy;
  final DateTime? createdAt;
  final DateTime? expiresAt;
  final int viewCount;
  final int responseCount;
  final List<String> notifiedDonors;

  EmergencyModel({
    required this.id,
    required this.bloodGroup,
    required this.unitsNeeded,
    required this.hospital,
    required this.city,
    required this.contactName,
    required this.contactPhone,
    required this.urgency,
    required this.notes,
    required this.patientName,
    required this.status,
    required this.active,
    required this.createdBy,
    this.createdAt,
    this.expiresAt,
    this.viewCount = 0,
    this.responseCount = 0,
    required this.notifiedDonors,
  });

  factory EmergencyModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    return EmergencyModel(
      id: doc.id,
      bloodGroup: data['bloodGroup'] ?? '',
      unitsNeeded: (data['unitsNeeded'] as num?)?.toInt() ?? 1,
      hospital: data['hospital'] ?? '',
      city: data['city'] ?? '',
      contactName: data['contactName'] ?? '',
      contactPhone: data['contactPhone'] ?? '',
      urgency: data['urgency'] ?? 'urgent',
      notes: data['notes'] ?? data['statusNotes'] ?? '',
      patientName: data['patientName'] ?? '',
      status: data['status'] ?? 'active',
      active: data['active'] ?? true,
      createdBy: data['createdBy'] ?? '',
      createdAt: (data['createdAt'] as Timestamp?)?.toDate(),
      expiresAt: (data['expiresAt'] as Timestamp?)?.toDate(),
      viewCount: (data['viewCount'] as num?)?.toInt() ?? 0,
      responseCount: (data['responseCount'] as num?)?.toInt() ?? 0,
      notifiedDonors: List<String>.from(data['notifiedDonors'] ?? []),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'bloodGroup': bloodGroup,
      'unitsNeeded': unitsNeeded,
      'hospital': hospital,
      'city': city,
      'contactName': contactName,
      'contactPhone': contactPhone,
      'urgency': urgency,
      'notes': notes,
      'patientName': patientName,
      'status': status,
      'active': active,
      'createdBy': createdBy,
      'createdAt': createdAt != null ? Timestamp.fromDate(createdAt!) : FieldValue.serverTimestamp(),
      'expiresAt': expiresAt != null ? Timestamp.fromDate(expiresAt!) : null,
      'viewCount': viewCount,
      'responseCount': responseCount,
      'notifiedDonors': notifiedDonors,
    };
  }
}
