// app.js
(() => {
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

  // Smooth scroll for nav anchors
  $$(".pill[data-scroll]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const target = btn.getAttribute("data-scroll");
      const el = document.getElementById(target);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({behavior:"smooth", block:"start"});
      history.replaceState(null, "", `#${target}`);
    });
  });

  // Install banner
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = $("#btnInstall");
    if (installBtn) installBtn.style.display = "inline-flex";
  });

  const installBtn = $("#btnInstall");
  if (installBtn) {
    installBtn.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice.catch(()=>{});
      deferredPrompt = null;
      installBtn.style.display = "none";
    });
  }

  // SW
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(()=>{});
    });
  }
})();
