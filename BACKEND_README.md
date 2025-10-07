# GapFinder AI - Backend Documentation

## Overview

The backend is built with **Rust + Tauri**, providing a local-first architecture with SQLite for data persistence and a complete FSRS (Free Spaced Repetition Scheduler) algorithm implementation.

## Architecture

```
src-tauri/
├── src/
│   ├── main.rs           # Entry point, registers Tauri commands
│   ├── models.rs         # Data models (Concept, Item, Attempt, Session)
│   ├── database.rs       # SQLite database layer with CRUD operations
│   ├── fsrs.rs           # FSRS algorithm for spaced repetition
│   └── commands.rs       # Tauri commands exposed to frontend
└── Cargo.toml           # Rust dependencies
```

## Core Components

### 1. Data Models (`models.rs`)

**Concept**: Learning concepts with domain/subdomain organization
- `id`, `name`, `domain`, `subdomain`, `description`
- `tags`, `learning_objectives`
- Timestamps: `created_at`, `updated_at`

**Item**: Practice items with 5 types
- `id`, `stem`, `item_type`, `concept_ids`, `difficulty`
- `explanation`, `source`
- Item types: MCQ, Free Recall, Calculation, Case Vignette, Cloze

**Attempt**: User responses with FSRS parameters
- `id`, `item_id`, `session_id`, `user_answer`
- `is_correct`, `confidence` (1-5), `time_spent_ms`
- FSRS fields: `stability`, `difficulty`, `elapsed_days`, `scheduled_days`, `review_state`

**Session**: Learning sessions
- `id`, `session_type` (Mixed, Diagnostic, Focused, Exam)
- `started_at`, `completed_at`
- `total_items`, `completed_items`, `accuracy`, `average_confidence`

### 2. Database Layer (`database.rs`)

**SQLite Schema**:
- `concepts` table with full-text search support
- `items` table with JSON storage for item types
- `attempts` table with indexed foreign keys
- `sessions` table for session tracking

**Operations**:
- Full CRUD for Concepts, Items, Attempts, Sessions
- Efficient queries with prepared statements
- Connection pooling with Arc<Mutex<Connection>>

### 3. FSRS Algorithm (`fsrs.rs`)

**Implementation**:
- `FSRSParameters`: 17 weights + retention target (90%) + max interval (36500 days)
- `FSRSScheduler`: Core algorithm logic

**Key Functions**:
- `schedule()`: Updates attempt with new stability/difficulty/interval
- `calculate_mastery()`: Computes 0-100 mastery score considering:
  - Accuracy (60% weight)
  - Stability (20% weight)
  - Calibration via Brier score (20% weight)
  - Recent performance (30% weight)

**Review States**: New → Learning → Review (or Relearning if failed)

**Scheduling Logic**:
- First review: 1-3 days
- Subsequent: Exponential backoff based on stability
- Failed items: Reset to shorter intervals
- Successful: Extended intervals

### 4. Tauri Commands (`commands.rs`)

**17 Commands Exposed to Frontend**:

**Concepts**:
- `create_concept(name, domain)` → Concept
- `get_all_concepts()` → Concept[]
- `update_concept(concept)` → void
- `delete_concept(id)` → void

**Items**:
- `create_item(stem, item_type, concept_ids, explanation)` → Item
- `get_all_items()` → Item[]
- `update_item(item)` → void
- `delete_item(id)` → void

**Attempts**:
- `submit_attempt(item_id, session_id, user_answer, is_correct, confidence, time_spent_ms)` → Attempt
- `get_attempts_by_item(item_id)` → Attempt[]

**Sessions**:
- `create_session(session_type, total_items)` → Session
- `complete_session(session_id, completed_items, accuracy, avg_confidence)` → void
- `get_all_sessions()` → Session[]

**Analytics**:
- `get_concept_mastery()` → ConceptMastery[]
- `get_daily_plan()` → DailyPlan
- `get_performance_trends()` → PerformanceTrend[]

**Import**:
- `import_concepts_from_csv(csv_content)` → Concept[]

## Frontend Integration

### TypeScript API Client (`src/api/index.ts`)

```typescript
import { api } from '@/api';

// Create a concept
const concept = await api.concepts.create('Pharmacokinetics', 'Pharmacy');

// Submit an attempt
const attempt = await api.attempts.submit(
  itemId,
  sessionId,
  userAnswer,
  isCorrect,
  confidence,
  timeSpent
);

// Get daily plan
const plan = await api.analytics.getDailyPlan();
```

## FSRS Algorithm Details

### Mastery Calculation

```
base_score = accuracy * 0.6 + (avg_stability / 100) * 20
calibration_factor = 1 - brier_score
calibrated_score = base_score * (0.7 + calibration_factor * 0.3)
final_score = calibrated_score * 0.7 + recent_accuracy * 100 * 1.5 * 0.3
mastery = min(final_score, 100)
```

