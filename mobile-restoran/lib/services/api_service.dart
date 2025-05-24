import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/menu_model.dart';

class ApiService {
  static const baseUrl = 'http://10.0.2.2:8000/api';

  static Future<String?> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login/'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);
      return json['access'];
    }
    return null;
  }

  static Future<List<MenuModel>> getMenu(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/menu/'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (response.statusCode == 200) {
      return (jsonDecode(response.body) as List)
          .map((e) => MenuModel.fromJson(e))
          .toList();
    }
    throw Exception('Failed to load menus');

  }

  static Future<List<MejaModel>> getMeja(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/meja/'),
      headers: {'Authorization': 'Bearer $token'},
    );
    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      return data.map((e) => MejaModel.fromJson(e)).toList();
    }
    return [];
  }

  static Future<void> updateMeja(String token, int id, String status) async {
    await http.patch(
      Uri.parse('$baseUrl/meja/$id/'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({"status": status}),
    );
  }
}