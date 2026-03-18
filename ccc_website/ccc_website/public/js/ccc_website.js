/* ================================================================
   CCC FACILITY GROUP — INTERACTIVE JAVASCRIPT
   Loaded on every public page via hooks.py
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroSlider();
  initScrollAnimations();
  initCounters();
  initBackToTop();
  initMobileMenu();
  initAccordions();
  initContactForm();
});

/* ─── NAVBAR SCROLL EFFECT ──────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function handleScroll() {
    if (window.scrollY > 80) {
      navbar.classList.remove('transparent');
      navbar.classList.add('scrolled');
    } else {
      if (document.querySelector('.hero')) {
        navbar.classList.add('transparent');
        navbar.classList.remove('scrolled');
      }
    }
  }

  if (document.querySelector('.hero')) {
    navbar.classList.add('transparent');
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ─── HERO SLIDER ────────────────────────────────────────────────── */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (slides.length === 0) return;

  let current = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startTimer() { timer = setInterval(() => goTo(current + 1), 5000); }
  function stopTimer()  { clearInterval(timer); }

  dots.forEach(dot => dot.addEventListener('click', () => {
    stopTimer(); goTo(parseInt(dot.dataset.slide)); startTimer();
  }));

  document.getElementById('heroPrev')?.addEventListener('click', () => {
    stopTimer(); goTo(current - 1); startTimer();
  });
  document.getElementById('heroNext')?.addEventListener('click', () => {
    stopTimer(); goTo(current + 1); startTimer();
  });

  startTimer();
}

/* ─── SCROLL ANIMATIONS (IntersectionObserver) ──────────────────── */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ─── COUNTER ANIMATION ──────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  let counted = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        counters.forEach(counter => {
          const target = parseInt(counter.dataset.target);
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;

          function tick() {
            current += step;
            if (current < target) {
              counter.textContent = Math.floor(current) + '+';
              requestAnimationFrame(tick);
            } else {
              counter.textContent = target + '+';
            }
          }
          tick();
        });
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) observer.observe(statsSection);
}

/* ─── BACK TO TOP ────────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ─── MOBILE MENU ────────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('click', e => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
  });
}

/* ─── SMOOTH SCROLL ──────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── ACCORDION ──────────────────────────────────────────────────── */
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;

      // In modern-accordion style: toggle only this one
      const isModern = item.closest('.modern-accordion');
      if (isModern) {
        // Close others in the same accordion
        isModern.querySelectorAll('.accordion-item.active').forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
      }

      item.classList.toggle('active');
    });
  });
}

/* ─── CONTACT FORM → ERPNext Lead ─────────────────────────────────
   Uses frappe.call() — works natively because the site IS Frappe.
   Falls back to a simple alert in non-Frappe environments.
   ─────────────────────────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('erpnext-contact-form');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const statusMsg  = document.getElementById('form-status');
    const submitBtn  = form.querySelector('[type="submit"]');
    const origHtml   = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Wird gesendet…</span><i class="fas fa-spinner fa-spin"></i>';
    if (statusMsg) { statusMsg.style.display = 'none'; statusMsg.className = 'form-status-msg'; }

    const formData = {
      full_name: form.name?.value || form['form-name']?.value || '',
      email:     form.email?.value || form['form-email']?.value || '',
      service:   form.service?.value || form['form-service']?.value || 'Sonstiges',
      message:   form.message?.value || form['form-message']?.value || '',
    };

    try {
      if (typeof frappe !== 'undefined' && frappe.call) {
        // Native Frappe call — no CORS, fully authenticated
        const result = await frappe.call({
          method: 'ccc_website.api.submit_contact_form',
          args: formData,
        });
        if (result.message && result.message.status === 'ok') {
          showStatus(statusMsg, 'success', 'Vielen Dank! Ihre Nachricht wurde erfolgreich an unser Team gesendet.');
          form.reset();
        } else {
          throw new Error('Unbekannter Fehler');
        }
      } else {
        // Fallback for static preview
        await new Promise(r => setTimeout(r, 1000));
        showStatus(statusMsg, 'success', 'Nachricht gesendet! (Demo-Modus)');
        form.reset();
      }
    } catch (err) {
      console.error('Contact form error:', err);
      showStatus(statusMsg, 'error', 'Es gab ein Problem beim Senden. Bitte versuchen Sie es später erneut.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origHtml;
    }
  });
}

function showStatus(el, type, msg) {
  if (!el) return;
  el.textContent = msg;
  el.className = `form-status-msg ${type}`;
}
