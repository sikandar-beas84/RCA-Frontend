'use client';

import { useEffect, useState } from 'react';
import { getConversations } from '../services/chat.service';
import { useChat } from '../context/ChatContext';
import { useRouter } from 'next/navigation';
import NewChatModal from './NewChatModal';

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

  return (
    <div
      className="border-end bg-white"
      style={{
        width: 320,
        height: '100vh',
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

      <div className="list-group list-group-flush">
        {conversations.map((conversation) => {
          const currentUser = JSON.parse(
            localStorage.getItem('user') || '{}'
          );

          const otherUser = conversation.participants.find(
            (p: any) => p.user.id !== currentUser.id
          );

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
              <strong>{otherUser?.user.name}</strong>
              <br />
              <small>{otherUser?.user.email}</small>
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