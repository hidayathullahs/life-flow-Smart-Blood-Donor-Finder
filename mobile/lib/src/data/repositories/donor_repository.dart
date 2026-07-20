import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:smart_blood_life/src/core/constants/app_constants.dart';
import 'package:smart_blood_life/src/data/models/donor_model.dart';

class DonorRepository {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // Stream of all active donors — real-time sync with the web dashboard
  Stream<List<DonorModel>> streamActiveDonors({int limit = 50}) {
    return _firestore
        .collection(AppConstants.collectionDonors)
        .where('isAvailable', isEqualTo: true)
        .limit(limit)
        .snapshots()
        .map((snapshot) {
      final list = snapshot.docs.map((doc) => DonorModel.fromFirestore(doc)).toList();
      list.sort((a, b) => (b.registeredAt ?? DateTime(2000)).compareTo(a.registeredAt ?? DateTime(2000)));
      _cacheDonorsLocally(list);
      return list;
    });
  }

  // Local Caching (Offline Support via Hive)
  void _cacheDonorsLocally(List<DonorModel> donors) {
    try {
      final box = Hive.box(AppConstants.hiveOfflineCacheBox);
      final listMap = donors.map((d) => d.toCacheMap()).toList();
      box.put('cached_donors', listMap);
    } catch (e) {
      debugPrint('Offline Caching Error: $e');
    }
  }

  // Retrieve Offline Cached Donors — uses fromMap() instead of DocumentSnapshot
  // to avoid implementing the full DocumentSnapshot interface
  List<DonorModel> getOfflineCachedDonors() {
    try {
      final box = Hive.box(AppConstants.hiveOfflineCacheBox);
      final cached = box.get('cached_donors');
      if (cached is List) {
        return cached
            .whereType<Map>()
            .map((raw) => DonorModel.fromMap(Map<String, dynamic>.from(raw)))
            .toList();
      }
    } catch (e) {
      debugPrint('Offline cache read error: $e');
    }
    return [];
  }

  // 1. Get All Active Donors (one-shot fetch with offline fallback)
  Future<List<DonorModel>> getAllActiveDonors({int limit = 100}) async {
    try {
      final snapshot = await _firestore
          .collection(AppConstants.collectionDonors)
          .where('isAvailable', isEqualTo: true)
          .limit(limit)
          .get();
      final list = snapshot.docs.map((doc) => DonorModel.fromFirestore(doc)).toList();
      list.sort((a, b) => (b.registeredAt ?? DateTime(2000)).compareTo(a.registeredAt ?? DateTime(2000)));
      return list;
    } catch (e) {
      debugPrint('Error getting active donors: $e. Loading offline cache.');
      return getOfflineCachedDonors();
    }
  }

  // 2. Register/Create Donor (Form submission)
  Future<String> registerDonor(DonorModel donor) async {
    try {
      final ref = _firestore.collection(AppConstants.collectionDonors).doc();
      final docId = ref.id;
      final freshDonor = DonorModel(
        id: docId,
        userId: donor.userId,
        name: donor.name,
        bloodGroup: donor.bloodGroup,
        age: donor.age,
        gender: donor.gender,
        weight: donor.weight,
        city: donor.city,
        district: donor.district,
        state: donor.state,
        latitude: donor.latitude,
        longitude: donor.longitude,
        lastDonationDate: donor.lastDonationDate,
        isAvailable: true,
        active: true,
        donationCount: 0,
        photoUrl: donor.photoUrl,
        phone: donor.phone,
        whatsapp: donor.whatsapp ?? donor.phone,
        verified: false, // Starts unverified — requires admin approval
        registeredAt: DateTime.now(),
      );
      // Store docId inside the map for offline cache recovery
      await ref.set(freshDonor.toMap()..['id'] = docId);
      return docId;
    } catch (e) {
      debugPrint('Error registering donor: $e');
      rethrow;
    }
  }

  // 3. Update Donor Profile fields
  Future<void> updateDonor(String docId, Map<String, dynamic> data) async {
    await _firestore.collection(AppConstants.collectionDonors).doc(docId).update(data);
  }

  // 4. Toggle Availability
  Future<void> toggleAvailability(String docId, bool currentStatus) async {
    await _firestore
        .collection(AppConstants.collectionDonors)
        .doc(docId)
        .update({'isAvailable': !currentStatus});
  }

  // 5. Admin: Approve Donor (set verified = true)
  Future<void> approveDonor(String docId) async {
    await _firestore
        .collection(AppConstants.collectionDonors)
        .doc(docId)
        .update({'verified': true});
  }

  // 6. Admin: Reject/Delete Donor
  Future<void> rejectDonor(String docId) async {
    await _firestore.collection(AppConstants.collectionDonors).doc(docId).delete();
  }

  // 7. Platform Statistics
  Future<Map<String, dynamic>> getStats() async {
    try {
      final snapshot = await _firestore.collection(AppConstants.collectionDonors).get();
      final list = snapshot.docs.map((doc) => DonorModel.fromFirestore(doc)).toList();

      return {
        'totalDonors': list.length,
        'activeDonors': list.where((d) => d.isAvailable).length,
        'totalDonations': list.fold<int>(0, (acc, d) => acc + d.donationCount),
        'uniqueCities': list.map((d) => d.city.trim().toLowerCase()).toSet().length,
      };
    } catch (e) {
      debugPrint('Stats Fetch Error: $e');
      return {'totalDonors': 0, 'activeDonors': 0, 'totalDonations': 0, 'uniqueCities': 0};
    }
  }

  // 8. Atomic Transaction: Record Successful Donation
  Future<void> recordSuccessfulDonation(String donorId) async {
    final donorRef = _firestore.collection(AppConstants.collectionDonors).doc(donorId);
    await _firestore.runTransaction((transaction) async {
      final snapshot = await transaction.get(donorRef);
      if (!snapshot.exists) throw Exception('Donor does not exist!');
      final currentCount = (snapshot.get('donationCount') as num?)?.toInt() ?? 0;
      transaction.update(donorRef, {
        'donationCount': currentCount + 1,
        'lastDonationDate': Timestamp.now(),
      });
    });
  }
}
