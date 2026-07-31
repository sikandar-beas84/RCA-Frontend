'use client';

import { useEffect, useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { getMessages } from '../services/chat.service';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import socket from '../services/socket';
import ProfileImageModal from "./ProfileImageModal";

export default function ChatWindow() {

  const {
  conversationId,
  selectedUser,
  setShowChat,
} = useChat();

  const [messages, setMessages] = useState<any[]>([]);
  const [typingUser, setTypingUser] = useState("");
  const [showProfileImage, setShowProfileImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentUser =
  typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || '{}')
    : null;

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
    socket.on('message_status_updated', (updatedMessage) => {
      console.log('STATUS UPDATED:', updatedMessage);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === updatedMessage.id
            ? {
                ...msg,
                status: updatedMessage.status,
              }
            : msg,
        ),
      );
    });

    return () => {
      socket.off('message_status_updated');
    };
  }, []);

  useEffect(() => {
    socket.on("typing", (data) => {
      console.log("Typing Received:", data);

      if (data.conversationId === conversationId) {
        setTypingUser(data.userName);
      }
    });

    socket.on("stop_typing", (data) => {
      console.log("Stop Typing Received:", data);

      if (data.conversationId === conversationId) {
        setTypingUser("");
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [conversationId]);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
    }
  }, [conversationId]);

  async function loadMessages() {
    try {
      console.log("Loading Conversation:", conversationId);
console.log("Current User:", currentUser?.id);
      const data = await getMessages(conversationId!);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
  if (!conversationId || messages.length === 0) return;

  messages.forEach((message) => {
    // Only mark messages from the OTHER user as seen
    if (
      message.senderId !== currentUser?.id &&
      message.status !== 'SEEN'
    ) {
      socket.emit('message_seen', {
        messageId: message.id,
      });

      console.log('Seen:', message.id);
    }
  });
}, [messages, conversationId]);

useEffect(() => {

  const handleEdited = (updated: any) => {

    setMessages((prev) =>
      prev.map((m) =>
        m.id === updated.id ? updated : m
      )
    );

  };

  socket.on(
    "message_edited",
    handleEdited,
  );

  return () => {
    socket.off(
      "message_edited",
      handleEdited,
    );
  };

}, []);

useEffect(() => {
  const handleDeleted = (deletedMessage: any) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === deletedMessage.id
          ? deletedMessage
          : msg,
      ),
    );
  };

  socket.on(
    "message_deleted",
    handleDeleted,
  );

  return () => {
    socket.off(
      "message_deleted",
      handleDeleted,
    );
  };
}, []);



  if (!conversationId) {
    return (
      <div className="d-flex flex-grow-1 justify-content-center align-items-center">
        <h4>Select a conversation</h4>
      </div>
    );
  }

  return (
    <div
      className="d-flex flex-column flex-grow-1"
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >

      <div className="border-bottom p-3 bg-white">
        <div className="d-flex align-items-center">

          {/* Mobile Back Button */}
          <button
            className="btn btn-link d-md-none me-2 p-0"
            onClick={() => setShowChat(false)}
            style={{
              fontSize: 24,
              textDecoration: "none",
            }}
          >
            ←
          </button>

        

          <div className="d-flex align-items-center">

  {selectedUser?.avatar ? (
    <img
      src={`${process.env.NEXT_PUBLIC_API_URL!.replace("/api", "")}${selectedUser.avatar}`}
      alt=""
      className="rounded-circle"
      style={{
        width: 45,
        height: 45,
        objectFit: "cover",
        cursor: "pointer",
      }}
      onClick={() => setShowProfileImage(true)}
    />
  ) : (
    <div
      className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
      style={{
        width: 45,
        height: 45,
        fontWeight: "bold",
        cursor: "pointer",
      }}
      onClick={() => setShowProfileImage(true)}
    >
      {selectedUser?.name?.charAt(0).toUpperCase()}
    </div>
  )}

  <div className="ms-3">

    <h6
      className="mb-0 fw-bold"
      style={{ cursor: "pointer" }}
      onClick={() => setShowProfileImage(true)}
    >
      {selectedUser?.name}
    </h6>

    <small
      className={
        selectedUser?.isOnline
          ? "text-success"
          : "text-muted"
      }
    >
      {selectedUser?.isOnline
      ? "Online"
      : selectedUser?.lastSeen
        ? `Last seen ${new Date(
            selectedUser.lastSeen
          ).toLocaleString()}`
        : "Offline"}
    </small>

  </div>

</div>

        </div>
      </div>

      <div
        className="flex-grow-1 p-3"
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          background: "#f5f5f5",
          minHeight: 0,
        }}
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            sender={msg.sender?.name}
            mine={msg.senderId === currentUser?.id}
            status={msg.status}
            createdAt={msg.createdAt}
            fileUrl={msg.fileUrl}
            fileName={msg.fileName}
            fileType={msg.fileType}
            id={msg.id}
            replyTo={msg.replyTo}
            edited={msg.edited}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

        {typingUser && (
          <div
            className="px-3 py-2"
            style={{
              color: "#198754",
              fontStyle: "italic",
              fontSize: 14,
              background: "#fff",
              borderTop: "1px solid #eee",
            }}
          >
            {typingUser} is typing...
          </div>
        )}

      <MessageInput />

      <ProfileImageModal
      show={showProfileImage}
      onClose={() => setShowProfileImage(false)}
      name={selectedUser?.name || ""}
      image={
        selectedUser?.avatar
          ? `${process.env.NEXT_PUBLIC_API_URL!.replace("/api", "")}${selectedUser.avatar}`
          : undefined
      }
    />
    </div>
  );
}