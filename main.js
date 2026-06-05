/* ================================================
   ni3bi3ski.github.io — main.js
   (gtag inicjalizowany inline w <head>)
   ================================================ */

/* ---------- CUSTOM CURSOR ---------- */
(function () {
  const cur  = document.getElementById('cur');
  const dot  = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');
  if (!cur || !dot || !ring) return;

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
  const heroImg = document.querySelector('.hero-img img');
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
  'pricing-head', 'price1', 'price2', 'price3', 'pricing-foot',
  'testimonials-head', 'testimonial1', 'testimonial2', 'testimonial3',
  'testimonial-intro', 'testimonial-form',
  'c-eye', 'c-h', 'c-row'
].forEach(id => {
  const el = document.getElementById(id);
  if (el) io.observe(el);
});
document.querySelectorAll('.p-item').forEach(el => io.observe(el));

/* ---------- OPINIE — dynamiczne ładowanie ---------- */
(function () {
  const grid = document.querySelector('.testimonials-grid');
  if (!grid) return;

  fetch('./opinie.json')
    .then(r => r.json())
    .then(opinie => {
      const approved = opinie.filter(o => o.approved);
      if (!approved.length) return;
      grid.innerHTML = approved.map((o, i) => `
        <article class="testimonial-card" id="testimonial${i + 1}">
          <div>
            <p class="testimonial-kicker">${o.kicker}</p>
            <p class="testimonial-quote">&ldquo;${o.quote}&rdquo;</p>
          </div>
          <div class="testimonial-meta">
            <strong>${o.name}</strong>
            <span>${o.meta}</span>
          </div>
        </article>
      `).join('');
      document.querySelectorAll('.testimonial-card').forEach(el => io.observe(el));
    })
    .catch(() => {}); // cicha obsługa błędu – siatka zostaje ze statycznym HTML
})();

/* ---------- FEATURED — losowy projekt ---------- */
(function () {
  const featured = [
    {
      title: 'Sportsy',
      desc:  'Reportaż z kultowego eventu ulicznego. Energia, ruch i kadry, które działy się tylko raz. Dokument chwil, które nie czekają.',
      href:  'https://niebiezki.myportfolio.com/sportsy',
      img:   'https://cdn.myportfolio.com/c707dd54-58cb-4c19-95f2-7e640d370fe9/d1a3c43f-dbc9-47b0-9f42-f532847b142a_rwc_0x1123x1365x769x1365.jpg?h=1055083717dcadb5010ca4b808729927'
    },
    {
      title: 'Sylwester Bielsko-Biała 25/26',
      desc:  'Nocny reportaż z miasta. Światło, tłum i energia przejścia między starym a nowym rokiem.',
      href:  'https://niebiezki.myportfolio.com/sylwester-bielsko-biala-31122025',
      img:   'https://cdn.myportfolio.com/c707dd54-58cb-4c19-95f2-7e640d370fe9/4ebc0e4c-2479-48c8-b3eb-d5867ee9bb5d_rwc_0x508x1365x769x1365.jpg?h=2301dc38cae991b2d07e2d0b0bf1bdf2'
    },
    {
      title: 'Street Yourself 2',
      desc:  'Street photography i miejski rytm. Ujęcia oparte na ruchu, geście i codziennym napięciu.',
      href:  'https://niebiezki.myportfolio.com/street-yourself-2-28062025',
      img:   'https://cdn.myportfolio.com/c707dd54-58cb-4c19-95f2-7e640d370fe9/0bf760d5-d0ef-4a40-9062-1af3265fad7e_rwc_0x305x1638x923x1638.jpg?h=b8da8e5156b530baed52a416b1b99727'
    },
    {
      title: 'Rekord — Sokół · Betclic II liga',
      desc:  'Meczowy reportaż z koncentracją na emocji, dynamice i detalach boiska.',
      href:  'https://niebiezki.myportfolio.com/rekord-sokol-15082025',
      img:   'https://cdn.myportfolio.com/c707dd54-58cb-4c19-95f2-7e640d370fe9/07d83596-9fd8-4a69-aeda-dcefad48ffb9_car_16x9.jpg?h=cfee3d55dc9ef0fc78cadea689acf54e'
    },
    {
      title: 'PSK 2026 — Inauguracja',
      desc:  'Wydarzenie z charakterem, światłem i ruchem, uchwycone bez upiększania.',
      href:  'https://niebiezki.myportfolio.com/psk-2026-inauguracja-20022025',
      img:   'https://cdn.myportfolio.com/c707dd54-58cb-4c19-95f2-7e640d370fe9/406e456c-f088-4069-a7d1-accf2fd26249_rwc_0x96x1920x1082x1920.jpg?h=8ad1e6aa8f30a5b7319024abaa1dca74'
    },
    {
      title: 'Mistrzostwa Polski Roasters 2025',
      desc:  'Reportaż z branżowego wydarzenia, w którym liczy się tempo, detal i atmosfera.',
      href:  'https://niebiezki.myportfolio.com/mistrzostwa-polski-roasters-2025-04102025',
      img:   'https://cdn.myportfolio.com/c707dd54-58cb-4c19-95f2-7e640d370fe9/abb051f4-5ac9-4baa-8044-54693c335c1d_rwc_0x756x1365x769x1365.jpg?h=196e57710072ceadc534c0a5dbb14d5e'
    },
    {
      title: 'Marsz Równości — Bielsko-Biała 2025',
      desc:  'Dokument miejskiego wydarzenia z naciskiem na emocje i kontekst ulicy.',
      href:  'https://niebiezki.myportfolio.com/marsz-rownosci-w-bielsku-bialej-22062025',
      img:   'https://cdn.myportfolio.com/c707dd54-58cb-4c19-95f2-7e640d370fe9/838e1451-a9b9-465d-bbbf-2ad22f272d52_rwc_0x639x1365x769x1365.jpg?h=0ad53312dd4d806a7fe004ae34f6ab51'
    }
  ];

  let pick = featured[Math.floor(Math.random() * featured.length)];
  try {
    const saved = sessionStorage.getItem('featuredIndex');
    const idx   = saved === null ? -1 : Number(saved);
    if (Number.isInteger(idx) && idx >= 0 && idx < featured.length) {
      pick = featured[idx];
    } else {
      sessionStorage.setItem('featuredIndex', String(featured.indexOf(pick)));
    }
  } catch (e) { /* sessionStorage zablokowany */ }

  const featImg = document.getElementById('feat-img');
  if (!featImg) return;
  featImg.href = pick.href;
  const img = featImg.querySelector('img');
  if (img) { img.src = pick.img; img.alt = pick.title; }
  const title = document.querySelector('.feat-title');
  const desc  = document.querySelector('.feat-desc');
  const num   = document.querySelector('.feat-num');
  if (title) title.textContent = pick.title;
  if (desc)  desc.textContent  = pick.desc;
  if (num)   num.textContent   = 'Wyróżniony projekt';
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
  });
})();

