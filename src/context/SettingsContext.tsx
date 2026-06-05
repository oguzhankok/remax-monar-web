import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { SiteSettings } from '../types';
import { defaultSettings } from '../data/mockData';
import axios from 'axios';

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (updates: Partial<SiteSettings>) => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Başlangıç değeri olarak defaultSettings veriyoruz. 
  // Böylece veri veritabanından gelene kadar site boş kalıp hata (null) fırlatmaz.
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Sayfa ilk açıldığında MongoDB'den ayarları çek
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/settings');
        if (res.data && Object.keys(res.data).length > 0) {
          // Veritabanından gelen _id ve __v gibi teknik kısımları ayıklayıp sadece bizim ayarları alıyoruz
          const { _id, __v, createdAt, updatedAt, ...actualSettings } = res.data;
          setSettings((prev) => ({ ...prev, ...actualSettings }));
        }
      } catch (error) {
        console.error('Ayarlar MongoDB\'den çekilemedi:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 2. Admin panelinden ayar güncellendiğinde hem ekranı hem MongoDB'yi güncelle
  const updateSettings = useCallback(async (updates: Partial<SiteSettings>) => {
    try {
      // Ekranı anında güncelle (kullanıcı bekleme süresi hissetmesin diye)
      setSettings((prev) => ({ ...prev, ...updates }));
      
      // Değişiklikleri arka planda MongoDB'ye gönder
      await axios.put('/api/settings', updates);
    } catch (error) {
      console.error('Ayarlar güncellenirken hata oluştu:', error);
      alert('Ayarlar kaydedilirken bir hata oluştu.');
    }
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};