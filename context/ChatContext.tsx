'use client';

import { createContext, useContext, useState } from 'react';

interface ChatContextType {
  conversationId: number | null;
  setConversationId: (id: number) => void;

  selectedUser: any;
  setSelectedUser: (user: any) => void;
}

const ChatContext = createContext<ChatContextType>({
  conversationId: null,
  setConversationId: () => {},

  selectedUser: null,
  setSelectedUser: () => {},
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

  return (
    <ChatContext.Provider
      value={{
        conversationId,
        setConversationId,

        selectedUser,
        setSelectedUser,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}