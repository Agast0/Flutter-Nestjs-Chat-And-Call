import 'package:logger/logger.dart';
import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart';

class SocketUtils {
  static Socket connectToSocket(String username, BuildContext context) {
    final Logger logger = Logger();
    
     Socket socket = io('http://localhost:3001/chats',
      OptionBuilder()
      .setQuery({'username': username})
      .setTransports(['websocket']) // for Flutter or Dart VM
      .build());

    socket.onConnect((_) {
      logger.d('Connected to socket.io server');
    });

    socket.onDisconnect((_) {
      logger.d('Disconnected from socket.io server');
      Navigator.pushNamed(context, '/');
    });

    return socket;
  }
}