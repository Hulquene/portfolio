/* ============================================================
   HULQUENE ROBERTO NGOLA — PORTFOLIO  |  script.js
   ============================================================ */

'use strict';

/* ── LOADER ─────────────────────────────────────────────────── */
(function () {
  const loader = document.getElementById('loader');
  const bar    = document.getElementById('loader-bar');
  const pct    = document.getElementById('loader-pct');
  let   p      = 0;
  document.body.style.overflow = 'hidden';

  const t = setInterval(() => {
    p += Math.random() * 16 + 5;
    if (p >= 100) {
      p = 100;
      clearInterval(t);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 280);
    }
    bar.style.width  = p + '%';
    pct.textContent  = Math.floor(p) + '%';
  }, 55);
})();

/* ── CUSTOM CURSOR ──────────────────────────────────────────── */
(function () {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function loop() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  const hoverEls = document.querySelectorAll('a, button, .tag, .stack-cell, .proj-card, .channel, .stat-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hovering'); ring.classList.add('hovering'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hovering'); ring.classList.remove('hovering'); });
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
})();

/* ── NAVBAR ─────────────────────────────────────────────────── */
(function () {
  const nav    = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');

  // Scrolled state
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Toggle mobile menu
  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) {
      toggle.classList.remove('open');
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* ── SMOOTH SCROLL ──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ── SKILL BARS ─────────────────────────────────────────────── */
(function () {
  const containers = document.querySelectorAll('.bars');
  if (!containers.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.bar-fill').forEach((fill, i) => {
        setTimeout(() => {
          fill.style.width = fill.dataset.w + '%';
          fill.classList.add('animated');
        }, i * 130);
      });
      io.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  containers.forEach(c => io.observe(c));
})();

/* ── COUNT-UP ───────────────────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur    = 1400;
      const start  = performance.now();

      function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
      function step(now) {
        const progress = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(easeOut(progress) * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  els.forEach(el => io.observe(el));
})();

/* ── ACTIVE NAV LINK ────────────────────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      links.forEach(a => {
        a.style.color = a.getAttribute('href') === id ? 'var(--text)' : '';
      });
    });
  }, { threshold: 0.45 });

  sections.forEach(s => io.observe(s));
})();

/* ── PARALLAX GLOWS ─────────────────────────────────────────── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const glows = document.querySelectorAll('.glow');
  if (!glows.length) return;
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (Math.abs(y - lastY) < 2) return;
    lastY = y;
    glows.forEach((g, i) => {
      const speed = i % 2 === 0 ? 0.05 : -0.035;
      g.style.transform = `translateY(${y * speed}px)`;
    });
  }, { passive: true });
})();

/* ── 3D TILT CARDS ──────────────────────────────────────────── */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.proj-card, .stat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width  - 0.5;
      const cy = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-cy * 5}deg) rotateY(${cx * 5}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ── MAGNETIC BUTTONS ───────────────────────────────────────── */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.btn-fill').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const cx = e.clientX - r.left - r.width  / 2;
      const cy = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${cx * 0.18}px, ${cy * 0.25}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();

/* ── MARQUEE ────────────────────────────────────────────────── */
(function () {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  let x = 0;
  const speed = 0.45;

  function getHalf() { return track.scrollWidth / 2; }

  (function animate() {
    x -= speed;
    if (Math.abs(x) >= getHalf()) x = 0;
    track.style.transform = `translateX(${x}px)`;
    requestAnimationFrame(animate);
  })();
})();
