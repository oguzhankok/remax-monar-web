import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  MessageSquare,
  Eye,
  Star,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useListings } from '../../context/ListingsContext';
import { useApplications } from '../../context/ApplicationsContext';

const AdminDashboard: React.FC = () => {
  const { listings } = useListings();
  const { applications, messages } = useApplications();

  const activeListings = listings.filter((l) => l.isActive).length;
  const featuredListings = listings.filter((l) => l.isFeatured).length;
  const totalViews = listings.reduce((sum, l) => sum + l.views, 0);
  const newApplications = applications.filter((a) => a.status === 'new').length;
  const unreadMessages = messages.filter((m) => !m.isRead).length;

  const stats = [
    {
      label: 'Aktif İlan',
      value: activeListings,
      icon: Building2,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      to: '/admin/listings',
    },
    {
      label: 'Toplam Görüntülenme',
      value: totalViews.toLocaleString('tr-TR'),
      icon: Eye,
      color: 'text-green-600',
      bg: 'bg-green-50',
      to: '/admin/listings',
    },
    {
      label: 'Yeni Başvuru',
      value: newApplications,
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      to: '/admin/applications',
    },
    {
      label: 'Okunmamış Mesaj',
      value: unreadMessages,
      icon: MessageSquare,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      to: '/admin/messages',
    },
  ];

  const recentListings = listings.slice(0, 5);
  const recentApplications = applications.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0d1b3e]">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Link
          to="/admin/listings/new"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Yeni İlan Ekle
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <Link
            key={i}
            to={stat.to}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="text-3xl font-black text-[#0d1b3e]">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Listings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-[#0d1b3e] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-red-600" />
              Son İlanlar
            </h2>
            <Link
              to="/admin/listings"
              className="text-red-600 text-xs font-semibold hover:underline"
            >
              Tümünü Gör
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentListings.map((listing) => (
              <div key={listing._id} className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={listing.images[0] || '/images/property1.jpg'}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/property1.jpg';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{listing.title}</p>
                  <p className="text-xs text-gray-500">{listing.district}, {listing.city}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-[#0d1b3e] text-sm">
                    ₺{listing.price.toLocaleString('tr-TR')}
                  </p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    {listing.isActive ? (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Aktif</span>
                    ) : (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Pasif</span>
                    )}
                    {listing.isFeatured && (
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-[#0d1b3e] flex items-center gap-2">
              <Users className="w-4 h-4 text-red-600" />
              Son Başvurular
            </h2>
            <Link
              to="/admin/applications"
              className="text-red-600 text-xs font-semibold hover:underline"
            >
              Tümünü Gör
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentApplications.map((app) => (
              <div key={app._id} className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {app.firstName.charAt(0)}{app.lastName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">
                    {app.firstName} {app.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{app.email}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
            {recentApplications.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-sm">
                Henüz başvuru yok
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="bg-[#0d1b3e] rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {[
          { label: 'Satılık İlan', value: listings.filter(l => l.type === 'sale').length },
          { label: 'Kiralık İlan', value: listings.filter(l => l.type === 'rent').length },
          { label: 'Öne Çıkan', value: featuredListings },
          { label: 'Toplam İlan', value: listings.length },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <p className="text-3xl font-black text-white">{item.value}</p>
            <p className="text-gray-400 text-xs mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const statusColors: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700',
  reviewed: 'bg-yellow-50 text-yellow-700',
  contacted: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
};

const statusLabels: Record<string, string> = {
  new: 'Yeni',
  reviewed: 'İncelendi',
  contacted: 'İletişime Geçildi',
  rejected: 'Reddedildi',
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-600'}`}>
    {statusLabels[status] || status}
  </span>
);

export default AdminDashboard;
