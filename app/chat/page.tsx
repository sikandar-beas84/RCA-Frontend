'use client';

import { useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ChatWindow from '../../components/ChatWindow';
import socket from '../../services/socket';
import { useChat } from '@/context/ChatContext';

export default function ChatPage() {

  const { showChat } = useChat();


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) return;

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      socket.emit("user_connected", {
        userId: user.id,
      });
    };

    socket.on("connect", onConnect);

    // If already connected, emit immediately
    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
    };
  }, []);

    return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Desktop */}
      <div
        className="d-none d-md-flex"
        style={{
          height: "100%",
        }}
      >
        <Sidebar />
        <ChatWindow />
      </div>

      {/* Mobile */}
      <div
        className="d-md-none w-100"
        style={{
          height: "100%",
          width: "100vw",
        }}
      >
        {showChat ? (
          <ChatWindow />
        ) : (
          <Sidebar />
        )}
      </div>
    </div>
  );
}