import { useState, useEffect } from 'react';
import { Navbar, AppPage } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { ConnectPage } from './components/ConnectPage';
import { MembershipPage } from './components/MembershipPage';
import { WatchPage } from './components/WatchPage';
import { CarePage } from './components/CarePage';
import { MinistriesPage } from './components/MinistriesPage';
import { CampusesPage } from './components/CampusesPage';
import { GivePage } from './components/GivePage';
import { GivingModal } from './components/GivingModal';
import { PrayerRequestModal } from './components/PrayerRequestModal';
import { PlanVisitModal } from './components/PlanVisitModal';
import { LiveStreamModal } from './components/LiveStreamModal';
import { DownloadModal } from './components/DownloadModal';
import { PaymentReturnNotice } from './components/PaymentReturnNotice';
import { Footer } from './components/Footer';

export default function App() {
  const getPageFromHash = (): AppPage => {
    if (typeof window === 'undefined') return 'home';
    const hash = window.location.hash.toLowerCase().replace('#', '');
    if (hash.includes('connect')) return 'connect';
    if (hash.includes('membership')) return 'membership';
    if (hash.includes('watch') || hash.includes('live') || hash.includes('sermons')) return 'watch';
    if (hash.includes('care') || hash.includes('prayer')) return 'care';
    if (hash.includes('ministr')) return 'ministries';
    if (hash.includes('campus') || hash.includes('location')) return 'campuses';
    if (hash.includes('give') || hash.includes('tithe') || hash.includes('vision')) return 'give';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<AppPage>(getPageFromHash);

  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isGiveOpen, setIsGiveOpen] = useState(false);
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [isPrayerOpen, setIsPrayerOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const selectedVisitCampus = 'Paarl Campus';

  // Sync hash changes (e.g. browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: AppPage) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar with Multi-Page Routing */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenLive={() => setIsLiveOpen(true)}
        onOpenGive={() => setIsGiveOpen(true)}
        onOpenVisit={() => setIsVisitOpen(true)}
        onOpenPrayer={() => setIsPrayerOpen(true)}
        onOpenDownload={() => setIsDownloadOpen(true)}
      />

      {/* Main Content: Distinct page for each button with unique information */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenLive={() => setIsLiveOpen(true)}
            onOpenVisit={() => setIsVisitOpen(true)}
            onOpenPrayer={() => setIsPrayerOpen(true)}
            onOpenGive={() => setIsGiveOpen(true)}
          />
        )}

        {currentPage === 'connect' && (
          <ConnectPage
            onNavigateHome={() => handleNavigate('home')}
            onOpenVisit={() => setIsVisitOpen(true)}
            onOpenPrayer={() => handleNavigate('care')}
          />
        )}

        {currentPage === 'membership' && (
          <MembershipPage
            onNavigateHome={() => handleNavigate('home')}
            onOpenVisit={() => setIsVisitOpen(true)}
            onOpenPrayer={() => handleNavigate('care')}
          />
        )}

        {currentPage === 'watch' && (
          <WatchPage
            onNavigateHome={() => handleNavigate('home')}
            onOpenGive={() => handleNavigate('give')}
            onOpenPrayer={() => handleNavigate('care')}
          />
        )}

        {currentPage === 'care' && (
          <CarePage
            onNavigateHome={() => handleNavigate('home')}
            onOpenGive={() => handleNavigate('give')}
          />
        )}

        {currentPage === 'ministries' && (
          <MinistriesPage
            onNavigateHome={() => handleNavigate('home')}
            onOpenVisit={() => setIsVisitOpen(true)}
            onOpenPrayer={() => handleNavigate('care')}
          />
        )}

        {currentPage === 'campuses' && (
          <CampusesPage
            onNavigateHome={() => handleNavigate('home')}
            onOpenLive={() => handleNavigate('watch')}
          />
        )}

        {currentPage === 'give' && (
          <GivePage
            onNavigateHome={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenGive={() => setIsGiveOpen(true)}
        onOpenPrayer={() => setIsPrayerOpen(true)}
        onOpenVisit={() => setIsVisitOpen(true)}
        onOpenDownload={() => setIsDownloadOpen(true)}
      />

      {/* RCI-branded receipt after returning from Yoco */}
      <PaymentReturnNotice onNavigateGive={() => handleNavigate('give')} />

      {/* Interactive Global Modals */}
      <GivingModal
        isOpen={isGiveOpen}
        onClose={() => setIsGiveOpen(false)}
      />

      <PrayerRequestModal
        isOpen={isPrayerOpen}
        onClose={() => setIsPrayerOpen(false)}
      />

      <PlanVisitModal
        isOpen={isVisitOpen}
        defaultCampus={selectedVisitCampus}
        onClose={() => setIsVisitOpen(false)}
      />

      <LiveStreamModal
        isOpen={isLiveOpen}
        onClose={() => setIsLiveOpen(false)}
        onOpenGive={() => {
          setIsLiveOpen(false);
          handleNavigate('give');
        }}
        onOpenPrayer={() => {
          setIsLiveOpen(false);
          handleNavigate('care');
        }}
      />

      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />
    </div>
  );
}
