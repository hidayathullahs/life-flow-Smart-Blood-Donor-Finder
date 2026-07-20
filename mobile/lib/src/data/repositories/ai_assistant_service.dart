import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:smart_blood_life/src/data/models/donor_model.dart';
import 'package:smart_blood_life/src/data/repositories/donor_repository.dart';

class AiAssistantService {
  final DonorRepository _donorRepository = DonorRepository();

  // API key injected at build time via: flutter run --dart-define=GEMINI_API_KEY=your_key
  // Falls back to empty string, which triggers local offline matching
  static const String _apiKey = String.fromEnvironment('GEMINI_API_KEY', defaultValue: '');

  Future<String> processQuery(String queryText) async {
    // 1. Fetch live active donors from Firestore to use as context
    List<DonorModel> activeDonors;
    try {
      activeDonors = await _donorRepository.getAllActiveDonors();
    } catch (e) {
      activeDonors = [];
    }

    // 2. Prepare context list of donors
    final donorContext = activeDonors.map((d) =>
      '- Name: ${d.name}, Blood Group: ${d.bloodGroup}, City: ${d.city}, Verified: ${d.verified}, Eligible: ${d.isEligibleToDonate}'
    ).join('\n');

    // 3. Use Gemini if API key is provided, else use local fallback
    if (_apiKey.isEmpty) {
      return _localMatchingFallback(queryText, activeDonors);
    }

    // 3. Query Gemini Model
    try {
      final model = GenerativeModel(
        model: 'gemini-1.5-flash',
        apiKey: _apiKey,
      );

      final prompt = '''
You are the SmartBloodLife AI Matcher Assistant. Your task is to match blood requests with verified, eligible donors in the area.
Here is the live donor registry context from the Firestore database:
$donorContext

User Query: "$queryText"

Instructions:
1. Parse the user request to identify the required Blood Group and Location/City.
2. Search the live registry provided above for matching donors.
3. Prioritize:
   - Verified donors (Verified: true).
   - Eligible donors (Eligible: true).
4. If matching donors are found, return a professional clinical summary listing their name, blood group, city, verification status, and contact phone number.
5. If no matches are found, politely inform them of the request details (group and city) and suggest broadcasting an SOS emergency request.
6. Keep the tone professional, helpful, and concise. Use clean markdown.
''';

      final content = [Content.text(prompt)];
      final response = await model.generateContent(content);
      return response.text ?? 'Sorry, I generated an empty response.';
    } catch (e) {
      // Fallback to local matching if API call fails
      return _localMatchingFallback(queryText, activeDonors);
    }
  }

  String _localMatchingFallback(String queryText, List<DonorModel> activeDonors) {
    final query = queryText.toLowerCase().trim();
    final bloodGroups = ['o+', 'o-', 'a+', 'a-', 'b+', 'b-', 'ab+', 'ab-'];
    String? detectedGroup;
    for (var bg in bloodGroups) {
      if (query.contains(bg) || query.contains(bg.replaceAll('+', ' positive').replaceAll('-', ' negative'))) {
        detectedGroup = bg.toUpperCase();
        break;
      }
    }

    final cities = ['chennai', 'mumbai', 'delhi', 'bangalore', 'hyderabad', 'kolkata', 'pune'];
    String? detectedCity;
    for (var city in cities) {
      if (query.contains(city)) {
        detectedCity = city;
        break;
      }
    }

    if (detectedGroup != null && detectedCity != null) {
      final matches = activeDonors.where((d) => 
        d.bloodGroup.toUpperCase() == detectedGroup && 
        d.city.toLowerCase() == detectedCity!.toLowerCase()
      ).toList();

      if (matches.isNotEmpty) {
        matches.sort((a, b) {
          if (a.verified && !b.verified) return -1;
          if (!a.verified && b.verified) return 1;
          if (a.isEligibleToDonate && !b.isEligibleToDonate) return -1;
          if (!a.isEligibleToDonate && b.isEligibleToDonate) return 1;
          return 0;
        });

        final bestDonor = matches.first;
        final eligibilityStatus = bestDonor.isEligibleToDonate ? 'Eligible to donate now' : 'Last donation was recently';

        return '🤖 **SmartBloodLife AI Matcher (Offline Mode)**\n\n'
            'I found a matching verified donor in your area:\n'
            '• **Donor Name:** ${bestDonor.name}\n'
            '• **Blood Group:** ${bestDonor.bloodGroup}\n'
            '• **City:** ${bestDonor.city.toUpperCase()}\n'
            '• **Verification Badge:** ${bestDonor.verified ? "✅ Verified" : "⏳ Pending"}\n'
            '• **Eligibility:** $eligibilityStatus\n'
            '• **Contact:** ${bestDonor.phone}\n\n'
            '*(Setup a GEMINI_API_KEY environment variable to enable full natural language responses)*';
      } else {
        return '🤖 **SmartBloodLife AI Matcher (Offline Mode)**\n\n'
            'I detected your request for **$detectedGroup** in **${detectedCity.toUpperCase()}**.\n'
            'Currently, there are no available active donors for this blood type registered in this city.\n\n'
            'Would you like to broadcast a new emergency blood request on the platform?';
      }
    }

    return '🤖 **SmartBloodLife Assistant (Offline Mode)**\n\n'
        'I didn\'t catch that request clearly. Please specify the **blood group** and **city** (e.g. "Need O+ in Chennai").\n'
        '*(Setup a GEMINI_API_KEY environment variable to enable full natural language responses)*';
  }
}
