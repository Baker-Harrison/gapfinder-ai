# GapFinder AI - Knowledge Gap Finder

A local-first desktop application for identifying and closing knowledge gaps in professional and academic learning, with first-class support for pharmacy education.

## Features

### Core Functionality
- **Smart Gap Detection**: Identifies weak concepts using mastery scores and FSRS-based stability
- **Adaptive Learning**: Spaced repetition scheduling optimized for long-term retention
- **Multiple Item Types**: MCQ, free recall, calculations, case vignettes, and cloze deletion
- **Visual Heatmap**: Interactive concept mastery visualization across domains
- **Analytics Dashboard**: Performance tracking, calibration analysis, and error patterns

### Pharmacy-Specific Features
- **Drug Class Taxonomies**: Built-in support for MOA, indications, contraindications, and interactions
- **Calculation Templates**: Pre-configured formulas for CrCl, IBW, E-value, kinetics, and more
- **Unit Checking**: Automatic validation and conversion for pharmaceutical calculations
- **Clinical Cases**: Multi-step case vignettes with partial credit rubrics

### Import & Export
- **Learning Objectives**: Paste LOs to auto-generate concepts
- **CSV/TSV Import**: Bulk import with intelligent concept mapping
- **Anki Bridge**: Import Anki decks and sync via AnkiConnect
- **Backup & Restore**: Local encryption and automatic backups

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI Components**: Radix UI + Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Charts**: Recharts
- **Desktop**: Tauri (Rust backend)
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Rust 1.70+ (for Tauri)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
npm run tauri build
```

## Project Structure

```
gapfinder-ai/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (shadcn/ui)
│   │   ├── layout/          # Layout components (Sidebar, Header)
│   │   └── CommandPalette.tsx
│   ├── pages/
│   │   ├── Home.tsx         # Today's plan and top gaps
│   │   ├── Learn.tsx        # Session player with all item types
│   │   ├── Concepts.tsx     # Heatmap visualization
│   │   ├── Items.tsx        # Item bank and authoring
│   │   ├── Analytics.tsx    # Performance and calibration
│   │   ├── Import.tsx       # Import pipelines
│   │   └── Settings.tsx     # App configuration
│   ├── store/
│   │   └── index.ts         # Zustand state management
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx              # Main application
│   ├── App.css              # Global styles and theme
│   └── main.tsx             # Entry point
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Key Features Explained

### 1. Home (Today)
- **Today's Plan**: Shows review count, diagnostic count, and estimated time
- **Top Gaps**: Lists 5 weakest concepts with mastery scores and trends
- **Coverage**: Displays percentage of syllabus attempted
- **Quick Actions**: Start session, quick diagnostic, review only

### 2. Learn (Session Player)
- **Item Types**: MCQ (single/multi), free recall, calculations, cases, cloze
- **Confidence Rating**: 1-5 scale for calibration tracking
- **Instant Feedback**: Correct/incorrect with detailed explanations
- **Context Pane**: Linked concepts, difficulty, prior attempts
- **Keyboard Navigation**: Full keyboard support (1-5 for options, Enter to submit)

### 3. Concepts (Heatmap)
- **Visual Grid**: Color-coded cells by mastery level
- **Drill-Down**: Click any cell to see concept details
- **Filters**: Weak first, below threshold, low stability
- **Remediation Plans**: Actionable next steps to reach 80% mastery

### 4. Items (Bank & Authoring)
- **Table View**: Searchable, filterable item list
- **Bulk Operations**: Import CSV, map to concepts, duplicate
- **Authoring Form**: Create MCQ, calc, free recall, case, or cloze items
- **Live Preview**: See how items will appear during practice

### 5. Analytics
- **Performance**: Accuracy over time, blueprint coverage
- **Calibration**: Accuracy vs confidence scatter plot, Brier score
- **Error Bank**: Top error types with drill links
- **Domain Breakdown**: Mastery by domain with visual charts

### 6. Import
- **Learning Objectives**: Auto-create concepts from pasted LOs
- **CSV/TSV**: Validate and map items with preview
- **Anki Decks**: Import .apkg files with tag mapping

### 7. Settings
- **General**: Theme, font size, date/number formats
- **SRS**: FSRS parameters, desired retention, max interval
- **Thresholds**: Mastery and stability thresholds
- **Privacy**: Local encryption, backup/restore, Anki bridge

## Keyboard Shortcuts

- **⌘/Ctrl + K**: Open command palette
- **1-5**: Select MCQ option (during session)
- **Enter**: Submit answer
- **F**: Flag item
- **G**: Open concept drawer
- **C**: Set confidence rating

## Accessibility

- Full keyboard navigation with visible focus rings
- Screen reader labels for all controls
- ARIA live regions for feedback
- WCAG AA+ contrast ratios
- Color-safe palettes (don't rely on color alone)

## Design Principles

1. **Clarity > Cleverness**: Straightforward UI over fancy animations
2. **Speed of Insight**: Minimal clicks to actionable information
3. **High Signal Density**: Information-rich without clutter
4. **Auditability**: Always show why a recommendation is made
5. **Keyboard-First**: Efficient navigation for power users

## Pharmacy Calculation Templates

Built-in support for:
- **Cockcroft-Gault CrCl**: Creatinine clearance estimation
- **IBW/AdjBW**: Ideal and adjusted body weight
- **E-value**: Isotonicity calculations
- **Henderson-Hasselbalch**: pH and pKa calculations
- **Kinetics**: Half-life, clearance, volume of distribution
- **Infusion Rates**: IV drip calculations
- **mEq/mOsm**: Electrolyte conversions

## Data Storage

All data is stored locally using:
- **IndexedDB**: For structured data (concepts, items, attempts)
- **Local Storage**: For user preferences
- **Optional Encryption**: AES-256 for sensitive data
- **Automatic Backups**: Daily backups to user-specified location

## Contributing

This is a reference implementation. Key areas for extension:
- Additional calculation templates
- More sophisticated FSRS parameter optimization
- Advanced analytics (learning curves, forgetting curves)
- Collaborative features (share decks, compare performance)
- Mobile companion app

## License

MIT License - See LICENSE file for details

## Acknowledgments

- **FSRS Algorithm**: Free Spaced Repetition Scheduler
- **shadcn/ui**: Beautiful component library
- **Radix UI**: Accessible primitives
- **Tauri**: Lightweight desktop framework
# gapfinder-ai
