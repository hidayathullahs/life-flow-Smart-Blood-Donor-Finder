import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';

class LocationService {
  /// Request GPS permissions and fetch current location.
  static Future<Position?> getCurrentLocation() async {
    final status = await Permission.location.request();
    if (status.isGranted) {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        return null;
      }
      return await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
    }
    return null;
  }

  /// Calculates the distance in kilometers between two coordinates.
  static double calculateDistanceInKm(
    double startLatitude,
    double startLongitude,
    double endLatitude,
    double endLongitude,
  ) {
    double distanceInMeters = Geolocator.distanceBetween(
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
    );
    return distanceInMeters / 1000.0;
  }
}
