import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:smart_blood_life/src/core/constants/app_constants.dart';
import 'package:smart_blood_life/src/data/models/emergency_model.dart';

class EmergencyRepository {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Stream active emergencies for real-time notification / dashboard view
  Stream<List<EmergencyModel>> streamActiveEmergencies() {
    return _firestore
        .collection(AppConstants.collectionEmergencies)
        .where('active', isEqualTo: true)          // FIX: named param
        .orderBy('createdAt', descending: true)    // FIX: named param
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) => EmergencyModel.fromFirestore(doc)).toList();
    });
  }

  // 1. Create Emergency Blood Request
  Future<String> createEmergency(EmergencyModel request) async {
    try {
      final docRef = _firestore.collection(AppConstants.collectionEmergencies).doc();
      final freshRequest = EmergencyModel(
        id: docRef.id,
        bloodGroup: request.bloodGroup,
        unitsNeeded: request.unitsNeeded,
        hospital: request.hospital,
        city: request.city,
        contactName: request.contactName,
        contactPhone: request.contactPhone,
        urgency: request.urgency,
        notes: request.notes,
        patientName: request.patientName,
        status: 'active',
        active: true,
        createdBy: request.createdBy,
        createdAt: DateTime.now(),
        expiresAt: _getExpiryDate(request.urgency),
        notifiedDonors: [],
      );

      await docRef.set(freshRequest.toMap());
      return docRef.id;
    } catch (e) {
      rethrow;
    }
  }

  DateTime _getExpiryDate(String urgency) {
    final now = DateTime.now();
    switch (urgency) {
      case AppConstants.urgencyCritical:
        return now.add(const Duration(days: 1)); // 24 hours
      case AppConstants.urgencyUrgent:
        return now.add(const Duration(days: 3)); // 3 days
      case AppConstants.urgencyStandard:
      default:
        return now.add(const Duration(days: 7)); // 7 days
    }
  }

  // 2. Fulfill Emergency Request
  Future<void> fulfillEmergency(String id) async {
    await _firestore.collection(AppConstants.collectionEmergencies).doc(id).update({
      'status': 'fulfilled',
      'active': false,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  // 3. Cancel Emergency Request
  Future<void> cancelEmergency(String id) async {
    await _firestore.collection(AppConstants.collectionEmergencies).doc(id).update({
      'status': 'cancelled',
      'active': false,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  // 4. Increment view counts
  Future<void> incrementViewCount(String id) async {
    await _firestore.collection(AppConstants.collectionEmergencies).doc(id).update({
      'viewCount': FieldValue.increment(1),
    });
  }

  // 5. Record Donor Actions (WhatsApp/Call response analytics)
  Future<void> recordDonorResponse(String id, String donorId, String responseType) async {
    final responseObj = {
      'donorId': donorId,
      'responseType': responseType, // 'call', 'whatsapp'
      'timestamp': Timestamp.now(),
    };

    await _firestore.collection(AppConstants.collectionEmergencies).doc(id).update({
      'donorResponses': FieldValue.arrayUnion([responseObj]),
      'responseCount': FieldValue.increment(1),
    });
  }
}
