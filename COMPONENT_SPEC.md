# Component Specification

## UI Component Library

All components are built using Radix UI primitives + Tailwind CSS, following the shadcn/ui pattern.

---

## Core Components

### Button

**File:** `src/components/ui/button.tsx`

**Props:**
```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}
```

**Variants:**
- `default`: Primary action (blue background)
- `destructive`: Dangerous action (red background)
- `outline`: Secondary action (border only)
- `secondary`: Tertiary action (gray background)
- `ghost`: Minimal action (transparent)
- `link`: Text link (underlined)
- `success`: Positive action (green background)

**Usage:**
```tsx
<Button variant="default" size="lg">Start Session</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="ghost" size="icon"><Icon /></Button>
```

---

### Card

**File:** `src/components/ui/card.tsx`

**Components:**
- `Card`: Container
- `CardHeader`: Top section
- `CardTitle`: Heading
- `CardDescription`: Subheading
- `CardContent`: Main content
- `CardFooter`: Bottom section

**Usage:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

### Badge

**File:** `src/components/ui/badge.tsx`

**Props:**
```typescript
interface BadgeProps {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';
}
```

**Usage:**
```tsx
<Badge variant="default">New</Badge>
<Badge variant="success">Completed</Badge>
<Badge variant="warning">Due Soon</Badge>
```

---

### Input

**File:** `src/components/ui/input.tsx`

**Props:** Standard HTML input props

**Usage:**
```tsx
<Input type="text" placeholder="Enter text..." />
<Input type="number" min={0} max={100} />
<Input type="file" accept=".csv" />
```

---

### Label

**File:** `src/components/ui/label.tsx`

**Usage:**
```tsx
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

---

### Progress

**File:** `src/components/ui/progress.tsx`

**Props:**
```typescript
interface ProgressProps {
  value?: number; // 0-100
}
```

**Usage:**
```tsx
<Progress value={75} />
```

---

### Slider

**File:** `src/components/ui/slider.tsx`

**Props:**
```typescript
interface SliderProps {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}
```

**Usage:**
```tsx
<Slider
  value={[confidence]}
  onValueChange={(v) => setConfidence(v[0])}
  min={1}
  max={5}
  step={1}
/>
```

---

### Tabs

**File:** `src/components/ui/tabs.tsx`

**Components:**
- `Tabs`: Container
- `TabsList`: Tab buttons container
- `TabsTrigger`: Individual tab button
- `TabsContent`: Tab panel

**Usage:**
```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

---

### Dialog

**File:** `src/components/ui/dialog.tsx`

**Components:**
- `Dialog`: Root
- `DialogTrigger`: Opens dialog
- `DialogContent`: Modal content
- `DialogHeader`: Top section
- `DialogTitle`: Heading
- `DialogDescription`: Subheading
- `DialogFooter`: Bottom section

