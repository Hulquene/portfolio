/* ============================================================
   HULQUENE ROBERTO NGOLA — PORTFÓLIO  |  assets/js/main.js
   JavaScript puro, sem dependências. Todo o conteúdo já está
   no HTML; este ficheiro só acrescenta interação.
   ============================================================ */

'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── TEMA (claro / escuro) ─────────────────────────────────── */
/* O tema inicial é aplicado no <head> (evita o "flash"); aqui só tratamos do toggle. */
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!btn) return;

  function apply(theme) {
    root.dataset.theme = theme;
    btn.setAttribute('aria-pressed', String(theme === 'light'));
    btn.setAttribute('aria-label', theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro');
    if (meta) meta.content = theme === 'light' ? '#faf9f7' : '#08080c';
  }

  apply(root.dataset.theme || 'dark');

  btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    apply(next);
    try { localStorage.setItem('theme', next); } catch (_) { /* armazenamento indisponível */ }
  });
})();

/* ── HEADER: estado "scrolled" ─────────────────────────────── */
(function () {
  const header = document.getElementById('site-header');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

/* ── MENU MOBILE ───────────────────────────────────────────── */
(function () {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('is-open', open);
    menu.inert = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) menu.querySelector('a')?.focus();
  }

  menu.inert = true;
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Se o ecrã crescer com o menu aberto, fecha-o
  window.matchMedia('(min-width: 821px)').addEventListener('change', e => { if (e.matches) setOpen(false); });
})();

/* ── LINK ATIVO NA NAVEGAÇÃO ───────────────────────────────── */
(function () {
  const links = document.querySelectorAll('[data-nav] a[href^="#"]');
  const sections = document.querySelectorAll('main section[id]');
  if (!links.length || !sections.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      links.forEach(a => {
        const active = a.getAttribute('href') === id;
        a.classList.toggle('is-active', active);
        if (active) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => io.observe(s));
})();

/* ── ANIMAÇÕES DE ENTRADA AO FAZER SCROLL ──────────────────── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ── BARRAS DE PROFICIÊNCIA ────────────────────────────────── */
(function () {
  const groups = document.querySelectorAll('.skills');
  if (!groups.length) return;

  const fill = group => group.querySelectorAll('.bar-fill').forEach((bar, i) => {
    setTimeout(() => bar.classList.add('is-filled'), reduceMotion ? 0 : i * 120);
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      fill(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  groups.forEach(g => io.observe(g));
})();

/* ── CONTADORES DO HERO ────────────────────────────────────── */
/* O valor final já está no HTML; apenas animamos de 0 até ele. */
(function () {
  if (reduceMotion) return;
  const els = document.querySelectorAll('[data-count]');

  els.forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 4);

    (function step(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(ease(p) * target);
      if (p < 1) requestAnimationFrame(step);
    })(start);
  });
})();

/* ── MARQUEE: duplica a lista para um loop contínuo ────────── */
(function () {
  const track = document.querySelector('.marquee-track');
  const list = track?.querySelector('.marquee-list');
  if (!list) return;
  const clone = list.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.appendChild(clone);
})();

/* ── ANO NO FOOTER ─────────────────────────────────────────── */
(function () {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();
