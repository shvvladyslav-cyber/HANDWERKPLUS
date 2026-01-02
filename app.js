// app.js
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  // ---------- i18n ----------
  const I18N = {
    de: {
      "brand.tagline": "Handyman per Abo",
      "nav.start": "Start",
      "nav.services": "Leistungen",
      "nav.abo": "Abo",
      "nav.contact": "Kontakt",
      "nav.partner": "Franchise/Partner",
      "nav.account": "Kundenkonto",
      "nav.admin": "Admin",
      "nav.install": "Install",
      "nav.cta": "Jetzt Anfrage",
      "hero.title": "Handwerk+ — Handyman per Abo",
      "hero.subtitle": "Schnell. Zuverlässig. Transparent. Für Kassel & Umgebung — skalierbar als Franchise.",
      "hero.btn_request": "Jetzt Anfrage senden",
      "hero.btn_partner": "Partner werden",
      "badges.reply": "24–48h Rückmeldung",
      "badges.prices": "Fixe Abo-Preise",
      "badges.verified": "Geprüfte Partner",
      "badges.langs": "Mehrsprachig: DE/UA/RU",
      "sec.services": "Leistungen",
      "sec.abo": "Abo",
      "sec.partner": "Franchise/Partner",
      "sec.contact": "Kontakt",
      "contact.text": "Schreib uns kurz, was du brauchst. (Die Formulare/CRM kannst du später über Apps Script aktivieren.)",
      "contact.telegram": "Jetzt in Telegram",
      "contact.email": "E-Mail senden",
      "legal.impressum": "Impressum",
      "legal.datenschutz": "Datenschutz",
      "legal.agb": "AGB",
    },
    uk: {
      "brand.tagline": "Майстер за підпискою",
      "nav.start": "Старт",
      "nav.services": "Послуги",
      "nav.abo": "Підписка",
      "nav.contact": "Контакти",
      "nav.partner": "Франшиза/Партнер",
      "nav.account": "Кабінет",
      "nav.admin": "Адмін",
      "nav.install": "Встановити",
      "nav.cta": "Заявка",
      "hero.title": "Handwerk+ — Майстер за підпискою",
      "hero.subtitle": "Швидко. Надійно. Прозоро. Для Касселя та околиць — масштабовано як франшиза.",
      "hero.btn_request": "Надіслати заявку",
      "hero.btn_partner": "Стати партнером",
      "badges.reply": "Відповідь 24–48 год",
      "badges.prices": "Фіксовані ціни",
      "badges.verified": "Перевірені партнери",
      "badges.langs": "Мови: DE/UA/RU",
      "sec.services": "Послуги",
      "sec.abo": "Підписка",
      "sec.partner": "Франшиза/Партнер",
      "sec.contact": "Контакти",
      "contact.text": "Коротко напишіть, що потрібно. (Форми/CRM можна підключити пізніше через Apps Script.)",
      "contact.telegram": "Написати в Telegram",
      "contact.email": "Надіслати email",
      "legal.impressum": "Impressum",
      "legal.datenschutz": "Datenschutz",
      "legal.agb": "AGB",
    },
    ru: {
      "brand.tagline": "Мастер по подписке",
      "nav.start": "Старт",
      "nav.services": "Услуги",
      "nav.abo": "Подписка",
      "nav.contact": "Контакты",
      "nav.partner": "Франшиза/Партнёр",
      "nav.account": "Кабинет",
      "nav.admin": "Админ",
      "nav.install": "Установить",
      "nav.cta": "Заявка",
      "hero.title": "Handwerk+ — Мастер по подписке",
      "hero.subtitle": "Быстро. Надёжно. Прозрачно. Для Касселя и окрестностей — масштабируется как франшиза.",
      "hero.btn_request": "Отправить заявку",
      "hero.btn_partner": "Стать партнёром",
      "badges.reply": "Ответ 24–48 ч",
      "badges.prices": "Фикс цены",
      "badges.verified": "Проверенные партнёры",
      "badges.langs": "Языки: DE/UA/RU",
      "sec.services": "Услуги",
      "sec.abo": "Подписка",
      "sec.partner": "Франшиза/Партнёр",
      "sec.contact": "Контакты",
      "contact.text": "Коротко напишите, что нужно. (Формы/CRM можно подключить позже через Apps Script.)",
      "contact.telegram": "Написать в Telegram",
      "contact.email": "Отправить email",
      "legal.impressum": "Impressum",
      "legal.datenschutz": "Datenschutz",
      "legal.agb": "AGB",
    }
  };

  function applyLang(lang) {
    const dict = I18N[lang] || I18N.de;

    // set <html lang="">
    document.documentElement.setAttribute("lang", lang === "uk" ? "uk" : (lang === "ru" ? "ru" : "de"));

    // update active language buttons
    $$("[data-set-lang]").forEach(b => {
      const isOn = b.getAttribute("data-set-lang") === lang;
      b.classList.toggle("is-active", isOn);
      b.setAttribute("aria-pressed", isOn ? "true" : "false");
    });

    // translate nodes
    $$("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const val = dict[key];
      if (typeof val === "string") el.textContent = val;
    });

    try { localStorage.setItem("hp_lang", lang); } catch {}
  }

  function initLang() {
    const saved = (() => { try { return localStorage.getItem("hp_lang"); } catch { return null; } })();
    const initial = saved && I18N[saved] ? saved : "de";
    applyLang(initial);

    $$("[data-set-lang]").forEach(btn => {
      btn.addEventListener("click", () => applyLang(btn.getAttribute("data-set-lang")));
    });
  }

  // ---------- Smooth scroll ----------
  function initScroll() {
    $$("[data-scroll]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const target = btn.getAttribute("data-scroll");
        const el = document.getElementById(target);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${target}`);
      });
    });
  }

  // ---------- Mobile menu ----------
  function initMenu() {
    const btn = $("#btnMenu");
    const menu = $("#mainMenu");
    if (!btn || !menu) return;

    const close = () => {
      menu.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    };

    const toggle = () => {
      const isOpen = menu.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      toggle();
    });

    // close when clicking any menu item
    menu.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      if (t.closest("a") || t.closest("button")) {
        // allow click to proceed, but close menu (esp. on mobile)
        setTimeout(close, 0);
      }
    });

    // close on outside click
    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      if (t === btn || btn.contains(t) || menu.contains(t)) return;
      close();
    });

    // close when resizing to desktop
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 821px)").matches) close();
    });
  }

  // ---------- PWA install ----------
  function initInstall() {
    const installBtn = $("#btnInstall");
    if (!installBtn) return;

    let deferredPrompt = null;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      installBtn.style.display = "inline-flex";
    });

    installBtn.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice.catch(() => {});
      deferredPrompt = null;
      installBtn.style.display = "none";
    });
  }

  // ---------- SW ----------
  function initSW() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        // Ask the browser to check for SW updates (helps with cached old bundles)
        try { reg.update(); } catch {}
      }).catch(() => {});
    });
  }

  // boot
  document.addEventListener("DOMContentLoaded", () => {
    initLang();
    initMenu();
    initScroll();
    initInstall();
    initSW();
  });
})();
