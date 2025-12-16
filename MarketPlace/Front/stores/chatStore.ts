'use client';

import { create } from 'zustand';
import { Conversation, Message } from '@/types';
import { conversationsApi } from '@/lib/api';
import { getSocket, markMessagesAsRead } from '@/lib/socket';

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  unreadCount: number;
  isLoading: boolean;
  typingUsers: Record<string, string[]>;

  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  setCurrentConversation: (conversation: Conversation | null) => void;
  addMessage: (message: Message) => void;
  updateUnreadCount: () => Promise<void>;
  setTypingUser: (conversationId: string, userId: string, isTyping: boolean) => void;
  initSocketListeners: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  unreadCount: 0,
  isLoading: false,
  typingUsers: {},

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const response = await conversationsApi.getAll();
      set({ conversations: response.data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Erreur chargement conversations:', error);
    }
  },

  fetchMessages: async (conversationId: string) => {
    set({ isLoading: true });
    try {
      const response = await conversationsApi.getMessages(conversationId);
      set({ messages: response.data.data, isLoading: false });
      markMessagesAsRead(conversationId);
    } catch (error) {
      set({ isLoading: false });
      console.error('Erreur chargement messages:', error);
    }
  },

  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation, messages: [] });
    if (conversation) {
      get().fetchMessages(conversation._id);
    }
  },

  addMessage: (message) => {
    const { currentConversation, conversations } = get();

    // Ajouter le message si c'est la conversation active
    if (currentConversation && message.conversation === currentConversation._id) {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    }

    // Mettre à jour la liste des conversations
    const updatedConversations = conversations.map((conv) => {
      if (conv._id === message.conversation) {
        return {
          ...conv,
          lastMessage: {
            content: message.content,
            sender: typeof message.sender === 'string' ? message.sender : message.sender.id || message.sender._id || '',
            createdAt: message.createdAt,
          },
        };
      }
      return conv;
    });

    set({ conversations: updatedConversations });
  },

  updateUnreadCount: async () => {
    try {
      const response = await conversationsApi.getUnreadCount();
      set({ unreadCount: response.data.unreadCount });
    } catch (error) {
      console.error('Erreur comptage messages non lus:', error);
    }
  },

  setTypingUser: (conversationId, userId, isTyping) => {
    set((state) => {
      const typingUsers = { ...state.typingUsers };
      if (!typingUsers[conversationId]) {
        typingUsers[conversationId] = [];
      }

      if (isTyping && !typingUsers[conversationId].includes(userId)) {
        typingUsers[conversationId].push(userId);
      } else if (!isTyping) {
        typingUsers[conversationId] = typingUsers[conversationId].filter(
          (id) => id !== userId
        );
      }

      return { typingUsers };
    });
  },

  initSocketListeners: () => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('message:new', ({ message }) => {
      get().addMessage(message);
      get().updateUnreadCount();
    });

    socket.on('message:read', ({ conversationId }) => {
      const { messages } = get();
      const updatedMessages = messages.map((msg) => {
        if (msg.conversation === conversationId) {
          return { ...msg, read: true };
        }
        return msg;
      });
      set({ messages: updatedMessages });
    });

    socket.on('typing:start', ({ conversationId, userId }) => {
      get().setTypingUser(conversationId, userId, true);
    });

    socket.on('typing:stop', ({ conversationId, userId }) => {
      get().setTypingUser(conversationId, userId, false);
    });

    socket.on('notification:message', () => {
      get().updateUnreadCount();
      get().fetchConversations();
    });
  },
}));
