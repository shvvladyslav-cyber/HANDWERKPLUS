// 1) CONFIG: вставь URL своего Apps Script Web App
// После публикации скрипта будет выглядеть так:
// https://script.google.com/macros/s/XXXX/exec
const APPS_SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_URL_HERE";

const PRICING = [
  {
    id: "STANDARD",
    name: "Standard",
    price: "39 € / Monat",
    tag: "Basis — плановый сервис",
    features: [
      "1 Einsatz/Monat inkl. (60 Min)",
      "Standard Termin (1–5 Werktage)",
      "Extra-Zeit: 39 €/h"
    ],
    cta: "Standard wählen"
  },
  {
    id: "PREMIUM",
    name: "Premium",
    price: "79 € / Monat",
    tag: "Schneller + mehr Einsätze",
    features: [
      "2 Einsätze/Monat inkl. (je 60 Min)",
      "Priorität: 24–48h",
      "Extra-Zeit: 35 €/h"
    ],
    cta: "Premium wählen",
    highlight: true
  },
  {
    id: "VIP",
    name: "VIP",
    price: "149 € / Monat",
    tag: "Maximale Priorität",
    features: [
      "4 Einsätze/Monat inkl. (je 60 Min)",
      "Same/Next Day (если доступно)",
      "Extra-Zeit: 29 €/h"
    ],
    cta: "VIP wählen"
  }
];

function $(id){ return document.getElementById(id); }

function setLang(lang){
  const dict = window.I18N[lang] || window.I18N.de;
  document.documentElement.lang = lang;

  const map = {
    t_appName: dict.appName,
    t_appTagline: dict.appTagline,
    t_h1: dict.h1,
    t_h1p: dict.h1p,
    t_badge1: dict.badge1,
    t_badge2: dict.badge2,
    t_badge3: dict.badge3,
    t_btnRequest: dict.btnRequest,
    t_btnPlans: dict.btnPlans,
    t_fine1: dict.fine1,
    t_stat1: dict.stat1,
    t_stat2: dict.stat2,
    t_stat3: dict.stat3,

    t_plansTitle: dict.plansTitle,
    t_plansSub: dict.plansSub,
    t_noteTitle: dict.noteTitle,
    t_noteFine: dict.noteFine,

    t_reqTitle: dict.reqTitle,
    t_reqSub: dict.reqSub,
    t_f_name: dict.f_name,
    t_f_phone: dict.f_phone,
    t_f_city: dict.f_city,
    t_f_plan: dict.f_plan,
    t_f_service: dict.f_service,
    t_f_time: dict.f_time,
    t_f_lang: dict.f_lang,
    t_f_consent: dict.f_consent,
    t_f_submit: dict.f_submit,
    t_legal1: dict.legal1,
    t_legal2: dict.legal2,

    t_frTitle: dict.frTitle,
    t_frSub: dict.frSub,
    t_fr1: dict.fr1,
    t_fr2: dict.fr2
  };

  Object.keys(map).forEach(k => { if($(k)) $(k).textContent = map[k]; });

  // lists
  const noteList = $("t_noteList");
  noteList.innerHTML = "";
  dict.noteList.forEach(x=>{
    const li=document.createElement("li");
    li.textContent=x;
    noteList.appendChild(li);
  });

  const fr1 = $("t_frList1");
  fr1.innerHTML="";
  dict.frList1.forEach(x=>{ const li=document.createElement("li"); li.textContent=x; fr1.appendChild(li); });

  const fr2 = $("t_frList2");
  fr2.innerHTML="";
  dict.frList2.forEach(x=>{ const li=document.createElement("li"); li.textContent=x; fr2.appendChild(li); });

  $("t_footerFine").textContent = dict.footerFine.replace("{year}", new Date().getFullYear());

  renderPlans(lang);
}

function renderPlans(lang){
  const grid = $("plansGrid");
  grid.innerHTML = "";

  PRICING.forEach(p=>{
    const card = document.createElement("div");
    card.className = "card plan" + (p.highlight ? " highlight" : "");
    card.innerHTML = `
      <div class="tag">${escapeHtml(p.tag)}</div>
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px;">
        <div style="font-size:18px;font-weight:900;">${escapeHtml(p.name)}</div>
        <div class="price">${escapeHtml(p.price)}</div>
      </div>
      <ul>${p.features.map(f=>`<li>${escapeHtml(f)}</li>`).join("")}</ul>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px;">
        <a class="btn ${p.highlight ? "primary" : ""}" href="#request" data-plan="${p.id}">${escapeHtml(p.cta)}</a>
        <button class="btn ghost" type="button" data-fill="${p.id}">Auto-fill</button>
      </div>
      <div class="small">Abrechnung monatlich. Kündigung jederzeit zum Monatsende.</div>
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll("[data-plan]").forEach(a=>{
    a.addEventListener("click", (e)=>{
      const plan = e.currentTarget.getAttribute("data-plan");
      document.querySelector('select[name="plan"]').value = plan;
    });
  });

  grid.querySelectorAll("[data-fill]").forEach(b=>{
    b.addEventListener("click", ()=>{
      const plan = b.getAttribute("data-fill");
      document.querySelector('select[name="plan"]').value = plan;
      location.hash = "#request";
    });
  });
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[m]));
}

// Form submit -> Apps Script -> Google Sheets
async function submitForm(e){
  e.preventDefault();
  const msg = $("formMsg");
  msg.textContent = "";

  if(!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("PASTE_")){
    msg.textContent = "⚠️ Admin: Поставь APPS_SCRIPT_URL в app.js";
    return;
  }

  const fd = new FormData(e.target);
  const payload = Object.fromEntries(fd.entries());
  payload.ts = new Date().toISOString();
  payload.userAgent = navigator.userAgent;

  try{
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ action:"createLead", payload })
    });
    const data = await res.json();
    if(data.ok){
      msg.textContent = "✅ Отправлено! Мы скоро свяжемся.";
      e.target.reset();
      e.target.querySelector('input[name="city"]').value = "Kassel";
    } else {
      msg.textContent = "❌ Ошибка: " + (data.error || "unknown");
    }
  }catch(err){
    msg.textContent = "❌ Ошибка сети: " + err.message;
  }
}

function setupPWAInstall(){
  let deferredPrompt = null;
  const btn = $("btnInstall");

  window.addEventListener("beforeinstallprompt", (e)=>{
    e.preventDefault();
    deferredPrompt = e;
    btn.style.display = "inline-flex";
    btn.textContent = "Install";
  });

  btn.addEventListener("click", async ()=>{
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    btn.style.display = "none";
  });

  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js");
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  $("year").textContent = new Date().getFullYear();
  $("reqForm").addEventListener("submit", submitForm);

  // language default DE
  const langSel = $("lang");
  const saved = localStorage.getItem("lang") || "de";
  langSel.value = saved;
  setLang(saved);

  langSel.addEventListener("change", ()=>{
    const v = langSel.value;
    localStorage.setItem("lang", v);
    setLang(v);
  });

  setupPWAInstall();
});