**Usage:**
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <div>Content</div>
    <DialogFooter>
      <Button onClick={() => setOpen(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Toast

**File:** `src/components/ui/toast.tsx`, `src/components/ui/use-toast.ts`

**Hook:**
```typescript
const { toast } = useToast();

toast({
  title: "Success",
  description: "Item saved successfully",
  variant: "success",
});
```

**Variants:**
- `default`: Neutral
- `destructive`: Error
- `success`: Success

---

### Command Palette

**File:** `src/components/ui/command.tsx`

**Components:**
- `Command`: Root
- `CommandInput`: Search input
- `CommandList`: Results list
- `CommandEmpty`: No results state
- `CommandGroup`: Grouped items
- `CommandItem`: Individual item
- `CommandSeparator`: Divider

**Usage:**
```tsx
<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Actions">
      <CommandItem onSelect={handleAction}>
        <Icon className="mr-2 h-4 w-4" />
        <span>Action</span>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

---

## Layout Components

### Sidebar

**File:** `src/components/layout/Sidebar.tsx`

**Props:**
```typescript
interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
}
```

**Features:**
- Collapsible (64px ↔ 256px)
- Active page highlighting
- Keyboard navigation
- Icon-only when collapsed

---

### Header

**File:** `src/components/layout/Header.tsx`

**Props:**
```typescript
interface HeaderProps {
  onToggleSidebar: () => void;
}
```

**Features:**
- Search/command palette trigger
- Notifications badge
- Theme toggle
- Profile avatar

---

### CommandPalette

**File:** `src/components/CommandPalette.tsx`

**Props:**
```typescript
interface CommandPaletteProps {
  onNavigate: (page: string) => void;
  onAction?: (action: string) => void;
}
```

**Features:**
- ⌘K / Ctrl+K to open
- Navigation commands
- Quick actions
- Fuzzy search

---

## Utility Functions

### cn (className merger)

**File:** `src/lib/utils.ts`

```typescript
function cn(...inputs: ClassValue[]): string
```

Merges Tailwind classes with proper precedence.

**Usage:**
```tsx
<div className={cn("base-class", condition && "conditional-class", className)} />
```

---

### formatDuration

**File:** `src/lib/utils.ts`

```typescript
function formatDuration(minutes: number): string
```

Formats minutes into human-readable duration.

**Examples:**
- `formatDuration(25)` → "25m"
- `formatDuration(90)` → "1h 30m"
- `formatDuration(120)` → "2h"

---

### getMasteryColor

**File:** `src/lib/utils.ts`

```typescript
function getMasteryColor(mastery: number): string
```

Returns HSL color based on mastery level.

**Thresholds:**
- ≥80: Green `hsl(142, 76%, 36%)`
- 70-79: Yellow `hsl(48, 96%, 53%)`
- 50-69: Orange `hsl(25, 95%, 53%)`
- <50: Red `hsl(0, 84%, 60%)`

---

### getMasteryLabel

**File:** `src/lib/utils.ts`

```typescript
function getMasteryLabel(mastery: number): string
```

Returns text label for mastery level.

**Labels:**
- ≥80: "Strong"
- 70-79: "Developing"
- 50-69: "Weak"
- <50: "Critical Gap"

---

## State Management

### Store (Zustand)

**File:** `src/store/index.ts`

**State:**
```typescript
interface AppState {
  // Data
  concepts: Concept[];
  items: Item[];
  attempts: Attempt[];
  sessions: Session[];
  currentSession: Session | null;

  // UI
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;

  // Actions
  setConcepts: (concepts: Concept[]) => void;
  setItems: (items: Item[]) => void;
  addAttempt: (attempt: Attempt) => void;
  startSession: (session: Session) => void;
  updateSession: (session: Session) => void;
  completeSession: () => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;

  // Computed
  getTodayPlan: () => TodayPlan;
  getTopGaps: (limit: number) => GapSummary[];
  getConceptById: (id: string) => Concept | undefined;
  getItemById: (id: string) => Item | undefined;
  getRemediationPlan: (conceptId: string) => RemediationPlan;
}
```

**Usage:**
```tsx
const { concepts, theme, toggleTheme } = useStore();
```

---

## Type Definitions

### Core Types

**File:** `src/types/index.ts`

**Concept:**
```typescript
interface Concept {
  id: string;
  name: string;
  domain: string;
  subdomain?: string;
  description?: string;
  mastery: number; // 0-100
  stability: number; // days
  coverage: number; // 0-100
  lastReviewed?: Date;
  createdAt: Date;
}
```

**Item:**
```typescript
type ItemType = 'mcq' | 'free-recall' | 'calc' | 'case' | 'cloze';

interface Item {
  id: string;
  type: ItemType;
  stem: string;
  conceptIds: string[];
  difficulty: number; // 0-100
  tags: string[];
  createdAt: Date;
  lastAttempted?: Date;
  choices?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  calcTemplate?: CalcTemplate;
  caseSteps?: CaseStep[];
  clozeText?: string;
}
```

**Attempt:**
```typescript
interface Attempt {
  id: string;
  itemId: string;
  conceptIds: string[];
  userAnswer: string | string[];
  isCorrect: boolean;
  confidence: number; // 1-5
  timeSpent: number; // seconds
  timestamp: Date;
}
```

---

## Icon Usage

**Library:** Lucide React

**Common Icons:**
- `Home`: Home page
- `BookOpen`: Learn/study
- `FileText`: Items/documents
- `Brain`: Concepts/knowledge
- `BarChart3`: Analytics/stats
- `Upload`: Import/upload
- `Settings`: Settings/config
- `Search`: Search functionality
- `Play`: Start/begin
- `Target`: Goals/objectives
- `CheckCircle2`: Success/correct
- `XCircle`: Error/incorrect
- `AlertTriangle`: Warning
- `TrendingUp/Down`: Trends

**Usage:**
```tsx
import { Home, Play, CheckCircle2 } from 'lucide-react';

<Home className="h-5 w-5" />
<Play className="h-4 w-4" />
```

---

## Styling Conventions

### Tailwind Classes

**Spacing:**
- Use consistent spacing scale (4, 6, 8, 12)
- `gap-4` for flex/grid gaps
- `p-6` for card padding
- `space-y-4` for vertical stacking

**Colors:**
- Use semantic tokens: `bg-primary`, `text-muted-foreground`
- Avoid hardcoded colors
- Use opacity modifiers: `bg-primary/10`

**Borders:**
- `border` for 1px borders
- `rounded-md` for medium radius
- `shadow-sm` for subtle shadows

**Typography:**
- `text-sm` for body text
- `text-2xl font-bold` for headings
- `text-muted-foreground` for secondary text

### Component Patterns

**Conditional Classes:**
```tsx
className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "primary" && "primary-classes"
)}
```

**Responsive:**
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

**States:**
```tsx
className="hover:bg-accent focus-visible:ring-2 disabled:opacity-50"
```

---

## Testing Considerations

### Component Testing
- Test all variants and sizes
- Test keyboard navigation
- Test screen reader labels
- Test error states
- Test loading states

### Integration Testing
- Test complete user flows
- Test data persistence
- Test navigation
- Test command palette
- Test theme switching

### Accessibility Testing
- Keyboard-only navigation
- Screen reader compatibility
- Color contrast validation
- Focus management
- ARIA attributes
