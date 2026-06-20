/* ═══════════════════════════════════════════════════════
   DIVINE PARTNERS — script.js
   All interactive functionality in Vanilla JavaScript
═══════════════════════════════════════════════════════ */

'use strict';

// ─── DOM READY ───
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroParticles();
  initScrollReveal();
  initCounters();
  initSIPCalculator();
  initTestimonialsSlider();
  initFAQ();
  initForms();
  initBackToTop();
  initSmoothScroll();
  initActiveNavLink();
});

/* ═══════════════════════════════════════════════════
   1. NAVBAR — Sticky + Hamburger
═══════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ═══════════════════════════════════════════════════
   2. HERO PARTICLES
═══════════════════════════════════════════════════ */
function initHeroParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const COUNT = 40;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const x = Math.random() * 100;
    const startY = Math.random() * 100;
    const size = Math.random() * 2.5 + 0.5;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 15;

    p.style.cssText = `
      left: ${x}%;
      top: ${startY}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;

    container.appendChild(p);
  }
}

/* ═══════════════════════════════════════════════════
   3. SCROLL REVEAL — IntersectionObserver
═══════════════════════════════════════════════════ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        const delay = (idx % 4) * 80;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════
   4. ANIMATED COUNTERS
═══════════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const duration = 2200;
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  function step(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;

    if (isDecimal) {
      el.textContent = current.toFixed(1);
    } else {
      el.textContent = Math.floor(current).toLocaleString('en-IN');
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('en-IN');
    }
  }

  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════════════════
   5. SIP CALCULATOR
═══════════════════════════════════════════════════ */
function initSIPCalculator() {
  const inputs = {
    amount: document.getElementById('sipAmount'),
    returns: document.getElementById('sipReturn'),
    duration: document.getElementById('sipDuration'),
  };
  const displays = {
    amount: document.getElementById('sipAmountVal'),
    returns: document.getElementById('sipReturnVal'),
    duration: document.getElementById('sipDurationVal'),
  };
  const results = {
    invested: document.getElementById('totalInvested'),
    returns: document.getElementById('estimatedReturns'),
    total: document.getElementById('totalWealth'),
  };

  if (!inputs.amount) return;

  let chartCtx;

  function formatINR(amount) {
    if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(2) + 'Cr';
    if (amount >= 100000) return '₹' + (amount / 100000).toFixed(2) + 'L';
    return '₹' + Math.round(amount).toLocaleString('en-IN');
  }

  function calculateSIP() {
    const monthly = parseFloat(inputs.amount.value);
    const annualRate = parseFloat(inputs.returns.value) / 100;
    const months = parseInt(inputs.duration.value) * 12;
    const r = annualRate / 12;

    const totalInvested = monthly * months;
    const futureValue = monthly * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
    const estimatedReturns = futureValue - totalInvested;

    displays.amount.textContent = '₹' + monthly.toLocaleString('en-IN');
    displays.returns.textContent = parseFloat(inputs.returns.value) + '%';
    displays.duration.textContent = inputs.duration.value + ' Years';

    results.invested.textContent = formatINR(totalInvested);
    results.returns.textContent = formatINR(estimatedReturns);
    results.total.textContent = formatINR(futureValue);

    updateChart(totalInvested, estimatedReturns);
  }

  function initChart() {
    const canvas = document.getElementById('sipChart');
    if (!canvas) return;
    chartCtx = canvas.getContext('2d');
    drawChart(1800000, 3200000);
  }

  function updateChart(invested, returns) {
    drawChart(invested, returns);
  }

  function drawChart(invested, returns) {
    const canvas = document.getElementById('sipChart');
    if (!canvas || !chartCtx) return;

    const w = canvas.width;
    const h = canvas.height;
    const total = invested + returns;
    const cx = w / 2;
    const cy = h / 2 - 20;
    const r = Math.min(w, h) / 2 - 40;

    chartCtx.clearRect(0, 0, w, h);

    const investedAngle = (invested / total) * Math.PI * 2;
    const returnsAngle = (returns / total) * Math.PI * 2;
    const startAngle = -Math.PI / 2;
    const gap = 0.04;

    // Invested arc — azure
    chartCtx.beginPath();
    chartCtx.arc(cx, cy, r, startAngle + gap / 2, startAngle + investedAngle - gap / 2);
    chartCtx.arc(cx, cy, r * 0.55, startAngle + investedAngle - gap / 2, startAngle + gap / 2, true);
    chartCtx.closePath();
    chartCtx.fillStyle = 'rgba(27, 134, 201, 0.45)';
    chartCtx.fill();

    // Returns arc — green
    chartCtx.beginPath();
    chartCtx.arc(cx, cy, r, startAngle + investedAngle + gap / 2, startAngle + investedAngle + returnsAngle - gap / 2);
    chartCtx.arc(cx, cy, r * 0.55, startAngle + investedAngle + returnsAngle - gap / 2, startAngle + investedAngle + gap / 2, true);
    chartCtx.closePath();
    chartCtx.fillStyle = '#48A349';
    chartCtx.fill();

    // Center text
    chartCtx.fillStyle = 'rgba(255,255,255,0.9)';
    chartCtx.font = 'bold 14px DM Sans';
    chartCtx.textAlign = 'center';
    chartCtx.fillText('Total Wealth', cx, cy - 12);

    const totalFmt = total >= 10000000 ? (total / 10000000).toFixed(1) + 'Cr' :
      total >= 100000 ? (total / 100000).toFixed(1) + 'L' : Math.round(total).toLocaleString('en-IN');

    chartCtx.fillStyle = '#4FA8DE';
    chartCtx.font = 'bold 22px Cormorant Garamond';
    chartCtx.fillText('₹' + totalFmt, cx, cy + 16);

    const investedPct = Math.round((invested / total) * 100);
    const returnsPct = 100 - investedPct;

    chartCtx.fillStyle = 'rgba(255,255,255,0.6)';
    chartCtx.font = '11px DM Sans';
    chartCtx.fillText(`Invested: ${investedPct}%`, cx, cy + h / 2 - 10);
    chartCtx.fillStyle = '#48A349';
    chartCtx.fillText(`Returns: ${returnsPct}%`, cx, cy + h / 2 + 10);
  }

  Object.values(inputs).forEach(input => {
    input.addEventListener('input', calculateSIP);
  });

  initChart();
  calculateSIP();
}

/* ═══════════════════════════════════════════════════
   6. TESTIMONIALS SLIDER
═══════════════════════════════════════════════════ */
function initTestimonialsSlider() {
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoTimer;

  function getCardsPerView() {
    return window.innerWidth <= 640 ? 1 : window.innerWidth <= 960 ? 2 : 3;
  }

  let perView = getCardsPerView();
  const totalSlides = Math.ceil(cards.length / perView);

  function createDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(index) {
    perView = getCardsPerView();
    const maxIndex = Math.ceil(cards.length / perView) - 1;
    current = Math.max(0, Math.min(index, maxIndex));

    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * perView * cardWidth}px)`;

    dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });

    clearInterval(autoTimer);
    startAuto();
  }

  function next() { goTo(current + 1 >= totalSlides ? 0 : current + 1); }
  function prev() { goTo(current - 1 < 0 ? totalSlides - 1 : current - 1); }

  function startAuto() {
    autoTimer = setInterval(next, 5000);
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
  });

  createDots();
  startAuto();

  window.addEventListener('resize', () => {
    perView = getCardsPerView();
    goTo(0);
    createDots();
  });
}

