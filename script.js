// Nav scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile nav
const burger = document.querySelector('#burger');
const navMobile = document.querySelector('#navMobile');

burger.addEventListener('click', () => {
  const open = navMobile.classList.toggle('open');
  burger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMobile.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Contact tabs
document.querySelectorAll('.contact-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.contact-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const input = document.querySelector('#fcontact');
    const placeholders = { telegram: '@username', vk: '@username или ссылка', email: 'email@example.com' };
    if (input) input.placeholder = placeholders[tab.dataset.channel] || '@username';
  });
});

// Booking form
const form = document.getElementById('bookingForm');
const modal = document.getElementById('modal');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    modal.classList.add('open');
    form.reset();
  });
}

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  reveals.forEach(el => io.observe(el));
}

// Audio player
(function() {
  const btn = document.getElementById('playBtn');
  const audio = document.getElementById('audioEl');
  const progress = document.getElementById('audioProgress');
  const timeEl = document.getElementById('audioTime');
  if (!btn || !audio) return;

  function fmt(s) {
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2,'0')}`;
  }
  btn.addEventListener('click', () => {
    audio.paused ? audio.play() : audio.pause();
    btn.innerHTML = audio.paused
      ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
  });
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    progress.style.width = (audio.currentTime / audio.duration * 100) + '%';
    timeEl.textContent = fmt(audio.currentTime);
  });
  audio.addEventListener('ended', () => {
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    progress.style.width = '0%';
    timeEl.textContent = '0:00';
  });
}());

// ClickSpark
(function() {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, { position:'fixed', inset:'0', width:'100%', height:'100%', pointerEvents:'none', zIndex:'9999' });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W, H;
  function resize() {
    W = canvas.width  = window.innerWidth  * dpr;
    H = canvas.height = window.innerHeight * dpr;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  const sparks = [];
  const COLORS = ['#C0392B','#FF6B5B','#ffffff','#2E4080','#B0BCE0'];
  document.addEventListener('click', e => {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      sparks.push({ x: e.clientX, y: e.clientY, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 1, color: COLORS[Math.floor(Math.random()*COLORS.length)] });
    }
  });

  (function tick() {
    ctx.clearRect(0, 0, W/dpr, H/dpr);
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx; s.y += s.vy; s.vy += 0.12; s.life -= 0.045;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      ctx.globalAlpha = s.life;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 3 * s.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }());
}());
