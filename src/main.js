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

// RAM //
const totalRam = document.querySelector("#total-ram");
const usedRam = document.querySelector("#used-ram");

// GPU //
const gpuName = document.querySelector("#gpu-name");
const gpuTemp = document.querySelector("#gpu-temp");
const gpuUsage = document.querySelector("#gpu-usage");
const vramUsage = document.querySelector("#vram-usage");
const vramTotal = document.querySelector("#vram-total");

// DISKS //
const diskContainer = document.querySelector("#disks");

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

  if (!mins) return `${secs}s`;
  if (!hrs && mins) return `${mins}m ${secs}s`;
  if (!days && hrs) return `${hrs}h ${mins}m ${secs}s`;
  else return `${days}d ${hrs}h ${mins}m ${secs}s`; 
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

  // RAM Stats //
  totalRam.textContent = `Total: ${Math.round(stats.total_memory / 1024 / 1024)} MB`;
  usedRam.textContent = `Used: ${Math.round(stats.used_memory / 1024 / 1024)} MB`;

  // Disks Stats//
  diskContainer.innerHTML = "";
  const disksTitle = document.createElement("h2");
  disksTitle.textContent = "Disks";
  diskContainer.append(disksTitle);
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

  // VRAM //
  vramTotal.textContent = `Total VRAM: ${gpu.memory_total} MB`;
  vramUsage.textContent = `VRAM Usage: ${gpu.memory_used} MB`;
}

setInterval(()=>{
  systemStats();
  gpuStats();
}, 1000);