/* ═══════════════════════════════════════════════════
   7. FAQ ACCORDION
═══════════════════════════════════════════════════ */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      items.forEach(i => i.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });
}

/* ═══════════════════════════════════════════════════
   8. FORMS
═══════════════════════════════════════════════════ */
function initForms() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }
}

function handleContactSubmit(e) {
  e.preventDefault();

  const btn = e.target.querySelector('button[type="submit"]');
  const originalContent = btn.innerHTML;

  btn.innerHTML = '<span>Sending...</span>';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<span>✓ Message Sent!</span>';
    showToast('Thank you! We will contact you within 24 hours.');

    setTimeout(() => {
      btn.innerHTML = originalContent;
      btn.disabled = false;
      e.target.reset();
    }, 3000);
  }, 1500);
}

function handleNewsletterSubmit(e) {
  e.preventDefault();

  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '✓ Subscribed!';
  btn.disabled = true;
  showToast('Welcome! You\'ve been subscribed to our newsletter.');

  setTimeout(() => {
    btn.textContent = 'Subscribe';
    btn.disabled = false;
    e.target.reset();
  }, 3000);
}

/* ═══════════════════════════════════════════════════
   9. BACK TO TOP
═══════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════════════════
   10. SMOOTH SCROLL + ACTIVE NAV
═══════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
      const offset = target.getBoundingClientRect().top + window.scrollY - navH - 20;

      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });
}

function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActive() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
}

/* ═══════════════════════════════════════════════════
   11. TOAST NOTIFICATION
═══════════════════════════════════════════════════ */
function showToast(message, duration = 4000) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* ═══════════════════════════════════════════════════
   12. CHART BAR ANIMATION — stagger
═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const bars = document.querySelectorAll('.chart-bar');
  bars.forEach((bar, i) => {
    bar.style.setProperty('--i', i);
  });
});

/* ═══════════════════════════════════════════════════
   13. PERFORMANCE — Lazy iframes
═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const mapContainer = document.querySelector('.map-container');
  if (mapContainer) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const iframe = entry.target.querySelector('iframe');
          if (iframe && iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(mapContainer);
  }
});
