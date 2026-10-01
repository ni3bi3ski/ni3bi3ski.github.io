/* Przycisk "Napisz SMS" w sekcji kontaktu. Samodzielny plik, nie wymaga zmian w main.js ani style.css. */
(function () {
  var PHONE = '+48572116577';
  var TEXT = 'Dzień dobry, piszę w sprawie sesji / reportażu. Termin: ... Miejsce: ... Pozdrawiam';

  function init() {
    var form = document.querySelector('form.contact-form');
    if (!form || document.getElementById('sms-btn')) return;

    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:8px;margin:18px auto 0;text-align:center;';

    var hint = document.createElement('span');
    hint.textContent = 'Wolisz krótko? Napisz SMS:';
    hint.style.cssText = 'font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted,#999);';

    var a = document.createElement('a');
    a.id = 'sms-btn';
    a.href = 'sms:' + PHONE + '?body=' + encodeURIComponent(TEXT);
    a.setAttribute('aria-label', 'Napisz SMS na numer +48 572 116 577');
    a.textContent = 'Napisz SMS';
    a.style.cssText = 'display:inline-flex;align-items:center;gap:10px;padding:14px 28px;border:1px solid var(--faint,rgba(255,255,255,.3));border-radius:999px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--text,#f2f2f2);background:transparent;text-decoration:none;font-family:inherit;transition:border-color .25s,background .25s;';
    a.addEventListener('mouseenter', function () { a.style.background = 'rgba(255,255,255,.06)'; });
    a.addEventListener('mouseleave', function () { a.style.background = 'transparent'; });
    a.addEventListener('click', function () {
      if (typeof gtag === 'function') gtag('event', 'click_sms', { method: 'sms' });
    });

    wrap.appendChild(hint);
    wrap.appendChild(a);
    form.insertAdjacentElement('afterend', wrap);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
