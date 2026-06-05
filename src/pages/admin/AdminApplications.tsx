import React, { useState } from 'react';
import { Trash2, Eye, Mail, Phone, Briefcase } from 'lucide-react';
import { useApplications } from '../../context/ApplicationsContext';
import { CareerApplication } from '../../types';

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-yellow-100 text-yellow-700',
  contacted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  new: 'Yeni',
  reviewed: 'İncelendi',
  contacted: 'İletişime Geçildi',
  rejected: 'Reddedildi',
};

const experienceLabels: Record<string, string> = {
  none: 'Deneyimsiz',
  '1-3': '1-3 Yıl',
  '3-5': '3-5 Yıl',
  '5+': '5+ Yıl',
};

const AdminApplications: React.FC = () => {
  const { applications, updateApplicationStatus, deleteApplication } = useApplications();
  const [selected, setSelected] = useState<CareerApplication | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-[#0d1b3e]">Kariyer Başvuruları</h1>
        <p className="text-gray-500 text-sm mt-1">
          {applications.length} toplam başvuru •{' '}
          <span className="text-blue-600 font-medium">
            {applications.filter((a) => a.status === 'new').length} yeni
          </span>
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Başvuran', 'İletişim', 'Deneyim', 'Tarih', 'Durum', 'İşlemler'].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-5 py-4"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {app.firstName.charAt(0)}{app.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {app.firstName} {app.lastName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Mail className="w-3 h-3" />
                        {app.email}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Phone className="w-3 h-3" />
                        {app.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Briefcase className="w-3.5 h-3.5" />
                      {experienceLabels[app.experience] || app.experience}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          updateApplicationStatus(app._id, e.target.value as CareerApplication['status'])
                        }
                        className={`appearance-none text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer focus:outline-none ${statusColors[app.status]}`}
                      >
                        <option value="new">Yeni</option>
                        <option value="reviewed">İncelendi</option>
                        <option value="contacted">İletişime Geçildi</option>
                        <option value="rejected">Reddedildi</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelected(app)}
                        className="w-8 h-8 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors"
                        title="Detay"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(app._id)}
                        className="w-8 h-8 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                    Henüz başvuru yok
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
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center text-white font-bold">
                  {selected.firstName.charAt(0)}{selected.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {selected.firstName} {selected.lastName}
                  </h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[selected.status]}`}>
                    {statusLabels[selected.status]}
                  </span>
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
                  <p className="text-sm font-medium text-gray-900">{selected.email}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">Telefon</p>
                  <p className="text-sm font-medium text-gray-900">{selected.phone}</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Deneyim</p>
                <p className="text-sm font-medium text-gray-900">
                  {experienceLabels[selected.experience] || selected.experience}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-2">Ön Yazı</p>
                <p className="text-sm text-gray-700 leading-relaxed">{selected.coverLetter}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 mb-1">Başvuru Tarihi</p>
                <p className="text-sm text-gray-900">
                  {new Date(selected.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={`mailto:${selected.email}`}
                className="flex-1 flex items-center justify-center gap-2 bg-[#0d1b3e] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#162347] transition-colors"
              >
                <Mail className="w-4 h-4" />
                E-posta Gönder
              </a>
              <a
                href={`tel:${selected.phone}`}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Ara
              </a>
              <button
                onClick={() => setSelected(null)}
                className="px-4 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 mb-2">Başvuruyu Sil</h3>
            <p className="text-gray-500 text-sm mb-5">Bu başvuruyu silmek istediğinize emin misiniz?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-semibold"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  deleteApplication(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold"
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

export default AdminApplications;
