// Nav scroll effect
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile nav
const burger = document.querySelector('.nav__burger');
const navLinks = document.querySelector('.nav__links');

function closeNav() {
  navLinks.classList.remove('open');
  burger.classList.remove('open');
  document.body.style.overflow = '';
}
function openNav() {
  navLinks.classList.add('open');
  burger.classList.add('open');
  document.body.style.overflow = 'hidden';
}

burger.addEventListener('click', (e) => {
  e.stopPropagation();
  navLinks.classList.contains('open') ? closeNav() : openNav();
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeNav);
});

document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== burger) {
    closeNav();
  }
});

// Audio player
const audio = document.getElementById('audioEl');
const playBtn = document.getElementById('playBtn');
const progress = document.getElementById('audioProgress');
const timeEl = document.getElementById('audioTime');
const track = document.querySelector('.audio-track');

const playIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
const pauseIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

playBtn.addEventListener('click', () => {
  if (audio.paused) { audio.play(); playBtn.innerHTML = pauseIcon; }
  else { audio.pause(); playBtn.innerHTML = playIcon; }
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progress.style.width = pct + '%';
  const m = Math.floor(audio.currentTime / 60);
  const s = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
  timeEl.textContent = `${m}:${s}`;
});

audio.addEventListener('ended', () => {
  playBtn.innerHTML = playIcon;
  progress.style.width = '0%';
  timeEl.textContent = '0:00';
});

track.addEventListener('click', e => {
  const rect = track.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  audio.currentTime = ratio * audio.duration;
});

// Scroll reveal
// Add reveal to legacy selectors not already marked in HTML
['.about__grid', '.credential-item', '.price__card', '.booking__info', '.booking-form']
  .forEach(sel => document.querySelectorAll(sel).forEach(el => el.classList.add('reveal')));

// Observe ALL .reveal elements (both HTML-static and just-added above)
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Contact method tabs
document.querySelectorAll('.contact-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.contact-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const targetId = tab.dataset.target;
    ['contact-tg', 'contact-vk', 'contact-phone'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const isActive = id === targetId;
        el.style.display = isActive ? 'block' : 'none';
        el.disabled = !isActive;
        if (isActive) el.required = true;
        else el.required = false;
      }
    });
  });
});

// Form handling
function handleForm(e, type) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type=submit]');
  btn.textContent = 'Отправляю...';
  btn.disabled = true;

  // Collect data for mailto fallback
  const data = Object.fromEntries(new FormData(form));
  const subject = type === 'trial' ? 'Запись на пробный урок' : 'Запись на урок';
  const body = Object.entries(data).map(([k,v]) => `${k}: ${v}`).join('\n');

  setTimeout(() => {
    form.reset();
    btn.textContent = type === 'trial' ? 'Отправить заявку' : 'Записаться на урок';
    btn.disabled = false;
    document.getElementById('modal').classList.add('open');
  }, 800);
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

document.getElementById('modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

// ── ClickSpark (from react-bits) ──
(function() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const sparks = [];
  const DURATION = 480, COUNT = 8, RADIUS = 28, SIZE = 9;
  const COLORS = ['#2a9e70','#34b882','#50c398','#a0dfc8'];

  function resize() {
    const dpr = devicePixelRatio || 1;
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('click', e => {
    const now = performance.now();
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    for (let i = 0; i < COUNT; i++) {
      sparks.push({ x: e.clientX, y: e.clientY, angle: (2 * Math.PI * i) / COUNT, t: now, color });
    }
  });

  function draw(ts) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      const el = ts - s.t;
      if (el > DURATION) { sparks.splice(i, 1); continue; }
      const p = el / DURATION;
      const e = p * (2 - p);
      const dist = e * RADIUS;
      const len  = SIZE * (1 - e);
      const x1 = s.x + dist * Math.cos(s.angle);
      const y1 = s.y + dist * Math.sin(s.angle);
      const x2 = s.x + (dist + len) * Math.cos(s.angle);
      const y2 = s.y + (dist + len) * Math.sin(s.angle);
      ctx.globalAlpha = 1 - p;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}());

// ── SpotlightCard hover ──
document.querySelectorAll('.price__card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', (e.clientX - r.left) + 'px');
    card.style.setProperty('--mouse-y', (e.clientY - r.top) + 'px');
  });
});

