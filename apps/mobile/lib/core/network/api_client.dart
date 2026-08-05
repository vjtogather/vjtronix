import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
class ApiClient { ApiClient({required String baseUrl, required FlutterSecureStorage storage}) : _storage = storage, dio = Dio(BaseOptions(baseUrl: baseUrl)) { dio.interceptors.add(InterceptorsWrapper(onRequest: (o, h) async { final token = await _storage.read(key: 'access_token'); if (token != null) o.headers['Authorization'] = 'Bearer $token'; h.next(o); })); } final Dio dio; final FlutterSecureStorage _storage; }
