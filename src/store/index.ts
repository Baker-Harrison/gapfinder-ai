import { create } from 'zustand';
import { api } from '@/api';
import type {
  Concept,
  Item,
  Attempt,
  Session,
  TodayPlan,
  GapSummary,
  RemediationPlan,
  ConceptMastery,
  DailyPlan,
} from '@/types';

interface AppState {
  // Data
  concepts: Concept[];
  items: Item[];
  conceptMastery: ConceptMastery[];
  sessions: Session[];
  currentSession: Session | null;
  dailyPlan: DailyPlan | null;

  // Loading states
  loading: boolean;
  error: string | null;

  // UI state
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;

  // Backend actions
  loadConcepts: () => Promise<void>;
  loadItems: () => Promise<void>;
  loadConceptMastery: () => Promise<void>;
  loadDailyPlan: () => Promise<void>;
  loadSessions: () => Promise<void>;
  createConcept: (name: string, domain: string) => Promise<void>;
  deleteConcept: (id: string) => Promise<void>;
  createItem: (stem: string, itemType: any, conceptIds: string[], explanation: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  submitAttempt: (itemId: string, sessionId: string | null, userAnswer: string, isCorrect: boolean, confidence: number, timeSpent: number) => Promise<void>;
  createSession: (sessionType: any, totalItems: number) => Promise<void>;
  completeCurrentSession: (completedItems: number, accuracy: number, avgConfidence: number) => Promise<void>;
  clearDatabase: () => Promise<void>;

  // UI Actions
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

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  concepts: [],
  items: [],
  conceptMastery: [],
  sessions: [],
  currentSession: null,
  dailyPlan: null,
  loading: false,
  error: null,
  theme: 'light',
  sidebarCollapsed: false,
  commandPaletteOpen: false,

  // Backend actions
  loadConcepts: async () => {
    try {
      set({ loading: true, error: null });
      const concepts = await api.concepts.getAll();
      set({ concepts: concepts as any, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  loadItems: async () => {
    try {
      set({ loading: true, error: null });
      const items = await api.items.getAll();
      set({ items: items as any, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  loadConceptMastery: async () => {
    try {
      const conceptMastery = await api.analytics.getConceptMastery();
      set({ conceptMastery });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  loadDailyPlan: async () => {
    try {
      const dailyPlan = await api.analytics.getDailyPlan();
      set({ dailyPlan });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  loadSessions: async () => {
    try {
      const sessions = await api.sessions.getAll();
      set({ sessions });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  createConcept: async (name: string, domain: string) => {
    try {
      set({ loading: true, error: null });
      await api.concepts.create(name, domain);
      await get().loadConcepts();
      await get().loadConceptMastery();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteConcept: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await api.concepts.delete(id);
      await get().loadConcepts();
      await get().loadConceptMastery();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createItem: async (stem: string, itemType: any, conceptIds: string[], explanation: string) => {
    try {
      set({ loading: true, error: null });
      await api.items.create(stem, itemType, conceptIds, explanation);
      await get().loadItems();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteItem: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await api.items.delete(id);
      await get().loadItems();
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  submitAttempt: async (itemId: string, sessionId: string | null, userAnswer: string, isCorrect: boolean, confidence: number, timeSpent: number) => {
    try {
      await api.attempts.submit(itemId, sessionId, userAnswer, isCorrect, confidence, timeSpent);
      await get().loadConceptMastery();
      await get().loadDailyPlan();
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  createSession: async (sessionType: any, totalItems: number) => {
    try {
      const session = await api.sessions.create(sessionType, totalItems);
      set({ currentSession: session });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  completeCurrentSession: async (completedItems: number, accuracy: number, avgConfidence: number) => {
    try {
      const session = get().currentSession;
      if (session) {
        await api.sessions.complete(session.id, completedItems, accuracy, avgConfidence);
        set({ currentSession: null });
        await get().loadSessions();
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  clearDatabase: async () => {
    try {
      set({ loading: true, error: null });
      await api.database.clearAll();
      set({ concepts: [], items: [], conceptMastery: [], sessions: [], currentSession: null, dailyPlan: null, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  // UI Actions
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  // Computed
  getTodayPlan: () => {
    const state = get();
    const plan = state.dailyPlan;
    
    if (!plan) {
      return {
        reviewCount: 0,
        diagnosticCount: 0,
        estimatedMinutes: 0,
        topGaps: [],
        dueItems: 0,
        coveragePercent: 0,
      };
    }

    const topGaps = state.getTopGaps(5);
    
    return {
      reviewCount: plan.reviews.length,
      diagnosticCount: plan.diagnostics.length,
      estimatedMinutes: plan.estimated_time_min,
      topGaps,
      dueItems: plan.total_items,
      coveragePercent: plan.coverage_percent,
    };
  },

  getTopGaps: (limit: number) => {
    const state = get();
    return state.conceptMastery
      .filter((c) => c.mastery_score < 70)
      .sort((a, b) => a.mastery_score - b.mastery_score)
      .slice(0, limit)
      .map((c) => ({
        conceptId: c.concept_id,
        conceptName: c.concept_name,
        mastery: c.mastery_score,
        trend: c.trend as 'up' | 'down' | 'stable',
        itemsToReview: c.attempts,
      }));
  },

  getConceptById: (id: string) => {
    return get().concepts.find((c) => c.id === id);
  },

  getItemById: (id: string) => {
    return get().items.find((i) => i.id === id);
  },

  getRemediationPlan: (conceptId: string) => {
    const mastery = get().conceptMastery.find((m) => m.concept_id === conceptId);
    if (!mastery) {
      return {
        conceptId,
        conceptName: 'Unknown',
        currentMastery: 0,
        targetMastery: 80,
        actions: [],
      };
    }

    const actions = [];
    if (mastery.mastery_score < 50) {
      actions.push({
        type: 'study' as const,
        description: 'Review foundational material',
        estimatedMinutes: 30,
      });
    }
    if (mastery.correct < mastery.attempts * 0.7) {
      actions.push({
        type: 'review' as const,
        description: `Review ${mastery.attempts - mastery.correct} incorrect items`,
        itemCount: mastery.attempts - mastery.correct,
        estimatedMinutes: 10,
      });
    }
    actions.push({
      type: 'practice' as const,
      description: 'Practice new items on this concept',
      itemCount: 10,
      estimatedMinutes: 15,
    });

    return {
      conceptId,
      conceptName: mastery.concept_name,
      currentMastery: mastery.mastery_score,
      targetMastery: 80,
      actions,
    };
  },
}));