/* ---------- FORMULARZ KONTAKTOWY — walidacja ---------- */
(function () {
  const form = document.querySelector('form[id="kontakt-form"], form.contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    let valid = true;

    form.querySelectorAll('input[required], textarea[required]').forEach(inp => {
      inp.style.borderColor = '';
      if (!inp.value.trim()) {
        inp.style.borderColor = 'rgba(200,80,80,0.7)';
        valid = false;
      }
    });

    const emailInp = form.querySelector('input[type="email"]');
    if (emailInp && emailInp.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInp.value)) {
      emailInp.style.borderColor = 'rgba(200,80,80,0.7)';
      valid = false;
    }

    if (!valid) e.preventDefault();
  });
})();

// === HERO SLIDESHOW ===
(function () {
  var heroDiv = document.getElementById('hero-img');
  if (!heroDiv) return;
  var slides = JSON.parse(heroDiv.dataset.slides || '[]');
  if (slides.length < 2) return;
  var img = document.getElementById('hero-slide-img');
  var current = 0;
  var preloadImg = new Image();
  function preload(idx) { preloadImg.src = slides[(idx + 1) % slides.length]; }
  function transition() {
    current = (current + 1) % slides.length;
    img.style.transition = 'opacity 1.2s ease';
    img.style.opacity = '0';
    setTimeout(function () { img.src = slides[current]; img.style.opacity = '1'; preload(current); }, 1200);
  }
  preload(0);
  setInterval(transition, 5000);
})();
