/* Handwerk+ PWA Starter */
(async function(){
  const cfg = window.HANDWERKPLUS || {};
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

  // Load strings
  const strings = await fetch('./i18n/strings.json').then(r=>r.json());
  const year = new Date().getFullYear();

  const state = {
    lang: (new URLSearchParams(location.search).get('lang')) || localStorage.getItem('lang') || cfg.DEFAULT_LANG || 'de'
  };
  if(!strings[state.lang]) state.lang='de';

  function t(path){
    const parts = path.split('.');
    let cur = strings[state.lang];
    for(const p of parts){
      if(cur && Object.prototype.hasOwnProperty.call(cur,p)) cur = cur[p];
      else return path;
    }
    if(typeof cur === 'string') return cur.replace('{year}', String(year));
    return cur;
  }

  function setLang(lang){
    if(!strings[lang]) return;
    state.lang = lang;
    localStorage.setItem('lang', lang);
    renderAll();
  }

  function toast(title, desc){
    const el = $('#toast');
    $('.t', el).textContent = title;
    $('.d', el).textContent = desc;
    el.classList.add('show');
    setTimeout(()=>el.classList.remove('show'), 4200);
  }

  function navActive(){
    const hash = (location.hash || '#home').replace('#','');
    $$('.nav-links a').forEach(a=>{
      a.classList.toggle('active', (a.getAttribute('href')||'').includes('#'+hash));
    });
  }

  function renderNav(){
    $('#brandName').textContent = cfg.BRAND || "Handwerk+";
    $('#navHome').textContent = t('nav.home');
    $('#navServices').textContent = t('nav.services');
    $('#navPricing').textContent = t('nav.pricing');
    $('#navPartner').textContent = t('nav.partner');
    $('#navCabinet').textContent = t('nav.cabinet');
    $('#navAdmin').textContent = t('nav.admin');

    // Language selector
    const sel = $('#langSelect');
    sel.innerHTML = '';
    (cfg.SUPPORTED_LANGS || ['de','ua','ru']).forEach(code=>{
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = strings[code]?.langName || code.toUpperCase();
      sel.appendChild(opt);
    });
    sel.value = state.lang;
    sel.onchange = (e)=> setLang(e.target.value);
  }

  function renderHero(){
    $('#heroTitle').textContent = t('hero.title');
    $('#heroSub').textContent = t('hero.subtitle');
    $('#heroCta').textContent = t('hero.cta');
    $('#heroCta2').textContent = t('hero.cta2');
    const badges = t('badges');
    const wrap = $('#badges');
    wrap.innerHTML='';
    (badges||[]).forEach(b=>{
      const div=document.createElement('div');
      div.className='badge';
      div.textContent=b;
      wrap.appendChild(div);
    });
  }

  function renderServices(){
    $('#servicesTitle').textContent = t('services.title');
    const items = t('services.items');
    const list = $('#servicesList');
    list.innerHTML='';
    (items||[]).forEach(it=>{
      const c=document.createElement('div');
      c.className='card';
      c.innerHTML = `<div style="font-weight:900; font-size:16px">${escapeHtml(it.t)}</div>
        <div class="mini" style="margin-top:6px">${escapeHtml(it.d)}</div>`;
      list.appendChild(c);
    });
  }

  function renderPricing(){
    $('#pricingTitle').textContent = t('pricing.title');
    $('#pricingNote').textContent = t('pricing.note');
    $('#pricingLegal').textContent = t('pricing.legal');

    const plans = t('pricing.plans');
    const wrap = $('#pricingCards');
    wrap.innerHTML='';
    (plans||[]).forEach(p=>{
      const card=document.createElement('div');
      card.className='card';
      card.innerHTML = `
        <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:10px;">
          <div>
            <div style="font-weight:900; font-size:18px">${escapeHtml(p.name)}</div>
            <div class="mini" style="margin-top:4px">${escapeHtml(p.desc)}</div>
          </div>
          <div class="pill ${p.id==='vip'?'warn':''}">${escapeHtml(p.price)}</div>
        </div>
        <ul class="ul">
          ${(p.bullets||[]).map(b=>`<li>${escapeHtml(b)}</li>`).join('')}
        </ul>
        <div class="hero-actions" style="margin-top:14px">
          <button data-plan="${p.id}" class="choosePlan">${escapeHtml(t('pricing.cta'))}</button>
          <a class="mini" href="#lead" style="align-self:center; text-decoration:underline">${escapeHtml(t('hero.cta'))}</a>
        </div>
      `;
      wrap.appendChild(card);
    });

    $$('.choosePlan').forEach(btn=>{
      btn.onclick = ()=>{
        const plan = btn.getAttribute('data-plan');
        $('#leadPlan').value = plan;
        location.hash = '#lead';
      };
    });
  }

  function renderLead(){
    $('#leadTitle').textContent = t('lead.title');
    $('#leadSub').textContent = t('lead.subtitle');

    const f = t('lead.fields');
    $('#fName').textContent = f.name;
    $('#fPhone').textContent = f.phone;
    $('#fEmail').textContent = f.email;
    $('#fCity').textContent = f.city;
    $('#fAddress').textContent = f.address;
    $('#fCategory').textContent = f.category;
    $('#fPlan').textContent = f.plan;
    $('#fDetails').textContent = f.details;
    $('#fPhotos').textContent = f.photos;

    const cats = t('lead.categories');
    const catSel = $('#leadCategory');
    catSel.innerHTML='';
    (cats||[]).forEach(c=>{
      const opt=document.createElement('option');
      opt.value=c;
      opt.textContent=c;
      catSel.appendChild(opt);
    });

    const plans = t('pricing.plans');
    const planSel = $('#leadPlan');
    planSel.innerHTML='';
    (plans||[]).forEach(p=>{
      const opt=document.createElement('option');
      opt.value=p.id;
      opt.textContent=`${p.name} — ${p.price}`;
      planSel.appendChild(opt);
    });

    $('#leadSubmit').textContent = t('lead.submit');
  }

  function renderPartner(){
    $('#partnerTitle').textContent = t('partner.title');
    $('#partnerSub').textContent = t('partner.subtitle');
    $('#partnerHowTitle').textContent = t('partner.howTitle');

    const steps = t('partner.steps');
    const wrap = $('#partnerSteps');
    wrap.innerHTML='';
    (steps||[]).forEach(s=>{
      const d=document.createElement('div');
      d.className='card';
      d.innerHTML = `<div style="font-weight:900">${escapeHtml(s.t)}</div><div class="mini" style="margin-top:6px">${escapeHtml(s.d)}</div>`;
      wrap.appendChild(d);
    });

    $('#partnerFormTitle').textContent = t('partner.formTitle');
    const f = t('partner.fields');
    $('#pCompanyL').textContent=f.company;
    $('#pEmailL').textContent=f.email;
    $('#pPhoneL').textContent=f.phone;
    $('#pCityL').textContent=f.city;
    $('#pSkillsL').textContent=f.skills;
    $('#pToolsL').textContent=f.tools;
    $('#pLegalL').textContent=f.legal;
    $('#pMessageL').textContent=f.message;

    const legal = t('partner.legalOpts');
    const sel = $('#pLegal');
    sel.innerHTML='';
    (legal||[]).forEach(o=>{
      const opt=document.createElement('option');
      opt.value=o; opt.textContent=o;
      sel.appendChild(opt);
    });

    $('#partnerSubmit').textContent = t('partner.submit');
    $('#partnerOk').textContent = t('partner.ok');
  }

  function renderFooter(){
    $('#fImpressum').textContent = t('footer.impressum');
    $('#fPrivacy').textContent = t('footer.privacy');
    $('#fTerms').textContent = t('footer.terms');
    $('#fCopy').textContent = t('footer.copy');
  }

  function renderAll(){
    document.documentElement.lang = state.lang;
    renderNav();
    renderHero();
    renderServices();
    renderPricing();
    renderLead();
    renderPartner();
    renderFooter();
    navActive();
  }

  function escapeHtml(str){
    return String(str ?? '').replace(/[&<>"']/g, s=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[s]));
  }

  // Lead submit -> Apps Script
  async function postToAppsScript(action, payload){
    const url = cfg.APPS_SCRIPT_URL;
    if(!url || url.includes('PASTE_')){
      throw new Error('APPS_SCRIPT_URL not set');
    }
    // POST JSON
    const res = await fetch(url, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({action, ...payload})
    });
    const data = await res.json().catch(()=> ({}));
    if(!res.ok || data.ok === false) throw new Error(data.error || 'Request failed');
    return data;
  }

  $('#leadForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const payload = {
      lang: state.lang,
      source: 'pwa_site',
      name: $('#leadName').value.trim(),
      phone: $('#leadPhone').value.trim(),
      email: $('#leadEmail').value.trim(),
      city: $('#leadCity').value.trim(),
      address: $('#leadAddress').value.trim(),
      category: $('#leadCategory').value,
      plan: $('#leadPlan').value,
      details: $('#leadDetails').value.trim(),
      photos: $('#leadPhotos').value.trim()
    };
    try{
      await postToAppsScript('leadCreate', payload);
      toast(t('lead.okTitle'), t('lead.okText'));
      e.target.reset();
      // default plan back to standard
      $('#leadPlan').value = 'standard';
    }catch(err){
      toast(t('lead.errTitle'), t('lead.errText'));
      console.warn(err);
    }
  });

  $('#partnerForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const payload = {
      lang: state.lang,
      source: 'pwa_site',
      company: $('#pCompany').value.trim(),
      email: $('#pEmail').value.trim(),
      phone: $('#pPhone').value.trim(),
      city: $('#pCity').value.trim(),
      skills: $('#pSkills').value.trim(),
      tools: $('#pTools').value.trim(),
      legal: $('#pLegal').value,
      message: $('#pMessage').value.trim()
    };
    try{
      await postToAppsScript('partnerRequest', payload);
      toast('OK', t('partner.ok'));
      e.target.reset();
    }catch(err){
      toast('Error', 'Could not send');
      console.warn(err);
    }
  });

  // PWA install
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault();
    deferredPrompt = e;
    $('#installBtnWrap').style.display = 'inline-flex';
  });
  $('#installBtn').onclick = async ()=>{
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    $('#installBtnWrap').style.display = 'none';
  };

  window.addEventListener('hashchange', ()=>navActive());
  renderAll();

  // Register SW
  if('serviceWorker' in navigator){
    window.addEventListener('load', async ()=>{
      try{ await navigator.serviceWorker.register('./sw.js'); }catch(e){ /* ignore */ }
    });
  }
})();
