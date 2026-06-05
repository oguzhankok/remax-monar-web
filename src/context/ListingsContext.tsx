import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Listing, ListingFilter } from '../types';

interface ListingsContextType {
  listings: Listing[];
  featuredListings: Listing[];
  isLoading: boolean;
  filter: ListingFilter;
  setFilter: (filter: ListingFilter) => void;
  getFilteredListings: () => Listing[];
  getListing: (id: string) => Listing | undefined;
  addListing: (listing: Omit<Listing, '_id' | 'views' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateListing: (id: string, listing: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  toggleActive: (id: string) => Promise<void>;
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export const ListingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<ListingFilter>({});

  // UYGULAMA AÇILDIĞINDA MONGODB'DEN VERİLERİ ÇEK
  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/listings');
      setListings(res.data);
    } catch (error) {
      console.error('İlanlar çekilirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const featuredListings = listings.filter((l) => l.isFeatured && l.isActive);

  const getFilteredListings = useCallback(() => {
    return listings.filter((l) => {
      if (!l.isActive) return false;
      if (filter.type && l.type !== filter.type) return false;
      if (filter.category && l.category !== filter.category) return false;
      if (filter.city && l.city !== filter.city) return false;
      if (filter.district && l.district !== filter.district) return false;
      if (filter.minPrice && l.price < filter.minPrice) return false;
      if (filter.maxPrice && l.price > filter.maxPrice) return false;
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return l.title.toLowerCase().includes(searchLower) || l.district.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }, [listings, filter]);

  const getListing = useCallback((id: string) => listings.find((l) => l._id === id), [listings]);

  const addListing = async (listingData: Omit<Listing, '_id' | 'views' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await axios.post('/api/listings', listingData);
      setListings((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error('İlan eklenemedi:', error);
    }
  };

  const updateListing = async (id: string, updates: Partial<Listing>) => {
    try {
      const res = await axios.put(`/api/listings/${id}`, updates);
      setListings((prev) => prev.map((l) => (l._id === id ? res.data : l)));
    } catch (error) {
      console.error('İlan güncellenemedi:', error);
    }
  };

  const deleteListing = async (id: string) => {
    try {
      await axios.delete(`/api/listings/${id}`);
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (error) {
      console.error('İlan silinemedi:', error);
    }
  };

  const toggleFeatured = async (id: string) => {
    const listing = listings.find(l => l._id === id);
    if(listing) await updateListing(id, { isFeatured: !listing.isFeatured });
  };

  const toggleActive = async (id: string) => {
    const listing = listings.find(l => l._id === id);
    if(listing) await updateListing(id, { isActive: !listing.isActive });
  };

  return (
    <ListingsContext.Provider
      value={{
        listings, featuredListings, isLoading, filter, setFilter,
        getFilteredListings, getListing, addListing, updateListing,
        deleteListing, toggleFeatured, toggleActive,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
};

export const useListings = (): ListingsContextType => {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error('useListings must be used within ListingsProvider');
  return ctx;
};