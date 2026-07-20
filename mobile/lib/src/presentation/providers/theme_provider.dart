import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive/hive.dart';
import 'package:smart_blood_life/src/core/constants/app_constants.dart';

final darkModeProvider = StateNotifierProvider<DarkModeNotifier, bool>((ref) {
  return DarkModeNotifier();
});

class DarkModeNotifier extends StateNotifier<bool> {
  DarkModeNotifier() : super(false) {
    _loadTheme();
  }

  void _loadTheme() {
    final box = Hive.box(AppConstants.hiveUserBox);
    state = box.get(AppConstants.keyDarkMode, defaultValue: false) as bool;
  }

  void toggleTheme() {
    state = !state;
    final box = Hive.box(AppConstants.hiveUserBox);
    box.put(AppConstants.keyDarkMode, state);
  }
}
