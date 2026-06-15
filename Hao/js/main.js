/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ===== NAV ACTIVE STATE ===== */
(function () {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
  });
})();

/* ===== TYPEWRITER (used on index) ===== */
function typewriter(el, text, speed = 60, callback) {
  let i = 0;
  el.textContent = '';
  const cursor = document.createElement('span');
  cursor.style.cssText = 'animation: blink 1s step-end infinite; border-right: 2px solid currentColor; margin-left:2px;';
  el.after(cursor);
  const t = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) { clearInterval(t); if (callback) callback(); }
  }, speed);
}

/* ===== MODAL HELPERS ===== */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); });
});
// ESC key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
});

/* ===== SMOOTH NAV INDICATOR ===== */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav');
  if (nav) nav.style.borderBottomColor = window.scrollY > 20
    ? 'rgba(0,229,255,0.25)' : 'rgba(0,229,255,0.1)';
});
