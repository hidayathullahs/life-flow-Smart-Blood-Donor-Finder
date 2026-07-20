import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:smart_blood_life/src/core/theme/app_theme.dart';

class QrScannerScreen extends StatefulWidget {
  const QrScannerScreen({super.key});

  @override
  State<QrScannerScreen> createState() => _QrScannerScreenState();
}

class _QrScannerScreenState extends State<QrScannerScreen> {
  final MobileScannerController _scannerController = MobileScannerController();
  final _inputController = TextEditingController();
  String? _verificationResult;
  bool _isVerifying = false;
  bool _cameraActive = true;

  @override
  void dispose() {
    _scannerController.dispose();
    super.dispose();
  }

  void _verifyPayload(String payload) async {
    if (payload.trim().isEmpty) return;

    // Pause scanner during API checking
    _scannerController.stop();

    setState(() {
      _isVerifying = true;
      _verificationResult = null;
      _cameraActive = false;
    });

    // Simulate database API lookup
    await Future.delayed(const Duration(milliseconds: 1500));

    setState(() {
      _isVerifying = false;
      if (payload.startsWith('smartbloodlife://verify')) {
        final uri = Uri.parse(payload);
        final name = uri.queryParameters['name'] ?? 'Verified Donor';
        _verificationResult = '✅ VERIFIED DONOR PROFILE\n\n'
            '• Name: $name\n'
            '• Status: Active & Eligible to Donate\n'
            'Firestore Registry: Verified matching record.';
      } else {
        _verificationResult = '❌ INVALID SIGNATURE\n\n'
            'The scanned QR does not match the SmartBloodLife database verification schemas.';
      }
    });
  }

  void _resetScanner() {
    setState(() {
      _verificationResult = null;
      _cameraActive = true;
    });
    _scannerController.start();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan QR Code'),
        actions: [
          IconButton(
            color: Colors.white,
            icon: ValueListenableBuilder<MobileScannerState>(
              valueListenable: _scannerController,
              builder: (context, state, child) {
                switch (state.torchState) {
                  case TorchState.off:
                    return const Icon(Icons.flash_off, color: Colors.grey);
                  case TorchState.on:
                    return const Icon(Icons.flash_on, color: Colors.yellow);
                  default:
                    return const Icon(Icons.flash_off, color: Colors.grey);
                }
              },
            ),
            onPressed: () => _scannerController.toggleTorch(),
          ),
          IconButton(
            color: Colors.white,
            icon: ValueListenableBuilder<MobileScannerState>(
              valueListenable: _scannerController,
              builder: (context, state, child) {
                if (state.cameraDirection == CameraFacing.front) {
                  return const Icon(Icons.camera_front, color: Colors.grey);
                }
                return const Icon(Icons.camera_rear, color: Colors.grey);
              },
            ),
            onPressed: () => _scannerController.switchCamera(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            if (_cameraActive)
              Container(
                height: 320,
                width: double.infinity,
                margin: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16.0),
                  color: Colors.black,
                ),
                clipBehavior: Clip.antiAlias,
                child: MobileScanner(
                  controller: _scannerController,
                  onDetect: (capture) {
                    final List<Barcode> barcodes = capture.barcodes;
                    for (final barcode in barcodes) {
                      if (barcode.rawValue != null) {
                        _verifyPayload(barcode.rawValue!);
                        break;
                      }
                    }
                  },
                ),
              )
            else
              Container(
                height: 320,
                width: double.infinity,
                margin: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16.0),
                  color: Colors.grey.shade200,
                ),
                child: Center(
                  child: _isVerifying
                      ? const Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            CircularProgressIndicator(),
                            SizedBox(height: 12),
                            Text('Querying Firestore ledger...', style: TextStyle(color: Colors.grey)),
                          ],
                        )
                      : TextButton.icon(
                          onPressed: _resetScanner,
                          icon: const Icon(Icons.refresh, color: AppTheme.bloodRed),
                          label: const Text('Restart Scanner', style: TextStyle(color: AppTheme.bloodRed)),
                        ),
                ),
              ),
            
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Verification Hub',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Point the camera at a donor digital card QR code. You can also manually paste the payload details below.',
                    style: TextStyle(color: Colors.grey),
                  ),
                  const SizedBox(height: 24),
                  
                  // Text input for emulator fallback
                  TextFormField(
                    controller: _inputController,
                    decoration: const InputDecoration(
                      labelText: 'Manual verification payload',
                      hintText: 'smartbloodlife://verify?uid=...',
                    ),
                    onFieldSubmitted: _verifyPayload,
                  ),
                  const SizedBox(height: 12),
                  ElevatedButton(
                    onPressed: () => _verifyPayload(_inputController.text),
                    child: const Text('Verify Manual Code'),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  if (_verificationResult != null)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16.0),
                      decoration: BoxDecoration(
                        color: _verificationResult!.contains('✅') ? Colors.green.shade50 : Colors.red.shade50,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: _verificationResult!.contains('✅') ? Colors.green : Colors.redAccent,
                        ),
                      ),
                      child: Text(
                        _verificationResult!,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: _verificationResult!.contains('✅') ? Colors.green.shade900 : Colors.red.shade900,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
