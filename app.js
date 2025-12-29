(() => {
  // year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // PWA install
  let deferredPrompt = null;
  const installBtn = document.getElementById('installBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.style.display = 'inline-flex';
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) {
        alert('Install ist aktuell nicht verfügbar (Safari/или уже installiert).');
        return;
      }
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      installBtn.style.display = 'none';
    });
  }

  // Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  // Demo contact handler (no backend)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const msg = (data.get('msg') || '').toString().trim();

      const text =
        `Handwerk+ Anfrage%n` +
        `Name: ${name}%n` +
        `Telefon: ${phone}%n` +
        `Nachricht: ${msg}`;

      alert('Gesendet (Demo). Далее подключим Telegram/Email отправку.');
      form.reset();
      console.log(text.replaceAll('%n', '\n'));
    });
  }
})();
