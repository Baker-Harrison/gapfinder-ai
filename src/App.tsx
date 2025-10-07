import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/CommandPalette';
import { Toaster } from '@/components/ui/toaster';
import { useStore } from '@/store';
import { Home } from '@/pages/Home';
import { Learn } from '@/pages/Learn';
import { Items } from '@/pages/Items';
import { Concepts } from '@/pages/Concepts';
import { Analytics } from '@/pages/Analytics';
import { Import } from '@/pages/Import';
import { Settings } from '@/pages/Settings';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { theme, sidebarCollapsed, toggleSidebar } = useStore();

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleStartSession = () => {
    setCurrentPage('learn');
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'start-session':
        setCurrentPage('learn');
        break;
      case 'quick-diagnostic':
        setCurrentPage('learn');
        break;
      case 'practice-weakest':
        setCurrentPage('learn');
        break;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} onStartSession={handleStartSession} />;
      case 'learn':
        return <Learn />;
      case 'items':
        return <Items />;
      case 'concepts':
        return <Concepts />;
      case 'analytics':
        return <Analytics />;
      case 'import':
        return <Import />;
      case 'settings':
        return <Settings />;
      default:
        return <Home onNavigate={handleNavigate} onStartSession={handleStartSession} />;
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

      <CommandPalette onNavigate={handleNavigate} onAction={handleAction} />
      <Toaster />
    </div>
  );
}

export default App;