// ── CountUp ──
(function() {
  const els = document.querySelectorAll('.countup[data-to]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      const el = entry.target;
      const to = +el.dataset.to;
      const from = 0;
      const dur = 1800;
      const start = performance.now();
      function step(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(from + (to - from) * ease);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = to;
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}());

// ── (removed: English Alphabet Physics) ──
(function() {
  const canvas = document.getElementById('alphabetCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const GRAVITY = 0.25;
  const DAMPING = 0.72;
  const FRICTION = 0.988;

  const PALETTE = [
    '#c8ede0','#b4e6d4','#a0dfc8','#8cd8bc',
    '#78d1b0','#64caa4','#50c398','#3cbc8c',
    '#2ab580','#2a9e70','#258e64','#1f7e58',
  ];

  let balls = [], mouse = { x: -9999, y: -9999 }, W = 0, H = 420;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const newW = rect.width || canvas.parentElement.offsetWidth || window.innerWidth;
    if (newW === 0) return;
    W = newW;
    const dpr = devicePixelRatio || 1;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn() {
    const R = Math.min(W / 10, H / 6, 32);
    balls = LETTERS.map((letter, i) => ({
      letter, r: R,
      x: R + Math.random() * (W - R * 2),
      y: R + Math.random() * H * 0.5,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 2,
      color: PALETTE[i % PALETTE.length],
    }));
  }

  function collide(a, b) {
    const dx = b.x - a.x, dy = b.y - a.y;
    const d = Math.hypot(dx, dy);
    const min = a.r + b.r;
    if (d >= min || d < 0.01) return;
    const nx = dx / d, ny = dy / d;
    const ov = (min - d) * 0.5;
    a.x -= nx * ov; a.y -= ny * ov;
    b.x += nx * ov; b.y += ny * ov;
    const dvx = a.vx - b.vx, dvy = a.vy - b.vy;
    const dot = dvx * nx + dvy * ny;
    if (dot > 0) return;
    const imp = dot * 0.88;
    a.vx -= imp * nx; a.vy -= imp * ny;
    b.vx += imp * nx; b.vy += imp * ny;
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const b of balls) {
      // mouse repulsion
      const mdx = b.x - mouse.x, mdy = b.y - mouse.y;
      const md = Math.hypot(mdx, mdy);
      if (md < 110 && md > 1) {
        const f = ((110 - md) / 110) * 7;
        b.vx += (mdx / md) * f;
        b.vy += (mdy / md) * f;
      }
      b.vy += GRAVITY;
      b.vx *= FRICTION; b.vy *= FRICTION;
      const spd = Math.hypot(b.vx, b.vy);
      if (spd > 18) { b.vx = b.vx / spd * 18; b.vy = b.vy / spd * 18; }
      b.x += b.vx; b.y += b.vy;
      if (b.x - b.r < 0)  { b.x = b.r;     b.vx =  Math.abs(b.vx) * DAMPING; }
      if (b.x + b.r > W)  { b.x = W - b.r;  b.vx = -Math.abs(b.vx) * DAMPING; }
      if (b.y - b.r < 0)  { b.y = b.r;     b.vy =  Math.abs(b.vy) * DAMPING; }
      if (b.y + b.r > H)  { b.y = H - b.r;  b.vy = -Math.abs(b.vy) * DAMPING; }
    }
    for (let i = 0; i < balls.length; i++)
      for (let j = i + 1; j < balls.length; j++)
        collide(balls[i], balls[j]);

    for (const b of balls) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
      ctx.font = `700 ${b.r * 0.72}px 'Libre Baskerville', Georgia, serif`;
      ctx.fillStyle = '#0d0e18';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.letter, b.x, b.y + b.r * 0.05);
    }
    requestAnimationFrame(tick);
  }

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const r = canvas.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - r.left; mouse.y = e.touches[0].clientY - r.top;
  }, { passive: false });
  canvas.addEventListener('touchend', () => { mouse.x = -9999; mouse.y = -9999; });
  // Shake on click
  canvas.addEventListener('click', () => {
    balls.forEach(b => { b.vx += (Math.random() - 0.5) * 12; b.vy -= Math.random() * 8; });
  });

  let inited = false;
  function init() {
    if (inited) return;
    const dpr = devicePixelRatio || 1;
    W = canvas.offsetWidth || canvas.parentElement.offsetWidth || window.innerWidth - 32;
    H = 420;
    if (W <= 0) return;
    inited = true;
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    spawn();
  }

  window.addEventListener('resize', () => {
    inited = false;
    init();
  });

  // Try at different times to guarantee layout is ready
  setTimeout(init, 0);
  setTimeout(init, 100);
  setTimeout(init, 400);
  window.addEventListener('load', init);
  tick();
}());

// Убираем висячие предлоги/союзы/частицы
(function fixOrphans() {
  const re = /(\s)(а|в|во|и|к|ко|на|не|но|о|об|от|по|под|с|со|у|я|он|из|за|до|при|без|над|для|или|что|как|так|то|же|ли|бы|уж|её|его|их)(\s)/gi;
  const walk = node => {
    if (node.nodeType === 3) {
      node.nodeValue = node.nodeValue.replace(re, (m, b, w) => b + w + ' ');
    } else if (node.nodeType === 1 && !['SCRIPT','STYLE','INPUT','TEXTAREA'].includes(node.tagName)) {
      node.childNodes.forEach(walk);
    }
  };
  document.querySelectorAll('p, h1, h2, h3, h4, blockquote, li, .hero__credentials-line, .price__desc, .price__per')
    .forEach(walk);
}());
