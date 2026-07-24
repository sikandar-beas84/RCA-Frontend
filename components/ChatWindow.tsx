'use client';

import { useEffect, useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { getMessages } from '../services/chat.service';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import socket from '../services/socket';

export default function ChatWindow() {

  const {
  conversationId,
  selectedUser,
} = useChat();

  const [messages, setMessages] = useState<any[]>([]);
  const [typingUser, setTypingUser] = useState("");
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

          <div
            className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3"
            style={{
              width: 45,
              height: 45,
              fontWeight: 'bold',
            }}
          >
            {selectedUser?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h5 className="mb-0">
              {selectedUser?.name}
            </h5>

            <small className="text-success">
              Online
            </small>
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

    </div>
  );
}