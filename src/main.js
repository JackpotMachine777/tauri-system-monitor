// invoke() //
const { invoke } = window.__TAURI__.core;

// OS //
const systemLogo = document.querySelector("#system-logo");
const hostname = document.querySelector("#hostname");
const osName = document.querySelector("#os-name");
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
const disk = Array.from(document.querySelectorAll(".disk"));

// NETWORK //
const networkName = document.querySelector("#network-name");
const transmitted = document.querySelector("#transmitted");
const received = document.querySelector("#received");

async function systemStats() {
  // Getting stats from backend (main.rs) //
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
  else if(stats.os_name.includes("Windows 10")) {
    systemLogo.src = "/assets/win10.png";
  } 
  else if(stats.os_name.includes("Windows 11")) {
    systemLogo.src = "/assets/win11.png";
  }
  else if(stats.os_name.includes("Fedora")){
    systemLogo.src = "/assets/fedora.png";
  } 
  else {
    systemLogo.src = "/assets/default.png";
  }

  hostname.textContent = `User: ${stats.hostname}`;
  osName.textContent = `Operating System: ${stats.os_name}`;
  kernelVersion.textContent = `Kernel version: ${stats.kernel_version}`;

  // CPU Stats //
  cpuName.textContent = `${stats.cpu_brand}`;
  cpuUsage.textContent = `CPU Usage: ${stats.cpu_usage.toFixed(0)}%`;
  cpuTemp.textContent = `CPU Temp: ${stats.cpu_temp.toFixed(0)}°C`

  // RAM Stats //
  totalRam.textContent = `Total RAM: ${Math.round(stats.total_memory / 1024 / 1024)} MB`;
  usedRam.textContent = `RAM Used: ${Math.round(stats.used_memory / 1024 / 1024)} MB`;

  // Disks Stats//
  disk[0].innerHTML = `${stats.disks[0].name} <br> 
  Total space: ${(stats.disks[0].total_space / 1024 / 1024 / 1024).toFixed(0)} GB <br> 
  Available space: ${(stats.disks[0].available_space.toFixed(0) / 1024 / 1024 / 1024).toFixed(0)} GB`;

  disk[1].innerHTML = `${stats.disks[2].name} <br> 
  Total space: ${(stats.disks[2].total_space / 1024 / 1024 / 1024).toFixed(0)} GB <br> 
  Available space: ${(stats.disks[2].available_space.toFixed(0) / 1024 / 1024 / 1024).toFixed(0)} GB`;

  disk[2].innerHTML = `${stats.disks[2].name} <br> 
  Total space: ${(stats.disks[2].total_space / 1024 / 1024 / 1024).toFixed(0)} GB <br> 
  Available space: ${(stats.disks[2].available_space.toFixed(0) / 1024 / 1024 / 1024).toFixed(0)} GB`;

  disk[3].innerHTML = `${stats.disks[3].name} <br> 
  Total space: ${(stats.disks[3].total_space / 1024 / 1024 / 1024).toFixed(0)} GB <br> 
  Available space: ${(stats.disks[3].available_space.toFixed(0) / 1024 / 1024 / 1024).toFixed(0)} GB`;

  disk[4].innerHTML = `${stats.disks[4].name} <br> 
  Total space: ${(stats.disks[4].total_space / 1024 / 1024 / 1024).toFixed(0)} GB <br> 
  Available space: ${(stats.disks[4].available_space.toFixed(0) / 1024 / 1024 / 1024).toFixed(0)} GB`;

  // Network Stats //
  networkName.textContent = `Network Interface: ${stats.name}`;
  if(stats.transmitted >= 1024 ** 3){
    transmitted.textContent = `Upload: ${(stats.transmitted / (1024 ** 3)).toFixed(2)} GB/s`;
    received.textContent = `Download: ${(stats.received / (1024 ** 3)).toFixed(2)} GB/s`;
  }
  else if(stats.transmitted >= 1024 ** 2){
    transmitted.textContent = `Upload: ${(stats.transmitted / (1024 ** 2)).toFixed(2)} MB/s`;
    received.textContent = `Download: ${(stats.received / (1024 ** 2)).toFixed(2)} MB/s`;
  }
  else{
    transmitted.textContent = `Upload: ${(stats.transmitted / 1024).toFixed(2)} KB/s`;
    received.textContent = `Download: ${(stats.received / 1024).toFixed(2)} KB/s`;
  }
}

async function gpuStats() {
  // Getting GPU stats from backend (main.rs) //
  const gpu = await invoke('get_gpu_info'); 

  // GPU //
  gpuName.textContent = `${gpu.name}`;
  gpuTemp.textContent = `GPU Temp: ${gpu.temp}°C`;
  gpuUsage.textContent = `GPU Usage: ${gpu.usage}%`;

  // VRAM //
  vramTotal.textContent = `Total VRAM: ${gpu.memory_total} MB`;
  vramUsage.textContent = `VRAM Usage: ${gpu.memory_used} MB`;
}

setInterval(()=>{
  systemStats();
  gpuStats();
}, 1000);