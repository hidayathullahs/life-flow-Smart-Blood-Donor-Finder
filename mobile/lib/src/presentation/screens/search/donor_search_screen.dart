import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:smart_blood_life/src/core/theme/app_theme.dart';
import 'package:smart_blood_life/src/data/models/donor_model.dart';
import 'package:smart_blood_life/src/data/repositories/donor_repository.dart';
import 'package:smart_blood_life/src/presentation/widgets/bottom_nav_bar.dart';
import 'package:smart_blood_life/src/presentation/widgets/custom_components.dart';

class DonorSearchScreen extends StatefulWidget {
  const DonorSearchScreen({super.key});

  @override
  State<DonorSearchScreen> createState() => _DonorSearchScreenState();
}

class _DonorSearchScreenState extends State<DonorSearchScreen> {
  final _donorRepo = DonorRepository();
  final _citySearchController = TextEditingController();
  String _selectedBloodGroup = 'All';
  bool _verifiedOnly = false;
  bool _smartMatch = true;
  double _maxDistance = 15.0; // Slider in km

  final List<String> _bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  void _showFiltersBottomSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              decoration: BoxDecoration(
                color: isDark ? AppTheme.darkCard : Colors.white,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 50,
                      height: 5,
                      decoration: BoxDecoration(
                        color: isDark ? Colors.white24 : Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Search Filters',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, letterSpacing: -0.5),
                  ),
                  const SizedBox(height: 24),
                  
                  // Distance Slider
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Search Radius',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      Text(
                        '${_maxDistance.toInt()} km',
                        style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.bloodRed),
                      ),
                    ],
                  ),
                  Slider(
                    value: _maxDistance,
                    min: 1.0,
                    max: 50.0,
                    activeColor: AppTheme.bloodRed,
                    onChanged: (val) {
                      setModalState(() => _maxDistance = val);
                      setState(() {});
                    },
                  ),
                  const SizedBox(height: 16),
                  
                  // Verified switch
                  SwitchListTile(
                    title: const Text('Verified Donors Only', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    subtitle: const Text('Show only donors verified by medical centers'),
                    value: _verifiedOnly,
                    activeColor: AppTheme.bloodRed,
                    contentPadding: EdgeInsets.zero,
                    onChanged: (val) {
                      setModalState(() => _verifiedOnly = val);
                      setState(() {});
                    },
                  ),
                  
                  // Smart Match switch
                  SwitchListTile(
                    title: const Text('Smart Match AI', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                    subtitle: const Text('Prioritize matching donor speeds and compatibility'),
                    value: _smartMatch,
                    activeColor: AppTheme.bloodRed,
                    contentPadding: EdgeInsets.zero,
                    onChanged: (val) {
                      setModalState(() => _smartMatch = val);
                      setState(() {});
                    },
                  ),
                  
                  const SizedBox(height: 32),
                  PrimaryButton(
                    label: 'Apply Filters',
                    onPressed: () => Navigator.pop(context),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Find Blood Donors'),
      ),
      body: Stack(
        children: [
          Column(
            children: [
              // Search & Filter Header Container
              Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 20),
                decoration: BoxDecoration(
                  color: isDark ? AppTheme.darkBg : Colors.white,
                  border: Border(
                    bottom: BorderSide(
                      color: isDark ? Colors.white.withOpacity(0.05) : Colors.grey.shade100,
                      width: 1.5,
                    ),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Search box with filters button
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _citySearchController,
                            style: const TextStyle(fontSize: 15),
                            decoration: InputDecoration(
                              labelText: 'Search City',
                              prefixIcon: const Icon(Icons.location_on_outlined, size: 20, color: AppTheme.bloodRed),
                              suffixIcon: _citySearchController.text.isNotEmpty
                                  ? IconButton(
                                      icon: const Icon(Icons.clear, size: 18),
                                      onPressed: () {
                                        _citySearchController.clear();
                                        setState(() {});
                                      },
                                    )
                                  : null,
                            ),
                            onChanged: (_) => setState(() {}),
                          ),
                        ),
                        const SizedBox(width: 12),
                        IconButton(
                          icon: const Icon(Icons.tune_outlined, color: AppTheme.bloodRed),
                          style: IconButton.styleFrom(
                            backgroundColor: isDark ? AppTheme.darkCard : const Color(0xFFFFF1F2),
                            padding: const EdgeInsets.all(16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                              side: BorderSide(
                                color: isDark ? Colors.white10 : Colors.grey.shade100,
                              ),
                            ),
                          ),
                          onPressed: _showFiltersBottomSheet,
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    
                    // Blood Group selection label
                    const Padding(
                      padding: EdgeInsets.only(left: 4.0, bottom: 8.0),
                      child: Text(
                        'Select Blood Group',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                    ),
                    
                    // Horizontal scrollable blood group chips
                    SizedBox(
                      height: 40,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: _bloodGroups.length,
                        separatorBuilder: (c, i) => const SizedBox(width: 8),
                        itemBuilder: (context, index) {
                          final bg = _bloodGroups[index];
                          final isSelected = _selectedBloodGroup == bg;
                          return GestureDetector(
                            onTap: () => setState(() => _selectedBloodGroup = bg),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 150),
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              alignment: Alignment.center,
                              decoration: BoxDecoration(
                                gradient: isSelected
                                    ? const LinearGradient(
                                        colors: [AppTheme.bloodRed, AppTheme.accentRed],
                                        begin: Alignment.topLeft,
                                        end: Alignment.bottomRight,
                                      )
                                    : null,
                                color: isSelected
                                    ? null
                                    : (isDark ? AppTheme.darkCard : Colors.grey.shade100),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: isSelected
                                      ? Colors.transparent
                                      : (isDark ? Colors.white10 : Colors.transparent),
                                ),
                              ),
                              child: Text(
                                bg,
                                style: TextStyle(
                                  color: isSelected
                                      ? Colors.white
                                      : (isDark ? Colors.white70 : Colors.black87),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
              
              // Live Results matching stream
              Expanded(
                child: StreamBuilder<List<DonorModel>>(
                  stream: _donorRepo.streamActiveDonors(),
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return ListView.builder(
                        padding: const EdgeInsets.all(16.0),
                        itemCount: 4,
                        itemBuilder: (context, index) => const Padding(
                          padding: EdgeInsets.only(bottom: 16.0),
                          child: ShimmerLoading(width: double.infinity, height: 160),
                        ),
                      );
                    }
                    if (!snapshot.hasData || snapshot.data!.isEmpty) {
                      return _buildEmptyState(context);
                    }

                    // Filter list on client side
                    var filtered = snapshot.data!;
                    if (_selectedBloodGroup != 'All') {
                      filtered = filtered.where((d) => d.bloodGroup == _selectedBloodGroup).toList();
                    }
                    final queryCity = _citySearchController.text.trim().toLowerCase();
                    if (queryCity.isNotEmpty) {
                      filtered = filtered.where((d) => d.city.toLowerCase().contains(queryCity)).toList();
                    }
                    if (_verifiedOnly) {
                      filtered = filtered.where((d) => d.verified).toList();
                    }

                    if (filtered.isEmpty) {
                      return _buildEmptyState(context);
                    }

                    return Column(
                      children: [
                        // Results count banner (matches web's results header)
                        ResultsCountBanner(
                          count: filtered.length,
                          bloodGroup: _selectedBloodGroup,
                        ),
                        Expanded(
                          child: ListView.builder(
                            padding: const EdgeInsets.fromLTRB(16.0, 16.0, 16.0, 110.0),
                            itemCount: filtered.length,
                            itemBuilder: (context, index) {
                              final donor = filtered[index];
                              return DonorCardWidget(
                                name: donor.name,
                                bloodGroup: donor.bloodGroup,
                                city: donor.city,
                                verified: donor.verified,
                                age: donor.age,
                                gender: donor.gender,
                                isEligible: donor.isEligibleToDonate,
                                onCall: () {},
                                onWhatsApp: () {},
                                onTap: () => context.push('/donor/${donor.id}'),
                              );
                            },
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),
            ],
          ),
          
          // Bottom Navigation Bar
          const Align(
            alignment: Alignment.bottomCenter,
            child: AppBottomNavigationBar(currentPath: '/search'),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Padding(
      padding: const EdgeInsets.all(32.0),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(28),
              decoration: BoxDecoration(
                color: isDark ? AppTheme.darkCard : const Color(0xFFF8FAFC),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.search_off_outlined,
                size: 72,
                color: AppTheme.bloodRed,
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'No Donors Found',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Try clearing search filters or searching a different city radius.',
              textAlign: TextAlign.center,
              style: TextStyle(color: isDark ? Colors.white54 : Colors.grey.shade600, height: 1.4),
            ),
          ],
        ),
      ),
    );
  }
}
