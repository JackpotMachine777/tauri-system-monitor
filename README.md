# 🖥️ Tauri System Monitor

A lightweight system monitor built with [Tauri](https://tauri.app/) and web technologies.  
It shows real-time info like CPU, RAM, GPU, disk usage and system stats.

## 🚀 Features

- CPU usage + model
- GPU usage + model
- RAM (used / total)
- Disk space per partition
- Temperatures (if supported)
- System info
- Network stats (Download and upload)
- Auto-refresh every 1 second

## 🛠️ Technologies

- Frontend: HTML/CSS/JS
- Backend: Rust + Tauri
- System stats via Rust crates (e.g. `sysinfo`, etc.)

## 📦 Build & Run

```bash
# install dependencies
npm install

# dev mode
npm run tauri dev

# build release
NO_STRIP=true npm run tauri build --release
```

## 🧪 Tested on
This application has been tested on:
- 🐧 Arch Linux (Hyprland environment)
