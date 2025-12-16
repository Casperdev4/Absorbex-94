import { create } from 'zustand';
import { favoritesApi } from '@/lib/api';
import { Service, Favorite, Pagination } from '@/types';

interface FavoritesState {
  favorites: Favorite[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchFavorites: (params?: Record<string, any>) => Promise<void>;
  addFavorite: (serviceId: string) => Promise<void>;
  removeFavorite: (serviceId: string) => Promise<void>;
  checkFavorite: (serviceId: string) => Promise<boolean>;
  clearError: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  pagination: null,
  isLoading: false,
  error: null,

  fetchFavorites: async (params?: Record<string, any>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await favoritesApi.getAll(params);
      set({
        favorites: response.data.data,
        pagination: response.data.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement des favoris',
        isLoading: false,
      });
    }
  },

  addFavorite: async (serviceId: string) => {
    try {
      const response = await favoritesApi.add(serviceId);
      const newFavorite = response.data.data;
      set((state) => ({
        favorites: [newFavorite, ...state.favorites],
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors de l\'ajout aux favoris',
      });
      throw error;
    }
  },

  removeFavorite: async (serviceId: string) => {
    try {
      await favoritesApi.remove(serviceId);
      set((state) => ({
        favorites: state.favorites.filter((f) => {
          const service = f.service as Service;
          return service._id !== serviceId;
        }),
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la suppression du favori',
      });
      throw error;
    }
  },

  checkFavorite: async (serviceId: string) => {
    try {
      const response = await favoritesApi.check(serviceId);
      return response.data.isFavorite;
    } catch {
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