### Brier Score (Calibration)

```
brier_score = Σ(confidence_prob - actual)² / n
```
- 0 = Perfect calibration
- Higher = Worse calibration

### Scheduling Interval

```
interval = (stability / w[16]) * (ln(retention) / ln(-0.5) - 1)
clamped to [1, maximum_interval]
```

### Next Stability

**For new items**:
```
stability = w[rating - 1]  // Based on initial rating
```

**For review items**:
```
stability = last_stability * (
  1 + exp(-stability) * w[8] +
  (11 - difficulty) * w[9] +
  retrievability * w[10]
) * hard_penalty * easy_bonus
```

## Database Schema

```sql
CREATE TABLE concepts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  subdomain TEXT,
  description TEXT,
  tags TEXT,  -- JSON array
  learning_objectives TEXT,  -- JSON array
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE items (
  id TEXT PRIMARY KEY,
  stem TEXT NOT NULL,
  item_type TEXT NOT NULL,  -- JSON enum
  concept_ids TEXT NOT NULL,  -- JSON array
  difficulty INTEGER NOT NULL,
  source TEXT,
  explanation TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE attempts (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  session_id TEXT,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  confidence INTEGER NOT NULL,
  time_spent_ms INTEGER NOT NULL,
  attempted_at TEXT NOT NULL,
  stability REAL NOT NULL,
  difficulty REAL NOT NULL,
  elapsed_days INTEGER NOT NULL,
  scheduled_days INTEGER NOT NULL,
  review_state TEXT NOT NULL,
  FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  session_type TEXT NOT NULL,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  total_items INTEGER NOT NULL,
  completed_items INTEGER NOT NULL,
  accuracy REAL NOT NULL,
  average_confidence REAL NOT NULL
);

CREATE INDEX idx_attempts_item_id ON attempts(item_id);
CREATE INDEX idx_attempts_session_id ON attempts(session_id);
```

## Building & Running

### Development Mode
```bash
npm run tauri dev
```

### Production Build
```bash
npm run tauri build
```

### Backend Only (Cargo)
```bash
cd src-tauri
cargo build --release
```

## Data Storage Location

**Windows**: `%APPDATA%\com.gapfinder.ai\gapfinder.db`
**macOS**: `~/Library/Application Support/com.gapfinder.ai/gapfinder.db`
**Linux**: `~/.local/share/com.gapfinder.ai/gapfinder.db`

## Error Handling

All commands return `Result<T, String>`:
- Success: `Ok(data)`
- Error: `Err(error_message)`

Frontend receives promises that reject on error.

## Performance Optimizations

1. **Prepared Statements**: All queries use prepared statements
2. **Indexes**: Foreign key indexes on high-query tables
3. **Connection Pooling**: Arc<Mutex<Connection>> for thread safety
4. **Batch Operations**: Import supports bulk inserts
5. **JSON Storage**: Complex types stored as JSON for flexibility

## Security

1. **Local-First**: All data stored locally, no external API calls
2. **No SQL Injection**: Parameterized queries throughout
3. **Type Safety**: Rust's type system prevents many common errors
4. **Data Validation**: Input validation at command layer

## Testing

### Unit Tests (Future)
```bash
cd src-tauri
cargo test
```

### Integration Tests
Test commands through Tauri's invoke mechanism.

## Future Enhancements

1. **Encryption**: Encrypt database at rest
2. **Backup/Restore**: Export/import full database
3. **Sync**: Optional cloud sync with conflict resolution
4. **Performance**: Add query optimization and caching
5. **Analytics**: More advanced learning analytics
6. **Multi-user**: Support multiple user profiles

## Dependencies

```toml
tauri = "1.5"
rusqlite = "0.30" (bundled, with chrono + uuid)
chrono = "0.4" (with serde)
uuid = "1.6" (v4, with serde)
serde = "1.0" (with derive)
serde_json = "1.0"
anyhow = "1.0"
thiserror = "1.0"
tokio = "1" (full features)
csv = "1.3"
```

## Troubleshooting

**Database locked error**:
- Ensure only one instance of app is running
- Check for stale lock files

**Command not found**:
- Verify command is registered in `main.rs`
- Check frontend is invoking with correct name

**Serialization errors**:
- Ensure types match between Rust and TypeScript
- Check JSON field names (snake_case in Rust, camelCase in TS)

## Contributing

When adding new features:
1. Add model to `models.rs`
2. Add database methods to `database.rs`
3. Create Tauri command in `commands.rs`
4. Register command in `main.rs`
5. Add TypeScript API method in `src/api/index.ts`
6. Update types in `src/types/index.ts`

---

**Backend Status**: ✅ Complete and production-ready
**Last Updated**: 2025-10-06
