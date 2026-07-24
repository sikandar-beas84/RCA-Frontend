'use client';

import { useEffect, useState } from 'react';
import { getConversations } from '../services/chat.service';
import { useChat } from '../context/ChatContext';
import { useRouter } from 'next/navigation';
import NewChatModal from './NewChatModal';
import socket from "../services/socket";

export default function Sidebar() {
  const [conversations, setConversations] = useState<any[]>([]);
  const {
  setConversationId,
  setSelectedUser,
  conversationId,
} = useChat();

const [showModal, setShowModal] = useState(false);

const [currentUser, setCurrentUser] = useState<any>(null);

const router = useRouter();
const logout = () => {

  // Disconnect socket
  socket.disconnect();

  setConversationId(null);
  setSelectedUser(null);

  localStorage.removeItem('token');
  localStorage.removeItem('user');

  router.push('/');
};

  useEffect(() => {
    const user = localStorage.getItem('user');

    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    loadConversations();
  }, []);

  useEffect(() => {

  socket.on("user_status", (data) => {
    console.log("USER STATUS RECEIVED:", data);
    setConversations((prev) =>
      prev.map((conversation) => ({

        ...conversation,

        participants: conversation.participants.map((p: any) =>

          p.user.id === data.userId
            ? {
                ...p,
                user: {
                  ...p.user,
                  isOnline: data.online,
                },
              }
            : p

        ),

      }))
    );

  });

  return () => {

    socket.off("user_status");

  };

}, []);

  async function loadConversations() {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      console.error(err);
    }
  }
  async function refreshConversations() {
  await loadConversations();
}

if (!currentUser) {
  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      Loading...
    </div>
  );
}

  return (
    <div
      className="border-end bg-white d-flex flex-column"
      style={{
        width: 320,
        height: '100vh',
        //overflow: "hidden",
      }}
    >
      <div className="border-bottom p-3">

  <div className="d-flex align-items-center">

    <div
      className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
      style={{
        width: 55,
        height: 55,
        fontSize: 22,
        fontWeight: 'bold',
      }}
    >
      {currentUser?.name?.charAt(0).toUpperCase()}
    </div>

    <div className="ms-3">
      <h5 className="mb-0">
        {currentUser?.name}
      </h5>

      <small className="text-muted">
        {currentUser?.email}
      </small>
    </div>

  </div>

  <div className="d-flex justify-content-between mt-3">

    <button
      className="btn btn-success btn-sm"
      onClick={() => setShowModal(true)}
    >
      + New Chat
    </button>

    <button
      className="btn btn-outline-danger btn-sm"
      onClick={logout}
    >
      Logout
    </button>

  </div>

</div>

      <div
        className="list-group list-group-flush flex-grow-1"
        style={{
          overflowY: 'auto',
          minHeight: 0,
        }}
      >
        {conversations.map((conversation) => {

          console.log("Conversation:", conversation);
          // const currentUser = JSON.parse(
          //   localStorage.getItem('user') || '{}'
          // );

          const otherUser = conversation.participants.find(
            (p: any) => p.user.id !== currentUser.id
          );
          const lastMessage = conversation.messages?.[0];
          return (
            <button
              key={conversation.id}
              //className="list-group-item list-group-item-action"
              onClick={() => {
                setConversationId(conversation.id);
                setSelectedUser(otherUser.user);
              }}
              className={`list-group-item border-0 rounded-3 mx-2 my-1 ${
                conversationId === conversation.id
                  ? 'active-chat'
                  : ''
              }`}
            >
              <div className="d-flex justify-content-between align-items-start w-100">

  <div
    style={{
      overflow: "hidden",
      flex: 1,
    }}
  >
    <strong>
      {otherUser?.user.name}
    </strong>

    <br />

<small
  className="text-muted d-block"
  style={{
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }}
>
  {lastMessage
    ? lastMessage.senderId === currentUser.id
      ? `You: ${lastMessage.text}`
      : lastMessage.text
    : "No messages yet"}
</small>

  </div>

  <div
    className="text-end ms-2"
    style={{
      minWidth: 65,
    }}
  >
    <small className="text-muted">

      {conversation.messages?.[0]
        ? new Date(
            conversation.messages[0].createdAt,
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : ""}

    </small>

    <div className="mt-1">

      <span
        className={`rounded-circle d-inline-block ${
          otherUser?.user.isOnline
            ? "bg-success"
            : "bg-secondary"
        }`}
        style={{
          width: 10,
          height: 10,
        }}
      />

    </div>

  </div>

</div>

            </button>
          );
        })}
      </div>
      <NewChatModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreated={refreshConversations}
      />
    </div>
  );
}