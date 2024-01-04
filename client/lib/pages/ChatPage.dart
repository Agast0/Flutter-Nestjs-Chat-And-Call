import 'package:flutter/material.dart';

class ChatPage extends StatelessWidget {
  final String username;

  const ChatPage({super.key, required this.username});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text(
          username,
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}
