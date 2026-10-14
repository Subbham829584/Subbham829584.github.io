/**
 * ULTRA-PREMIUM INTERACTIVE PORTFOLIO ENGINE
 * Particles, Custom Neon Cursor, 3D Tilt, Typing, Filter & Scroll Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. PARTICLES CANVAS ENGINE
  initParticleCanvas();

  // 2. CUSTOM NEON CURSOR
  initCustomCursor();

  // 3. TYPING EFFECT
  initTypingEffect();

  // 4. STAT COUNTERS
  initStatCounters();

  // 5. SCROLL REVEAL & NAVBAR SCROLL
  initScrollAnimations();

  // 6. SKILL FILTER & BARS ANIMATION
  initSkillsFilter();

  // 7. 3D TILT EFFECT ON CARDS
  init3DTilt();

  // 8. MOBILE MENU TOGGLE
  initMobileMenu();

  // 9. CONTACT FORM INTERACTION
  initContactForm();
});

/* ==========================================================
   1. PARTICLES CANVAS ENGINE
   ========================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.min(Math.floor((width * height) / 12000), 100);
  const particles = [];

  const colors = ['#00f2fe', '#4facfe', '#9d4edd', '#ff007f'];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2 + 1;
      this.baseRadius = this.radius;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.6 + 0.2;
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse collision repulsion / attraction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 3;
          this.y -= Math.sin(angle) * force * 3;
          this.radius = this.baseRadius * 1.8;
        } else {
          this.radius = this.baseRadius;
        }
      }

      this.draw();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const opacity = 1 - dist / 110;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${opacity * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================
   2. CUSTOM NEON CURSOR
   ========================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  if (!dot || !outline) return;

  let mouseX = -100;
  let mouseY = -100;
  let outlineX = -100;
  let outlineY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.18;
    outlineY += (mouseY - outlineY) * 0.18;
    outline.style.transform = `translate(${outlineX - 19}px, ${outlineY - 19}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover state on links & interactive elements
  const interactive = document.querySelectorAll(
    'a, button, input, textarea, .skill-card, .project-card, .highlight-item, .contact-link'
  );

  interactive.forEach((el) => {
    el.addEventListener('mouseenter', () => outline.classList.add('hovered'));
    el.addEventListener('mouseleave', () => outline.classList.remove('hovered'));
  });
}

/* ==========================================================
   3. TYPING EFFECT
   ========================================================== */
function initTypingEffect() {
  const target = document.getElementById('typed-text');
  if (!target) return;

  const words = [
    'Next-Gen Web Apps',
    'Sleek Flutter Apps',
    'Stunning 3D UIs',
    'Scalable Cloud APIs'
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIdx];

    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 50;
    } else {
      target.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIdx === currentWord.length) {
      typingSpeed = 1800; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      typingSpeed = 400; // Pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================
   4. STAT COUNTERS
   ========================================================== */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number');
  let started = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          counters.forEach((counter) => {
            const target = +counter.getAttribute('data-count');
            const duration = 1800;
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
              } else {
                counter.textContent = Math.floor(current);
              }
            }, stepTime);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  const heroStats = document.getElementById('hero-stats');
  if (heroStats) observer.observe(heroStats);
}

/* ==========================================================
   5. SCROLL REVEAL & NAVBAR SCROLL
   ========================================================== */
function initScrollAnimations() {
  const navbar = document.getElementById('navbar');
  const reveals = document.querySelectorAll('.reveal');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link highlight
    const sections = document.querySelectorAll('section');
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });

  // IntersectionObserver for elements reveal
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');

          // If it has skill bars, trigger their progress
          const bars = entry.target.querySelectorAll('.skill-bar');
          bars.forEach((bar) => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
          });
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach((el) => revealObserver.observe(el));
}

/* ==========================================================
   6. SKILL FILTER
   ========================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-cat-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-cat');

      skillCards.forEach((card) => {
        const cardCat = card.getAttribute('data-cat');
        if (cat === 'all' || cardCat === cat) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            const bar = card.querySelector('.skill-bar');
            if (bar) bar.style.width = bar.getAttribute('data-width') + '%';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================
   7. 3D TILT EFFECT
   ========================================================== */
function init3DTilt() {
  const tiltCards = document.querySelectorAll('.project-card, .about-card, .exp-card, .cert-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* ==========================================================
   8. MOBILE MENU TOGGLE
   ========================================================== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-btn');
  const overlay = document.getElementById('mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !overlay) return;

  hamburger.addEventListener('click', () => {
    overlay.classList.toggle('active');
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      overlay.classList.remove('active');
    });
  });
}

/* ==========================================================
   9. CONTACT FORM INTERACTION
   ========================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successBox = document.getElementById('form-success');
  if (!form || !successBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<span>Sending... 🚀</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      successBox.classList.add('active');

      setTimeout(() => {
        form.reset();
        form.style.display = 'flex';
        successBox.classList.remove('active');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 5000);
    }, 1200);
  });
}
