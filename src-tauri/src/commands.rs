use crate::database::Database;
use crate::fsrs::FSRSScheduler;
use crate::sir_scheduler::SirScheduler;
use crate::models::*;
use chrono::Utc;
use std::sync::Arc;
use tauri::State;

pub struct AppState {
    pub db: Arc<Database>,
    pub fsrs: Arc<FSRSScheduler>,
    pub sir: Arc<SirScheduler>,
}

// ==================== Concept Commands ====================

#[tauri::command]
pub fn create_concept(state: State<AppState>, name: String, domain: String) -> Result<Concept, String> {
    let concept = Concept::new(name, domain);
    state.db.create_concept(&concept).map_err(|e| e.to_string())?;
    Ok(concept)
}

#[tauri::command]
pub fn get_all_concepts(state: State<AppState>) -> Result<Vec<Concept>, String> {
    state.db.get_all_concepts().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_concept(state: State<AppState>, concept: Concept) -> Result<(), String> {
    state.db.update_concept(&concept).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_concept(state: State<AppState>, id: String) -> Result<(), String> {
    state.db.delete_concept(&id).map_err(|e| e.to_string())
}

// ==================== Item Commands ====================

#[tauri::command]
pub fn create_item(
    state: State<AppState>,
    stem: String,
    item_type: ItemType,
    concept_ids: Vec<String>,
    explanation: String,
) -> Result<Item, String> {
    let item = Item::new(stem, item_type, concept_ids, explanation);
    state.db.create_item(&item).map_err(|e| e.to_string())?;
    Ok(item)
}

#[tauri::command]
pub fn get_all_items(state: State<AppState>) -> Result<Vec<Item>, String> {
    state.db.get_all_items().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_item(state: State<AppState>, item: Item) -> Result<(), String> {
    state.db.update_item(&item).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_item(state: State<AppState>, id: String) -> Result<(), String> {
    state.db.delete_item(&id).map_err(|e| e.to_string())
}

// ==================== Learning Material Commands ====================

#[tauri::command]
pub fn create_learning_material(
    state: State<AppState>,
    content: String,
    domain: String,
) -> Result<LearningMaterial, String> {
    let material = LearningMaterial::new(content, domain);
    state.db.create_learning_material(&material).map_err(|e| e.to_string())?;
    Ok(material)
}

#[tauri::command]
pub fn get_learning_material(
    state: State<AppState>,
    id: String,
) -> Result<Option<LearningMaterial>, String> {
    state.db.get_learning_material(&id).map_err(|e| e.to_string())
}

// ==================== Attempt Commands ====================

#[tauri::command]
pub fn submit_attempt(
    state: State<AppState>,
    item_id: String,
    session_id: Option<String>,
    user_answer: String,
    is_correct: bool,
    confidence: i32,
    time_spent_ms: i64,
    metacognitive: Option<MetacognitiveReflection>,
) -> Result<Attempt, String> {
    let mut attempt = Attempt::new(item_id.clone(), session_id, user_answer, is_correct, confidence, time_spent_ms);
    
    // Use SIR scheduler for SIR-based scheduling
    state.sir.schedule(&mut attempt, metacognitive);
    
    // Also keep FSRS compatibility
    let rating = if is_correct {
        confidence.min(4).max(2)
    } else {
        1
    };
    state.fsrs.schedule(&mut attempt, rating);
    
    state.db.create_attempt(&attempt).map_err(|e| e.to_string())?;
    
    Ok(attempt)
}

#[tauri::command]
pub fn get_attempts_by_item(state: State<AppState>, item_id: String) -> Result<Vec<Attempt>, String> {
    state.db.get_attempts_by_item(&item_id).map_err(|e| e.to_string())
}

// ==================== Session Commands ====================

#[tauri::command]
pub fn create_session(state: State<AppState>, session_type: SessionType, total_items: i32) -> Result<Session, String> {
    let session = Session::new(session_type, total_items);
    state.db.create_session(&session).map_err(|e| e.to_string())?;
    Ok(session)
}

#[tauri::command]
pub fn complete_session(
    state: State<AppState>,
    session_id: String,
    completed_items: i32,
    accuracy: f64,
    average_confidence: f64,
) -> Result<(), String> {
    let mut session = state.db.get_session(&session_id).map_err(|e| e.to_string())?
        .ok_or("Session not found")?;
    
    session.completed_at = Some(Utc::now());
    session.completed_items = completed_items;
    session.accuracy = accuracy;
    session.average_confidence = average_confidence;
    
    state.db.update_session(&session).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_all_sessions(state: State<AppState>) -> Result<Vec<Session>, String> {
    state.db.get_all_sessions().map_err(|e| e.to_string())
}

// ==================== Analytics Commands ====================

#[tauri::command]
pub fn get_concept_mastery(state: State<AppState>) -> Result<Vec<ConceptMastery>, String> {
    let concepts = state.db.get_all_concepts().map_err(|e| e.to_string())?;
    let items = state.db.get_all_items().map_err(|e| e.to_string())?;
    
    let mut mastery_list = Vec::new();
    
    for concept in concepts {
        let concept_items: Vec<&Item> = items.iter().filter(|i| i.concept_ids.contains(&concept.id)).collect();
        
        let mut all_attempts = Vec::new();
        for item in &concept_items {
            if let Ok(attempts) = state.db.get_attempts_by_item(&item.id) {
                all_attempts.extend(attempts);
            }
        }
        
        let mastery_score = state.sir.calculate_mastery(&all_attempts);
        
        let attempts_count = all_attempts.len() as i32;
        let correct_count = all_attempts.iter().filter(|a| a.is_correct).count() as i32;
        
        let avg_confidence = if attempts_count > 0 {
            all_attempts.iter().map(|a| a.confidence as f64).sum::<f64>() / attempts_count as f64
        } else {
            0.0
        };
        
        let brier_score = state.sir.calculate_brier_score(&all_attempts);
        let last_attempted = all_attempts.first().map(|a| a.attempted_at);
        
        let avg_stability = if !all_attempts.is_empty() {
            all_attempts.iter().map(|a| a.stability).sum::<f64>() / all_attempts.len() as f64
        } else {
            0.0
        };
        
        let trend = "stable".to_string();
        
        mastery_list.push(ConceptMastery {
            concept_id: concept.id,
            concept_name: concept.name,
            mastery_score,
            attempts: attempts_count,
            correct: correct_count,
            avg_confidence,
            brier_score,
            last_attempted,
            stability: avg_stability,
            trend,
        });
    }
    
    Ok(mastery_list)
}

#[tauri::command]
pub fn get_daily_plan(state: State<AppState>) -> Result<DailyPlan, String> {
    let items = state.db.get_all_items().map_err(|e| e.to_string())?;
    let concepts = state.db.get_all_concepts().map_err(|e| e.to_string())?;
    
    let mut reviews = Vec::new();
    let mut diagnostics = Vec::new();
    
    for item in &items {
        let attempts = state.db.get_attempts_by_item(&item.id).map_err(|e| e.to_string())?;
        
        if attempts.is_empty() {
            if diagnostics.len() < 3 {
                diagnostics.push(PlannedItem {
                    item_id: item.id.clone(),
                    concept_id: item.concept_ids.first().unwrap_or(&String::new()).clone(),
                    reason: "new_concept".to_string(),
                    priority: 2,
                });
            }
        } else {
            let last_attempt = &attempts[0];
            if last_attempt.scheduled_days <= last_attempt.elapsed_days && reviews.len() < 12 {
                reviews.push(PlannedItem {
                    item_id: item.id.clone(),
                    concept_id: item.concept_ids.first().unwrap_or(&String::new()).clone(),
                    reason: "due_for_review".to_string(),
                    priority: if last_attempt.stability < 7.0 { 3 } else { 1 },
                });
            }
        }
    }
    
    reviews.sort_by(|a, b| b.priority.cmp(&a.priority));
    reviews.truncate(12);
    diagnostics.truncate(3);
    
    let total_items = (reviews.len() + diagnostics.len()) as i32;
    let estimated_time_min = total_items * 2;
    
    let attempted_concepts: std::collections::HashSet<_> = items
        .iter()
        .filter(|i| state.db.get_attempts_by_item(&i.id).map(|a| !a.is_empty()).unwrap_or(false))
        .flat_map(|i| i.concept_ids.clone())
        .collect();
    
    let coverage_percent = if !concepts.is_empty() {
        (attempted_concepts.len() as f64 / concepts.len() as f64) * 100.0
    } else {
        0.0
    };
    
    Ok(DailyPlan {
        date: Utc::now(),
        reviews,
        diagnostics,
        total_items,
        estimated_time_min,
        coverage_percent,
    })
}

#[tauri::command]
pub fn get_performance_trends(state: State<AppState>) -> Result<Vec<PerformanceTrend>, String> {
    let sessions = state.db.get_all_sessions().map_err(|e| e.to_string())?;
    
    let trends: Vec<PerformanceTrend> = sessions
        .iter()
        .filter(|s| s.completed_at.is_some())
        .map(|s| PerformanceTrend {
            date: s.started_at,
            accuracy: s.accuracy,
            items_completed: s.completed_items,
            avg_confidence: s.average_confidence,
        })
        .collect();
    
    Ok(trends)
}

// ==================== Import Commands ====================

#[tauri::command]
pub fn import_concepts_from_csv(state: State<AppState>, csv_content: String) -> Result<Vec<Concept>, String> {
    let mut reader = csv::Reader::from_reader(csv_content.as_bytes());
    let mut concepts = Vec::new();
    
    for result in reader.records() {
        let record = result.map_err(|e| e.to_string())?;
        if record.len() >= 2 {
            let name = record.get(0).unwrap_or("").to_string();
            let domain = record.get(1).unwrap_or("General").to_string();
            
            if !name.is_empty() {
                let concept = Concept::new(name, domain);
                state.db.create_concept(&concept).map_err(|e| e.to_string())?;
                concepts.push(concept);
            }
        }
    }
    
    Ok(concepts)
}

// ==================== Quick Learn Commands ====================

#[tauri::command]
pub fn get_next_review_item(state: State<AppState>) -> Result<Option<Item>, String> {
    let items = state.db.get_all_items().map_err(|e| e.to_string())?;
    
    // Prioritize items for SIR-based review
    let mut due_items = Vec::new();
    let mut new_items = Vec::new();
    
    for item in &items {
        let attempts = state.db.get_attempts_by_item(&item.id).map_err(|e| e.to_string())?;
        
        if attempts.is_empty() {
            new_items.push(item.clone());
        } else if let Some(last_attempt) = attempts.first() {
            // Use SIR scheduler to check if due
            if state.sir.is_due(last_attempt) {
                due_items.push((item.clone(), last_attempt.clone()));
            }
        }
    }
    
    // Prioritize due items in early SIR phases, then new items
    due_items.sort_by(|a, b| {
        // Earlier phases get higher priority
        let phase_order_a = match a.1.sir_phase {
            SirPhase::Encoding => 0,
            SirPhase::ShortTermRetrieval => 1,
            SirPhase::InterleavedRetrieval => 2,
            SirPhase::MediumSpacing => 3,
            SirPhase::IntegrationTransfer => 4,
        };
        let phase_order_b = match b.1.sir_phase {
            SirPhase::Encoding => 0,
            SirPhase::ShortTermRetrieval => 1,
            SirPhase::InterleavedRetrieval => 2,
            SirPhase::MediumSpacing => 3,
            SirPhase::IntegrationTransfer => 4,
        };
        phase_order_a.cmp(&phase_order_b)
    });
    
    // Return first due item, or first new item
    Ok(due_items.into_iter().next().map(|(item, _)| item).or_else(|| new_items.into_iter().next()))
}

#[tauri::command]
pub fn get_item_count(state: State<AppState>) -> Result<usize, String> {
    let items = state.db.get_all_items().map_err(|e| e.to_string())?;
    Ok(items.len())
}

#[tauri::command]
pub fn get_due_count(state: State<AppState>) -> Result<usize, String> {
    let items = state.db.get_all_items().map_err(|e| e.to_string())?;
    let mut due_count = 0;
    
    for item in items {
        let attempts = state.db.get_attempts_by_item(&item.id).map_err(|e| e.to_string())?;
        
        if attempts.is_empty() {
            due_count += 1;
        } else if let Some(last_attempt) = attempts.first() {
            // Use SIR scheduler to check if due
            if state.sir.is_due(last_attempt) {
                due_count += 1;
            }
        }
    }
    
    Ok(due_count)
}

// ==================== Database Management ====================

#[tauri::command]
pub fn clear_all_data(state: State<AppState>) -> Result<(), String> {
    state.db.clear_all().map_err(|e| e.to_string())
}
