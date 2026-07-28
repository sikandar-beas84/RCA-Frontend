'use client';

import { useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ChatWindow from '../../components/ChatWindow';
import socket from '../../services/socket';

export default function ChatPage() {

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