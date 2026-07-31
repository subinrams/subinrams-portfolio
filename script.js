/* ============================================================
   SUBINRAM S — PORTFOLIO SCRIPT
   Handles: nav scroll state, mobile menu, active-link highlighting,
   scroll-reveal animations, typed-role effect, back-to-top,
   scroll progress bar, and contact form validation.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar scrolled state + scroll progress ---------- */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Navbar background once scrolled past hero
    navbar.classList.toggle('scrolled', scrollY > 40);

    // Scroll progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';

    // Back to top button visibility
    backToTop.classList.toggle('visible', scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile nav toggle ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  const closeMenu = () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close mobile menu after clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Active nav link highlighting on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));

  /* ---------- Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Typed role effect in hero ---------- */
  const typedEl = document.getElementById('typedRole');
  const roles = [
    'Java Full Stack Developer',
    'Software Developer',
    'Web Developer',
    'Problem Solver'
  ];

  if (typedEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let roleIndex = 0;   // which role string we're on
    let charIndex = roles[0].length; // starts fully typed (matches HTML fallback text)
    let deleting = false;

    const tick = () => {
      const current = roles[roleIndex];

      if (deleting) {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);

        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      } else {
        charIndex++;
        const nextRole = roles[roleIndex];
        typedEl.textContent = nextRole.slice(0, charIndex);

        if (charIndex === nextRole.length) {
          deleting = true;
          setTimeout(tick, 1800); // pause on a fully-typed word
          return;
        }
      }

      setTimeout(tick, deleting ? 45 : 85);
    };

    // Pause on the initial (already-typed) role before the loop starts
    setTimeout(() => {
      deleting = true;
      tick();
    }, 2200);
  }

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  const validators = {
    name: (v) => v.trim().length >= 2 ? '' : 'Please enter your name (min. 2 characters).',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
    subject: (v) => v.trim().length >= 3 ? '' : 'Please enter a subject (min. 3 characters).',
    message: (v) => v.trim().length >= 10 ? '' : 'Please write a message of at least 10 characters.'
  };

  const validateField = (field) => {
    const input = document.getElementById(field);
    const errorEl = document.getElementById(`${field}Error`);
    const message = validators[field](input.value);

    input.classList.toggle('invalid', Boolean(message));
    errorEl.textContent = message;
    return !message;
  };

  if (form) {
    ['name', 'email', 'subject', 'message'].forEach(field => {
      const input = document.getElementById(field);
      input.addEventListener('blur', () => validateField(field));
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) validateField(field);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = ['name', 'email', 'subject', 'message'];
      const results = fields.map(validateField);
      const allValid = results.every(Boolean);

      if (!allValid) {
        formStatus.textContent = 'Please fix the errors above before sending.';
        formStatus.className = 'form-status error';
        return;
      }

      // No backend is connected — this simulates a successful hand-off.
      // Replace this block with a real fetch() call to your backend or
      // a service like Formspree / EmailJS / Netlify Forms.
      formStatus.textContent = 'Message ready to send! Connect a backend or form service to deliver it.';
      formStatus.className = 'form-status success';
      form.reset();
    });
  }

});
