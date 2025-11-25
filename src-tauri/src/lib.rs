use std::{fs, path::PathBuf};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn set_default_directory(path: &str, folder_name: &str) {
    println!("Called it");
    let os_path: PathBuf = [path, folder_name].iter().collect();
    println!("Path is {}", &os_path.display());
    fs::DirBuilder::new()
        .recursive(true)
        .create(os_path)
        .unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, set_default_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
