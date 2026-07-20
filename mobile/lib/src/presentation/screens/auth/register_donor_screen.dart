import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:smart_blood_life/src/core/theme/app_theme.dart';
import 'package:smart_blood_life/src/data/models/donor_model.dart';
import 'package:smart_blood_life/src/data/repositories/auth_repository.dart';
import 'package:smart_blood_life/src/data/repositories/donor_repository.dart';
import 'package:smart_blood_life/src/core/utils/location_service.dart';
import 'package:smart_blood_life/src/presentation/widgets/custom_components.dart';

class RegisterDonorScreen extends StatefulWidget {
  const RegisterDonorScreen({super.key});

  @override
  State<RegisterDonorScreen> createState() => _RegisterDonorScreenState();
}

class _RegisterDonorScreenState extends State<RegisterDonorScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _ageController = TextEditingController();
  final _weightController = TextEditingController();
  final _cityController = TextEditingController();

  String _selectedBloodGroup = 'O+';
  String _selectedGender = 'Male';
  double? _latitude;
  double? _longitude;
  bool _isLoading = false;
  bool _isLocating = false;

  final List<String> _bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  final List<String> _genders = ['Male', 'Female', 'Other'];

  // Medical questionnaire
  bool _isEligibleChecked = false;
  bool _hasDiseases = false;

  void _getCurrentGPSLocation() async {
    setState(() => _isLocating = true);
    try {
      final pos = await LocationService.getCurrentLocation();
      if (pos != null) {
        setState(() {
          _latitude = pos.latitude;
          _longitude = pos.longitude;
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('GPS Coordinates fetched successfully.')),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to fetch GPS coordinates. Please check location permissions.')),
          );
        }
      }
    } catch (e) {
      debugPrint('GPS fetch error: $e');
    } finally {
      setState(() => _isLocating = false);
    }
  }

  void _handleRegistration() async {
    if (!_formKey.currentState!.validate()) return;
    if (!_isEligibleChecked) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('You must confirm you meet the donor criteria.')),
      );
      return;
    }
    if (_hasDiseases) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('You must meet health conditions to register as a donor.')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final authRepo = AuthRepository();
      final donorRepo = DonorRepository();

      // Create Authentication User
      final userCred = await authRepo.signUpWithEmail(
        _nameController.text.trim(),
        _emailController.text.trim(),
        _passwordController.text.trim(),
        _phoneController.text.trim(),
        _selectedBloodGroup,
      );

      // Create Donor Profile
      final newDonor = DonorModel(
        id: '',
        userId: userCred.user!.uid,
        name: _nameController.text.trim(),
        bloodGroup: _selectedBloodGroup,
        age: int.tryParse(_ageController.text) ?? 18,
        gender: _selectedGender,
        weight: double.tryParse(_weightController.text) ?? 50.0,
        city: _cityController.text.trim(),
        latitude: _latitude,
        longitude: _longitude,
        phone: _phoneController.text.trim(),
        whatsapp: _phoneController.text.trim(),
        isAvailable: true,
        active: true,
        verified: false, // Wait for admin approval
      );

      await donorRepo.registerDonor(newDonor);

      if (mounted) {
        context.go('/home');
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

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Become a Donor'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Create Your Profile',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Enter your details below to join the verified donor network.',
                style: TextStyle(color: isDark ? Colors.white54 : Colors.black54),
              ),
              const SizedBox(height: 28),
              
              // Personal Information Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: isDark ? AppTheme.darkCard : Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.grey.shade100,
                    width: 1.5,
                  ),
                ),
                child: Column(
                  children: [
                    TextFormField(
                      controller: _nameController,
                      decoration: const InputDecoration(
                        labelText: 'Full Name',
                        prefixIcon: Icon(Icons.person_outline, size: 20),
                      ),
                      validator: (val) => val == null || val.isEmpty ? 'Enter name' : null,
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(
                        labelText: 'Email Address',
                        prefixIcon: Icon(Icons.email_outlined, size: 20),
                      ),
                      validator: (val) => val == null || val.isEmpty ? 'Enter email' : null,
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _phoneController,
                      keyboardType: TextInputType.phone,
                      decoration: const InputDecoration(
                        labelText: 'Phone Number',
                        prefixIcon: Icon(Icons.phone_outlined, size: 20),
                      ),
                      validator: (val) => val == null || val.isEmpty ? 'Enter phone number' : null,
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _passwordController,
                      obscureText: true,
                      decoration: const InputDecoration(
                        labelText: 'Password',
                        prefixIcon: Icon(Icons.lock_outline, size: 20),
                      ),
                      validator: (val) => val == null || val.length < 6 ? 'Password must be 6+ characters' : null,
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 20),
              
              // Medical Information Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: isDark ? AppTheme.darkCard : Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.grey.shade100,
                    width: 1.5,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Medical Details',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            initialValue: _selectedBloodGroup,
                            decoration: const InputDecoration(labelText: 'Blood Group'),
                            items: _bloodGroups.map((bg) => DropdownMenuItem(value: bg, child: Text(bg))).toList(),
                            onChanged: (val) => setState(() => _selectedBloodGroup = val!),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: DropdownButtonFormField<String>(
                            initialValue: _selectedGender,
                            decoration: const InputDecoration(labelText: 'Gender'),
                            items: _genders.map((g) => DropdownMenuItem(value: g, child: Text(g))).toList(),
                            onChanged: (val) => setState(() => _selectedGender = val!),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: _ageController,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'Age'),
                            validator: (val) => val == null || val.isEmpty ? 'Enter age' : null,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: TextFormField(
                            controller: _weightController,
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'Weight (kg)'),
                            validator: (val) => val == null || val.isEmpty ? 'Enter weight' : null,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 20),
              
              // Location Information Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: isDark ? AppTheme.darkCard : Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.grey.shade100,
                    width: 1.5,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Location & GPS',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _cityController,
                      decoration: const InputDecoration(
                        labelText: 'City',
                        prefixIcon: Icon(Icons.location_city_outlined, size: 20),
                      ),
                      validator: (val) => val == null || val.isEmpty ? 'Enter city' : null,
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            _latitude != null && _longitude != null
                                ? 'GPS Linked: ${_latitude!.toStringAsFixed(4)}, ${_longitude!.toStringAsFixed(4)}'
                                : 'Link your location to show up on the emergency live map.',
                            style: TextStyle(color: isDark ? Colors.white54 : Colors.grey.shade600, fontSize: 13),
                          ),
                        ),
                        const SizedBox(width: 12),
                        _isLocating
                            ? const SizedBox(
                                width: 24,
                                height: 24,
                                child: CircularProgressIndicator(strokeWidth: 2.5),
                              )
                            : TextButton.icon(
                                onPressed: _getCurrentGPSLocation,
                                icon: const Icon(Icons.my_location, color: AppTheme.bloodRed, size: 18),
                                label: const Text('Fetch', style: TextStyle(color: AppTheme.bloodRed, fontWeight: FontWeight.bold)),
                              ),
                      ],
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 20),
              
              // Medical questionnaire
              Container(
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
                decoration: BoxDecoration(
                  color: isDark ? AppTheme.darkCard : Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.grey.shade100,
                    width: 1.5,
                  ),
                ),
                child: Column(
                  children: [
                    CheckboxListTile(
                      value: _isEligibleChecked,
                      controlAffinity: ListTileControlAffinity.leading,
                      activeColor: AppTheme.bloodRed,
                      title: const Text('I confirm that I am between 18-65 years of age, weigh at least 45kg, and have not donated blood in the past 90 days.', style: TextStyle(fontSize: 13)),
                      onChanged: (val) => setState(() => _isEligibleChecked = val!),
                    ),
                    CheckboxListTile(
                      value: _hasDiseases,
                      controlAffinity: ListTileControlAffinity.leading,
                      activeColor: AppTheme.bloodRed,
                      title: const Text('I have a history of diabetes, hepatitis, hypertension or cardiovascular ailments.', style: TextStyle(fontSize: 13)),
                      onChanged: (val) => setState(() => _hasDiseases = val!),
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 32),
              
              PrimaryButton(
                label: 'Register & Save Profile',
                onPressed: _handleRegistration,
                isLoading: _isLoading,
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
