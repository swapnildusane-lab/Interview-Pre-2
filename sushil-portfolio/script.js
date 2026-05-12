/* ============================================
   SUSHIL KUMAR DUSANE — script.js
   ============================================ */

/* ---- LOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 2000);
});
document.body.style.overflow = 'hidden';

/* ---- SET PROFILE IMAGE ---- */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof SUSHIL_IMG !== 'undefined') {
    const heroPhoto = document.getElementById('heroPhoto');
    const aboutPhoto = document.getElementById('aboutPhoto');
    if (heroPhoto) heroPhoto.src = SUSHIL_IMG;
    if (aboutPhoto) aboutPhoto.src = SUSHIL_IMG;
  }
});

/* ---- AOS INIT ---- */
AOS.init({
  duration: 700,
  once: true,
  easing: 'ease-out-cubic',
  offset: 60,
});

/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ---- ACTIVE NAV LINK ON SCROLL ---- */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const h = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = navLinks.querySelector(`a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + h) {
        link.style.color = 'var(--primary)';
      } else {
        link.style.color = '';
      }
    }
  });
});

/* ---- DARK / LIGHT MODE ---- */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.querySelector('i').className =
    theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

/* ---- TYPING EFFECT ---- */
const phrases = [
  'Trusted Insurance Advisor',
  'Life Insurance Expert',
  'Health Coverage Specialist',
  'Claim Settlement Champion',
  'Your Financial Guardian',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  if (!typedEl) return;
  const current = phrases[phraseIndex];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === current.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    speed = 400;
  }
  setTimeout(type, speed);
}
setTimeout(type, 1500);

/* ---- ANIMATED COUNTERS ---- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('en-IN');
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ---- TESTIMONIAL SLIDER ---- */
const track = document.getElementById('tsTrack');
const dotsContainer = document.getElementById('tsDots');
const cards = track ? track.querySelectorAll('.ts-card') : [];
let current = 0;
let autoplay;

function buildDots() {
  if (!dotsContainer) return;
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'ts-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });
}

function goTo(index) {
  current = (index + cards.length) % cards.length;
  if (track) track.style.transform = `translateX(-${current * 100}%)`;
  document.querySelectorAll('.ts-dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

function startAutoplay() {
  autoplay = setInterval(() => goTo(current + 1), 5000);
}
function stopAutoplay() {
  clearInterval(autoplay);
}

const prevBtn = document.getElementById('tsPrev');
const nextBtn = document.getElementById('tsNext');
if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoplay(); goTo(current - 1); startAutoplay(); });
if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoplay(); goTo(current + 1); startAutoplay(); });

buildDots();
startAutoplay();

/* Touch swipe for testimonials */
let touchStartX = 0;
if (track) {
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      stopAutoplay();
      goTo(dx < 0 ? current + 1 : current - 1);
      startAutoplay();
    }
  });
}

/* ---- CONTACT FORM ---- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #16a34a, #22c55e)';
      contactForm.reset();
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1600);
  });
}

/* ---- SMOOTH SCROLL NAV LINKS ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- REVEAL FLOATING QUOTE ON SCROLL ---- */
const floatQuote = document.querySelector('.float-quote');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    floatQuote.style.opacity = '1';
    floatQuote.style.pointerEvents = 'auto';
  } else {
    floatQuote.style.opacity = '0';
    floatQuote.style.pointerEvents = 'none';
  }
});
if (floatQuote) {
  floatQuote.style.opacity = '0';
  floatQuote.style.transition = 'opacity 0.4s ease';
}

/* ---- PARALLAX on hero shapes ---- */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const shapes = document.querySelectorAll('.shape');
  shapes.forEach((shape, i) => {
    shape.style.transform = `translateY(${scrollY * (i + 1) * 0.04}px)`;
  });
});
