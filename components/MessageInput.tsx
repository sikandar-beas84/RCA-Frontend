'use client';

import { useState } from 'react';
import socket from '../services/socket';
import { useChat } from '../context/ChatContext';

export default function MessageInput() {
  const [text, setText] = useState('');

  const { conversationId } = useChat();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const sendMessage = () => {
    if (!text.trim()) return;

    if (!conversationId) return;

    socket.emit('send_message', {
      conversationId,
      senderId: user.id,
      text,
    });

    setText('');
  };

  return (
    <div className="border-top p-3 d-flex">

      <input
        className="form-control"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
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