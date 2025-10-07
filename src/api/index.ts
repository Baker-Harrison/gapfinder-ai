import { invoke } from '@tauri-apps/api/tauri';
import type { Concept, Item, ItemType, Attempt, Session, SessionType, ConceptMastery, DailyPlan, PerformanceTrend } from '@/types';

export const conceptApi = {
  create: async (name: string, domain: string): Promise<Concept> => {
    return await invoke('create_concept', { name, domain });
  },
  getAll: async (): Promise<Concept[]> => {
    return await invoke('get_all_concepts');
  },
  update: async (concept: Concept): Promise<void> => {
    return await invoke('update_concept', { concept });
  },
  delete: async (id: string): Promise<void> => {
    return await invoke('delete_concept', { id });
  },
};

export const itemApi = {
  create: async (stem: string, itemType: ItemType, conceptIds: string[], explanation: string): Promise<Item> => {
    return await invoke('create_item', { stem, itemType, conceptIds, explanation });
  },
  getAll: async (): Promise<Item[]> => {
    return await invoke('get_all_items');
  },
  update: async (item: Item): Promise<void> => {
    return await invoke('update_item', { item });
  },
  delete: async (id: string): Promise<void> => {
    return await invoke('delete_item', { id });
  },
};

export const attemptApi = {
  submit: async (itemId: string, sessionId: string | null, userAnswer: string, isCorrect: boolean, confidence: number, timeSpentMs: number): Promise<Attempt> => {
    return await invoke('submit_attempt', { itemId, sessionId, userAnswer, isCorrect, confidence, timeSpentMs });
  },
  getByItem: async (itemId: string): Promise<Attempt[]> => {
    return await invoke('get_attempts_by_item', { itemId });
  },
};

export const sessionApi = {
  create: async (sessionType: SessionType, totalItems: number): Promise<Session> => {
    return await invoke('create_session', { sessionType, totalItems });
  },
  complete: async (sessionId: string, completedItems: number, accuracy: number, averageConfidence: number): Promise<void> => {
    return await invoke('complete_session', { sessionId, completedItems, accuracy, averageConfidence });
  },
  getAll: async (): Promise<Session[]> => {
    return await invoke('get_all_sessions');
  },
};

export const analyticsApi = {
  getConceptMastery: async (): Promise<ConceptMastery[]> => {
    return await invoke('get_concept_mastery');
  },
  getDailyPlan: async (): Promise<DailyPlan> => {
    return await invoke('get_daily_plan');
  },
  getPerformanceTrends: async (): Promise<PerformanceTrend[]> => {
    return await invoke('get_performance_trends');
  },
};

export const importApi = {
  conceptsFromCsv: async (csvContent: string): Promise<Concept[]> => {
    return await invoke('import_concepts_from_csv', { csvContent });
  },
};

export const databaseApi = {
  clearAll: async (): Promise<void> => {
    return await invoke('clear_all_data');
  },
};

export const api = {
  concepts: conceptApi,
  items: itemApi,
  attempts: attemptApi,
  sessions: sessionApi,
  analytics: analyticsApi,
  import: importApi,
  database: databaseApi,
};
