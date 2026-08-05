import 'package:flutter/material.dart';
class AppLoading extends StatelessWidget { const AppLoading({super.key}); @override Widget build(BuildContext context) => const Center(child: CircularProgressIndicator()); }
class AppEmptyState extends StatelessWidget { const AppEmptyState({required this.message, super.key}); final String message; @override Widget build(BuildContext context) => Center(child: Text(message, textAlign: TextAlign.center)); }
class AppErrorState extends StatelessWidget { const AppErrorState({required this.message, required this.onRetry, super.key}); final String message; final VoidCallback onRetry; @override Widget build(BuildContext context) => Center(child: FilledButton.icon(onPressed: onRetry, icon: const Icon(Icons.refresh), label: Text(message))); }
