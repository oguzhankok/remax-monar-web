import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  StarOff,
  Eye,
  EyeOff,
  MapPin,
} from 'lucide-react';
import { useListings } from '../../context/ListingsContext';

const categoryLabel: Record<string, string> = {
  residential: 'Konut',
  land: 'Arsa',
  commercial: 'Ticari',
};

const typeLabel: Record<string, string> = {
  sale: 'Satılık',
  rent: 'Kiralık',
};

const AdminListings: React.FC = () => {
  const { listings, deleteListing, toggleFeatured, toggleActive } = useListings();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = listings.filter((l) => {
    const matchSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || l.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleDelete = (id: string) => {
    deleteListing(id);
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0d1b3e]">İlan Yönetimi</h1>
          <p className="text-gray-500 text-sm mt-1">{listings.length} ilan toplam</p>
        </div>
        <Link
          to="/admin/listings/new"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni İlan Ekle
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="İlan ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-gray-700 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {['', 'sale', 'rent'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                typeFilter === t
                  ? 'bg-[#0d1b3e] text-white border-[#0d1b3e]'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {t === '' ? 'Tümü' : t === 'sale' ? 'Satılık' : 'Kiralık'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-4">
                  İlan
                </th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-4 hidden sm:table-cell">
                  Konum
                </th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-4 hidden md:table-cell">
                  Tip
                </th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-4">
                  Fiyat
                </th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-4 hidden lg:table-cell">
                  Durum
                </th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-4">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((listing) => (
                <tr key={listing._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={listing.images[0] || '/images/property1.jpg'}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/property1.jpg';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate max-w-[180px]">
                          {listing.title}
                        </p>
                        <p className="text-xs text-gray-400">{listing.area} m²{listing.rooms ? ` • ${listing.rooms}` : ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      {listing.district}, {listing.city}
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-block w-fit ${
                        listing.type === 'sale' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {typeLabel[listing.type]}
                      </span>
                      <span className="text-xs text-gray-400">{categoryLabel[listing.category]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-bold text-[#0d1b3e] text-sm">
                      ₺{listing.price.toLocaleString('tr-TR')}
                    </p>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${listing.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className="text-xs text-gray-600">{listing.isActive ? 'Aktif' : 'Pasif'}</span>
                      {listing.isFeatured && (
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => toggleFeatured(listing._id)}
                        title={listing.isFeatured ? 'Öne Çıkarmayı Kaldır' : 'Öne Çıkar'}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          listing.isFeatured
                            ? 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {listing.isFeatured ? <Star className="w-3.5 h-3.5 fill-current" /> : <StarOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => toggleActive(listing._id)}
                        title={listing.isActive ? 'Pasife Al' : 'Aktife Al'}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          listing.isActive
                            ? 'bg-green-50 text-green-500 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {listing.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <Link
                        to={`/admin/listings/edit/${listing._id}`}
                        className="w-8 h-8 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setConfirmDelete(listing._id)}
                        className="w-8 h-8 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                    İlan bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
              İlanı Sil
            </h3>
            <p className="text-gray-500 text-sm text-center mb-6">
              Bu ilanı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminListings;
