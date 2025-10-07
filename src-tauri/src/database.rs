use anyhow::{Context, Result};
use rusqlite::{params, Connection, OptionalExtension};
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use crate::models::*;

pub struct Database {
    conn: Arc<Mutex<Connection>>,
}

impl Database {
    pub fn new(db_path: PathBuf) -> Result<Self> {
        let conn = Connection::open(db_path).context("Failed to open database")?;
        let conn = Arc::new(Mutex::new(conn));
        let db = Self { conn };
        db.init_schema()?;
        Ok(db)
    }

    fn init_schema(&self) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("CREATE TABLE IF NOT EXISTS concepts (id TEXT PRIMARY KEY, name TEXT NOT NULL, domain TEXT NOT NULL, subdomain TEXT, description TEXT, tags TEXT, learning_objectives TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)", [])?;
        conn.execute("CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY, stem TEXT NOT NULL, item_type TEXT NOT NULL, concept_ids TEXT NOT NULL, difficulty INTEGER NOT NULL, source TEXT, explanation TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)", [])?;
        conn.execute("CREATE TABLE IF NOT EXISTS attempts (id TEXT PRIMARY KEY, item_id TEXT NOT NULL, session_id TEXT, user_answer TEXT NOT NULL, is_correct BOOLEAN NOT NULL, confidence INTEGER NOT NULL, time_spent_ms INTEGER NOT NULL, attempted_at TEXT NOT NULL, stability REAL NOT NULL, difficulty REAL NOT NULL, elapsed_days INTEGER NOT NULL, scheduled_days INTEGER NOT NULL, review_state TEXT NOT NULL)", [])?;
        conn.execute("CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, session_type TEXT NOT NULL, started_at TEXT NOT NULL, completed_at TEXT, total_items INTEGER NOT NULL, completed_items INTEGER NOT NULL, accuracy REAL NOT NULL, average_confidence REAL NOT NULL)", [])?;
        conn.execute("CREATE INDEX IF NOT EXISTS idx_attempts_item_id ON attempts(item_id)", [])?;
        conn.execute("CREATE INDEX IF NOT EXISTS idx_attempts_session_id ON attempts(session_id)", [])?;
        Ok(())
    }

    pub fn create_concept(&self, concept: &Concept) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("INSERT INTO concepts VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
            params![concept.id, concept.name, concept.domain, concept.subdomain, concept.description,
                    serde_json::to_string(&concept.tags)?, serde_json::to_string(&concept.learning_objectives)?,
                    concept.created_at.to_rfc3339(), concept.updated_at.to_rfc3339()])?;
        Ok(())
    }

    pub fn get_all_concepts(&self) -> Result<Vec<Concept>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT * FROM concepts ORDER BY name")?;
        let concepts = stmt.query_map([], |row| {
            Ok(Concept {
                id: row.get(0)?, name: row.get(1)?, domain: row.get(2)?, subdomain: row.get(3)?, description: row.get(4)?,
                tags: serde_json::from_str(&row.get::<_, String>(5)?).unwrap_or_default(),
                learning_objectives: serde_json::from_str(&row.get::<_, String>(6)?).unwrap_or_default(),
                created_at: row.get::<_, String>(7)?.parse().unwrap(), updated_at: row.get::<_, String>(8)?.parse().unwrap(),
            })
        })?.collect::<Result<Vec<_>, _>>()?;
        Ok(concepts)
    }

    pub fn update_concept(&self, concept: &Concept) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("UPDATE concepts SET name=?2, domain=?3, subdomain=?4, description=?5, tags=?6, learning_objectives=?7, updated_at=?8 WHERE id=?1",
            params![concept.id, concept.name, concept.domain, concept.subdomain, concept.description,
                    serde_json::to_string(&concept.tags)?, serde_json::to_string(&concept.learning_objectives)?, concept.updated_at.to_rfc3339()])?;
        Ok(())
    }

    pub fn delete_concept(&self, id: &str) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("DELETE FROM concepts WHERE id = ?1", params![id])?;
        Ok(())
    }

    pub fn create_item(&self, item: &Item) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("INSERT INTO items VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
            params![item.id, item.stem, serde_json::to_string(&item.item_type)?, serde_json::to_string(&item.concept_ids)?,
                    item.difficulty, item.source, item.explanation, item.created_at.to_rfc3339(), item.updated_at.to_rfc3339()])?;
        Ok(())
    }

    pub fn get_all_items(&self) -> Result<Vec<Item>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT * FROM items")?;
        let items = stmt.query_map([], |row| {
            Ok(Item {
                id: row.get(0)?, stem: row.get(1)?, item_type: serde_json::from_str(&row.get::<_, String>(2)?).unwrap(),
                concept_ids: serde_json::from_str(&row.get::<_, String>(3)?).unwrap(),
                difficulty: row.get(4)?, source: row.get(5)?, explanation: row.get(6)?,
                created_at: row.get::<_, String>(7)?.parse().unwrap(), updated_at: row.get::<_, String>(8)?.parse().unwrap(),
            })
        })?.collect::<Result<Vec<_>, _>>()?;
        Ok(items)
    }

    pub fn update_item(&self, item: &Item) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("UPDATE items SET stem=?2, item_type=?3, concept_ids=?4, difficulty=?5, source=?6, explanation=?7, updated_at=?8 WHERE id=?1",
            params![item.id, item.stem, serde_json::to_string(&item.item_type)?, serde_json::to_string(&item.concept_ids)?,
                    item.difficulty, item.source, item.explanation, item.updated_at.to_rfc3339()])?;
        Ok(())
    }

    pub fn delete_item(&self, id: &str) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("DELETE FROM items WHERE id = ?1", params![id])?;
        Ok(())
    }

    pub fn create_attempt(&self, attempt: &Attempt) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("INSERT INTO attempts VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
            params![attempt.id, attempt.item_id, attempt.session_id, attempt.user_answer, attempt.is_correct, attempt.confidence,
                    attempt.time_spent_ms, attempt.attempted_at.to_rfc3339(), attempt.stability, attempt.difficulty,
                    attempt.elapsed_days, attempt.scheduled_days, serde_json::to_string(&attempt.review_state)?])?;
        Ok(())
    }

    pub fn get_attempts_by_item(&self, item_id: &str) -> Result<Vec<Attempt>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT * FROM attempts WHERE item_id = ?1 ORDER BY attempted_at DESC")?;
        let attempts = stmt.query_map(params![item_id], |row| {
            Ok(Attempt {
                id: row.get(0)?, item_id: row.get(1)?, session_id: row.get(2)?, user_answer: row.get(3)?,
                is_correct: row.get(4)?, confidence: row.get(5)?, time_spent_ms: row.get(6)?,
                attempted_at: row.get::<_, String>(7)?.parse().unwrap(), stability: row.get(8)?, difficulty: row.get(9)?,
                elapsed_days: row.get(10)?, scheduled_days: row.get(11)?,
                review_state: serde_json::from_str(&row.get::<_, String>(12)?).unwrap(),
            })
        })?.collect::<Result<Vec<_>, _>>()?;
        Ok(attempts)
    }

    pub fn create_session(&self, session: &Session) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("INSERT INTO sessions VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            params![session.id, serde_json::to_string(&session.session_type)?, session.started_at.to_rfc3339(),
                    session.completed_at.map(|dt| dt.to_rfc3339()), session.total_items, session.completed_items,
                    session.accuracy, session.average_confidence])?;
        Ok(())
    }

    pub fn update_session(&self, session: &Session) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("UPDATE sessions SET completed_at=?2, completed_items=?3, accuracy=?4, average_confidence=?5 WHERE id=?1",
            params![session.id, session.completed_at.map(|dt| dt.to_rfc3339()), session.completed_items,
                    session.accuracy, session.average_confidence])?;
        Ok(())
    }

    pub fn get_session(&self, id: &str) -> Result<Option<Session>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT * FROM sessions WHERE id = ?1")?;
        let session = stmt.query_row([id], |row| {
            Ok(Session {
                id: row.get(0)?,
                session_type: serde_json::from_str(&row.get::<_, String>(1)?).unwrap(),
                started_at: row.get::<_, String>(2)?.parse().unwrap(),
                completed_at: row.get::<_, Option<String>>(3)?.and_then(|s| s.parse().ok()),
                total_items: row.get(4)?,
                completed_items: row.get(5)?,
                accuracy: row.get(6)?,
                average_confidence: row.get(7)?,
            })
        }).optional()?;
        Ok(session)
    }

    pub fn get_all_sessions(&self) -> Result<Vec<Session>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT * FROM sessions ORDER BY started_at DESC")?;
        let sessions = stmt.query_map([], |row| {
            Ok(Session {
                id: row.get(0)?, session_type: serde_json::from_str(&row.get::<_, String>(1)?).unwrap(),
                started_at: row.get::<_, String>(2)?.parse().unwrap(),
                completed_at: row.get::<_, Option<String>>(3)?.and_then(|s| s.parse().ok()),
                total_items: row.get(4)?, completed_items: row.get(5)?, accuracy: row.get(6)?, average_confidence: row.get(7)?,
            })
        })?.collect::<Result<Vec<_>, _>>()?;
        Ok(sessions)
    }

    pub fn clear_all(&self) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("DELETE FROM attempts", [])?;
        conn.execute("DELETE FROM sessions", [])?;
        conn.execute("DELETE FROM items", [])?;
        conn.execute("DELETE FROM concepts", [])?;
        Ok(())
    }
}
