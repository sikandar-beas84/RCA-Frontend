'use client';

import { createContext, useContext, useState } from 'react';

interface ChatContextType {
  conversationId: number | null;
  setConversationId: (id: number) => void;
}

const ChatContext = createContext<ChatContextType>({
  conversationId: null,
  setConversationId: () => {},
});

export function ChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversationId, setConversationId] =
    useState<number | null>(null);

  return (
    <ChatContext.Provider
      value={{
        conversationId,
        setConversationId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}