import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:smart_blood_life/src/core/theme/app_theme.dart';
import 'package:smart_blood_life/src/data/models/emergency_model.dart';
import 'package:smart_blood_life/src/data/repositories/emergency_repository.dart';
import 'package:smart_blood_life/src/presentation/widgets/custom_components.dart';

class CreateEmergencyRequestScreen extends StatefulWidget {
  const CreateEmergencyRequestScreen({super.key});

  @override
  State<CreateEmergencyRequestScreen> createState() => _CreateEmergencyRequestScreenState();
}

class _CreateEmergencyRequestScreenState extends State<CreateEmergencyRequestScreen> {
  final _formKey = GlobalKey<FormState>();
  final _hospitalController = TextEditingController();
  final _patientNameController = TextEditingController();
  final _unitsController = TextEditingController(text: '1');
  final _cityController = TextEditingController();
  final _contactNameController = TextEditingController();
  final _contactPhoneController = TextEditingController();
  final _notesController = TextEditingController();

  String _selectedBloodGroup = 'O+';
  String _selectedUrgency = 'urgent';
  bool _isLoading = false;
  int _currentStep = 0; // 3 steps: 0, 1, 2

  final List<String> _bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  final List<Map<String, String>> _urgencies = [
    {'value': 'critical', 'label': 'Critical (Immediate)'},
    {'value': 'urgent', 'label': 'Urgent (Within 24h)'},
    {'value': 'standard', 'label': 'Standard (A few days)'},
  ];

