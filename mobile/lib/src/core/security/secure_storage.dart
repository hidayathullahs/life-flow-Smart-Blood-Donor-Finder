import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:smart_blood_life/src/core/constants/app_constants.dart';

class SecureStorage {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  static Future<void> saveToken(String token) async {
    await _storage.write(key: AppConstants.keyAuthToken, value: token);
  }

  static Future<String?> getToken() async {
    return await _storage.read(key: AppConstants.keyAuthToken);
  }

  static Future<void> deleteToken() async {
    await _storage.delete(key: AppConstants.keyAuthToken);
  }

  static Future<void> setBiometricsEnabled(bool enabled) async {
    await _storage.write(key: AppConstants.keyBiometricsEnabled, value: enabled.toString());
  }

  static Future<bool> isBiometricsEnabled() async {
    final value = await _storage.read(key: AppConstants.keyBiometricsEnabled);
    return value == 'true';
  }

  static Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
