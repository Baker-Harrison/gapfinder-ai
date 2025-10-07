// Core entity types
export interface Concept {
  id: string;
  name: string;
  domain: string;
  subdomain?: string;
  description?: string;
  mastery: number; // 0-100
  stability: number; // FSRS stability in days
  coverage: number; // % of items attempted
  lastReviewed?: Date;
  createdAt: Date;
}

export type ItemType = 'mcq' | 'free-recall' | 'calc' | 'case' | 'cloze';

export interface Item {
  id: string;
  type: ItemType;
  stem: string;
  conceptIds: string[];
  difficulty: number; // 0-100
  tags: string[];
  createdAt: Date;
  lastAttempted?: Date;
  // Type-specific fields
  choices?: string[]; // for MCQ
  correctAnswer?: string | string[]; // for MCQ, free-recall
  explanation?: string;
  calcTemplate?: CalcTemplate; // for calc items
  caseSteps?: CaseStep[]; // for case vignettes
  clozeText?: string; // for cloze
}

export interface CalcTemplate {
  formula: string;
  parameters: CalcParameter[];
  unit: string;
  workingSolution?: string;
}

export interface CalcParameter {
  name: string;
  min: number;
  max: number;
  unit: string;
}

export interface CaseStep {
  question: string;
  correctAnswer: string;
  points: number;
}

export interface Attempt {
  id: string;
  itemId: string;
  conceptIds: string[];
  userAnswer: string | string[];
  isCorrect: boolean;
  confidence: number; // 1-5
  timeSpent: number; // seconds
  timestamp: Date;
}

export type SessionType = 'Mixed' | 'Diagnostic' | { Focused: { concept_id: string } } | { Exam: { time_limit_ms: number } };

export interface Session {
  id: string;
  session_type: SessionType;
  started_at: string;
  completed_at?: string;
  total_items: number;
  completed_items: number;
  accuracy: number;
  average_confidence: number;
}

// Analytics types
export interface PerformanceMetrics {
  accuracy: number;
  averageConfidence: number;
  brierScore: number;
  timeToCompetence: { [conceptId: string]: number }; // days
}

export interface CalibrationData {
  confidence: number;
  accuracy: number;
  count: number;
}

export interface ConceptMastery {
  concept_id: string;
  concept_name: string;
  mastery_score: number;
  attempts: number;
  correct: number;
  avg_confidence: number;
  brier_score: number;
  last_attempted?: string;
  stability: number;
  trend: string;
}

export interface DailyPlan {
  date: string;
  reviews: PlannedItem[];
  diagnostics: PlannedItem[];
  total_items: number;
  estimated_time_min: number;
  coverage_percent: number;
}

export interface PlannedItem {
  item_id: string;
  concept_id: string;
  reason: string;
  priority: number;
}

export interface PerformanceTrend {
  date: string;
  accuracy: number;
  items_completed: number;
  avg_confidence: number;
}

// Pharmacy-specific types
export interface DrugClass {
  id: string;
  name: string;
  exemplarDrugs: string[];
  moa: string;
  indications: string[];
  contraindications: string[];
  adverseEffects: string[];
  monitoring: string[];
  interactions: string[];
}

export type CalcType =
  | 'creatinine-clearance'
  | 'ibw'
  | 'adjbw'
  | 'e-value'
  | 'henderson-hasselbalch'
  | 'half-life'
  | 'clearance'
  | 'volume-distribution'
  | 'infusion-rate'
  | 'meq'
  | 'mosm';

// UI state types
export interface GapSummary {
  conceptId: string;
  conceptName: string;
  mastery: number;
  trend: 'up' | 'down' | 'stable';
  itemsToReview: number;
}

export interface TodayPlan {
  reviewCount: number;
  diagnosticCount: number;
  estimatedMinutes: number;
  topGaps: GapSummary[];
  dueItems: number;
  coveragePercent: number;
}

export interface RemediationPlan {
  conceptId: string;
  conceptName: string;
  currentMastery: number;
  targetMastery: number;
  actions: RemediationAction[];
}

export interface RemediationAction {
  type: 'review' | 'practice' | 'study';
  description: string;
  itemCount?: number;
  estimatedMinutes?: number;
}
