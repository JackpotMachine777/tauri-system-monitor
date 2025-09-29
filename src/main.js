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
const cpuThreads = document.querySelector("#cpu-threads");

const cpuUsage = document.querySelector("#cpu-usage");
const usagePerThread = document.querySelector("#usage-per-thread");

const cpuFreq = document.querySelector("#cpu-freq");
const freqPerThread = document.querySelector("#freq-per-thread");

const cpuTemp = document.querySelector("#cpu-temp");

let usageVisible = false;
let freqVisible = false;

cpuUsage.addEventListener("click", () => {
  usageVisible = !usageVisible;
  usagePerThread.style.display = usageVisible ? "block" : "none";
});

cpuFreq.addEventListener("click", () => {
  freqVisible = !freqVisible
  freqPerThread.style.display = freqVisible ? "block" : "none";
});

// RAM //
const totalRam = document.querySelector("#total-ram");
const usedRam = document.querySelector("#used-ram");

const totalSwap = document.querySelector("#total-swap");
const usedSwap = document.querySelector("#used-swap");

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

function formatInternet(bytes){
  if(bytes >= 1024 ** 3) return(`${(bytes / (1024**3)).toFixed(2)} GB/s`);
  else if(bytes >= 1024 ** 2) return(`${(bytes / (1024**2)).toFixed(2)} MB/s`);
  else return(`${(bytes / (1024)).toFixed(2)} KB/s`);
}

function formatBytes(bytes){
  if(bytes >= 1024 ** 3) return(`${(bytes / (1024**3)).toFixed(2)} GB`);
  else if(bytes >= 1024 ** 2) return(`${(bytes / (1024**2)).toFixed(2)} MB`);
  else if(bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  else return `${bytes} B`;
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
  cpuThreads.textContent = `Threads: ${stats.cpu_threads}`;

  cpuUsage.textContent = `Usage: ${stats.cpu_usage.toFixed(0)}%`;
  usagePerThread.innerHTML = "";
  stats.usage_per_thread.forEach((t, index) => {
    const div = document.createElement("div");
    div.classList.add("thread-usage");

    div.style.fontWeight = "600";
    div.style.color = "#bb86fc";

    div.textContent = `Thread ${index + 1}: ${t.toFixed(1)}%`
    usagePerThread.appendChild(div);
  });
  usagePerThread.style.display = usageVisible ? "block" : "none";

  cpuFreq.textContent = `Frequency: ${formatClocks(stats.cpu_freq, "cpu")}`;

  freqPerThread.innerHTML = "";
  stats.freq_per_thread.forEach((f, index) => {
    const div = document.createElement("div");
    div.classList.add("thread-freq");

    div.style.fontWeight = "600";
    div.style.color = "#bb86fc";

    div.textContent = `Thread ${index + 1}: ${formatClocks(f, "cpu")}`;
    freqPerThread.appendChild(div);
  });
  freqPerThread.style.display = freqVisible ? "block" : "none";

  cpuTemp.textContent = `Temp: ${stats.cpu_temp.toFixed(0)}°C`

  // RAM Stats //
  totalRam.textContent = `Total: ${Math.round(stats.total_memory / 1024 / 1024)} MB`;
  usedRam.textContent = `Used: ${Math.round(stats.used_memory / 1024 / 1024)} MB`;

  totalSwap.textContent = `Total SWAP: ${Math.round(stats.total_swap / 1024 / 1024)} MB`;
  usedSwap.textContent = `Used SWAP: ${Math.round(stats.used_swap / 1024 / 1024)} MB`;

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
  transmitted.textContent = `Upload: ${formatInternet(stats.transmitted)}`;
  received.textContent = `Download: ${formatInternet(stats.received)}`;
}

// GPU Stats function //
async function gpuStats() {
  const gpu = await invoke('get_gpu_info');

  gpuName.textContent = `Model: ${gpu.name}`;
  gpuTemp.textContent = `Temp: ${gpu.temp}°C`;
  gpuUsage.textContent = `Usage: ${gpu.usage}%`;
  gpuPower.textContent = `Power draw: ${(gpu.power_draw).toFixed(0)} W / ${gpu.power_limit} W`

  vramUsage.textContent = `VRAM Usage: ${gpu.memory_used} MB / ${gpu.memory_total} MB`;

  mhzUsed.textContent = `Frequency: ${formatClocks(gpu.mhz_used, "gpu")} / ${formatClocks(gpu.mhz_total, "gpu")}`;
}

async function fetchProcesses(){
  const processes = await invoke("get_processes");
  const stats = await invoke('get_system_stats'); 

  processes.sort((a, b) => b.proc_usage - a.proc_usage);

  const tbody = document.querySelector("#process-table tbody");
  tbody.innerHTML = "";
  
  processes.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style='text-align: center'>${p.pid}</td>
      <td style='text-align: center'>${p.name}</td>
      <td style='text-align: center'>${formatBytes(p.mem)}</td>
      <td style='text-align: center'>${(p.proc_usage / stats.cpu_threads).toFixed(1)}</td>
      <td><button class="kill-btn" data-pid="${p.pid}">Kill</button></td>
    `;

    tbody.appendChild(tr);
  });
}
async function killProcess(pid){
  try{
    await invoke("process_kill", { pid });
    alert(`Process ${pid} killed`);
  } catch(err) {
    alert(`Error: ${err}`);
  }
}

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("kill-btn")) {
    e.stopPropagation();
    const pid = parseInt(e.target.dataset.pid);
    killProcess(pid);
  }
});

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

setInterval(() => fetchProcesses(), 3000);