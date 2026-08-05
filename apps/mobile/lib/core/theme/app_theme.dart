import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

abstract final class AppTheme {
  static ThemeData get light => _theme(Brightness.light);
  static ThemeData get dark => _theme(Brightness.dark);

  static ThemeData _theme(Brightness brightness) {
    final scheme = ColorScheme.fromSeed(seedColor: const Color(0xFF0284C7), brightness: brightness);
    return ThemeData(useMaterial3: true, colorScheme: scheme, textTheme: GoogleFonts.interTextTheme(), scaffoldBackgroundColor: scheme.surface);
  }
}
