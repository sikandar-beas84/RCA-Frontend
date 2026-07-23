'use client';

import { useEffect, useState } from 'react';
import { getConversations } from '../services/chat.service';
import { useChat } from '../context/ChatContext';

export default function Sidebar() {
  const [conversations, setConversations] = useState<any[]>([]);
  const { setConversationId } = useChat();

  useEffect(() => {
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

  return (
    <div
      className="border-end bg-white"
      style={{
        width: 320,
        height: '100vh',
      }}
    >
      <div className="p-3 border-bottom">
        <h4>Chats</h4>
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
              className="list-group-item list-group-item-action"
              onClick={() => setConversationId(conversation.id)}
            >
              <strong>{otherUser?.user.name}</strong>
              <br />
              <small>{otherUser?.user.email}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}