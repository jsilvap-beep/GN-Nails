import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroCover } from './components/HeroCover';
import { PromoCatalog } from './components/PromoCatalog';
import { CustomServiceBuilder } from './components/CustomServiceBuilder';
import { AdminPanel } from './components/AdminPanel';
import { TermsModal } from './components/TermsModal';
import { GuideModal } from './components/GuideModal';
import { BookingModal } from './components/BookingModal';
import { Footer } from './components/Footer';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroCover />
            <PromoCatalog />
            <CustomServiceBuilder />
          </>
        )}

        {currentView === 'promotions' && <PromoCatalog />}

        {currentView === 'custom' && <CustomServiceBuilder />}

        {currentView === 'admin' && <AdminPanel />}
      </main>

      {/* Global Modals */}
      <TermsModal />
      <GuideModal />
      <BookingModal />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
