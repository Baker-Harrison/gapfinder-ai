// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod models;
mod database;
mod fsrs;
mod commands;

use commands::AppState;
use database::Database;
use fsrs::FSRSScheduler;
use std::sync::Arc;

fn main() {
    let app_data_dir = tauri::api::path::app_data_dir(&tauri::Config::default())
        .expect("Failed to get app data directory");
    
    std::fs::create_dir_all(&app_data_dir).expect("Failed to create app data directory");
    
    let db_path = app_data_dir.join("gapfinder.db");
    let db = Database::new(db_path).expect("Failed to initialize database");
    let fsrs = FSRSScheduler::default();
    
    let state = AppState {
        db: Arc::new(db),
        fsrs: Arc::new(fsrs),
    };

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            commands::create_concept,
            commands::get_all_concepts,
            commands::update_concept,
            commands::delete_concept,
            commands::create_item,
            commands::get_all_items,
            commands::update_item,
            commands::delete_item,
            commands::submit_attempt,
            commands::get_attempts_by_item,
            commands::create_session,
            commands::complete_session,
            commands::get_all_sessions,
            commands::get_concept_mastery,
            commands::get_daily_plan,
            commands::get_performance_trends,
            commands::import_concepts_from_csv,
            commands::get_next_review_item,
            commands::get_item_count,
            commands::get_due_count,
            commands::clear_all_data,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
