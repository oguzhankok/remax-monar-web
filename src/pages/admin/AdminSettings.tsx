import React, { useState } from 'react';
import { Save, CheckCircle, Globe, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { SiteSettings } from '../../types';

const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social' | 'hero'>('general');

  const set = (key: keyof SiteSettings, value: unknown) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const setSocial = (key: string, value: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [key]: value },
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    updateSettings(localSettings);
    setSaved(true);
    setIsLoading(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { key: 'general', label: 'Genel' },
    { key: 'contact', label: 'İletişim' },
    { key: 'social', label: 'Sosyal Medya' },
    { key: 'hero', label: 'Ana Sayfa' },
  ] as const;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0d1b3e]">Site Ayarları</h1>
          <p className="text-gray-500 text-sm mt-1">Sitenin genel ayarlarını yönetin</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Kaydedildi!
            </>
          ) : isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Kaydet
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-2xl border border-gray-100 p-1.5 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === tab.key
                ? 'bg-[#0d1b3e] text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        {activeTab === 'general' && (
          <div className="space-y-5">
            <h2 className="font-bold text-[#0d1b3e] text-lg mb-5">Genel Bilgiler</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                  Şirket Adı
                </label>
                <input
                  type="text"
                  value={localSettings.companyName}
                  onChange={(e) => set('companyName', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                  Slogan
                </label>
                <input
                  type="text"
                  value={localSettings.companySlogan}
                  onChange={(e) => set('companySlogan', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                Kısa Açıklama
              </label>
              <input
                type="text"
                value={localSettings.companyDescription}
                onChange={(e) => set('companyDescription', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                Hakkımızda Metni
              </label>
              <textarea
                rows={4}
                value={localSettings.companyAbout}
                onChange={(e) => set('companyAbout', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                Çalışma Saatleri
              </label>
              <input
                type="text"
                value={localSettings.workingHours}
                onChange={(e) => set('workingHours', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-5">
            <h2 className="font-bold text-[#0d1b3e] text-lg mb-5">İletişim Bilgileri</h2>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> WhatsApp Numarası</span>
              </label>
              <input
                type="text"
                value={localSettings.whatsappNumber}
                onChange={(e) => set('whatsappNumber', e.target.value)}
                placeholder="+905069060177"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> WhatsApp Varsayılan Mesaj</span>
              </label>
              <textarea
                rows={2}
                value={localSettings.whatsappMessage}
                onChange={(e) => set('whatsappMessage', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> Telefon</span>
              </label>
              <input
                type="text"
                value={localSettings.phone}
                onChange={(e) => set('phone', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> E-posta</span>
              </label>
              <input
                type="email"
                value={localSettings.email}
                onChange={(e) => set('email', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Adres</span>
              </label>
              <textarea
                rows={2}
                value={localSettings.address}
                onChange={(e) => set('address', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Google Maps Embed URL</span>
              </label>
              <input
                type="text"
                value={localSettings.mapEmbedUrl}
                onChange={(e) => set('mapEmbedUrl', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                id="notif"
                checked={localSettings.emailNotifications}
                onChange={(e) => set('emailNotifications', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded"
              />
              <label htmlFor="notif" className="text-sm font-medium text-gray-700 cursor-pointer">
                Form dolduğunda e-posta bildirimi al
              </label>
            </div>

            {localSettings.emailNotifications && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                  Bildirim E-postası
                </label>
                <input
                  type="email"
                  value={localSettings.notificationEmail}
                  onChange={(e) => set('notificationEmail', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-5">
            <h2 className="font-bold text-[#0d1b3e] text-lg mb-5">Sosyal Medya Hesapları</h2>
            {[
              { key: 'facebook', label: 'Facebook URL' },
              { key: 'instagram', label: 'Instagram URL' },
              { key: 'linkedin', label: 'LinkedIn URL' },
              { key: 'youtube', label: 'YouTube URL' },
              { key: 'twitter', label: 'Twitter/X URL' },
            ].map((item) => (
              <div key={item.key}>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                  {item.label}
                </label>
                <input
                  type="url"
                  value={(localSettings.socialMedia as Record<string, string>)[item.key] || ''}
                  onChange={(e) => setSocial(item.key, e.target.value)}
                  placeholder={`https://${item.key}.com/...`}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="space-y-5">
            <h2 className="font-bold text-[#0d1b3e] text-lg mb-5">Ana Sayfa Hero Bölümü</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                Ana Başlık
              </label>
              <input
                type="text"
                value={localSettings.heroTitle}
                onChange={(e) => set('heroTitle', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                Alt Başlık / Açıklama
              </label>
              <textarea
                rows={3}
                value={localSettings.heroSubtitle}
                onChange={(e) => set('heroSubtitle', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 resize-none"
              />
            </div>

            {/* Preview */}
            <div className="bg-[#0d1b3e] rounded-xl p-6 mt-4">
              <p className="text-xs text-gray-400 mb-3 uppercase">Önizleme</p>
              <h3 className="text-2xl font-black text-white mb-2">{localSettings.heroTitle}</h3>
              <p className="text-gray-400 text-sm">{localSettings.heroSubtitle}</p>
            </div>
          </div>
        )}
      </div>

      {/* Save Button Bottom */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-8 py-3 rounded-xl text-sm font-semibold transition-colors shadow-lg"
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Değişiklikler Kaydedildi!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Değişiklikleri Kaydet
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
