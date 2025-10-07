# GapFinder AI - Design Specification

## Design System

### Color Palette

#### Light Mode
- **Background**: `hsl(0, 0%, 100%)` - Pure white
- **Foreground**: `hsl(222.2, 84%, 4.9%)` - Near black
- **Primary**: `hsl(221.2, 83.2%, 53.3%)` - Blue
- **Secondary**: `hsl(210, 40%, 96.1%)` - Light gray
- **Muted**: `hsl(210, 40%, 96.1%)` - Light gray
- **Success**: `hsl(142, 76%, 36%)` - Green
- **Warning**: `hsl(48, 96%, 53%)` - Yellow
- **Destructive**: `hsl(0, 84.2%, 60.2%)` - Red
- **Border**: `hsl(214.3, 31.8%, 91.4%)` - Light border

#### Dark Mode
- **Background**: `hsl(222.2, 84%, 4.9%)` - True black
- **Foreground**: `hsl(210, 40%, 98%)` - Off white
- **Primary**: `hsl(217.2, 91.2%, 59.8%)` - Lighter blue
- **Secondary**: `hsl(217.2, 32.6%, 17.5%)` - Dark gray
- **Muted**: `hsl(217.2, 32.6%, 17.5%)` - Dark gray
- **Success**: `hsl(142, 76%, 36%)` - Green (same)
- **Warning**: `hsl(48, 96%, 53%)` - Yellow (same)
- **Destructive**: `hsl(0, 62.8%, 30.6%)` - Darker red
- **Border**: `hsl(217.2, 32.6%, 17.5%)` - Dark border

### Typography

- **Font Family**: System font stack (default)
- **Font Sizes**:
  - `xs`: 0.75rem (12px)
  - `sm`: 0.875rem (14px)
  - `base`: 1rem (16px)
  - `lg`: 1.125rem (18px)
  - `xl`: 1.25rem (20px)
  - `2xl`: 1.5rem (24px)
  - `3xl`: 1.875rem (30px)

- **Font Weights**:
  - `normal`: 400
  - `medium`: 500
  - `semibold`: 600
  - `bold`: 700

### Spacing

12-column grid with consistent spacing scale:
- `1`: 0.25rem (4px)
- `2`: 0.5rem (8px)
- `3`: 0.75rem (12px)
- `4`: 1rem (16px)
- `6`: 1.5rem (24px)
- `8`: 2rem (32px)
- `12`: 3rem (48px)

### Border Radius

- `sm`: 0.375rem (6px)
- `md`: 0.5rem (8px)
- `lg`: 0.75rem (12px)
- `full`: 9999px (circular)

## Component Specifications

### Button

**Variants:**
- `default`: Primary blue background
- `destructive`: Red background for dangerous actions
- `outline`: Transparent with border
- `secondary`: Light gray background
- `ghost`: Transparent, shows background on hover
- `link`: Text-only with underline
- `success`: Green background for positive actions

**Sizes:**
- `sm`: h-9 px-3
- `default`: h-10 px-4
- `lg`: h-11 px-8
- `icon`: h-10 w-10 (square)

**States:**
- Default: Base colors
- Hover: 90% opacity or darker shade
- Focus: 2px ring with offset
- Disabled: 50% opacity, no pointer events

### Card

**Structure:**
- Container: Rounded border with shadow
- Header: p-6 with title and optional description
- Content: p-6 pt-0
- Footer: p-6 pt-0 with flex layout

**Usage:**
- Primary content containers
- Dashboard widgets
- Form sections
- List items

### Input

**Variants:**
- Text input: Single line
- Textarea: Multi-line
- Number: With step controls
- File: Upload button

**States:**
- Default: Border with subtle background
- Focus: Ring with primary color
- Error: Red border and ring
- Disabled: Muted colors, no interaction

### Badge

**Variants:**
- `default`: Primary background
- `secondary`: Gray background
- `outline`: Transparent with border
- `destructive`: Red background
- `success`: Green background
- `warning`: Yellow background

**Usage:**
- Status indicators
- Tags and labels
- Counts and metrics

## Layout Specifications

### Sidebar

**Dimensions:**
- Expanded: 256px (w-64)
- Collapsed: 64px (w-16)
- Height: 100vh

**Structure:**
- Logo/branding: h-16 border-b
- Navigation: flex-1 with scrolling
- Items: Full width buttons with icons

