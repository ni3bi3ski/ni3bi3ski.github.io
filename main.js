/* ================================================
   ni3bi3ski.github.io — main.js
   ================================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ---------- ZGODA NA COOKIES (Google Consent Mode v2) ---------- */
(function () {
  var KEY = 'cookie-consent';
  function update(granted) {
    if (typeof gtag !== 'function') return;
    gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
  }
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === 'granted') { update(true); return; }
  if (saved === 'denied') return;

  var bar = document.createElement('div');
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', 'Zgoda na pliki cookies');
  bar.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;padding:16px 18px;background:#141414;color:#f2f2f2;border:1px solid rgba(255,255,255,.18);border-radius:14px;font-size:13px;line-height:1.6;display:flex;gap:12px;align-items:center;flex-wrap:wrap;';
  bar.innerHTML = '<span style="flex:1 1 240px">Używam Google Analytics do statystyk odwiedzin. Zgadzasz się na analityczne pliki cookies?</span>' +
    '<span style="display:flex;gap:8px">' +
    '<button type="button" data-c="no" style="padding:8px 14px;border:1px solid rgba(255,255,255,.3);border-radius:999px;background:transparent;color:inherit;font:inherit;cursor:pointer">Odrzuć</button>' +
    '<button type="button" data-c="yes" style="padding:8px 14px;border:1px solid #fff;border-radius:999px;background:#fff;color:#0d0d0d;font:inherit;cursor:pointer">Akceptuję</button>' +
    '</span>';
  bar.addEventListener('click', function (e) {
    var c = e.target && e.target.getAttribute && e.target.getAttribute('data-c');
    if (!c) return;
    var granted = c === 'yes';
    try { localStorage.setItem(KEY, granted ? 'granted' : 'denied'); } catch (err) {}
    update(granted);
    bar.remove();
  });
  document.body.appendChild(bar);
})();

/* ---------- CUSTOM CURSOR (tylko mysz, bez reduced-motion) ---------- */
(function () {
  const cur  = document.getElementById('cur');
  const dot  = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');
  if (!cur || !dot || !ring) return;
  if (!hasFinePointer || prefersReducedMotion) { cur.style.display = 'none'; return; }

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('on-link'));
    el.addEventListener('mouseleave', () => cur.classList.remove('on-link'));
  });
  document.querySelectorAll('img').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('on-img'));
    el.addEventListener('mouseleave', () => cur.classList.remove('on-img'));
  });
})();

/* ---------- NAV — mobile toggle ---------- */
(function () {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
})();

/* ---------- NAV — solid on scroll ---------- */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (nav) nav.classList.toggle('solid', window.scrollY > 50);
}, { passive: true });

/* ---------- HERO — parallax ---------- */
(function () {
  if (prefersReducedMotion) return;
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroImg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    }
  }, { passive: true });
})();

/* ---------- HERO — reveal on load ---------- */
window.addEventListener('load', () => {
  const t = document.getElementById('hero-title');
  const a = document.getElementById('hero-aside');
  if (t) t.classList.add('go');
  if (a) a.classList.add('go');
});

/* ---------- INTERSECTION OBSERVER — scroll reveals ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('go');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

[
  'feat-label', 'feat-img', 'feat-body', 'work-head',
  'about-img', 'about-h', 'about-m', 'about-s', 'about-stats', 'gear',
  'srv-head', 'srv1', 'srv2', 'srv3',
  'testimonials-head', 'testimonial1', 'testimonial2', 'testimonial3',
  'testimonial-intro', 'testimonial-form',
  'c-eye', 'c-h', 'c-row'
].forEach(id => {
  const el = document.getElementById(id);
  if (el) io.observe(el);
});
document.querySelectorAll('.p-item').forEach(el => io.observe(el));

/* ---------- OPINIE — dynamiczne ładowanie (z escapowaniem) ---------- */
(function () {
  const grid = document.querySelector('.testimonials-grid');
  if (!grid) return;

  fetch('./opinie.json')
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(opinie => {
      const approved = opinie.filter(o => o && o.approved);
      if (!approved.length) return;
      grid.innerHTML = approved.map((o, i) => `
        <article class="testimonial-card" id="testimonial${i + 1}">
          <p class="t-kicker">${esc(o.kicker)}</p>
          <blockquote class="t-quote">&bdquo;${esc(o.quote)}&rdquo;</blockquote>
          <footer class="t-footer">
            <span class="t-name">${esc(o.name)}</span>
            <span class="t-meta">${esc(o.meta)}</span>
          </footer>
        </article>
      `).join('');
      document.querySelectorAll('.testimonial-card').forEach(el => io.observe(el));
    })
    .catch(err => console.warn('Opinie: nie można załadować', err));
})();

