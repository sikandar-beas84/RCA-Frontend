'use client';

import { useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import ChatWindow from '../../components/ChatWindow';
import socket from '../../services/socket';

export default function ChatPage() {

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) return;

    const onConnect = () => {
      console.log("✅ Connected:", socket.id);

      socket.emit("user_connected", {
        userId: user.id,
      });
    };

    socket.on("connect", onConnect);

    if (!socket.connected) {
      socket.connect();
    } else {
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