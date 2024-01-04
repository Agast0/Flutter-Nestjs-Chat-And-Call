import 'package:flutter/material.dart';
import 'package:logger/logger.dart';


class UsernamePage extends StatefulWidget {
  const UsernamePage({Key? key}) : super(key: key);

  @override
  UsernamePageState createState() => UsernamePageState();
}

class UsernamePageState extends State<UsernamePage> {
  String _username = '';
  final Logger logger = Logger();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Username Page'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: TextField(
                onChanged: (value) {
                  setState(() {
                    _username = value;
                  });
                },
                decoration: const InputDecoration(
                  hintText: 'Enter your username',
                ),
              ),
            ),
            const SizedBox(height: 16), // Add a gap of 16 pixels
            SizedBox(
              height: 48, // Adjust the height as needed
              child: ElevatedButton(
                onPressed: () {
                  logger.d('username $_username');
                  Navigator.pushNamed(
                    context,
                    '/chatPage',
                    arguments: _username,
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepPurple,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.symmetric(
                    vertical: 16,
                    horizontal: 32,
                  ),
                ),
                child: const Text(
                  'Submit',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
