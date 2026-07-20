import 'package:flutter/material.dart';
import 'package:smart_blood_life/src/core/theme/app_theme.dart';

class BloodBankPanelScreen extends StatefulWidget {
  const BloodBankPanelScreen({super.key});

  @override
  State<BloodBankPanelScreen> createState() => _BloodBankPanelScreenState();
}

class _BloodBankPanelScreenState extends State<BloodBankPanelScreen> {
  // Blood group inventory stock
  final Map<String, int> _inventory = {
    'A+': 12,
    'A-': 4,
    'B+': 18,
    'B-': 6,
    'AB+': 8,
    'AB-': 2,
    'O+': 24,
    'O-': 5,
  };

  void _updateStock(String bloodGroup, int delta) {
    setState(() {
      final current = _inventory[bloodGroup] ?? 0;
      final updated = current + delta;
      if (updated >= 0) {
        _inventory[bloodGroup] = updated;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final list = _inventory.entries.toList();
    return Scaffold(
      appBar: AppBar(
        title: const Text('Blood Bank Inventory'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16.0),
        itemCount: list.length,
        itemBuilder: (context, index) {
          final item = list[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12.0),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: AppTheme.bloodRed,
                foregroundColor: Colors.white,
                child: Text(item.key, style: const TextStyle(fontWeight: FontWeight.bold)),
              ),
              title: Text('Stock Available: ${item.value} Units'),
              subtitle: Text(item.value < 5 ? '⚠️ Low Stock Level' : '✅ Stable Stock Level',
                  style: TextStyle(color: item.value < 5 ? Colors.orange : Colors.green, fontSize: 12)),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    icon: const Icon(Icons.remove_circle_outline, color: AppTheme.bloodRed),
                    onPressed: () => _updateStock(item.key, -1),
                  ),
                  IconButton(
                    icon: const Icon(Icons.add_circle_outline, color: Colors.green),
                    onPressed: () => _updateStock(item.key, 1),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
