import { create } from 'zustand';
import { adminApi } from '@/lib/api';
import { User, Service, Pagination } from '@/types';

interface AdminStats {
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  totalConversations: number;
  totalMessages: number;
}

interface CategoryStat {
  _id: string;
  count: number;
}

interface AdminState {
  stats: AdminStats | null;
  listingsByCategory: CategoryStat[];
  recentUsers: User[];
  recentListings: Service[];
  users: User[];
  services: Service[];
  usersPagination: Pagination | null;
  servicesPagination: Pagination | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchStats: () => Promise<void>;
  fetchUsers: (params?: Record<string, any>) => Promise<void>;
  fetchServices: (params?: Record<string, any>) => Promise<void>;
  updateUserRole: (userId: string, role: string) => Promise<void>;
  updateServiceStatus: (serviceId: string, status: string) => Promise<void>;
  deleteService: (serviceId: string) => Promise<void>;
  clearError: () => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  stats: null,
  listingsByCategory: [],
  recentUsers: [],
  recentListings: [],
  users: [],
  services: [],
  usersPagination: null,
  servicesPagination: null,
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminApi.getStats();
      const data = response.data.data;
      set({
        stats: data.stats,
        listingsByCategory: data.listingsByCategory,
        recentUsers: data.recentUsers,
        recentListings: data.recentListings,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement des statistiques',
        isLoading: false,
      });
    }
  },

  fetchUsers: async (params?: Record<string, any>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminApi.getUsers(params);
      set({
        users: response.data.data,
        usersPagination: response.data.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement des utilisateurs',
        isLoading: false,
      });
    }
  },

  fetchServices: async (params?: Record<string, any>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminApi.getListings(params);
      set({
        services: response.data.data,
        servicesPagination: response.data.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement des services',
        isLoading: false,
      });
    }
  },

  updateUserRole: async (userId: string, role: string) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.updateUserRole(userId, role);
      set((state) => ({
        users: state.users.map((u) =>
          (u._id === userId || u.id === userId) ? { ...u, role: role as any } : u
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la modification du rôle',
        isLoading: false,
      });
      throw error;
    }
  },

  updateServiceStatus: async (serviceId: string, status: string) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.updateListingStatus(serviceId, status);
      set((state) => ({
        services: state.services.map((s) =>
          s._id === serviceId ? { ...s, status: status as any } : s
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la modification du statut',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteService: async (serviceId: string) => {
    set({ isLoading: true, error: null });
    try {
      await adminApi.deleteListing(serviceId);
      set((state) => ({
        services: state.services.filter((s) => s._id !== serviceId),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la suppression',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
