import { Home, BookOpen, FileText, Brain, BarChart3, Upload, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'items', label: 'Items', icon: FileText },
  { id: 'concepts', label: 'Concepts', icon: Brain },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'import', label: 'Import', icon: Upload },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ currentPage, onNavigate, collapsed }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-card transition-all duration-200',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">GapFinder</span>
          </div>
        )}
        {collapsed && <Brain className="h-6 w-6 text-primary mx-auto" />}
      </div>

      <nav className="flex-1 space-y-1 p-2" role="navigation" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
