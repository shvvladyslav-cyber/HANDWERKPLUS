// Handwerk+ v8 — language + micro-motion
(() => {
  const $ = (q, el=document) => el.querySelector(q);
  const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));

  const i18n = {
    de: { nav_start:"Start", nav_services:"Leistungen", nav_abo:"Abo", nav_contact:"Kontakt", nav_franchise:"Franchise/Partner", nav_account:"Kundenkonto",
      cta:"Jetzt Anfrage", h1:"Handwerk+ — Handyman per Abo",
      lead:"Schnell. Zuverlässig. Transparent. Für Kassel & Umgebung — skalierbar als Franchise.",
      btn_send:"Jetzt Anfrage senden", btn_partner:"Partner werden",
      b1:"24–48h Rückmeldung", b2:"Fixe Abo-Preise", b3:"Geprüfte Partner", b4:"Mehrsprachig: DE/UA/RU",
      s1:"Leistungen", s2:"Abo-Modelle", s3:"Franchise / Partner", s4:"Kundenkonto",
      f_title:"Anfrage senden", f_sub:"Schnell. Ohne Registrierung. Wir antworten in 24–48 Stunden.",
      f_name:"Name", f_phone:"Telefon / WhatsApp", f_city:"PLZ / Ort", f_lang:"Sprache", f_msg:"Worum geht’s?", f_submit:"Senden",
      legal_im:"Impressum", legal_ds:"Datenschutz", legal_agb:"AGB"
    },
    ua: { nav_start:"Старт", nav_services:"Послуги", nav_abo:"Підписка", nav_contact:"Контакти", nav_franchise:"Франшиза/Партнер", nav_account:"Кабінет",
      cta:"Заявка", h1:"Handwerk+ — Майстер за підпискою",
      lead:"Швидко. Надійно. Прозоро. Для Касселя та околиць — масштабується як франшиза.",
      btn_send:"Відправити заявку", btn_partner:"Стати партнером",
      b1:"Відповідь 24–48 год", b2:"Фікс ціни", b3:"Перевірені партнери", b4:"Мови: DE/UA/RU",
      s1:"Послуги", s2:"Тарифи підписки", s3:"Франшиза / Партнер", s4:"Кабінет",
      f_title:"Надіслати заявку", f_sub:"Швидко. Без реєстрації. Відповімо за 24–48 год.",
      f_name:"Імʼя", f_phone:"Телефон / WhatsApp", f_city:"Індекс / Місто", f_lang:"Мова", f_msg:"Що потрібно зробити?", f_submit:"Надіслати",
      legal_im:"Impressum", legal_ds:"Datenschutz", legal_agb:"AGB"
    },
    ru: { nav_start:"Старт", nav_services:"Услуги", nav_abo:"Подписка", nav_contact:"Контакты", nav_franchise:"Франшиза/Партнёр", nav_account:"Кабинет",
      cta:"Заявка", h1:"Handwerk+ — Мастер по подписке",
      lead:"Быстро. Надёжно. Прозрачно. Для Касселя и окрестностей — масштабируется как франшиза.",
      btn_send:"Отправить заявку", btn_partner:"Стать партнёром",
      b1:"Ответ 24–48 ч", b2:"Фикс цены", b3:"Проверенные партнёры", b4:"Языки: DE/UA/RU",
      s1:"Услуги", s2:"Тарифы подписки", s3:"Франшиза / Партнёр", s4:"Кабинет",
      f_title:"Отправить заявку", f_sub:"Быстро. Без регистрации. Ответим в течение 24–48 часов.",
      f_name:"Имя", f_phone:"Телефон / WhatsApp", f_city:"Индекс / Город", f_lang:"Язык", f_msg:"Что нужно сделать?", f_submit:"Отправить",
      legal_im:"Impressum", legal_ds:"Datenschutz", legal_agb:"AGB"
    }
  };

  function applyLang(lang){
    const dict = i18n[lang] || i18n.de;
    document.documentElement.lang = (lang === "ua" ? "uk" : lang);

    const setText = (sel, val) => { const el=$(sel); if(el) el.textContent = val; };
    ["nav_start","nav_services","nav_abo","nav_contact","nav_franchise","nav_account","cta",
     "h1","lead","btn_send","btn_partner","b1","b2","b3","b4","s1","s2","s3","s4","f_title","f_sub","f_submit",
     "legal_im","legal_ds","legal_agb"].forEach(key => setText(`[data-i18n='${key}']`, dict[key]));

    const name = $("[name='name']");
    const phone = $("[name='phone']");
    const city = $("[name='city']");
    const msg  = $("[name='msg']");
    if(name) name.placeholder = (lang==="de"?"Vor- und Nachname":lang==="ua"?"Імʼя та прізвище":"Имя и фамилия");
    if(phone) phone.placeholder = "+49…";
    if(city) city.placeholder = (lang==="de"?"z.B. 34117 Kassel":"напр. 34117 Kassel");
    if(msg) msg.placeholder  = (lang==="de"?"Kurz beschreiben (z.B. Möbelaufbau…)":lang==="ua"?"Коротко опишіть (напр. монтаж меблів…)":"Коротко опишите (напр. сборка мебели…)");

    ["f_name","f_phone","f_city","f_lang","f_msg"].forEach(key => setText(`[data-i18n='${key}']`, dict[key]));

    $$(".lang").forEach(b => b.classList.toggle("is-active", b.dataset.lang === lang));
    localStorage.setItem("hw_lang", lang);
  }

  applyLang(localStorage.getItem("hw_lang") || "de");
  $$(".lang").forEach(btn => btn.addEventListener("click", () => applyLang(btn.dataset.lang)));

  // reveal on scroll
  const items = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting) e.target.classList.add("inview"); });
    }, { threshold: 0.12, rootMargin: "0px 0px -10% 0px" });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add("inview"));
  }

  // PWA install
  let deferredPrompt = null;
  const installBtn = $("#installBtn");
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if(installBtn) installBtn.hidden = false;
  });
  installBtn?.addEventListener("click", async () => {
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.hidden = true;
  });

  // form -> telegram share
  const form = $("#reqForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const lang = (localStorage.getItem("hw_lang") || "de").toUpperCase();
    const text =
`Handwerk+ Anfrage (${lang})
Name: ${fd.get("name")}
Telefon: ${fd.get("phone")}
Ort: ${fd.get("city")}
Sprache: ${fd.get("lang")}
---
${fd.get("msg")}`;
    const tgShare = "https://t.me/share/url?url=" + encodeURIComponent(location.href) + "&text=" + encodeURIComponent(text);
    window.open(tgShare, "_blank", "noopener,noreferrer");
    form.reset();
  });

  const year = $("#year");
  if(year) year.textContent = new Date().getFullYear();

  // SW register
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(()=>{});
    });
  }
})();
