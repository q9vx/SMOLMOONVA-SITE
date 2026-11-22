/**
 * SmolMoonVA — script.js
 * Vanilla JS, no external dependencies.
 * Celestial Preloader, Canvas Stars & Meteors, Scroll Progress,
 * Interactive 3D Card Tilt, and Scroll Reveals.
 */

function initSmolMoon() {

  // Force animations active so the celestial experience and loading screen always play
  const reducedMotion = false;

  // ─── 1. Celestial Loading Screen (Preloader) ───────────────────────────────
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloader-bar');
  const preloaderPercent = document.getElementById('preloader-percent');
  const preloaderStatus = document.getElementById('preloader-status');

  let preloaderDismissed = false;

  const dismissPreloader = () => {
    if (!preloader || preloaderDismissed) return;
    preloaderDismissed = true;

    if (preloaderBar) preloaderBar.style.width = '100%';
    if (preloaderPercent) preloaderPercent.textContent = '100%';
    if (preloaderStatus) preloaderStatus.textContent = 'Welcome to SmolMoonVA ✨';

    // Brief hold at 100% so the visitor perceives smooth completion
    setTimeout(() => {
      preloader.classList.add('fade-out');
      document.body.classList.add('loaded');

      // Trigger Hero Section Reveals
      setTimeout(() => {
        document.querySelectorAll('.hero-reveal').forEach(el => el.classList.add('active'));
      }, 180);

      // Clean up after CSS transition ends
      setTimeout(() => {
        preloader.style.display = 'none';
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 900);
    }, 240);
  };

  if (preloader) {
    if (reducedMotion) {
      dismissPreloader();
    } else {
      // Guaranteed cinematic progression (~1.3s) ensuring the animation is visible
      const startTime = performance.now();
      const duration = 1350; // ms

      const step = (now) => {
        if (preloaderDismissed) return;
        const elapsed = now - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);
        
        // Easing curve for a realistic, smooth load feel
        const easeProgress = 1 - Math.pow(1 - rawProgress, 2.2);
        const currentPercent = Math.round(easeProgress * 100);

        if (preloaderBar) {
          preloaderBar.style.width = currentPercent + '%';
        }
        if (preloaderPercent) {
          preloaderPercent.textContent = currentPercent + '%';
        }

        // Atmospheric status messages
        if (preloaderStatus) {
          if (currentPercent < 35) {
            preloaderStatus.textContent = 'Tuning celestial frequencies...';
          } else if (currentPercent < 75) {
            preloaderStatus.textContent = 'Harmonizing vocal dimensions...';
          } else if (currentPercent < 100) {
            preloaderStatus.textContent = 'Unlocking the moonlit realm...';
          }
        }

        if (rawProgress < 1) {
          requestAnimationFrame(step);
        } else {
          dismissPreloader();
        }
      };

      requestAnimationFrame(step);
    }
  }

  // ─── AMBIENT CURSOR AURA ───────────────────────────────────────────────────
  const cursorAura = document.getElementById('cursor-aura');
  if (cursorAura && !reducedMotion && window.innerWidth > 860) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let auraX = mouseX;
    let auraY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    const animateAura = () => {
      auraX += (mouseX - auraX) * 0.08;
      auraY += (mouseY - auraY) * 0.08;
      cursorAura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0)`;
      requestAnimationFrame(animateAura);
    };
    requestAnimationFrame(animateAura);
  }

  // ─── 2. Scroll Reading Progress Bar ────────────────────────────────────────
  const scrollProgressBar = document.getElementById('scroll-progress');
  const updateScrollProgress = () => {
    if (!scrollProgressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressBar.style.width = percent + '%';
  };

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // ─── 3. Canvas Stars & Shooting Meteors ───────────────────────────────────
  const canvas = document.getElementById('stars-canvas');
  if (canvas && !reducedMotion) {
    const ctx = canvas.getContext('2d');
    const STAR_COUNT = 180;
    const stars = [];
    const meteors = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    const rand = (min, max) => Math.random() * (max - min) + min;

    const initStar = (star = {}) => {
      star.x = rand(0, canvas.width);
      star.y = rand(0, canvas.height);
      star.radius = rand(0.4, 2);
      star.opacity = rand(0.15, 1);
      star.speed = rand(0.08, 0.4);
      star.twinkleSpeed = rand(0.005, 0.02);
      star.twinkleDir = Math.random() > 0.5 ? 1 : -1;
      return star;
    };

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(initStar());
    }

    // Shooting star creator
    const spawnMeteor = () => {
      if (meteors.length >= 2) return; // max 2 concurrent
      meteors.push({
        x: rand(canvas.width * 0.1, canvas.width * 0.9),
        y: rand(0, canvas.height * 0.4),
        length: rand(80, 160),
        speed: rand(9, 15),
        angle: Math.PI / 4 + rand(-0.15, 0.15), // ~45 deg diagonal
        opacity: 1,
        fadeSpeed: rand(0.015, 0.025)
      });
    };

    // Periodically spawn meteors (every 3 to 6 seconds)
    let nextMeteorTime = performance.now() + rand(2000, 4500);

    const drawSky = (now) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw normal stars
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 214, 255, ${s.opacity})`;
        ctx.fill();

        // Twinkle
        s.opacity += s.twinkleSpeed * s.twinkleDir;
        if (s.opacity >= 1) { s.opacity = 1; s.twinkleDir = -1; }
        if (s.opacity <= 0.12) { s.opacity = 0.12; s.twinkleDir = 1; }

        // Drift upward
        s.y -= s.speed;
        if (s.y < 0) {
          s.y = canvas.height;
          s.x = rand(0, canvas.width);
        }
      });

      // Spawn meteors
      if (now > nextMeteorTime) {
        spawnMeteor();
        nextMeteorTime = now + rand(3500, 7000);
      }

      // Draw & update meteors
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, 'rgba(199, 166, 255, 0)');
        grad.addColorStop(0.7, `rgba(255, 159, 67, ${m.opacity * 0.5})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${m.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${m.opacity})`;
        ctx.fill();

        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.opacity -= m.fadeSpeed;

        if (m.opacity <= 0 || m.x > canvas.width || m.y > canvas.height) {
          meteors.splice(i, 1);
        }
      }

      requestAnimationFrame(drawSky);
    };

    requestAnimationFrame(drawSky);
  } else if (canvas && reducedMotion) {
    canvas.style.display = 'none';
  }

  // ─── 4. Sticky Navigation & Active Link Highlighting ───────────────────────
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav-links a[data-section]');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 80);
      const btn = document.querySelector('.back-to-top');
      if (btn) btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  }

  // Active section link highlighting
  if (navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    }, { threshold: 0.35 });

    document.querySelectorAll('section[id]').forEach(el => {
      sectionObserver.observe(el);
    });
  }

  // ─── 5. Mobile Drawer Navigation ──────────────────────────────────────────
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksUl = document.querySelector('.nav-links');

  const closeNav = () => {
    if (!navLinksUl) return;
    navLinksUl.classList.remove('open');
    document.body.classList.remove('nav-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  };

  if (navToggle && navLinksUl) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinksUl.classList.toggle('open');
      document.body.classList.toggle('nav-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click
    navLinksUl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (
      navLinksUl &&
      navLinksUl.classList.contains('open') &&
      nav &&
      !nav.contains(e.target)
    ) {
      closeNav();
    }
  });

  // ─── 6. Scroll Reveal Observer ────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (reducedMotion) {
    revealEls.forEach(el => el.classList.add('active'));
  } else if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ─── 7. Character Cards: 3D Tilt & Mouse Follow Glow ──────────────────────
  document.querySelectorAll('.char-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (reducedMotion) return;
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');

      // Subtle 3D perspective tilt
      const rotateX = ((y - 50) / 50) * -5;
      const rotateY = ((x - 50) / 50) * 5;
      card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      if (reducedMotion) return;
      card.style.transform = '';
    });
  });

  // ─── 8. Service Rows Counter Animation ────────────────────────────────────
  const animateCounter = (el, target, duration = 600) => {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(progress * target);
      el.textContent = String(value).padStart(2, '0');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const serviceRows = document.querySelectorAll('.service-row');
  if (serviceRows.length && !reducedMotion) {
    const serviceObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const numEl = entry.target.querySelector('.service-num');
        if (!numEl) return;
        const target = parseInt(numEl.dataset.num || numEl.textContent, 10);
        if (!isNaN(target)) animateCounter(numEl, target);
        serviceObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    serviceRows.forEach(row => serviceObserver.observe(row));
  }

  // ─── 9. Back to Top Button ────────────────────────────────────────────────
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
    });
  }

  // ─── 10. Waveform Controller ──────────────────────────────────────────────
  if (reducedMotion) {
    document.querySelectorAll('.waveform-bars span').forEach(s => {
      s.style.animationPlayState = 'paused';
    });
  }

  // ─── 11. Netlify Contact Form Loading State ───────────────────────────────
  const contactForm = document.querySelector('form[name="contact"]') ||
                      document.querySelector('.contact-form');
  if (contactForm) {
    const submitBtn = contactForm.querySelector('[type="submit"]');
    contactForm.addEventListener('submit', () => {
      contactForm.classList.add('submitting');
      if (submitBtn) {
        submitBtn.textContent = 'Sending\u2026';
        submitBtn.disabled = true;
      }
    });
  }

} // end initSmolMoon

// Ensure initialization executes reliably whether loaded before or after DOM readiness
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSmolMoon);
} else {
  initSmolMoon();
}
