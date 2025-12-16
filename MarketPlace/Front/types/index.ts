// Types utilisateur
export interface User {
  id: string;
  _id?: string;
  email: string;
  name: string;
  phone?: string;
  city?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'worker';
  isOnline?: boolean;
  lastSeen?: string;
  createdAt: string;
  // Champs spécifiques aux travailleurs
  bio?: string;
  skills?: string[];
  hourlyRate?: number;
  rating?: number;
  reviewCount?: number;
  completedTasks?: number;
  verified?: boolean;
}

// Types service
export interface Service {
  _id: string;
  owner: User | string;
  title: string;
  description: string;
  price: number;
  priceType: 'fixed' | 'hourly' | 'starting_from';
  category: Category;
  subcategory?: string;
  city: string;
  postalCode?: string;
  images: string[];
  tags: string[];
  status: 'active' | 'inactive' | 'pending';
  views: number;
  rating?: number;
  reviewCount?: number;
  deliveryTime?: string;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
}

// Catégories de services
export type Category =
  | 'cleaning'
  | 'renovation'
  | 'gardening'
  | 'handyman'
  | 'photography'
  | 'babysitting'
  | 'moving'
  | 'tutoring'
  | 'beauty'
  | 'tech'
  | 'events'
  | 'other';

// Labels des catégories
export const categoryLabels: Record<Category, string> = {
  cleaning: 'Ménage & Nettoyage',
  renovation: 'Rénovation',
  gardening: 'Jardinage',
  handyman: 'Bricolage',
  photography: 'Photographie',
  babysitting: 'Garde d\'enfants',
  moving: 'Déménagement',
  tutoring: 'Cours particuliers',
  beauty: 'Beauté & Bien-être',
  tech: 'Informatique & Tech',
  events: 'Événements',
  other: 'Autres services',
};

// Icônes des catégories
export const categoryIcons: Record<Category, string> = {
  cleaning: '🧹',
  renovation: '🔨',
  gardening: '🌿',
  handyman: '🔧',
  photography: '📷',
  babysitting: '👶',
  moving: '📦',
  tutoring: '📚',
  beauty: '💅',
  tech: '💻',
  events: '🎉',
  other: '⭐',
};

// Types conversation
export interface Conversation {
  _id: string;
  participants: User[];
  service: Service;
  lastMessage?: {
    content: string;
    sender: string;
    createdAt: string;
  };
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: User | string;
  content: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
}

// Types favoris
export interface Favorite {
  _id: string;
  user: string;
  service: Service;
  createdAt: string;
}

// Types tâche/demande
export interface Task {
  _id: string;
  client: User | string;
  worker?: User | string;
  service?: Service | string;
  title: string;
  description: string;
  category: Category;
  budget: number;
  budgetType: 'fixed' | 'hourly';
  city: string;
  address?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

// Types avis
export interface Review {
  _id: string;
  reviewer: User | string;
  reviewed: User | string;
  service?: Service | string;
  task?: Task | string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Types pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Types réponse API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: Pagination;
}

// Types filtres
export interface ServiceFilters {
  category?: Category;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  priceType?: 'fixed' | 'hourly';
  sort?: string;
  page?: number;
  limit?: number;
}

export interface WorkerFilters {
  category?: Category;
  city?: string;
  minRate?: number;
  maxRate?: number;
  search?: string;
  verified?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}
