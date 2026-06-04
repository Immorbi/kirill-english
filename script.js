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
const revealEls = document.querySelectorAll(
  '.about__grid, .credential-item, .course-card, .price__card, .booking__info, .booking-form, .audio-section'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

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
