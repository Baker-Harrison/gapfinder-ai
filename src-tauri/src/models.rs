use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// ==================== Learning Material ====================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LearningMaterial {
    pub id: String,
    pub content: String,
    pub domain: String,
    pub encoding_date: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
}

impl LearningMaterial {
    pub fn new(content: String, domain: String) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4().to_string(),
            content,
            domain,
            encoding_date: now,
            created_at: now,
        }
    }
}

// ==================== Concept ====================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Concept {
    pub id: String,
    pub name: String,
    pub domain: String,
    pub subdomain: Option<String>,
    pub description: Option<String>,
    pub tags: Vec<String>,
    pub learning_material_id: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Concept {
    pub fn new(name: String, domain: String) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4().to_string(),
            name,
            domain,
            subdomain: None,
            description: None,
            tags: Vec::new(),
            learning_material_id: None,
            created_at: now,
            updated_at: now,
        }
    }
}

// ==================== Item ====================

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum ItemType {
    #[serde(rename = "mcq")]
    Mcq {
        options: Vec<McqOption>,
    },
    #[serde(rename = "free-recall")]
    FreeRecall {
        correct_answer: String,
    },
    #[serde(rename = "calc")]
    Calculation {
        formula: String,
        variables: Vec<CalcVariable>,
        correct_answer: f64,
        unit: String,
        worked_solution: Vec<String>,
    },
    #[serde(rename = "case")]
    CaseVignette {
        steps: Vec<CaseStep>,
    },
    #[serde(rename = "cloze")]
    Cloze {
        blanks: Vec<ClozeBlanks>,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct McqOption {
    pub id: String,
    pub text: String,
    pub is_correct: bool,
    pub explanation: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CalcVariable {
    pub name: String,
    pub value: f64,
    pub unit: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CaseStep {
    pub step_number: i32,
    pub prompt: String,
    pub correct_answer: String,
    pub points: i32,
    pub explanation: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClozeBlanks {
    pub id: String,
    pub correct_answer: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Item {
    pub id: String,
    pub stem: String,
    pub item_type: ItemType,
    pub concept_ids: Vec<String>,
    pub difficulty: i32,
    pub source: Option<String>,
    pub explanation: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Item {
    pub fn new(stem: String, item_type: ItemType, concept_ids: Vec<String>, explanation: String) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4().to_string(),
            stem,
            item_type,
            concept_ids,
            difficulty: 50,
            source: None,
            explanation,
            created_at: now,
            updated_at: now,
        }
    }
}

// ==================== Attempt ====================

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum SirPhase {
    Encoding,           // Day 0
    ShortTermRetrieval, // 1-2 days
    InterleavedRetrieval, // 3-5 days
    MediumSpacing,      // 7-10 days
    IntegrationTransfer, // 14+ days
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MetacognitiveReflection {
    pub felt_uncertain: bool,
    pub felt_confusing: bool,
    pub needs_review: bool,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Attempt {
    pub id: String,
    pub item_id: String,
    pub session_id: Option<String>,
    pub user_answer: String,
    pub is_correct: bool,
    pub confidence: i32,
    pub time_spent_ms: i64,
    pub attempted_at: DateTime<Utc>,
    pub sir_phase: SirPhase,
    pub next_review_date: DateTime<Utc>,
    pub metacognitive: Option<MetacognitiveReflection>,
    // Keep legacy FSRS fields for backward compatibility
    pub stability: f64,
    pub difficulty: f64,
    pub elapsed_days: i32,
    pub scheduled_days: i32,
    pub review_state: ReviewState,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ReviewState {
    New,
    Learning,
    Review,
    Relearning,
}

impl Attempt {
    pub fn new(
        item_id: String,
        session_id: Option<String>,
        user_answer: String,
        is_correct: bool,
        confidence: i32,
        time_spent_ms: i64,
    ) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4().to_string(),
            item_id,
            session_id,
            user_answer,
            is_correct,
            confidence,
            time_spent_ms,
            attempted_at: now,
            sir_phase: SirPhase::Encoding,
            next_review_date: now,
            metacognitive: None,
            stability: 0.0,
            difficulty: 0.0,
            elapsed_days: 0,
            scheduled_days: 0,
            review_state: ReviewState::New,
        }
    }
}

// ==================== Session ====================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
    pub id: String,
    pub session_type: SessionType,
    pub started_at: DateTime<Utc>,
    pub completed_at: Option<DateTime<Utc>>,
    pub total_items: i32,
    pub completed_items: i32,
    pub accuracy: f64,
    pub average_confidence: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SessionType {
    Mixed,
    Diagnostic,
    Focused { concept_id: String },
    Exam { time_limit_ms: i64 },
}

impl Session {
    pub fn new(session_type: SessionType, total_items: i32) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            session_type,
            started_at: Utc::now(),
            completed_at: None,
            total_items,
            completed_items: 0,
            accuracy: 0.0,
            average_confidence: 0.0,
        }
    }
}

// ==================== Analytics ====================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConceptMastery {
    pub concept_id: String,
    pub concept_name: String,
    pub mastery_score: f64,
    pub attempts: i32,
    pub correct: i32,
    pub avg_confidence: f64,
    pub brier_score: f64,
    pub last_attempted: Option<DateTime<Utc>>,
    pub stability: f64,
    pub trend: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DailyPlan {
    pub date: DateTime<Utc>,
    pub reviews: Vec<PlannedItem>,
    pub diagnostics: Vec<PlannedItem>,
    pub total_items: i32,
    pub estimated_time_min: i32,
    pub coverage_percent: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlannedItem {
    pub item_id: String,
    pub concept_id: String,
    pub reason: String,
    pub priority: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ErrorAnalysis {
    pub error_type: String,
    pub count: i32,
    pub percentage: f64,
    pub example_items: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PerformanceTrend {
    pub date: DateTime<Utc>,
    pub accuracy: f64,
    pub items_completed: i32,
    pub avg_confidence: f64,
}