**Behavior:**
- Toggle via hamburger menu
- Persists state in localStorage
- Smooth transition (200ms)

### Header

**Dimensions:**
- Height: 64px (h-16)
- Full width with border-bottom

**Structure:**
- Left: Sidebar toggle + search
- Right: Notifications + theme toggle + profile

**Search:**
- Expandable input with ⌘K shortcut
- Opens command palette

### Main Content Area

**Dimensions:**
- Flex: 1 (fills remaining space)
- Padding: 24px (p-6)
- Overflow: auto

**Structure:**
- Page title and description
- Content cards with consistent spacing
- Responsive grid layouts

## Screen Specifications

### Home (Today)

**Layout:**
```
┌─────────────────────────────────────────┐
│ Title + Description                     │
├─────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐      │
│ │ Today's Plan │ │   Coverage   │      │
│ │  (2 cols)    │ │   (1 col)    │      │
│ └──────────────┘ └──────────────┘      │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │         Top Gaps (full width)       │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐      │
│ │ Action │ │ Action │ │ Action │      │
│ └────────┘ └────────┘ └────────┘      │
└─────────────────────────────────────────┘
```

**Components:**
- Today's Plan card: Shows counts and action buttons
- Coverage card: Progress bar and percentage
- Top Gaps: List of 5 weakest concepts
- Quick Actions: 3-column grid of action cards

### Learn (Session Player)

**Layout:**
```
┌─────────────────────────────────────────┬──────────┐
│ Progress Bar + Timer + Controls         │          │
├─────────────────────────────────────────┤ Context  │
│                                         │  Pane    │
│         Item Content (centered)         │ (320px)  │
│                                         │          │
│         Answer Controls                 │          │
│                                         │          │
│         Confidence Slider               │          │
│                                         │          │
└─────────────────────────────────────────┴──────────┘
```

**Components:**
- Progress bar: Linear progress at top
- Item stem: Large, readable text
- Answer controls: Type-specific (MCQ, input, etc.)
- Confidence slider: 1-5 scale
- Context pane: Linked concepts, shortcuts

### Concepts (Heatmap)

**Layout:**
```
┌─────────────────────────────────────────┬──────────┐
│ Title + Search + Filters                │          │
├─────────────────────────────────────────┤          │
│ ┌─────────────────────────────────────┐ │ Concept  │
│ │         Domain 1                    │ │ Details  │
│ │  ┌──┬──┬──┬──┬──┬──┬──┬──┐        │ │ Drawer   │
│ │  │  │  │  │  │  │  │  │  │        │ │ (384px)  │
│ │  └──┴──┴──┴──┴──┴──┴──┴──┘        │ │          │
│ └─────────────────────────────────────┘ │ (when    │
│ ┌─────────────────────────────────────┐ │ concept  │
│ │         Domain 2                    │ │ selected)│
│ │  ┌──┬──┬──┬──┬──┬──┬──┬──┐        │ │          │
│ │  │  │  │  │  │  │  │  │  │        │ │          │
│ │  └──┴──┴──┴──┴──┴──┴──┴──┘        │ │          │
│ └─────────────────────────────────────┘ │          │
└─────────────────────────────────────────┴──────────┘
```

**Components:**
- Heatmap grid: Color-coded cells by mastery
- Domain cards: Grouped by domain
- Filters: Weak, low stability, search
- Drawer: Concept details and actions

### Items (Bank & Authoring)

**Layout:**
```
┌─────────────────────────────────────────┐
│ Title + Search + Actions                │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │         Data Table                  │ │
│ │  Stem | Type | Concepts | Actions   │ │
│ │  ─────┼──────┼──────────┼─────────  │ │
│ │  ...  │ MCQ  │ Cardio   │ Edit Del  │ │
│ │  ...  │ Calc │ Renal    │ Edit Del  │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Components:**
- Search and filters: Type, concept, tags
- Data table: Sortable columns
- Action buttons: Edit, duplicate, delete
- Author dialog: Tabbed interface for item types

### Analytics

**Layout:**
```
┌─────────────────────────────────────────┐
│ Title + Summary Cards (4 cols)          │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ Tabs: Performance | Calibration |   │ │
│ │       Errors | Domains              │ │
│ ├─────────────────────────────────────┤ │
│ │                                     │ │
│ │         Charts and Visualizations   │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Components:**
- Summary cards: Key metrics at top
- Tabs: Different analytics views
- Charts: Line, bar, scatter plots
- Tables: Error types, domain breakdown

