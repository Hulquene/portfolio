/* ============================================================
   HULQUENE NGOLA: PORTFÓLIO E SERVIÇOS  |  assets/js/main.js
   JavaScript puro, sem dependências. Todo o conteúdo já está
   no HTML; este ficheiro só acrescenta interação.
   ============================================================ */

'use strict';

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

/* ── ANO NO FOOTER ─────────────────────────────────────────── */
(function () {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();
