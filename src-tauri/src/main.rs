use serde::Serialize;
use std::{process::Command, thread, time};
use sysinfo::{
    Components, 
    Disks, 
    System,
    Networks,
    NetworkData
};
use tauri::command;

// System Data structure (from sysinfo) //
#[derive(Serialize)]
struct SystemStats {
    // CPU //
    cpu_brand: Option<String>,
    cpu_usage: f32,
    cpu_temp: Option<f32>,
    // RAM //
    total_memory: u64,
    used_memory: u64,
    // OS //
    os_name: Option<String>,
    kernel_version: Option<String>,
    hostname: Option<String>,
    // DISKS //
    disks: Vec<DiskInfo>,
    // NETWORK //
    name: String,
    received: u64,
    transmitted: u64,
}

// Disks Data structure //
#[derive(Serialize)]
struct DiskInfo {
    name: String,
    total_space: u64,
    available_space: u64,
}

#[command]
fn get_system_stats() -> SystemStats {
    // New system processes list //
    let mut sys = System::new_all();
    let mut networks = Networks::new_with_refreshed_list();
    // Updating info about system //
    std::thread::sleep(sysinfo::MINIMUM_CPU_UPDATE_INTERVAL);
    sys.refresh_all();
    thread::sleep(time::Duration::from_millis(10));
    networks.refresh(true);

    // Components info: //
    let components = Components::new_with_refreshed_list();
    // println!("{:#?}", components);

    // CPU Info: //
    let cpu_brand = sys.cpus()[0].brand().to_string();
    let cpu_usage = sys.global_cpu_usage();
    let cpu_temp = components
        .iter()
        .find(|c| c.label() == "k10temp Tctl")
        .map(|c| c.temperature())
        .unwrap_or(Some(0.0));

    // RAM Info: //
    let total_memory = sys.total_memory();
    let used_memory = sys.used_memory();

    // OS Info: //
    let os_name = System::name();
    let kernel_version = System::kernel_version();
    let hostname = System::host_name();

    // Disks info: //
    let sys_disks = Disks::new_with_refreshed_list();
    let mut disks_vec: Vec<DiskInfo> = Vec::new();

    for disk in sys_disks.list() {
        let name = disk.name().to_string_lossy().into_owned();
        let total_space = disk.total_space();
        let available_space = disk.available_space();

        disks_vec.push(DiskInfo {
            name,
            total_space,
            available_space,
        });
    }

    // Network info: //
    let mut names: Vec<&String> = networks.keys().collect();
    names.sort();
    let name = names.first().unwrap();

    let (received, transmitted) = networks.get(*name)
    .map(|data| (data.received(), data.transmitted()))
    .unwrap_or((0, 0));

    // Pushing data into SystemStats structure //
    SystemStats {
        cpu_brand: Some(cpu_brand),
        cpu_usage,
        cpu_temp,
        total_memory,
        used_memory,
        os_name,
        kernel_version,
        hostname,
        disks: disks_vec,
        name: name.to_string(),
        received,
        transmitted,
    }
}

// GPU Data structure //
#[derive(Serialize)]
struct GpuInfo {
    name: String,
    temp: u32,
    usage: u32,
    memory_used: u32,
    memory_total: u32,
}

// GPU Info //
#[tauri::command]
fn get_gpu_info() -> Option<GpuInfo> {
    let output = Command::new("nvidia-smi")
        .args([
            "--query-gpu=name,temperature.gpu,utilization.gpu,memory.used,memory.total",
            "--format=csv,noheader,nounits",
        ])
        .output()
        .ok()?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let line = stdout.lines().next()?;
    let parts: Vec<&str> = line.trim().split(',').map(|s| s.trim()).collect();

    Some(GpuInfo {
        name: parts[0].to_string(),
        temp: parts[1].parse().ok()?,
        usage: parts[2].parse().ok()?,
        memory_used: parts[3].parse().ok()?,
        memory_total: parts[4].parse().ok()?,
    })
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![get_system_stats, get_gpu_info])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
