import React, { createContext, useContext, useState, useEffect } from 'react';
import { CareerApplication, ContactMessage } from '../types';
import axios from 'axios';

interface ApplicationsContextType {
  applications: CareerApplication[];
  messages: ContactMessage[];
  addApplication: (app: Omit<CareerApplication, '_id' | 'status' | 'createdAt'>) => Promise<void>;
  addMessage: (msg: Omit<ContactMessage, '_id' | 'isRead' | 'createdAt'>) => Promise<void>;
  updateApplicationStatus: (id: string, status: CareerApplication['status']) => Promise<void>;
  markMessageRead: (id: string) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

export const ApplicationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Test verileri silindi, gerçek listeler başlangıçta boş olarak ayarlandı
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // 1. Sayfa İlk Açıldığında Kariyer Başvurularını MongoDB'den Çek
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get('/api/applications');
        setApplications(res.data);
        const msgRes = await axios.get('/api/contact');
        setMessages(msgRes.data);
      } catch (error) {
        console.error('Veriler çekilirken hata:', error);
      }
    };

    fetchApplications();
  }, []);

  // 2. Yeni Kariyer Başvurusu (Gerçek Backend Kapısına Yolluyoruz)
  const addApplication = async (appData: Omit<CareerApplication, '_id' | 'status' | 'createdAt'>) => {
    try {
      const res = await axios.post('/api/applications', appData);
      if (res.data.success) {
        // İşlem başarılıysa backend'den gelen yeni kaydı listeye ekle
        setApplications((prev) => [res.data.data, ...prev]);
      }
    } catch (error) {
      console.error('Kariyer başvurusu kaydedilemedi:', error);
      throw error; // Sayfadaki hata mesajının tetiklenmesi için fırlatıyoruz
    }
  };

  // 3. Yeni İletişim Mesajı Gönderimi
  const addMessage = async (msgData: Omit<ContactMessage, '_id' | 'isRead' | 'createdAt'>) => {
    try {
      // 1. İsteği at ve backend'den gelen cevabı (res) yakala
      const res = await axios.post('/api/contact', msgData);
      
      // 2. İşlem başarılıysa ve backend bize veriyi yolladıysa
      if (res.data.success) {
        // Backend'den dönen GERÇEK MongoDB kaydını (res.data.data) listeye ekle
        setMessages((prev) => [res.data.data, ...prev]);
      }
    } catch (error) {
      console.error('İletişim mesajı gönderilemedi:', error);
      throw error;
    }
  };

  // --- DİĞER İŞLEMLER ---
  
  // --- GERÇEK VERİTABANI İŞLEMLERİ ---

  // 1. Başvuru Durumunu Güncelle
  const updateApplicationStatus = async (id: string, status: CareerApplication['status']) => {
    try {
      await axios.put(`/api/applications/${id}`, { status });
      // Başarılı olursa ekrandaki listeyi de güncelle
      setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
    } catch (error) {
      console.error('Durum güncellenemedi:', error);
    }
  };

  // 2. Mesajı Okundu İşaretle
  const markMessageRead = async (id: string) => {
    try {
      await axios.put(`/api/contact/${id}`);
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, isRead: true } : m)));
    } catch (error) {
      console.error('Mesaj okundu yapılamadı:', error);
    }
  };

  // 3. Başvuruyu Sil
  const deleteApplication = async (id: string) => {
    try {
      await axios.delete(`/api/applications/${id}`);
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error('Başvuru silinemedi:', error);
    }
  };

  // 4. Mesajı Sil
  const deleteMessage = async (id: string) => {
    try {
      await axios.delete(`/api/contact/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      console.error('Mesaj silinemedi:', error);
    }
  };

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
        messages,
        addApplication,
        addMessage,
        updateApplicationStatus,
        markMessageRead,
        deleteApplication,
        deleteMessage,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationsContext);
  if (!context) throw new Error('useApplications must be used within ApplicationsProvider');
  return context;
};