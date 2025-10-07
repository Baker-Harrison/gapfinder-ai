import { useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useStore } from '@/store';
import {
  Home,
  BookOpen,
  FileText,
  Brain,
  BarChart3,
  Upload,
  Settings,
  Play,
  Target,
} from 'lucide-react';

interface CommandPaletteProps {
  onNavigate: (page: string) => void;
  onAction?: (action: string) => void;
}

export function CommandPalette({ onNavigate, onAction }: CommandPaletteProps) {
  const { commandPaletteOpen, setCommandPaletteOpen } = useStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const handleSelect = (callback: () => void) => {
    callback();
    setCommandPaletteOpen(false);
  };

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => handleSelect(() => onNavigate('home'))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate('learn'))}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Learn</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate('items'))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Items</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate('concepts'))}>
            <Brain className="mr-2 h-4 w-4" />
            <span>Concepts</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate('analytics'))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Analytics</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate('import'))}>
            <Upload className="mr-2 h-4 w-4" />
            <span>Import</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onNavigate('settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => handleSelect(() => onAction?.('start-session'))}>
            <Play className="mr-2 h-4 w-4" />
            <span>Start Session</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onAction?.('quick-diagnostic'))}>
            <Target className="mr-2 h-4 w-4" />
            <span>Quick Diagnostic (5 min)</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => onAction?.('practice-weakest'))}>
            <Brain className="mr-2 h-4 w-4" />
            <span>Practice Weakest Concept</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
