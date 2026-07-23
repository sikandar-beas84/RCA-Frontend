'use client';

import { useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';
import { getMessages } from '../services/chat.service';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import socket from '../services/socket';

export default function ChatWindow() {

    const { conversationId } = useChat();

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
  socket.on('receive_message', (message) => {
    if (message.conversationId === conversationId) {
      setMessages((prev) => [...prev, message]);
    }
  });

  return () => {
    socket.off('receive_message');
  };
}, [conversationId]);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
    }
  }, [conversationId]);

  async function loadMessages() {
    try {
      const data = await getMessages(conversationId!);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  }

  if (!conversationId) {
    return (
      <div className="d-flex flex-grow-1 justify-content-center align-items-center">
        <h4>Select a conversation</h4>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column flex-grow-1">

      <div className="border-bottom p-3">
        <h5>Chat</h5>
      </div>

      <div
        className="flex-grow-1 p-3"
        style={{
          overflowY: 'auto',
          background: '#f5f5f5',
        }}
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            mine={false}
          />
        ))}
      </div>

      <MessageInput />

    </div>
  );
}