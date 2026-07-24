'use client';

import { useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ChatWindow from '../../components/ChatWindow';
import socket from '../../services/socket';

export default function ChatPage() {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user.id) return;

    // Connect only if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('user_connected', {
      userId: user.id,
    });

    console.log('Socket Connected:', socket.connected);

    return () => {
      // Don't disconnect here.
      // We only disconnect on Logout.
    };
  }, []);

  return (
    <div
      className="d-flex"
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Sidebar />
      <ChatWindow />
    </div>
  );
}