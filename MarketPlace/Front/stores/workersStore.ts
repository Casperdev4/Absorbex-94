import { create } from 'zustand';
import { workersApi } from '@/lib/api';
import { User, WorkerFilters, Pagination, Service } from '@/types';

interface WorkerWithServices extends User {
  services?: Service[];
}

interface WorkersState {
  workers: User[];
  currentWorker: WorkerWithServices | null;
  topWorkers: User[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  filters: WorkerFilters;

  // Actions
  fetchWorkers: (filters?: WorkerFilters) => Promise<void>;
  fetchWorker: (id: string) => Promise<void>;
  fetchTopWorkers: (params?: Record<string, any>) => Promise<void>;
  setFilters: (filters: WorkerFilters) => void;
  clearError: () => void;
}

export const useWorkersStore = create<WorkersState>((set, get) => ({
  workers: [],
  currentWorker: null,
  topWorkers: [],
  pagination: null,
  isLoading: false,
  error: null,
  filters: {},

  fetchWorkers: async (filters?: WorkerFilters) => {
    set({ isLoading: true, error: null });
    try {
      const mergedFilters = { ...get().filters, ...filters };
      const response = await workersApi.getAll(mergedFilters);
      set({
        workers: response.data.data,
        pagination: response.data.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement des prestataires',
        isLoading: false,
      });
    }
  },

  fetchWorker: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await workersApi.getById(id);
      set({
        currentWorker: response.data.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement du prestataire',
        isLoading: false,
      });
    }
  },

  fetchTopWorkers: async (params?: Record<string, any>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await workersApi.getTopRated(params);
      set({
        topWorkers: response.data.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement des meilleurs prestataires',
        isLoading: false,
      });
    }
  },

  setFilters: (filters: WorkerFilters) => {
    set({ filters });
  },

  clearError: () => {
    set({ error: null });
  },
}));
