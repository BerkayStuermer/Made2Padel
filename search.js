/* =========================================================
   Made2Padel – Seitensuche
   Läuft komplett im Browser, ohne externen Dienst.
   Die Inhalte werden beim ersten Öffnen der Suche direkt aus den
   eigenen Seiten gelesen (Überschriften, FAQ-Fragen, Shop-Produkte).
   Neue Seiten: unten in SEITEN eintragen.
   ========================================================= */
(function () {
  const SEITEN = [
    { url: '/', titel: 'Startseite' },
    { url: '/shop', titel: 'Shop' },
    { url: '/ueber-uns', titel: 'Über uns' },
    { url: '/faq', titel: 'FAQ' },
    { url: '/logo-anleitung', titel: 'Logo-Anleitung' },
    { url: '/impressum', titel: 'Impressum', nurSeite: true },
    { url: '/datenschutz', titel: 'Datenschutz', nurSeite: true }
  ];
  const CACHE_KEY = 'm2p-suche-v2';

  /* ---------- Hilfsfunktionen ---------- */
  const norm = s => String(s || '').toLowerCase().replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
  const slug = s => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  /* Überschriften-Text mit Leerzeichen an Zeilenumbrüchen (<br>, Masken-Zeilen) */
  const headText = el => {
    const c = el.cloneNode(true);
    c.querySelectorAll('br').forEach(b => b.replaceWith(' '));
    c.querySelectorAll('.mask, .ln').forEach(m => m.append(' '));
    return clean(c.textContent);
  };
  const pathOf = u => (u.replace(/\.html$/, '').replace(/\/index$/, '/') || '/');

  /* ---------- Styles ---------- */
  const css = `
.search-btn { display: inline-grid; place-items: center; width: 38px; height: 38px; flex: none; border-radius: 50%;
  background: none; border: 1px solid #3a3a3a; color: #fff; cursor: pointer; transition: border-color .2s, background .2s; }
.search-btn:hover { border-color: #C5E334; }
.search-btn svg { width: 17px; height: 17px; }
.s-scrim { position: fixed; inset: 0; background: rgba(0,0,0,.6); backdrop-filter: blur(4px); z-index: 300; opacity: 0; pointer-events: none; transition: opacity .2s; }
.s-scrim.on { opacity: 1; pointer-events: auto; }
.s-box { position: fixed; z-index: 301; left: 50%; top: calc(80px + env(safe-area-inset-top, 0px)); width: min(640px, 92vw);
  transform: translate(-50%, -10px); opacity: 0; pointer-events: none; transition: opacity .2s, transform .2s;
  background: #101010; border: 1px solid #262626; border-radius: 18px; box-shadow: 0 30px 80px rgba(0,0,0,.6); overflow: hidden;
  font-family: 'Archivo', system-ui, sans-serif; color: #fff; }
.s-box.on { opacity: 1; transform: translate(-50%, 0); pointer-events: auto; }
.s-field { display: flex; align-items: center; gap: .75rem; padding: 1rem 1.2rem; border-bottom: 1px solid #262626; }
.s-field svg { width: 20px; height: 20px; flex: none; color: #C5E334; }
.s-field input { flex: 1; min-width: 0; background: none; border: 0; outline: 0; color: #fff; font: inherit; font-size: 1.05rem; }
.s-field input::placeholder { color: #777; }
.s-field input::-webkit-search-cancel-button { display: none; }
.s-close { background: none; border: 1px solid #333; color: #aaa; border-radius: 8px; font: inherit; font-size: .72rem; padding: .25rem .5rem; cursor: pointer; }
.s-results { list-style: none; margin: 0; padding: .4rem; max-height: min(60vh, 460px); overflow-y: auto; }
.s-results a { display: block; padding: .75rem .9rem; border-radius: 10px; text-decoration: none; color: #fff; }
.s-results a:hover, .s-results a.act { background: #1f1f1f; }
.s-results .s-where { display: block; font-size: .72rem; font-weight: 600; color: #C5E334; margin-bottom: .15rem; }
.s-results .s-t { display: block; font-weight: 700; font-size: .95rem; }
.s-results .s-d { display: block; font-size: .82rem; color: #9a9a9a; margin-top: .15rem; line-height: 1.45;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.s-results mark { background: none; color: #C5E334; }
.s-empty { padding: 1.2rem 1rem; color: #9a9a9a; font-size: .9rem; }
.s-hint { padding: .9rem 1rem 1rem; color: #777; font-size: .8rem; }
.s-hint button { background: #1c1c1c; border: 1px solid #2c2c2c; color: #ddd; border-radius: 999px; font: inherit; font-size: .78rem; padding: .3rem .75rem; margin: .5rem .35rem 0 0; cursor: pointer; }
.s-hint button:hover { border-color: #C5E334; }
.s-flash { animation: sFlash 1.6s ease; border-radius: 6px; }
@keyframes sFlash { 0%, 40% { box-shadow: 0 0 0 6px rgba(197,227,52,.35); } 100% { box-shadow: 0 0 0 6px rgba(197,227,52,0); } }
@media (max-width: 480px) {
  .nav-right { gap: .4rem !important; }
  .menu-btn { padding: .45rem .7rem !important; }
  .menu-btn svg { display: none; }
  .top .wordmark { font-size: 1.55rem; }
  .top { padding-left: 5vw !important; padding-right: 5vw !important; gap: .5rem !important; }
}
@media (max-width: 860px) { .search-btn { width: 34px; height: 34px; } .search-btn svg { width: 15px; height: 15px; } .s-box { top: calc(70px + env(safe-area-inset-top, 0px)); } }
@media (prefers-reduced-motion: reduce) { .s-box, .s-scrim { transition: none; } .s-flash { animation: none; } }`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- Overlay ---------- */
  const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
  const scrim = document.createElement('div'); scrim.className = 's-scrim';
  const box = document.createElement('div'); box.className = 's-box';
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Suche');
  box.innerHTML = `<div class="s-field">${ICON}<input type="search" id="sInput" placeholder="Suchen, z. B. Lieferzeit, Logo, Kantenschutz" autocomplete="off" aria-label="Suchbegriff" aria-controls="sResults"><button class="s-close" type="button">Esc</button></div><ul class="s-results" id="sResults" role="listbox"></ul>`;
  document.body.append(scrim, box);
  const input = box.querySelector('input');
  const list = box.querySelector('.s-results');
  const btn = document.getElementById('searchBtn');
  let index = null, loading = null, active = -1, lastFocus = null;

  /* ---------- Index aufbauen ---------- */
  function fromDoc(doc, seite) {
    const out = [];
    const desc = doc.querySelector('meta[name="description"]');
    out.push({ seite: seite.titel, url: seite.url, t: seite.titel, d: desc ? desc.content : '' });
    if (seite.nurSeite) return out;
    const skip = el => el.closest('nav, footer, .menu, .top, .menu-list, form, .panel, .toc, [aria-hidden="true"]');
    doc.querySelectorAll('h1, h2, h3, summary').forEach(el => {
      if (skip(el)) return;
      const t = headText(el);
      if (!t) return;
      let d = '';
      if (el.tagName === 'SUMMARY') {
        const a = el.parentElement.querySelector('.answer'); d = a ? clean(a.textContent) : '';
      } else {
        let n = el.nextElementSibling;
        while (n && !d) { if (/^(P|DIV|UL)$/.test(n.tagName)) d = clean(n.textContent); n = n.nextElementSibling; }
      }
      out.push({ seite: seite.titel, url: seite.url + '#such-' + slug(t), t, d: d.slice(0, 220) });
    });
    if (seite.url === '/shop') {
      const re = /id:\s*'([^']+)',\s*name:\s*'([^']+)'[\s\S]*?kurz:\s*'([^']*)'(?:[\s\S]*?text:\s*'([^']*)')?/g;
      doc.querySelectorAll('script').forEach(s => {
        let m; while ((m = re.exec(s.textContent))) {
          out.push({ seite: 'Shop · Produkt', url: '/shop#such-produkt-' + m[1], t: m[2], d: m[3], x: m[4] || '' });
        }
      });
    }
    return out;
  }
  function load() {
    if (index) return Promise.resolve(index);
    if (loading) return loading;
    try { const c = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null'); if (c && c.length) { index = c; return Promise.resolve(index); } } catch (e) {}
    const here = pathOf(location.pathname);
    loading = Promise.all(SEITEN.map(seite => {
      const p = here === seite.url ? Promise.resolve(document.documentElement.outerHTML)
        : fetch(seite.url).then(r => r.ok ? r.text() : '').catch(() => '');
      return p.then(html => html ? fromDoc(new DOMParser().parseFromString(html, 'text/html'), seite) : [{ seite: seite.titel, url: seite.url, t: seite.titel, d: '' }]);
    })).then(parts => {
      index = parts.flat().map(e => Object.assign(e, { nt: norm(e.t), nd: norm(e.d + ' ' + (e.x || '') + ' ' + e.seite) }));
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(index)); } catch (e) {}
      return index;
    });
    return loading;
  }

  /* ---------- Suchen & anzeigen ---------- */
  function mark(text, words) {
    let h = esc(text);
    words.forEach(w => {
      if (w.length < 2) return;
      const n = norm(text); let i = n.indexOf(w);
      if (i < 0 || n.length !== text.length) return;
      const raw = text.slice(i, i + w.length);
      h = h.replace(esc(raw), '<mark>' + esc(raw) + '</mark>');
    });
    return h;
  }
  function render() {
    const q = norm(input.value); active = -1;
    if (!q) {
      list.innerHTML = `<li class="s-hint">Beliebte Suchen:<br>${['Lieferzeit', 'Mindestmenge', 'Logo', 'Versand', 'Kantenschutz'].map(w => `<button type="button" data-q="${w}">${w}</button>`).join('')}</li>`;
      return;
    }
    if (!index) { list.innerHTML = '<li class="s-empty">Suche wird geladen …</li>'; return; }
    const words = q.split(' ');
    const hits = index.map(e => {
      let sc = 0;
      for (const w of words) {
        const stem = w.length >= 6 ? w.slice(0, Math.max(5, w.length - 4)) : null;
        if (e.nt.includes(w)) sc += e.nt.startsWith(w) ? 6 : 4;
        else if (e.nd.includes(w)) sc += 1;
        else if (stem && e.nt.includes(stem)) sc += 2;
        else if (stem && e.nd.includes(stem)) sc += .5;
        else return null;
      }
      if (e.seite.includes('Produkt')) sc += 2;
      return { e, sc };
    }).filter(Boolean).sort((a, b) => b.sc - a.sc);
    const seen = new Set();
    const top = hits.filter(h => { const k = h.e.url + h.e.t; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 8);
    if (!top.length) {
      list.innerHTML = `<li class="s-empty">Keine Treffer für „${esc(input.value.trim())}“. Schreibt uns gern an <a href="mailto:info@made2padel.de" style="color:#C5E334">info@made2padel.de</a>.</li>`;
      return;
    }
    list.innerHTML = top.map((h, i) => `<li role="option"><a href="${h.e.url}" data-i="${i}"><span class="s-where">${esc(h.e.seite)}</span><span class="s-t">${mark(h.e.t, words)}</span>${h.e.d ? `<span class="s-d">${mark(h.e.d, words)}</span>` : ''}</a></li>`).join('');
  }
  function setActive(i) {
    const links = list.querySelectorAll('a[data-i]'); if (!links.length) return;
    active = (i + links.length) % links.length;
    links.forEach((a, k) => a.classList.toggle('act', k === active));
    links[active].scrollIntoView({ block: 'nearest' });
  }

  /* ---------- Öffnen / Schließen ---------- */
  function open() {
    lastFocus = document.activeElement;
    scrim.classList.add('on'); box.classList.add('on');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    render(); setTimeout(() => input.focus(), 30);
    load().then(render);
  }
  function close() {
    scrim.classList.remove('on'); box.classList.remove('on');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (btn) btn.addEventListener('click', e => { e.stopPropagation(); open(); });
  scrim.addEventListener('click', close);
  box.querySelector('.s-close').addEventListener('click', close);
  input.addEventListener('input', render);
  list.addEventListener('click', e => {
    const b = e.target.closest('button[data-q]');
    if (b) { input.value = b.dataset.q; render(); input.focus(); return; }
    const a = e.target.closest('a[data-i]');
    if (a && pathOf(new URL(a.href).pathname) === pathOf(location.pathname)) {
      e.preventDefault(); close(); history.replaceState(null, '', a.getAttribute('href')); goToHash();
    } else if (a) close();
  });
  document.addEventListener('keydown', e => {
    const isOpen = box.classList.contains('on');
    if (!isOpen && e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) { e.preventDefault(); open(); return; }
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter' && document.activeElement === input) {
      const links = list.querySelectorAll('a[data-i]');
      const a = links[active >= 0 ? active : 0]; if (a) { e.preventDefault(); a.click(); }
    }
  });

  /* ---------- Treffer auf der Zielseite anspringen ---------- */
  function goToHash() {
    const h = decodeURIComponent(location.hash || '');
    if (!h.startsWith('#such-')) return;
    const key = h.slice(6);
    let el = null;
    if (key.startsWith('produkt-')) {
      const card = document.querySelector('.card[data-id="' + key.slice(8).replace(/"/g, '') + '"]');
      if (card) { card.scrollIntoView({ block: 'center' }); setTimeout(() => card.click(), 350); }
      return;
    }
    document.querySelectorAll('h1, h2, h3, summary').forEach(x => { if (!el && slug(headText(x)) === key) el = x; });
    if (!el) return;
    const det = el.closest('details'); if (det) det.open = true;
    el.closest('.reveal') && el.closest('.reveal').classList.add('in');
    el.querySelectorAll('.mask, .reveal').forEach(m => m.classList.add('in'));
    const y = el.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    el.classList.add('s-flash'); setTimeout(() => el.classList.remove('s-flash'), 1700);
  }
  if (document.readyState === 'complete') setTimeout(goToHash, 200);
  else window.addEventListener('load', () => setTimeout(goToHash, 200));
  window.addEventListener('hashchange', goToHash);
})();
