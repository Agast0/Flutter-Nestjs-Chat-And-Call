import 'package:flutter/material.dart';
import 'pages/UsernamePage.dart';
import 'pages/ChatPage.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const UsernamePage(),
        '/chatPage': (context) => ChatPage(
            username: ModalRoute.of(context)!.settings.arguments as String),
      },
    );
  }
}
