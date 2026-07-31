'use client';

import { createContext, useContext, useState } from 'react';

interface ChatContextType {
  conversationId: number | null;
  setConversationId: (id: number | null) => void;

  selectedUser: any;
  setSelectedUser: (user: any | null) => void;

  showChat: boolean;
  setShowChat: (show: boolean) => void;

  replyMessage: any;
  setReplyMessage: (message: any | null) => void;

}

const ChatContext = createContext<ChatContextType>({
  conversationId: null,
  setConversationId: () => {},

  selectedUser: null,
  setSelectedUser: () => {},

  showChat: false,
  setShowChat: () => {},

  replyMessage: false,
  setReplyMessage: () => {},

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

  const [replyMessage, setReplyMessage] =
  useState<any>(null);

  return (
    <ChatContext.Provider
      value={{
        conversationId,
        setConversationId,

        selectedUser,
        setSelectedUser,

        showChat,
        setShowChat,

        replyMessage,
        setReplyMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}