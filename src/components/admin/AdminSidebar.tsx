import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Plus,
  Users,
  Settings,
  LogOut,
  MessageSquare,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApplications } from '../../context/ApplicationsContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const { applications, messages } = useApplications();
  const location = useLocation();

  const newApplications = applications.filter((a) => a.status === 'new').length;
  const unreadMessages = messages.filter((m) => !m.isRead).length;

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      to: '/admin/dashboard',
      badge: 0,
    },
    {
      icon: Building2,
      label: 'İlan Yönetimi',
      to: '/admin/listings',
      badge: 0,
    },
    {
      icon: Plus,
      label: 'Yeni İlan Ekle',
      to: '/admin/listings/new',
      badge: 0,
    },
    {
      icon: Users,
      label: 'Kariyer Başvuruları',
      to: '/admin/applications',
      badge: newApplications,
    },
    {
      icon: MessageSquare,
      label: 'Mesajlar',
      to: '/admin/messages',
      badge: unreadMessages,
    },
    {
      icon: Settings,
      label: 'Site Ayarları',
      to: '/admin/settings',
      badge: 0,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0d1b3e] z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <div className="bg-red-600 text-white font-black text-sm px-1.5 py-0.5 rounded-l">
                  RE
                </div>
                <div className="bg-white text-[#0d1b3e] font-black text-sm px-1.5 py-0.5 rounded-r">
                  MAX
                </div>
              </div>
              <span className="text-white font-bold tracking-wide">MONAR</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-1">Admin Paneli</p>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{user?.username}</p>
              <p className="text-gray-500 text-xs">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive(item.to)
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2.5 text-gray-400 hover:text-white text-sm rounded-xl hover:bg-white/10 transition-all mb-1"
          >
            <ChevronRight className="w-4 h-4" />
            Siteyi Gör
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-red-400 hover:text-red-300 text-sm rounded-xl hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
