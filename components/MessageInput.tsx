'use client';

import { useRef, useState } from 'react';
import socket from '../services/socket';
import { useChat } from '../context/ChatContext';

export default function MessageInput() {
  const [text, setText] = useState('');

  const { conversationId, selectedUser } = useChat();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = (value: string) => {
    
    setText(value);

    if (!conversationId) return;

    console.log('Socket Connected:', socket.connected);
    console.log('Conversation:', conversationId);
    console.log('User:', user);
    console.log('Typing Event Fired');

    socket.emit('typing', {
      conversationId,
      userId: user.id,
      userName: user.name,
    });

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit('stop_typing', {
        conversationId,
        userId: user.id,
      });
    }, 1000);
  };

  const sendMessage = () => {
    if (!text.trim()) return;

    if (!conversationId) return;

    socket.emit('send_message', {
      conversationId,
      senderId: user.id,
      text,
    });

    setText('');
    socket.emit('stop_typing', {
      conversationId,
      userId: user.id,
    });
  };

  return (
    <div className="border-top p-3 d-flex">

      <input
        className="form-control"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => handleTyping(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        }}
      />

      <button
        className="btn btn-primary ms-2"
        onClick={sendMessage}
      >
        Send
      </button>

    </div>
  );
}