import 'package:flutter_test/flutter_test.dart';
import 'package:smart_blood_life/src/data/models/donor_model.dart';

void main() {
  group('DonorModel Tests', () {
    test('fromMap parses successfully with basic fields', () {
      final map = {
        'userId': 'user123',
        'name': 'John Doe',
        'bloodGroup': 'O+',
        'age': 30,
        'gender': 'male',
        'weight': 75.5,
        'city': 'New York',
        'phone': '1234567890',
        'isAvailable': true,
        'active': true,
        'donationCount': 2,
        'verified': true,
      };

      final donor = DonorModel.fromMap(map, id: 'doc123');

      expect(donor.id, 'doc123');
      expect(donor.userId, 'user123');
      expect(donor.name, 'John Doe');
      expect(donor.bloodGroup, 'O+');
      expect(donor.age, 30);
      expect(donor.gender, 'male');
      expect(donor.weight, 75.5);
      expect(donor.city, 'New York');
      expect(donor.phone, '1234567890');
      expect(donor.isAvailable, isTrue);
      expect(donor.active, isTrue);
      expect(donor.donationCount, 2);
      expect(donor.verified, isTrue);
    });

    test('isEligibleToDonate returns true when lastDonationDate is null', () {
      final donor = DonorModel(
        id: '1',
        userId: '1',
        name: 'Donor',
        bloodGroup: 'A+',
        age: 25,
        gender: 'female',
        weight: 60.0,
        city: 'Boston',
        phone: '9876543210',
        lastDonationDate: null,
      );

      expect(donor.isEligibleToDonate, isTrue);
    });

    test('isEligibleToDonate returns false when lastDonationDate is less than 90 days ago', () {
      final recentDate = DateTime.now().subtract(const Duration(days: 45));
      final donor = DonorModel(
        id: '1',
        userId: '1',
        name: 'Donor',
        bloodGroup: 'A+',
        age: 25,
        gender: 'female',
        weight: 60.0,
        city: 'Boston',
        phone: '9876543210',
        lastDonationDate: recentDate,
      );

      expect(donor.isEligibleToDonate, isFalse);
    });

    test('isEligibleToDonate returns true when lastDonationDate is 90 or more days ago', () {
      final eligibleDate = DateTime.now().subtract(const Duration(days: 91));
      final donor = DonorModel(
        id: '1',
        userId: '1',
        name: 'Donor',
        bloodGroup: 'A+',
        age: 25,
        gender: 'female',
        weight: 60.0,
        city: 'Boston',
        phone: '9876543210',
        lastDonationDate: eligibleDate,
      );

      expect(donor.isEligibleToDonate, isTrue);
    });

    test('nextEligibleDate is exactly 90 days after lastDonationDate', () {
      final lastDonation = DateTime(2026, 1, 1);
      final donor = DonorModel(
        id: '1',
        userId: '1',
        name: 'Donor',
        bloodGroup: 'B-',
        age: 28,
        gender: 'male',
        weight: 70.0,
        city: 'Chicago',
        phone: '1122334455',
        lastDonationDate: lastDonation,
      );

      final expectedDate = lastDonation.add(const Duration(days: 90));
      expect(donor.nextEligibleDate, expectedDate);
    });
  });
}
