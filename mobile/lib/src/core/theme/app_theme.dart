import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Brand Colors
  static const Color bloodRed = Color(0xFFE53935); // Brand Primary
  static const Color secondaryBlue = Color(0xFF2563EB); // Brand Secondary
  static const Color successGreen = Color(0xFF16A34A); // Success
  static const Color warningOrange = Color(0xFFF59E0B); // Warning
  
  static const Color darkRed = Color(0xFFB71C1C); 
  static const Color lightRed = Color(0xFFFFEBEE); 
  static const Color accentRed = Color(0xFFEF5350); 
  
  static const Color lightBg = Color(0xFFF8FAFC);
  static const Color darkBg = Color(0xFF090D16);
  
  static const Color darkCard = Color(0xFF132033); 
  static const Color lightCard = Color(0xFFFFFFFF); 

  // Light Color Scheme
  static final ColorScheme lightScheme = ColorScheme.fromSeed(
    seedColor: bloodRed,
    primary: bloodRed,
    onPrimary: Colors.white,
    secondary: secondaryBlue,
    onSecondary: Colors.white,
    error: Colors.redAccent,
    surface: lightBg,
    onSurface: const Color(0xFF0F172A), // Text slate
  );

  // Dark Color Scheme
  static final ColorScheme darkScheme = ColorScheme.fromSeed(
    seedColor: bloodRed,
    brightness: Brightness.dark,
    primary: bloodRed,
    onPrimary: Colors.white,
    secondary: secondaryBlue,
    onSecondary: Colors.white,
    surface: darkBg,
    onSurface: const Color(0xFFF8FAFC), 
  );

  static TextTheme _buildTextTheme(TextTheme base, Brightness brightness) {
    final textColor = brightness == Brightness.light ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    return GoogleFonts.interTextTheme(base).copyWith(
      displayLarge: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: textColor),
      displayMedium: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: textColor),
      displaySmall: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: textColor),
      headlineLarge: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: textColor),
      headlineMedium: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: textColor),
      headlineSmall: GoogleFonts.outfit(fontWeight: FontWeight.bold, color: textColor),
      titleLarge: GoogleFonts.outfit(fontWeight: FontWeight.w600, color: textColor),
      titleMedium: GoogleFonts.outfit(fontWeight: FontWeight.w600, color: textColor),
      titleSmall: GoogleFonts.outfit(fontWeight: FontWeight.w600, color: textColor),
      bodyLarge: GoogleFonts.inter(fontWeight: FontWeight.w500, color: textColor),
      bodyMedium: GoogleFonts.inter(fontWeight: FontWeight.w500, color: textColor.withOpacity(0.8)),
      bodySmall: GoogleFonts.inter(color: textColor.withOpacity(0.6)),
    );
  }

  // Light Theme Data
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: lightScheme,
      scaffoldBackgroundColor: lightBg,
      textTheme: _buildTextTheme(ThemeData.light().textTheme, Brightness.light),
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24.0),
          side: BorderSide(color: Colors.grey.shade100, width: 1.5),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: lightBg,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        iconTheme: IconThemeData(color: Color(0xFF0F172A)),
        titleTextStyle: TextStyle(
          color: Color(0xFF0F172A),
          fontSize: 22,
          fontWeight: FontWeight.bold,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: bloodRed,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 54),
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16.0),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFFF8FAFC),
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16.0),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16.0),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16.0),
          borderSide: const BorderSide(color: bloodRed, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16.0),
          borderSide: const BorderSide(color: Colors.redAccent, width: 1.5),
        ),
        labelStyle: TextStyle(color: Colors.grey.shade600, fontWeight: FontWeight.w500),
      ),
    );
  }

  // Dark Theme Data
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: darkScheme,
      scaffoldBackgroundColor: darkBg,
      textTheme: _buildTextTheme(ThemeData.dark().textTheme, Brightness.dark),
      cardTheme: CardThemeData(
        color: darkCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24.0),
          side: BorderSide(color: Colors.white.withOpacity(0.05), width: 1),
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: darkBg,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        iconTheme: IconThemeData(color: Color(0xFFF8FAFC)),
        titleTextStyle: TextStyle(
          color: Color(0xFFF8FAFC),
          fontSize: 22,
          fontWeight: FontWeight.bold,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: bloodRed,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 54),
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16.0),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFF0F1E33),
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16.0),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16.0),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16.0),
          borderSide: const BorderSide(color: bloodRed, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16.0),
          borderSide: const BorderSide(color: Colors.redAccent, width: 1.5),
        ),
        labelStyle: const TextStyle(color: Colors.grey, fontWeight: FontWeight.w500),
      ),
    );
  }
}
