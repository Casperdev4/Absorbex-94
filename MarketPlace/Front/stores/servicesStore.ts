import { create } from 'zustand';
import { servicesApi } from '@/lib/api';
import { Service, ServiceFilters, Pagination } from '@/types';

interface ServicesState {
  services: Service[];
  currentService: Service | null;
  myServices: Service[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  filters: ServiceFilters;

  // Actions
  fetchServices: (filters?: ServiceFilters) => Promise<void>;
  fetchService: (id: string) => Promise<void>;
  fetchMyServices: (params?: Record<string, any>) => Promise<void>;
  createService: (data: FormData) => Promise<Service>;
  updateService: (id: string, data: FormData) => Promise<Service>;
  deleteService: (id: string) => Promise<void>;
  setFilters: (filters: ServiceFilters) => void;
  clearError: () => void;
}

export const useServicesStore = create<ServicesState>((set, get) => ({
  services: [],
  currentService: null,
  myServices: [],
  pagination: null,
  isLoading: false,
  error: null,
  filters: {},

  fetchServices: async (filters?: ServiceFilters) => {
    set({ isLoading: true, error: null });
    try {
      const mergedFilters = { ...get().filters, ...filters };
      const response = await servicesApi.getAll(mergedFilters);
      set({
        services: response.data.data,
        pagination: response.data.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement des services',
        isLoading: false,
      });
    }
  },

  fetchService: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await servicesApi.getById(id);
      set({
        currentService: response.data.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement du service',
        isLoading: false,
      });
    }
  },

  fetchMyServices: async (params?: Record<string, any>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await servicesApi.getMy(params);
      set({
        myServices: response.data.data,
        pagination: response.data.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors du chargement de vos services',
        isLoading: false,
      });
    }
  },

  createService: async (data: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await servicesApi.create(data);
      const newService = response.data.data;
      set((state) => ({
        myServices: [newService, ...state.myServices],
        isLoading: false,
      }));
      return newService;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la création du service',
        isLoading: false,
      });
      throw error;
    }
  },

  updateService: async (id: string, data: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await servicesApi.update(id, data);
      const updatedService = response.data.data;
      set((state) => ({
        myServices: state.myServices.map((s) =>
          s._id === id ? updatedService : s
        ),
        currentService:
          state.currentService?._id === id ? updatedService : state.currentService,
        isLoading: false,
      }));
      return updatedService;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du service',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteService: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await servicesApi.delete(id);
      set((state) => ({
        myServices: state.myServices.filter((s) => s._id !== id),
        services: state.services.filter((s) => s._id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Erreur lors de la suppression du service',
        isLoading: false,
      });
      throw error;
    }
  },

  setFilters: (filters: ServiceFilters) => {
    set({ filters });
  },

  clearError: () => {
    set({ error: null });
  },
}));
