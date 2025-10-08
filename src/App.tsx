import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { useStore } from '@/store';
import { Home } from '@/pages/Home';
import { Analytics } from '@/pages/Analytics';
import { Import } from '@/pages/Import';
import { Settings } from '@/pages/Settings';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { theme, sidebarCollapsed, toggleSidebar, loadConcepts, loadItems, loadConceptMastery, loadDailyPlan } = useStore();

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Load initial data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          loadConcepts(),
          loadItems(),
          loadConceptMastery(),
          loadDailyPlan(),
        ]);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };
    loadData();
  }, []); // Run once on mount

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'analytics':
        return <Analytics />;
      case 'import':
        return <Import />;
      case 'settings':
        return <Settings />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
      />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-auto p-6">
          {renderPage()}
        </main>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
