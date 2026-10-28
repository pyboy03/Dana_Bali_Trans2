/* Bali Tour Guide — script.js (vanilla JS) */
(function () {
  'use strict';

  /* Header: transparan di atas hero (beranda), solid saat scroll */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (header && !header.classList.contains('is-solid-fixed') && document.body.classList.contains('page-home')) {
      header.classList.toggle('is-solid', window.scrollY > 40 || header.classList.contains('menu-open'));
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Menu mobile */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    header.classList.toggle('menu-open', open);
    onScroll();
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* Galeri: filter + lightbox (hanya ada di gallery.php) */
  var gallery = document.getElementById('gallery');
  if (!gallery) return;

  var items = Array.prototype.slice.call(gallery.querySelectorAll('.g-item'));
  var buttons = document.querySelectorAll('.filter-btn');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      buttons.forEach(function (b) { b.classList.toggle('active', b === btn); });
      items.forEach(function (it) {
        it.hidden = !(f === 'All' || it.getAttribute('data-category') === f);
      });
    });
  });

  var lb = document.getElementById('lightbox');
  var img = document.getElementById('lbImg');
  var title = document.getElementById('lbTitle');
  var cap = document.getElementById('lbCaption');
  var count = document.getElementById('lbCount');
  var current = 0, list = [], lastFocus = null;

  function visibleButtons() {
    return items.filter(function (it) { return !it.hidden; })
                .map(function (it) { return it.querySelector('.g-btn'); });
  }

  function show(i) {
    current = (i + list.length) % list.length;
    var b = list[current];
    img.classList.add('swap');
    setTimeout(function () {
      img.src = b.getAttribute('data-full');
      img.alt = b.querySelector('img').alt;
      title.textContent = b.getAttribute('data-title');
      cap.textContent = b.getAttribute('data-caption');
      count.textContent = (current + 1) + ' / ' + list.length;
      img.classList.remove('swap');
    }, 150);
  }

  function open(btn) {
    list = visibleButtons();
    lastFocus = btn;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { lb.classList.add('open'); });
    show(list.indexOf(btn));
    document.getElementById('lbClose').focus();
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () { lb.hidden = true; img.src = ''; }, 300);
    if (lastFocus) lastFocus.focus();
  }

  gallery.addEventListener('click', function (e) {
    var b = e.target.closest('.g-btn');
    if (b) open(b);
  });
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', function () { show(current - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { show(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });

  /* Geser jari di mobile */
  var startX = null;
  lb.addEventListener('touchstart', function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();

/* Tahun footer otomatis */
(function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
