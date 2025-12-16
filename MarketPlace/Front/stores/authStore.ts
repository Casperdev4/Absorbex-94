'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { authApi } from '@/lib/api';
import { initSocket, disconnectSocket } from '@/lib/socket';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    city?: string;
    role?: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: {
    name?: string;
    phone?: string;
    city?: string;
    avatar?: string;
    bio?: string;
    skills?: string[];
    hourlyRate?: number;
  }) => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login({ email, password });
          const { user, token } = response.data.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
          }
          initSocket(token);
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(error.response?.data?.message || 'Erreur de connexion');
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register(data);
          const { user, token } = response.data.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
          }
          initSocket(token);
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(error.response?.data?.message || 'Erreur d\'inscription');
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        disconnectSocket();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateProfile: async (data) => {
        try {
          const response = await authApi.updateProfile(data);
          set({ user: response.data.data });
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Erreur de mise à jour');
        }
      },

      checkAuth: async () => {
        const token = get().token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const response = await authApi.getMe();
          set({
            user: response.data.data,
            token,
            isAuthenticated: true,
          });
          initSocket(token);
        } catch {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
        }
      },

      setUser: (user) => {
        set({ user });
      },

      updateUser: (user) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
