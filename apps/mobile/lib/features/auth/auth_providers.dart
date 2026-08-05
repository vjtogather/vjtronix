import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../core/network/api_client.dart';
import '../../core/services/session_service.dart';
import 'auth_repository.dart';
final sessionServiceProvider = Provider((_) => SessionService(const FlutterSecureStorage()));
final apiClientProvider = Provider((ref) => ApiClient(baseUrl: const String.fromEnvironment('API_BASE_URL', defaultValue: 'http://10.0.2.2:3000'), storage: const FlutterSecureStorage()));
final authRepositoryProvider = Provider((ref) => AuthRepository(ref.watch(apiClientProvider), ref.watch(sessionServiceProvider)));
final sessionProvider = FutureProvider((ref) => ref.watch(authRepositoryProvider).hasSession());
