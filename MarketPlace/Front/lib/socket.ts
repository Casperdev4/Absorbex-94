import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const initSocket = (token: string): Socket => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Socket connecté');
  });

  socket.on('disconnect', () => {
    console.log('Socket déconnecté');
  });

  socket.on('connect_error', (error) => {
    console.error('Erreur de connexion socket:', error);
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Fonctions helper pour la messagerie
export const sendMessage = (conversationId: string, content: string): void => {
  if (socket) {
    socket.emit('message:send', { conversationId, content });
  }
};

export const markMessagesAsRead = (conversationId: string): void => {
  if (socket) {
    socket.emit('message:read', { conversationId });
  }
};

export const startTyping = (conversationId: string): void => {
  if (socket) {
    socket.emit('typing:start', { conversationId });
  }
};

export const stopTyping = (conversationId: string): void => {
  if (socket) {
    socket.emit('typing:stop', { conversationId });
  }
};

export const joinConversation = (conversationId: string): void => {
  if (socket) {
    socket.emit('conversation:join', conversationId);
  }
};
