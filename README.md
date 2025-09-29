# 🖥️ Tauri System Monitor

A lightweight system monitor built with [Tauri](https://tauri.app/) and web technologies.  
Displays real-time info like CPU, RAM, GPU, disks, temperatures and network usage.

---

## 🚀 Features

- 🧠 CPU usage + model
- 🎮 GPU usage + model (Only NVIDIA for now)
- 🧮 RAM (used / total)
- ♻️ SWAP (used / total)
- 💾 Disk space per partition
- 🌡️ Temperatures (if supported)
- 🖥️ System informations
- 🌐 Network stats (Download and upload)
- ⚡ Process management
  - View running processes (Name, PID, CPU Usage, memory)
  - Kill process directly from the app
- 🔄 Auto-refresh (CPU, RAM, GPU, network: 1s; processes: 3s)

---

## 🛠️ Technologies

- **Frontend**: HTML/CSS/JS
- **Backend**: Rust + Tauri
- **System stats via:** `sysinfo` + others

---

## 📦 Build & Run
1. AUR installation:
```
yay -S tauri-system-monitor
```

---

2. Manual installation:
```bash
## Install dependencies

# Runtime dependencies
sudo pacman -S glibc webkit2gtk gtk3 libayatana-appindicator hicolor-icon-theme linuxdeploy 

# Build dependencies
sudo pacman -S nodejs npm rust pkg-config gcc make git clang lld llvm

git clone https://github.com/JackpotMachine777/tauri-system-monitor.git
cd tauri-system-monitor

npm install

## Dev mode
npm run tauri dev

## Build release
NO_STRIP=true npm run tauri build --release

## To run executable you can make .sh script

#!/bin/bash
WEBKIT_DISABLE_DMABUF_RENDERER=1 WEBKIT_DISABLE_COMPOSITING_MODE=1 ./tauri-system-monitor.AppImage

## Save file then in terminal add this command
chmod +x run.sh
```

---

## 🧪 Tested on
This application has been tested on:
- 🐧 Arch Linux (Hyprland environment)
