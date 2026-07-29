'use client';

import { createContext, useContext, useState } from 'react';

interface ChatContextType {
  conversationId: number | null;
  setConversationId: (id: number | null) => void;

  selectedUser: any;
  setSelectedUser: (user: any | null) => void;

  showChat: boolean;
  setShowChat: (show: boolean) => void;

}

const ChatContext = createContext<ChatContextType>({
  conversationId: null,
  setConversationId: () => {},

  selectedUser: null,
  setSelectedUser: () => {},

  showChat: false,
  setShowChat: () => {},

});

export function ChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversationId, setConversationId] =
    useState<number | null>(null);

  const [selectedUser, setSelectedUser] =
    useState<any>(null);

  const [showChat, setShowChat] =
  useState(false);

  return (
    <ChatContext.Provider
      value={{
        conversationId,
        setConversationId,

        selectedUser,
        setSelectedUser,

        showChat,
        setShowChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}