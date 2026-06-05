import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  Grid3X3,
  List,
  ChevronDown,
} from 'lucide-react';
import { useListings } from '../context/ListingsContext';
import { ListingFilter } from '../types';
import ListingCard from '../components/shared/ListingCard';
import { turkishCities } from '../data/mockData';

const roomOptions = ['1+0', '1+1', '2+1', '3+1', '4+1', '5+1', '5+2', '6+'];

const ListingsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { getFilteredListings, filter, setFilter } = useListings();
  const [localFilter, setLocalFilter] = useState<ListingFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const newFilter: ListingFilter = {};
    if (searchParams.get('type')) newFilter.type = searchParams.get('type')!;
    if (searchParams.get('category')) newFilter.category = searchParams.get('category')!;
    if (searchParams.get('city')) newFilter.city = searchParams.get('city')!;
    setLocalFilter(newFilter);
    setFilter(newFilter);
  }, [searchParams]);

  const filteredListings = getFilteredListings();

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'area-desc': return b.area - a.area;
      case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default: return 0;
    }
  });

  const applyFilter = () => {
    setFilter(localFilter);
    setShowFilters(false);
  };

  const resetFilter = () => {
    setLocalFilter({});
    setFilter({});
  };

  const activeFilterCount = Object.values(filter).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-[#0d1b3e] pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Gayrimenkul İlanları
          </h1>
          <p className="text-gray-400">
            {filteredListings.length} ilan listeleniyor
          </p>
          {/* Quick Search */}
          <div className="mt-6 flex gap-3">
            <div className="flex-1 max-w-md bg-white/10 rounded-xl px-4 py-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="İlan ara..."
                value={localFilter.search || ''}
                onChange={(e) =>
                  setLocalFilter((prev) => ({ ...prev, search: e.target.value }))
                }
                onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                className="bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none w-full"
              />
            </div>
            <button
              onClick={applyFilter}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Ara
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'bg-[#0d1b3e] text-white border-[#0d1b3e]'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtrele
            {activeFilterCount > 0 && (
              <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Type Buttons */}
          <div className="flex gap-2">
            {[
              { value: '', label: 'Tümü' },
              { value: 'sale', label: 'Satılık' },
              { value: 'rent', label: 'Kiralık' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  const newF = { ...localFilter, type: opt.value || undefined };
                  setLocalFilter(newF);
                  setFilter(newF);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                  (localFilter.type || '') === opt.value
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium focus:outline-none focus:border-red-500 cursor-pointer pr-8"
              >
                <option value="newest">En Yeni</option>
                <option value="price-asc">Fiyat: Artan</option>
                <option value="price-desc">Fiyat: Azalan</option>
                <option value="area-desc">En Geniş</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* View Mode */}
            <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' ? 'bg-[#0d1b3e] text-white' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${viewMode === 'list' ? 'bg-[#0d1b3e] text-white' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[#0d1b3e] flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Gelişmiş Filtreler
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  Emlak Tipi
                </label>
                <select
                  value={localFilter.category || ''}
                  onChange={(e) =>
                    setLocalFilter((prev) => ({
                      ...prev,
                      category: e.target.value || undefined,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-red-500"
                >
                  <option value="">Tümü</option>
                  <option value="residential">Konut</option>
                  <option value="commercial">Ticari</option>
                  <option value="land">Arsa</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  Şehir
                </label>
                <select
                  value={localFilter.city || ''}
                  onChange={(e) =>
                    setLocalFilter((prev) => ({
                      ...prev,
                      city: e.target.value || undefined,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-red-500"
                >
                  <option value="">Tüm Şehirler</option>
                  {turkishCities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Rooms */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  Oda Sayısı
                </label>
                <select
                  value={localFilter.rooms || ''}
                  onChange={(e) =>
                    setLocalFilter((prev) => ({
                      ...prev,
                      rooms: e.target.value || undefined,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-red-500"
                >
                  <option value="">Tümü</option>
                  {roomOptions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  Min Fiyat (₺)
                </label>
                <input
                  type="number"
                  placeholder="Min fiyat"
                  value={localFilter.minPrice || ''}
                  onChange={(e) =>
                    setLocalFilter((prev) => ({
                      ...prev,
                      minPrice: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  Max Fiyat (₺)
                </label>
                <input
                  type="number"
                  placeholder="Max fiyat"
                  value={localFilter.maxPrice || ''}
                  onChange={(e) =>
                    setLocalFilter((prev) => ({
                      ...prev,
                      maxPrice: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Min Area */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  Min Alan (m²)
                </label>
                <input
                  type="number"
                  placeholder="Min m²"
                  value={localFilter.minArea || ''}
                  onChange={(e) =>
                    setLocalFilter((prev) => ({
                      ...prev,
                      minArea: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Max Area */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                  Max Alan (m²)
                </label>
                <input
                  type="number"
                  placeholder="Max m²"
                  value={localFilter.maxArea || ''}
                  onChange={(e) =>
                    setLocalFilter((prev) => ({
                      ...prev,
                      maxArea: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
              <button
                onClick={applyFilter}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Filtreyi Uygula
              </button>
              <button
                onClick={resetFilter}
                className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Temizle
              </button>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {filter.type && (
              <FilterTag
                label={filter.type === 'sale' ? 'Satılık' : 'Kiralık'}
                onRemove={() => {
                  const f = { ...filter, type: undefined };
                  setLocalFilter(f);
                  setFilter(f);
                }}
              />
            )}
            {filter.category && (
              <FilterTag
                label={{ residential: 'Konut', commercial: 'Ticari', land: 'Arsa' }[filter.category] || filter.category}
                onRemove={() => {
                  const f = { ...filter, category: undefined };
                  setLocalFilter(f);
                  setFilter(f);
                }}
              />
            )}
            {filter.city && (
              <FilterTag
                label={filter.city}
                onRemove={() => {
                  const f = { ...filter, city: undefined };
                  setLocalFilter(f);
                  setFilter(f);
                }}
              />
            )}
            {filter.rooms && (
              <FilterTag
                label={filter.rooms}
                onRemove={() => {
                  const f = { ...filter, rooms: undefined };
                  setLocalFilter(f);
                  setFilter(f);
                }}
              />
            )}
            <button
              onClick={resetFilter}
              className="text-xs text-red-600 hover:text-red-700 font-semibold underline"
            >
              Tümünü Temizle
            </button>
          </div>
        )}

        {/* Listings Grid */}
        {sortedListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">İlan Bulunamadı</h3>
            <p className="text-gray-500 mb-6">Arama kriterlerinize uygun ilan bulunamadı.</p>
            <button
              onClick={resetFilter}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {sortedListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FilterTag: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 bg-[#0d1b3e] text-white text-xs font-medium px-3 py-1.5 rounded-full">
    {label}
    <button onClick={onRemove} className="hover:text-red-300 transition-colors">
      <X className="w-3 h-3" />
    </button>
  </span>
);

export default ListingsPage;
