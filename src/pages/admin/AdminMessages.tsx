import React, { useState } from 'react';
import { Eye, Trash2, Mail, Phone, Building2 } from 'lucide-react';
import { useApplications } from '../../context/ApplicationsContext';
import { ContactMessage } from '../../types';

const AdminMessages: React.FC = () => {
  const { messages, markMessageRead, deleteMessage } = useApplications();
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const handleView = (msg: ContactMessage) => {
    setSelected(msg);
    markMessageRead(msg._id);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-[#0d1b3e]">Mesajlar</h1>
        <p className="text-gray-500 text-sm mt-1">
          {messages.length} toplam •{' '}
          <span className="text-red-600 font-medium">
            {messages.filter((m) => !m.isRead).length} okunmamış
          </span>
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Gönderen', 'Konu', 'Tarih', 'Durum', 'İşlemler'].map((h) => (
                  <th key={h} className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {messages.map((msg) => (
                <tr
                  key={msg._id}
                  className={`hover:bg-gray-50 transition-colors ${!msg.isRead ? 'bg-blue-50/30' : ''}`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-[#0d1b3e] to-blue-800 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {msg.name.charAt(0)}
                      </div>
                      <div>
                        <p className={`text-sm ${!msg.isRead ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                          {msg.name}
                        </p>
                        <p className="text-xs text-gray-400">{msg.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className={`text-sm truncate max-w-[200px] ${!msg.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                      {msg.subject}
                    </p>
                    {msg.listingId && (
                      <div className="flex items-center gap-1 text-xs text-red-600 mt-0.5">
                        <Building2 className="w-3 h-3" />
                        İlan #{msg.listingId}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-500">
                      {new Date(msg.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      !msg.isRead ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {!msg.isRead ? 'Yeni' : 'Okundu'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(msg)}
                        className="w-8 h-8 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMessage(msg._id)}
                        className="w-8 h-8 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-sm">
                    Henüz mesaj yok
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0d1b3e] to-blue-800 rounded-xl flex items-center justify-center text-white font-bold">
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selected.name}</h3>
                  <p className="text-sm text-gray-500">{selected.subject}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">E-posta</p>
                  <p className="text-sm font-medium">{selected.email}</p>
                </div>
                {selected.phone && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">Telefon</p>
                    <p className="text-sm font-medium">{selected.phone}</p>
                  </div>
                )}
              </div>
              {selected.listingId && (
                <div className="p-3 bg-red-50 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">İlgili İlan</p>
                  <p className="text-sm font-medium text-red-700">İlan #{selected.listingId}</p>
                </div>
              )}
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-2">Mesaj</p>
                <p className="text-sm text-gray-700 leading-relaxed">{selected.message}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Tarih</p>
                <p className="text-sm">{new Date(selected.createdAt).toLocaleString('tr-TR')}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                className="flex-1 flex items-center justify-center gap-2 bg-[#0d1b3e] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#162347] transition-colors"
              >
                <Mail className="w-4 h-4" />
                Yanıtla
              </a>
              {selected.phone && (
                <a
                  href={`tel:${selected.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Ara
                </a>
              )}
              <button
                onClick={() => setSelected(null)}
                className="px-4 border border-gray-200 py-2.5 rounded-xl text-sm font-semibold"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
