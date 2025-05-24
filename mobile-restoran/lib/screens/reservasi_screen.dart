import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ReservasiScreen extends StatelessWidget {
  final String token;
  const ReservasiScreen({super.key, required this.token});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(color: Colors.white),
      child: const Center(
        child: Text(
          'Hello World',
          textDirection: TextDirection.ltr,
          style: TextStyle(fontSize: 32, color: Colors.black87),
        ),
      ),
    );
  }
}
