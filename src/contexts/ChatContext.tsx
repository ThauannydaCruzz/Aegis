
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MessageType } from '@/components/ChatMessage';

export interface MediaAttachment {
  type: 'image' | 'document' | 'video';
  url: string;
  name: string;
}

export interface Message {
  id: string;
  text: string;
  type: MessageType;
  timestamp: Date;
  media?: MediaAttachment;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (text: string, type: MessageType, media?: MediaAttachment) => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (text: string, type: MessageType, media?: MediaAttachment) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date(),
      media,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