## Interaction Patterns

### Keyboard Navigation

**Global:**
- `⌘/Ctrl + K`: Open command palette
- `Tab`: Navigate between focusable elements
- `Shift + Tab`: Navigate backwards
- `Esc`: Close dialogs/drawers

**Session Player:**
- `1-5`: Select MCQ option
- `Enter`: Submit answer
- `F`: Flag item
- `G`: Open concept drawer
- `C`: Focus confidence slider

### Focus Management

- Visible focus rings (2px, primary color)
- Skip to main content link
- Focus trap in modals
- Return focus on close

### Loading States

- Skeleton screens for initial load
- Spinner for actions
- Optimistic UI updates
- Error boundaries for failures

### Empty States

- Friendly illustrations
- Clear explanation
- Primary action button
- Example or help link

## Accessibility Requirements

### WCAG AA+ Compliance

- **Contrast Ratios:**
  - Normal text: 4.5:1 minimum
  - Large text: 3:1 minimum
  - UI components: 3:1 minimum

- **Keyboard:**
  - All interactive elements accessible
  - Logical tab order
  - Visible focus indicators

- **Screen Readers:**
  - Semantic HTML
  - ARIA labels and roles
  - Live regions for dynamic content

- **Color:**
  - Don't rely on color alone
  - Patterns or text labels
  - High contrast mode support

### Testing Checklist

- [ ] Keyboard-only navigation works
- [ ] Screen reader announces content
- [ ] Focus visible on all elements
- [ ] Color contrast meets WCAG AA
- [ ] Form errors clearly indicated
- [ ] Loading states announced
- [ ] Modals trap focus
- [ ] Skip links present

## Responsive Behavior

### Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1400px

### Desktop-First Approach

Primary target: 1400x900 desktop
- Sidebar: Always visible (can collapse)
- Multi-column layouts
- Hover states
- Keyboard shortcuts

### Scaling Support

- 125% - 175% Windows scaling
- Relative units (rem, em)
- Flexible layouts
- Readable at all scales

## Microcopy Guidelines

### Tone

- **Concise**: Get to the point quickly
- **Professional**: Avoid slang or jargon
- **Encouraging**: Positive reinforcement
- **Clear**: No ambiguity

### Examples

**Good:**
- "No data yet. Run a 5-minute diagnostic to surface your top gaps."
- "We've prioritized 14 items to raise Acid–Base mastery from 62 → 80."
- "How sure were you? (1=guess, 5=absolutely sure)"

**Avoid:**
- "Oops! Something went wrong!" (too casual)
- "Utilize the diagnostic functionality" (too formal)
- "Click here" (not descriptive)

### Error Messages

- Explain what happened
- Suggest how to fix it
- Provide support link if needed

**Example:**
"Failed to import CSV. Check that the file has required columns: stem, type, correct."

## Animation & Transitions

### Principles

- **Subtle**: 200ms duration
- **Purposeful**: Guide attention
- **Smooth**: Ease-in-out timing
- **Optional**: Respect prefers-reduced-motion

### Common Transitions

- Page changes: Fade (200ms)
- Drawer open/close: Slide (200ms)
- Hover states: Background (200ms)
- Focus rings: Instant (0ms)
- Progress bars: Linear (smooth)

### Celebrations

- Milestone achievements: Confetti animation
- Session completion: Success badge
- Mastery threshold: Color pulse

## Performance Targets

- **Initial Load**: < 2s
- **Page Navigation**: < 100ms
- **Search Results**: < 300ms
- **Chart Rendering**: < 500ms
- **Drawer Open**: < 200ms

## Browser Support

- **Chrome**: 105+
- **Edge**: 105+
- **Firefox**: 100+
- **Safari**: 13+

## Export Formats

### Screenshots
- PNG format
- 1400x900 resolution
- Light and dark mode variants

### Design Files
- Figma components
- Tokens (colors, spacing, typography)
- Icon library
- Prototype flows

## Handoff Checklist

- [ ] All screens designed (light + dark)
- [ ] Component library complete
- [ ] Interaction states documented
- [ ] Accessibility annotations
- [ ] Responsive breakpoints defined
- [ ] Copy finalized
- [ ] Assets exported
- [ ] Prototype tested with users
