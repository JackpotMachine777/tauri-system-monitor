// invoke() //
const { invoke } = window.__TAURI__.core;

// OS //
const systemLogo = document.querySelector("#system-logo");
const hostname = document.querySelector("#hostname");

const osName = document.querySelector("#os-name");
const osVer = document.querySelector("#os-version");
const osArch = document.querySelector("#os-arch");
const uptime = document.querySelector("#uptime");

const kernelVersion = document.querySelector("#kernel-version");

// CPU //
const cpuName = document.querySelector("#cpu-name");
const cpuUsage = document.querySelector("#cpu-usage");
const cpuTemp = document.querySelector("#cpu-temp");
const cpuFreq = document.querySelector("#cpu-freq");

// RAM //
const totalRam = document.querySelector("#total-ram");
const usedRam = document.querySelector("#used-ram");

// GPU //
const gpuName = document.querySelector("#gpu-name");
const gpuTemp = document.querySelector("#gpu-temp");
const gpuUsage = document.querySelector("#gpu-usage");
const gpuPower = document.querySelector("#gpu-power");
const vramUsage = document.querySelector("#vram-usage");
const mhzUsed = document.querySelector("#mhz-used");

// DISKS //
const diskContainer = document.querySelector("#disks-wrapper");

// NETWORK //
const networkName = document.querySelector("#network-name");
const transmitted = document.querySelector("#transmitted");
const received = document.querySelector("#received");

function formatBytes(bytes){
  if(bytes >= 1024 ** 3) return(`${(bytes / (1024**3)).toFixed(2)} GB/s`);
  else if(bytes >= 1024 ** 2) return(`${(bytes / (1024**2)).toFixed(2)} MB/s`);
  else return(`${(bytes / (1024)).toFixed(2)} KB/s`);
}

function formatTime(seconds){
  const days = Math.floor(seconds / 86400);
  const hrs = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (!days && !hrs && !mins) return `${secs}s`;
  if (!days && !hrs) return `${mins}m ${secs}s`;
  if (!days) return `${hrs}h ${mins}m ${secs}s`;
  else return `${days}d ${hrs}h ${mins}m ${secs}s`; 
}

function formatClocks(mhz, type){
  if(type === "cpu") return `${(mhz / 1000).toFixed(1)} GHz`;
  else return `${mhz} MHz`;
}

// System stats function //
async function systemStats() {
  const stats = await invoke('get_system_stats'); 

  // OS Stats //
  if(stats.os_name.includes("Arch")) {
    systemLogo.src = "/assets/arch.png";
  } 
  else if(stats.os_name.includes("Debian")) {
    systemLogo.src = "/assets/debian.png";
  } 
  else if(stats.os_name.includes("Mint")) {
    systemLogo.src = "/assets/mint.png";
  } 
  else if(stats.os_name.includes("Ubuntu")) {
    systemLogo.src = "/assets/ubuntu.png";
  }  
  else if(stats.os_name.includes("Windows")) {
    systemLogo.src = "/assets/windows.png";
  }
  else if(stats.os_name.includes("Fedora")){
    systemLogo.src = "/assets/fedora.png";
  } 
  else {
    systemLogo.src = "/assets/default.png";
  }

  hostname.textContent = `User: ${stats.hostname}`;

  osName.textContent = `Operating System: ${stats.os_name}`;
  osVer.textContent = `OS Version: ${stats.os_version}`;
  osArch.textContent = `OS Architecture: ${stats.os_arch}`;
  uptime.textContent = `Uptime: ${formatTime(stats.uptime)}`;

  kernelVersion.textContent = `Kernel version: ${stats.kernel_version}`;

  // CPU Stats //
  cpuName.textContent = `Model: ${stats.cpu_brand}`;
  cpuUsage.textContent = `Usage: ${stats.cpu_usage.toFixed(0)}%`;
  cpuTemp.textContent = `Temp: ${stats.cpu_temp.toFixed(0)}°C`
  cpuFreq.textContent = `Frequency: ${formatClocks(stats.cpu_freq, "cpu")}`;

  // RAM Stats //
  totalRam.textContent = `Total: ${Math.round(stats.total_memory / 1024 / 1024)} MB`;
  usedRam.textContent = `Used: ${Math.round(stats.used_memory / 1024 / 1024)} MB`;

  // Disks Stats//
  diskContainer.innerHTML = "";
  stats.disks
  .filter(disk => disk.diskname !== "tauri-system-monitor.AppImage")
  .forEach(disk => {
    const el = document.createElement("div");
    el.classList.add("disk");
    el.innerHTML = `${disk.diskname} <br>
      Total space: ${(disk.total_space / 1024 / 1024 / 1024).toFixed(0)} GB <br>
      Available space: ${(disk.available_space / 1024 / 1024 / 1024).toFixed(0)} GB`;
    
      
    diskContainer.append(el);
  });

  // Network Stats //
  networkName.textContent = `Name: ${stats.name}`;
  transmitted.textContent = `Upload: ${formatBytes(stats.transmitted)}`;
  received.textContent = `Download: ${formatBytes(stats.received)}`;
}

// GPU Stats function //
async function gpuStats() {
  const gpu = await invoke('get_gpu_info'); 

  // GPU //
  gpuName.textContent = `Model: ${gpu.name}`;
  gpuTemp.textContent = `Temp: ${gpu.temp}°C`;
  gpuUsage.textContent = `Usage: ${gpu.usage}%`;
  gpuPower.textContent = `Power draw: ${(gpu.power_draw).toFixed(0)} W / ${gpu.power_limit} W`

  vramUsage.textContent = `VRAM Usage: ${gpu.memory_used} MB / ${gpu.memory_total} MB`;

  mhzUsed.textContent = `Frequency: ${formatClocks(gpu.mhz_used, "gpu")} / ${formatClocks(gpu.mhz_total, "gpu")}`;
}

const doomBtn = document.querySelector("#doom");

doomBtn.addEventListener("click", async () => {
  try {
    await invoke("open_doom_window");
  } catch (err) {
    console.error("Nie udało się otworzyć okna DOOM:", err);
  }
});

setInterval(()=>{
  systemStats();
  gpuStats();
}, 1000);