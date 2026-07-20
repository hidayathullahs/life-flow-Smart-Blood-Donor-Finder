import 'package:cloud_firestore/cloud_firestore.dart';

class DonorModel {
  final String id;
  final String userId;
  final String name;
  final String bloodGroup;
  final int age;
  final String gender;
  final double weight;
  final String city;
  final String? district;
  final String? state;
  final double? latitude;
  final double? longitude;
  final DateTime? lastDonationDate;
  final bool isAvailable;
  final bool active;
  final int donationCount;
  final String? photoUrl;
  final String phone;
  final String? whatsapp;
  final bool verified;
  final DateTime? registeredAt;

  DonorModel({
    required this.id,
    required this.userId,
    required this.name,
    required this.bloodGroup,
    required this.age,
    required this.gender,
    required this.weight,
    required this.city,
    this.district,
    this.state,
    this.latitude,
    this.longitude,
    this.lastDonationDate,
    this.isAvailable = true,
    this.active = true,
    this.donationCount = 0,
    this.photoUrl,
    required this.phone,
    this.whatsapp,
    this.verified = false,
    this.registeredAt,
  });

  factory DonorModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    return DonorModel.fromMap(data, id: doc.id);
  }

  factory DonorModel.fromMap(Map<String, dynamic> data, {String? id}) {
    double? lat;
    double? lng;
    final geoPoint = data['location'];
    if (geoPoint is GeoPoint) {
      lat = geoPoint.latitude;
      lng = geoPoint.longitude;
    } else if (geoPoint is Map) {
      lat = _parseNullableDouble(geoPoint['latitude']);
      lng = _parseNullableDouble(geoPoint['longitude']);
    }

    return DonorModel(
      id: id ?? data['id'] ?? '',
      userId: data['userId'] ?? '',
      name: data['name'] ?? '',
      bloodGroup: data['bloodGroup'] ?? '',
      age: _parseInt(data['age']),
      gender: data['gender'] ?? 'male',
      weight: _parseDouble(data['weight']),
      city: data['city'] ?? '',
      district: data['district'],
      state: data['state'],
      latitude: lat,
      longitude: lng,
      lastDonationDate: _parseDateTime(data['lastDonationDate'] ?? data['lastDonation']),
      isAvailable: data['isAvailable'] ?? data['active'] ?? true,
      active: data['active'] ?? true,
      donationCount: _parseInt(data['donationCount']),
      photoUrl: data['photoUrl'],
      phone: data['phone'] ?? '',
      whatsapp: data['whatsapp'] ?? data['phone'] ?? '',
      verified: data['verified'] ?? data['isVerified'] ?? false,
      registeredAt: _parseDateTime(data['registeredAt']),
    );
  }

  static DateTime? _parseDateTime(dynamic value) {
    if (value == null) return null;
    if (value is Timestamp) return value.toDate();
    if (value is String) return DateTime.tryParse(value);
    if (value is int) return DateTime.fromMillisecondsSinceEpoch(value);
    return null;
  }

  static int _parseInt(dynamic value) {
    if (value == null) return 0;
    if (value is num) return value.toInt();
    if (value is String) return int.tryParse(value) ?? 0;
    return 0;
  }

  static double _parseDouble(dynamic value) {
    if (value == null) return 0.0;
    if (value is num) return value.toDouble();
    if (value is String) return double.tryParse(value) ?? 0.0;
    return 0.0;
  }

  static double? _parseNullableDouble(dynamic value) {
    if (value == null) return null;
    if (value is num) return value.toDouble();
    if (value is String) return double.tryParse(value);
    return null;
  }


  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'name': name,
      'bloodGroup': bloodGroup,
      'age': age,
      'gender': gender,
      'weight': weight,
      'city': city,
      'district': district,
      'state': state,
      'location': (latitude != null && longitude != null) ? GeoPoint(latitude!, longitude!) : null,
      'lastDonationDate': lastDonationDate != null ? Timestamp.fromDate(lastDonationDate!) : null,
      'isAvailable': isAvailable,
      'active': active,
      'donationCount': donationCount,
      'photoUrl': photoUrl,
      'phone': phone,
      'whatsapp': whatsapp ?? phone,
      'verified': verified,
      'registeredAt': registeredAt != null ? Timestamp.fromDate(registeredAt!) : FieldValue.serverTimestamp(),
    };
  }

  Map<String, dynamic> toCacheMap() {
    return {
      'id': id,
      'userId': userId,
      'name': name,
      'bloodGroup': bloodGroup,
      'age': age,
      'gender': gender,
      'weight': weight,
      'city': city,
      'district': district,
      'state': state,
      'location': (latitude != null && longitude != null) ? {'latitude': latitude, 'longitude': longitude} : null,
      'lastDonationDate': lastDonationDate?.toIso8601String(),
      'isAvailable': isAvailable,
      'active': active,
      'donationCount': donationCount,
      'photoUrl': photoUrl,
      'phone': phone,
      'whatsapp': whatsapp ?? phone,
      'verified': verified,
      'registeredAt': registeredAt?.toIso8601String() ?? DateTime.now().toIso8601String(),
    };
  }

  bool get isEligibleToDonate {
    if (lastDonationDate == null) return true;
    final difference = DateTime.now().difference(lastDonationDate!);
    // 90 days rule for blood donation eligibility
    return difference.inDays >= 90;
  }

  DateTime get nextEligibleDate {
    if (lastDonationDate == null) return DateTime.now();
    return lastDonationDate!.add(const Duration(days: 90));
  }
}
