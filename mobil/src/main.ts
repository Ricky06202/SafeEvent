import { Html5Qrcode } from "html5-qrcode";
import { vibrate } from "@tauri-apps/plugin-haptics";
import { load } from "@tauri-apps/plugin-store";

interface Evento {
  id: number;
  nombre: string;
  fecha: string;
  lugar: string;
}

let currentScreen = "login";
let eventos: Evento[] = [];
let eventoSeleccionado: Evento | null = null;
let store: Awaited<ReturnType<typeof load>> | null = null;
let html5Qrcode: Html5Qrcode | null = null;

const DEMO_EVENTOS: Evento[] = [
  { id: 1, nombre: "Conferencia Tech 2026", fecha: "20/03/2026", lugar: "Centro de Convenciones" },
  { id: 2, nombre: "Festival de Música", fecha: "25/03/2026", lugar: "Parque Central" },
  { id: 3, nombre: "Workshop React", fecha: "15/04/2026", lugar: "Coworking Space" },
];

function goBack() {
  if (currentScreen === "scanner") {
    if (html5Qrcode) {
      try {
        html5Qrcode.stop();
      } catch (e) {}
    }
    currentScreen = "eventos";
    render();
  } else if (currentScreen === "eventos") {
    if (store) {
      store.clear();
      store.save();
    }
    currentScreen = "login";
    render();
  }
}

async function render() {
  const app = document.getElementById("app")!;
  
  if (currentScreen === "login") {
    app.innerHTML = `
      <div class="screen login-screen">
        <h1>SafeEvent</h1>
        <p class="subtitle">Control de Entrada</p>
        <form id="login-form">
          <input type="text" id="username" placeholder="Usuario" required />
          <input type="password" id="password" placeholder="Contraseña" required />
          <button type="submit">Iniciar Sesión</button>
        </form>
        <button id="demo-btn" class="secondary">Modo Demo</button>
      </div>
    `;
    
    document.getElementById("login-form")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const user = (document.getElementById("username") as HTMLInputElement).value;
      const pass = (document.getElementById("password") as HTMLInputElement).value;
      
      if (user && pass && store) {
        await store.set("token", "demo-token");
        await store.set("user", user);
        await store.save();
        eventos = DEMO_EVENTOS;
        currentScreen = "eventos";
        render();
      }
    });
    
    document.getElementById("demo-btn")?.addEventListener("click", async () => {
      if (store) {
        await store.set("token", "demo-token");
        await store.set("user", "demo");
        await store.save();
        eventos = DEMO_EVENTOS;
        currentScreen = "eventos";
        render();
      }
    });
  }
  
  else if (currentScreen === "eventos") {
    app.innerHTML = `
      <div class="screen eventos-screen">
        <header>
          <h2>Eventos</h2>
          <button id="logout-btn">Salir</button>
        </header>
        <div class="eventos-list">
          ${eventos.map(ev => `
            <div class="evento-card" data-id="${ev.id}">
              <h3>${ev.nombre}</h3>
              <p>📅 ${ev.fecha}</p>
              <p>📍 ${ev.lugar}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    
    document.getElementById("logout-btn")?.addEventListener("click", async () => {
      if (store) {
        await store.clear();
        await store.save();
      }
      currentScreen = "login";
      render();
    });
    
    document.querySelectorAll(".evento-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = parseInt(card.getAttribute("data-id")!);
        eventoSeleccionado = eventos.find(e => e.id === id)!;
        currentScreen = "scanner";
        render();
      });
    });
  }
  
  else if (currentScreen === "scanner") {
    app.innerHTML = `
      <div class="screen scanner-screen">
        <header>
          <button id="back-btn">←</button>
          <h2>${eventoSeleccionado?.nombre}</h2>
        </header>
        <div class="scanner-container">
          <div id="scanner-view"></div>
          <button id="scan-btn">📷 Escanear QR</button>
          <button id="stop-btn" class="hidden">⏹ Detener</button>
        </div>
        <div id="result" class="result hidden"></div>
      </div>
    `;
    
    document.getElementById("back-btn")?.addEventListener("click", async () => {
      if (html5Qrcode) {
        try {
          await html5Qrcode.stop();
        } catch (e) {}
      }
      currentScreen = "eventos";
      render();
    });
    
    document.getElementById("scan-btn")?.addEventListener("click", async () => {
      const scanBtn = document.getElementById("scan-btn") as HTMLButtonElement;
      const stopBtn = document.getElementById("stop-btn") as HTMLButtonElement;
      
      if (!html5Qrcode) {
        html5Qrcode = new Html5Qrcode("scanner-view");
      }
      
      try {
        scanBtn.classList.add("hidden");
        stopBtn.classList.remove("hidden");
        
        await html5Qrcode!.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            await html5Qrcode!.stop();
            await vibrate(200);
            showResult(true, decodedText);
            scanBtn.classList.remove("hidden");
            stopBtn.classList.add("hidden");
          },
          () => {}
        );
      } catch (e) {
        showResult(false, "Error al iniciar cámara: " + String(e));
        scanBtn.classList.remove("hidden");
        stopBtn.classList.add("hidden");
      }
    });
    
    document.getElementById("stop-btn")?.addEventListener("click", async () => {
      if (html5Qrcode) {
        try {
          await html5Qrcode.stop();
        } catch (e) {}
      }
      const scanBtn = document.getElementById("scan-btn") as HTMLButtonElement;
      const stopBtn = document.getElementById("stop-btn") as HTMLButtonElement;
      scanBtn.classList.remove("hidden");
      stopBtn.classList.add("hidden");
    });
  }
}

function showResult(success: boolean, message: string) {
  const result = document.getElementById("result");
  if (result) {
    result.className = `result ${success ? "success" : "error"}`;
    result.textContent = success ? `✓ Validado: ${message}` : `✗ ${message}`;
    result.classList.remove("hidden");
    
    setTimeout(() => {
      result.classList.add("hidden");
    }, 3000);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  store = await load("safeevent.dat");
  const token = await store.get<string>("token");
  if (token) {
    eventos = DEMO_EVENTOS;
    currentScreen = "eventos";
  }
  render();
  
  document.addEventListener("backbutton", (e) => {
    e.preventDefault();
    goBack();
  });
});