/* ---------- FEATURED — losowy projekt ---------- */
(function () {
  const featured = [
    { title: 'Sportsy', desc: 'Reportaż z kultowego eventu ulicznego. Energia, ruch i kadry, które działy się tylko raz. Dokument chwil, które nie czekają.', href: 'https://niebiezki.myportfolio.com/sportsy', img: 'https://cdn.myportfolio.com/c707dd54-58cb-4c19-95f2-7e640d370fe9/d1a3c43f-dbc9-47b0-9f42-f532847b142a_rwc_0x1123x1365x769x1365.jpg?h=1055083717dcadb5010ca4b808729927' },
    { title: 'Sylwester Bielsko-Biała 25/26', desc: 'Nocny reportaż z miasta. Światło, tłum i energia przejścia między starym a nowym rokiem.', href: 'https://niebiezki.myportfolio.com/sylwester-bielsko-biala-31122025', img: 'https://cdn.myportfolio.com/c707dd54-58cb-4c19-95f2-7e640d370fe9/4ebc0e4c-2479-48c8-b3eb-d5867ee9bb5d_rwc_0x508x1365x769x1365.jpg?h=2301dc38cae991b2d07e2d0b0bf1bdf2' },
    { title: 'Street Yourself 2', desc: 'Street photography i miejski rytm. Ujęcia oparte na ruchu, geście i codziennym napięciu.', href: 'https://niebiezki.myportfolio.com/street-yourself-2-28062025', img: 'https://cdn.myportfolio.com/c707dd54-58cb-4c19-95f2-7e640d370fe9/0bf760d5-d0ef-4a40-9062-1af3265fad7e_rwc_0x305x1638x923x1638.jpg?h=b8da8e5156b530baed52a416b1b99727' },
    { title: 'Rekord — Sokół · Betclic II liga', desc: 'Meczowy reportaż z koncentracją na emocji, dynamice i detalach boiska.', href: 'https://niebiezki.myportfolio.com/rekord-sokol-15082025', img: 'https://cdn.myportfolio.com/c707dd54-58cb-4c19-95f2-7e640d370fe9/07d83596-9fd8-4a69-aeda-dcefad48ffb9_car_16x9.jpg?h=cfee3d55dc9ef0fc78cadea689acf54e' },
    { title: 'PSK 2026 — Inauguracja', desc: 'Wydarzenie z charakterem, światłem i ruchem, uchwycone bez upiększania.', href: 'https://niebiezki.myportfolio.com/psk-2026-inauguracja-20022025', img: 'https://cdn.myportfolio.com/c707dd54-58cb-4c19-95f2-7e640d370fe9/406e456c-f088-4069-a7d1-accf2fd26249_rwc_0x96x1920x1082x1920.jpg?h=8ad1e6aa8f30a5b7319024abaa1dca74' },
    { title: 'Mistrzostwa Polski Roasters 2025', desc: 'Reportaż z branżowego wydarzenia, w którym liczy się tempo, detal i atmosfera.', href: 'https://niebiezki.myportfolio.com/mistrzostwa-polski-roasters-2025-04102025', img: 'https://cdn.myportfolio.com/c707dd54-58cb-4c19-95f2-7e640d370fe9/abb051f4-5ac9-4baa-8044-54693c335c1d_rwc_0x756x1365x769x1365.jpg?h=196e57710072ceadc534c0a5dbb14d5e' },
    { title: 'Marsz Równości — Bielsko-Biała 2025', desc: 'Dokument miejskiego wydarzenia z naciskiem na emocje i kontekst ulicy.', href: 'https://niebiezki.myportfolio.com/marsz-rownosci-w-bielsku-bialej-22062025', img: 'https://cdn.myportfolio.com/c707dd54-58cb-4c19-95f2-7e640d370fe9/838e1451-a9b9-465d-bbbf-2ad22f272d52_rwc_0x639x1365x769x1365.jpg?h=0ad53312dd4d806a7fe004ae34f6ab51' }
  ];

  const pick = featured[Math.floor(Math.random() * featured.length)];
  const featImg = document.getElementById('feat-img');
  if (!featImg) return;
  featImg.href = pick.href;
  const img = featImg.querySelector('img');
  if (img) { img.src = pick.img; img.alt = pick.title; }
  const link  = document.querySelector('#feat-body .feat-link');
  const title = document.querySelector('.feat-title');
  const desc  = document.querySelector('.feat-desc');
  if (link)  link.href = pick.href;
  if (title) title.textContent = pick.title;
  if (desc)  desc.textContent  = pick.desc;
})();

