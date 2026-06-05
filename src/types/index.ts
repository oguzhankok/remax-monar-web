// ==================== LISTING TYPES ====================
export interface Listing {
  _id: string;
  title: string;
  description: string;
  type: 'sale' | 'rent';
  category: 'residential' | 'land' | 'commercial';
  price: number;
  currency: 'TRY' | 'USD' | 'EUR';
  city: string;
  district: string;
  address: string;
  area: number; // m²
  rooms?: string; // e.g. "3+1"
  floor?: number;
  totalFloors?: number;
  buildingAge?: number;
  bathrooms?: number;
  parking?: boolean;
  elevator?: boolean;
  balcony?: boolean;
  furnished?: boolean;
  heatingType?: string;
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListingFilter {
  type?: string;
  category?: string;
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  rooms?: string;
  search?: string;
}

// ==================== APPLICATION TYPES ====================
export interface CareerApplication {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  experience: string; // 'none' | '1-3' | '3-5' | '5+'
  coverLetter: string;
  status: 'new' | 'reviewed' | 'contacted' | 'rejected';
  createdAt: string;
}

// ==================== CONTACT TYPES ====================
export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  listingId?: string;
  isRead: boolean;
  createdAt: string;
}

// ==================== SETTINGS TYPES ====================
export interface SiteSettings {
  _id?: string;
  whatsappNumber: string;
  whatsappMessage: string;
  companyName: string;
  companySlogan: string;
  companyDescription: string;
  companyAbout: string;
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  workingHours: string;
  emailNotifications: boolean;
  notificationEmail: string;
  heroTitle: string;
  heroSubtitle: string;
}

// ==================== AUTH TYPES ====================
export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: 'superadmin' | 'admin';
}

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// ==================== TESTIMONIAL TYPES ====================
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

// ==================== STATS TYPES ====================
export interface CompanyStat {
  icon: string;
  value: string;
  label: string;
}
