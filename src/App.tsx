import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ListingsProvider } from './context/ListingsContext';
import { SettingsProvider } from './context/SettingsContext';
import { ApplicationsProvider } from './context/ApplicationsContext';

// Layout Components
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import WhatsAppButton from './components/shared/WhatsAppButton';
import ProtectedRoute from './components/shared/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import CareerPage from './pages/CareerPage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminListings from './pages/admin/AdminListings';
import AdminListingForm from './pages/admin/AdminListingForm';
import AdminApplications from './pages/admin/AdminApplications';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSettings from './pages/admin/AdminSettings';

// Public Layout Wrapper
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
    <WhatsAppButton />
  </>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AuthProvider>
          <ListingsProvider>
            <ApplicationsProvider>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/"
                  element={
                    <PublicLayout>
                      <HomePage />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/listings"
                  element={
                    <PublicLayout>
                      <ListingsPage />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/listings/:id"
                  element={
                    <PublicLayout>
                      <ListingDetailPage />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/career"
                  element={
                    <PublicLayout>
                      <CareerPage />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <PublicLayout>
                      <ContactPage />
                    </PublicLayout>
                  }
                />

                {/* Admin Login */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="listings" element={<AdminListings />} />
                  <Route path="listings/new" element={<AdminListingForm />} />
                  <Route path="listings/edit/:id" element={<AdminListingForm />} />
                  <Route path="applications" element={<AdminApplications />} />
                  <Route path="messages" element={<AdminMessages />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Catch All */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ApplicationsProvider>
          </ListingsProvider>
        </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
};

export default App;
