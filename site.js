/* =========================================================
   Made2Padel – kleine Helfer für alle Seiten
   - "Nach oben"-Button unten rechts
   ========================================================= */
(function () {
  const css = `
.to-top { position: fixed; right: max(18px, env(safe-area-inset-right, 0px) + 12px); bottom: max(18px, env(safe-area-inset-bottom, 0px) + 12px);
  z-index: 70; width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; cursor: pointer;
  background: #C5E334; color: #050505; border: 0; box-shadow: 0 10px 30px rgba(0,0,0,.45);
  opacity: 0; transform: translateY(14px) scale(.9); pointer-events: none; transition: opacity .25s, transform .25s, background .2s; }
.to-top.on { opacity: 1; transform: none; pointer-events: auto; }
.to-top:hover { background: #fff; }
.to-top svg { width: 20px; height: 20px; }
@media (max-width: 860px) { .to-top { width: 44px; height: 44px; } }
@media (prefers-reduced-motion: reduce) { .to-top { transition: none; } }`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const btn = document.createElement('button');
  btn.className = 'to-top'; btn.type = 'button'; btn.setAttribute('aria-label', 'Nach oben');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(btn);

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    const first = document.querySelector('a.wordmark, a[href], button');
    if (first) setTimeout(() => first.focus({ preventScroll: true }), reduce ? 0 : 500);
  });

  let ticking = false;
  const update = () => { btn.classList.toggle('on', window.scrollY > window.innerHeight * 0.8); ticking = false; };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  update();
})();
