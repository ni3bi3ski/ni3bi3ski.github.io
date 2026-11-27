(function () {
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = '/kadry.css';
  document.head.appendChild(css);

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  fetch('/kadry.json')
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (list) {
      var items = list.filter(function (p) { return p && p.src; });
      if (!items.length) return;
      var anchor = document.querySelector('.split');
      if (!anchor) return;
      var sec = document.createElement('section');
      sec.className = 'kadry';
      sec.id = 'kadry';
      sec.innerHTML = '<p class="sec-label">Portfolio</p><h2 class="sec-title">Wybrane kadry</h2><div class="kadry-grid">' +
        items.map(function (p) {
          return '<figure><img src="' + esc(p.src) + '" alt="' + esc(p.alt) + '" loading="lazy"' +
            (p.width && p.height ? ' width="' + esc(p.width) + '" height="' + esc(p.height) + '"' : '') + '>' +
            (p.place ? '<figcaption>' + esc(p.place) + '</figcaption>' : '') + '</figure>';
        }).join('') + '</div>';
      anchor.parentNode.insertBefore(sec, anchor);
    })
    .catch(function (e) { console.warn('Kadry: nie można załadować', e); });
})();
