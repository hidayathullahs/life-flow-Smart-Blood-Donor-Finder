import 'package:cloud_firestore/cloud_firestore.dart';

class UserModel {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String role; // 'donor', 'verified_donor', 'hospital', 'admin', 'super_admin'
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final DateTime? lastLogin;
  final String? photoUrl;
  final String? bloodGroup;
  final bool verified;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.role,
    this.createdAt,
    this.updatedAt,
    this.lastLogin,
    this.photoUrl,
    this.bloodGroup,
    this.verified = false,
  });

  factory UserModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>? ?? {};
    return UserModel(
      id: doc.id,
      name: data['name'] ?? '',
      email: data['email'] ?? '',
      phone: data['phone'] ?? '',
      role: data['role'] ?? 'donor',
      createdAt: (data['createdAt'] as Timestamp?)?.toDate(),
      updatedAt: (data['updatedAt'] as Timestamp?)?.toDate(),
      lastLogin: (data['lastLogin'] as Timestamp?)?.toDate(),
      photoUrl: data['photoUrl'],
      bloodGroup: data['bloodGroup'],
      verified: data['verified'] ?? false,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'email': email,
      'phone': phone,
      'role': role,
      'createdAt': createdAt != null ? Timestamp.fromDate(createdAt!) : FieldValue.serverTimestamp(),
      'updatedAt': updatedAt != null ? Timestamp.fromDate(updatedAt!) : FieldValue.serverTimestamp(),
      'lastLogin': lastLogin != null ? Timestamp.fromDate(lastLogin!) : FieldValue.serverTimestamp(),
      'photoUrl': photoUrl,
      'bloodGroup': bloodGroup,
      'verified': verified,
    };
  }
}
