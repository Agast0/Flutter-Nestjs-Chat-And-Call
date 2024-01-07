import 'package:client/utils/SocketUtils.dart';
import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import 'package:socket_io_client/socket_io_client.dart';

class ChatPage extends StatefulWidget {
  final String username;

  const ChatPage({Key? key, required this.username}) : super(key: key);

  @override
  ChatPageState createState() => ChatPageState();
}

class ChatPageState extends State<ChatPage> {
  final TextEditingController _messageController = TextEditingController();
  final Logger logger = Logger();
  late Socket socket;
  Map? otherUser;

  @override
  void initState() {
    super.initState();
    _connectToSocket();
    _getOtherUser();
    _setupListeners();
  }

  void _connectToSocket() {
    socket = SocketUtils.connectToSocket(widget.username, context);
  }

  void _getOtherUser() {
    socket.emitWithAck('getOtherUser', 'test', ack: (data) {
      setState(() {
        otherUser = data;
      });
    });
  }

  void _setupListeners() {
    socket.on('userConnected', (data) => setState(() => otherUser = data));
    socket.on('userDisconnected', (data) => setState(() => otherUser = null));
  }

  @override
  void dispose() {
    _messageController.dispose();
    socket.disconnect();
    super.dispose();
  }

  void _sendMessage() {
    String message = _messageController.text;
    logger.d('Sent message: $message');
    _messageController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(otherUser?['username'] ?? 'Chat Page'),
      ),
      body: Column(
        children: [
          if (otherUser == null) // Add condition here
            const Expanded(
              child: Center(
                child: Text('Waiting for other user...'),
              ),
            )
          else
            Expanded(
              child: Container(
                  // Display chats here
                  ),
            ),
          if (otherUser != null) // Add condition here
            Container(
              padding: const EdgeInsets.all(8),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      decoration: const InputDecoration(
                        hintText: 'Type a message...',
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: _sendMessage,
                    child: const Text('Send'),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