  void _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    try {
      final user = FirebaseAuth.instance.currentUser;
      final repo = EmergencyRepository();

      final newRequest = EmergencyModel(
        id: '',
        bloodGroup: _selectedBloodGroup,
        unitsNeeded: int.tryParse(_unitsController.text) ?? 1,
        hospital: _hospitalController.text.trim(),
        city: _cityController.text.trim(),
        contactName: _contactNameController.text.trim(),
        contactPhone: _contactPhoneController.text.trim(),
        urgency: _selectedUrgency,
        notes: _notesController.text.trim(),
        patientName: _patientNameController.text.trim(),
        status: 'active',
        active: true,
        createdBy: user?.uid ?? 'guest',
        notifiedDonors: [],
      );

      await repo.createEmergency(newRequest);

      if (mounted) {
        // Show a premium Success Modal
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) {
            final isDark = Theme.of(context).brightness == Brightness.dark;
            return Dialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
              backgroundColor: isDark ? AppTheme.darkCard : Colors.white,
              child: Padding(
                padding: const EdgeInsets.all(28.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: const BoxDecoration(
                        color: Color(0xFFE8F5E9),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.check_circle,
                        color: AppTheme.successGreen,
                        size: 64,
                      ),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Emergency Broadcasted',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, letterSpacing: -0.5),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'All compatible donors within search range have been notified instantly. Keep your phone line active.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey, height: 1.4, fontSize: 13),
                    ),
                    const SizedBox(height: 28),
                    PrimaryButton(
                      label: 'Back to Home',
                      onPressed: () {
                        Navigator.pop(context); // Pop dialog
                        context.pop(); // Pop screen
                      },
                    ),
                  ],
                ),
              ),
            );
          },
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString()), backgroundColor: Colors.redAccent),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _nextStep() {
    if (_currentStep == 0) {
      if (_patientNameController.text.trim().isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please enter patient name'), backgroundColor: AppTheme.bloodRed),
        );
        return;
      }
      setState(() => _currentStep = 1);
    } else if (_currentStep == 1) {
      if (_hospitalController.text.trim().isEmpty || _cityController.text.trim().isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please fill hospital and city details'), backgroundColor: AppTheme.bloodRed),
        );
        return;
      }
      setState(() => _currentStep = 2);
    }
  }

  void _previousStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('SOS Request Broadcast'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Wizard Progress Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Step ${_currentStep + 1} of 3',
                    style: const TextStyle(fontWeight: FontWeight.w900, color: AppTheme.bloodRed, fontSize: 13),
                  ),
                  Text(
                    _currentStep == 0 
                      ? 'Patient Profile' 
                      : (_currentStep == 1 ? 'Location & Urgency' : 'Contact Info'),
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              
              // Custom Progress Bar
              Container(
                height: 6,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: isDark ? Colors.white10 : Colors.grey.shade200,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    Expanded(
                      flex: _currentStep + 1,
                      child: Container(
                        decoration: BoxDecoration(
                          color: AppTheme.bloodRed,
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ),
                    Expanded(
                      flex: 3 - (_currentStep + 1),
                      child: const SizedBox(),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),
              
              // Step-based Wizard Content
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 250),
                child: _buildStepContent(isDark),
              ),
              
              const SizedBox(height: 36),
              
              // Button Controls
              Row(
                children: [
                  if (_currentStep > 0) ...[
                    Expanded(
                      child: OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          minimumSize: const Size(double.infinity, 54),
                          side: BorderSide(color: isDark ? Colors.white24 : Colors.grey.shade300, width: 1.5),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        onPressed: _previousStep,
                        child: Text(
                          'Back',
                          style: TextStyle(color: isDark ? Colors.white : Colors.black87, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                  ],
                  Expanded(
                    child: _currentStep < 2
                      ? PrimaryButton(
                          label: 'Continue',
                          onPressed: _nextStep,
                        )
                      : PrimaryButton(
                          label: 'Broadcast SOS',
                          onPressed: _handleSubmit,
                          isLoading: _isLoading,
                        ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStepContent(bool isDark) {
    switch (_currentStep) {
      case 0:
        return Container(
          key: const ValueKey(0),
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: isDark ? AppTheme.darkCard : Colors.white,
            borderRadius: BorderRadius.circular(28),
            border: Border.all(
              color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.grey.shade100,
              width: 1.5,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Who needs blood?',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, letterSpacing: -0.5),
              ),
              const SizedBox(height: 20),
              TextFormField(
                controller: _patientNameController,
                decoration: const InputDecoration(
                  labelText: 'Patient Name',
                  prefixIcon: Icon(Icons.person_outline, size: 20),
                ),
                validator: (val) => val == null || val.isEmpty ? 'Enter patient name' : null,
              ),
              const SizedBox(height: 20),
              DropdownButtonFormField<String>(
                initialValue: _selectedBloodGroup,
                decoration: const InputDecoration(
                  labelText: 'Required Blood Group',
                  prefixIcon: Icon(Icons.water_drop_outlined, size: 20, color: AppTheme.bloodRed),
                ),
                items: _bloodGroups.map((bg) => DropdownMenuItem(value: bg, child: Text(bg))).toList(),
                onChanged: (val) => setState(() => _selectedBloodGroup = val!),
              ),
              const SizedBox(height: 20),
              TextFormField(
                controller: _unitsController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Units Required',
                  prefixIcon: Icon(Icons.onetwothree, size: 20),
                ),
                validator: (val) => val == null || val.isEmpty ? 'Enter units' : null,
              ),
            ],
          ),
        );
      case 1:
        return Container(
          key: const ValueKey(1),
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: isDark ? AppTheme.darkCard : Colors.white,
            borderRadius: BorderRadius.circular(28),
            border: Border.all(
              color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.grey.shade100,
              width: 1.5,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Hospital Location & Urgency',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, letterSpacing: -0.5),
              ),
              const SizedBox(height: 20),
              TextFormField(
                controller: _hospitalController,
                decoration: const InputDecoration(
                  labelText: 'Hospital Name',
                  prefixIcon: Icon(Icons.local_hospital_outlined, size: 20),
                ),
                validator: (val) => val == null || val.isEmpty ? 'Enter hospital name' : null,
              ),
              const SizedBox(height: 20),
              TextFormField(
                controller: _cityController,
                decoration: const InputDecoration(
                  labelText: 'City',
                  prefixIcon: Icon(Icons.location_city_outlined, size: 20),
                ),
                validator: (val) => val == null || val.isEmpty ? 'Enter city' : null,
              ),
              const SizedBox(height: 20),
              DropdownButtonFormField<String>(
                initialValue: _selectedUrgency,
                decoration: const InputDecoration(
                  labelText: 'Urgency Level',
                  prefixIcon: Icon(Icons.priority_high, size: 20),
                ),
                items: _urgencies.map((u) => DropdownMenuItem(value: u['value'], child: Text(u['label']!))).toList(),
                onChanged: (val) => setState(() => _selectedUrgency = val!),
              ),
            ],
          ),
        );
      case 2:
        return Container(
          key: const ValueKey(2),
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: isDark ? AppTheme.darkCard : Colors.white,
            borderRadius: BorderRadius.circular(28),
            border: Border.all(
              color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.grey.shade100,
              width: 1.5,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Point of Contact Details',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, letterSpacing: -0.5),
              ),
              const SizedBox(height: 20),
              TextFormField(
                controller: _contactNameController,
                decoration: const InputDecoration(
                  labelText: 'Contact Name',
                  prefixIcon: Icon(Icons.person_pin_outlined, size: 20),
                ),
                validator: (val) => val == null || val.isEmpty ? 'Enter contact name' : null,
              ),
              const SizedBox(height: 20),
              TextFormField(
                controller: _contactPhoneController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: 'Contact Phone Number',
                  prefixIcon: Icon(Icons.phone_outlined, size: 20),
                ),
                validator: (val) => val == null || val.isEmpty ? 'Enter contact phone' : null,
              ),
              const SizedBox(height: 20),
              TextFormField(
                controller: _notesController,
                maxLines: 3,
                decoration: const InputDecoration(
                  labelText: 'Special Notes / Instructions',
                  alignLabelWithHint: true,
                ),
              ),
            ],
          ),
        );
      default:
        return const SizedBox();
    }
  }
}