/* ---------- "POKAŻ WIĘCEJ" ---------- */
(function () {
  const btn    = document.getElementById('btn-more');
  const extras = document.querySelectorAll('.p-item.extra');
  const txt    = document.getElementById('btn-txt');
  if (!btn) return;

  let open = false;
  btn.addEventListener('click', () => {
    open = !open;
    extras.forEach((el, i) => {
      if (open) {
        el.classList.add('show');
        setTimeout(() => el.classList.add('go'), 30 + i * 80);
      } else {
        el.classList.remove('go');
        setTimeout(() => el.classList.remove('show'), 500);
      }
    });
    if (txt) txt.textContent = open ? 'Pokaż mniej' : 'Pokaż więcej';
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  });
})();

/* ---------- FORMULARZE — walidacja i komunikat po wysyłce ---------- */
(function () {
  const forms = document.querySelectorAll('form.contact-form, form.testimonial-form');
  const mark = el => { el.style.borderColor = 'rgba(200,80,80,0.7)'; };

  forms.forEach(form => {
    form.addEventListener('submit', e => {
      let valid = true;

      form.querySelectorAll('input[required], textarea[required]').forEach(inp => {
        inp.style.borderColor = '';
        const empty = inp.type === 'checkbox' ? !inp.checked : !inp.value.trim();
        if (empty) { mark(inp); valid = false; }
      });

      const emailInp = form.querySelector('input[type="email"]');
      if (emailInp && emailInp.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInp.value)) {
        mark(emailInp);
        valid = false;
      }

      const hp = form.querySelector('input[name="gotcha"]');
      if (hp && hp.value) valid = false;

      if (!valid) { e.preventDefault(); return; }

      if (typeof gtag === 'function') {
        const t = form.querySelector('input[name="form_type"]');
        gtag('event', 'generate_lead', { form_type: t ? t.value : 'unknown' });
      }
    });
  });
})();

/* ---------- HERO SLIDESHOW (bez autoplay przy reduced-motion) ---------- */
(function () {
  var heroDiv = document.getElementById('hero-img');
  if (!heroDiv || prefersReducedMotion) return;
  var slides = [];
  try { slides = JSON.parse(heroDiv.dataset.slides || '[]'); } catch (e) { return; }
  if (slides.length < 2) return;
  var img = document.getElementById('hero-slide-img');
  if (!img) return;
  var current = 0;
  var preloadImg = new Image();
  var timer = null;
  function preload(idx) { preloadImg.src = slides[(idx + 1) % slides.length]; }
  function transition() {
    current = (current + 1) % slides.length;
    img.style.opacity = '0';
    setTimeout(function () { img.src = slides[current]; img.style.opacity = '1'; preload(current); }, 1200);
  }
  function start() { if (!timer) timer = setInterval(transition, 5000); }
  function stop()  { clearInterval(timer); timer = null; }
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  preload(0);
  start();
})();
