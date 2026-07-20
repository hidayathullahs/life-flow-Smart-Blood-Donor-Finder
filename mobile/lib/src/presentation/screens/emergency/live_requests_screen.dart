import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:smart_blood_life/src/core/theme/app_theme.dart';
import 'package:smart_blood_life/src/data/models/emergency_model.dart';
import 'package:smart_blood_life/src/data/repositories/emergency_repository.dart';
import 'package:smart_blood_life/src/presentation/widgets/custom_components.dart';
import 'package:url_launcher/url_launcher.dart';

class LiveRequestsScreen extends StatefulWidget {
  const LiveRequestsScreen({super.key});

  @override
  State<LiveRequestsScreen> createState() => _LiveRequestsScreenState();
}

class _LiveRequestsScreenState extends State<LiveRequestsScreen> {
  final _emergencyRepo = EmergencyRepository();
  bool _showMap = false;

  // Chennai Coordinates Default
  static const LatLng _defaultCenter = LatLng(13.0827, 80.2707);

  void _callRequestPhone(String phone) async {
    final uri = Uri.parse('tel:$phone');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Live SOS Broadcasts'),
        actions: [
          IconButton(
            icon: Icon(_showMap ? Icons.view_headline_outlined : Icons.map_outlined),
            style: IconButton.styleFrom(
              backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: BorderSide(color: isDark ? Colors.white10 : Colors.grey.shade100),
              ),
            ),
            onPressed: () => setState(() => _showMap = !_showMap),
          ),
          const SizedBox(width: 12),
        ],
      ),
      body: StreamBuilder<List<EmergencyModel>>(
        stream: _emergencyRepo.streamActiveEmergencies(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: AppTheme.bloodRed));
          }
          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(28),
                    decoration: BoxDecoration(
                      color: isDark ? AppTheme.darkCard : const Color(0xFFF8FAFC),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.favorite_border, size: 72, color: AppTheme.bloodRed),
                  ),
                  const SizedBox(height: 24),
                  const Text('No Active Emergencies', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  const Text('Currently, there are no active blood requests.', style: TextStyle(color: Colors.grey)),
                ],
              ),
            );
          }

          final list = snapshot.data!;

          if (_showMap) {
            return GoogleMap(
              initialCameraPosition: const CameraPosition(
                target: _defaultCenter,
                zoom: 11,
              ),
              style: isDark ? '[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]}]' : null,
              markers: list.map((req) {
                final offsetIndex = list.indexOf(req);
                final lat = 13.0827 + (offsetIndex * 0.012);
                final lng = 80.2707 - (offsetIndex * 0.008);
                
                return Marker(
                  markerId: MarkerId(req.id),
                  position: LatLng(lat, lng),
                  infoWindow: InfoWindow(
                    title: '${req.bloodGroup} Needed',
                    snippet: '${req.unitsNeeded} Units @ ${req.hospital}',
                  ),
                  icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRed),
                );
              }).toSet(),
            );
          }

          // Otherwise show List View with Realtime Counters & Timelines
          return Column(
            children: [
              // Real-time status header banner
              Container(
                width: double.infinity,
                margin: const EdgeInsets.fromLTRB(16, 12, 16, 8),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E1014) : const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: AppTheme.bloodRed.withValues(alpha: 0.15),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.radio_button_checked, color: AppTheme.bloodRed, size: 18),
                    const SizedBox(width: 12),
                    Text(
                      'Monitoring ${list.length} active emergency broadcasts in real-time',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.bloodRed,
                      ),
                    ),
                  ],
                ),
              ),
              
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                  itemCount: list.length,
                  itemBuilder: (context, index) {
                    final req = list[index];
                    final isHighUrgency = req.urgency.toLowerCase() == 'high' || req.urgency.toLowerCase() == 'critical';
                    
                    return Container(
                      margin: const EdgeInsets.only(bottom: 16.0),
                      decoration: BoxDecoration(
                        color: isDark ? AppTheme.darkCard : Colors.white,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(
                          color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.grey.shade100,
                          width: 1.5,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.02),
                            blurRadius: 12,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    BloodGroupBadge(bloodGroup: req.bloodGroup, size: 48),
                                    const SizedBox(width: 12),
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          '${req.unitsNeeded} Units Needed',
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 16,
                                            letterSpacing: -0.3,
                                          ),
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          req.hospital,
                                          style: TextStyle(
                                            color: isDark ? Colors.white60 : Colors.black54,
                                            fontSize: 13,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: isHighUrgency 
                                      ? AppTheme.bloodRed.withValues(alpha: 0.1) 
                                      : AppTheme.warningOrange.withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    req.urgency.toUpperCase(),
                                    style: TextStyle(
                                      color: isHighUrgency ? AppTheme.bloodRed : AppTheme.warningOrange,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 11,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            if (req.patientName.isNotEmpty) ...[
                              Row(
                                children: [
                                  Icon(Icons.person_outline, size: 16, color: isDark ? Colors.white38 : Colors.grey),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Patient: ${req.patientName}',
                                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                            ],
                            
                            // Real-time Acceptance Tracker Simulation
                            Row(
                              children: [
                                Icon(Icons.volunteer_activism_outlined, size: 16, color: isDark ? Colors.white38 : Colors.grey),
                                const SizedBox(width: 8),
                                Text(
                                  '2 donors responding to this broadcast',
                                  style: TextStyle(
                                    fontSize: 12, 
                                    fontWeight: FontWeight.bold, 
                                    color: isDark ? Colors.white70 : Colors.grey.shade700,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            
                            if (req.notes.isNotEmpty) ...[
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: isDark ? const Color(0xFF0F1E33) : Colors.grey.shade50,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  req.notes,
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: isDark ? Colors.white70 : Colors.black87,
                                    height: 1.4,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 16),
                            ],
                            Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                TextButton.icon(
                                  onPressed: () => _callRequestPhone(req.contactPhone),
                                  icon: const Icon(Icons.phone, color: AppTheme.secondaryBlue, size: 18),
                                  label: const Text(
                                    'Call Contact',
                                    style: TextStyle(color: AppTheme.secondaryBlue, fontWeight: FontWeight.bold),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                ElevatedButton.icon(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppTheme.bloodRed,
                                    foregroundColor: Colors.white,
                                    minimumSize: const Size(120, 42),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    elevation: 0,
                                  ),
                                  onPressed: () {
                                    _emergencyRepo.recordDonorResponse(req.id, 'user', 'accepted');
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text('Thank you! You registered response to this request.'),
                                        backgroundColor: Colors.green,
                                      ),
                                    );
                                  },
                                  icon: const Icon(Icons.check, size: 16),
                                  label: const Text(
                                    'Donate Now',
                                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
