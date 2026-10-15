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

  // 9. ARCHIVE PROJECTS ACCORDION TOGGLE
  initArchiveProjectsToggle();

  // 10. INTERACTIVE PROJECT PREVIEW MODAL
  initProjectModal();

  // 11. CONTACT FORM INTERACTION WITH REAL EMAIL SUBMIT
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
    'Backend & Cloud Systems',
    'Production Flutter Apps',
    'Airflow ETL Pipelines',
    'Scalable Cloud Services'
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
   4. STAT COUNTERS (Resilient to 0 display)
   ========================================================== */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number');
  let started = false;

  function runCounterAnimation() {
    if (started) return;
    started = true;
    counters.forEach((counter) => {
      const target = +counter.getAttribute('data-count');
      const duration = 1600;
      const stepTime = 25;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target >= 1000 ? target.toLocaleString('en-US') : target;
          clearInterval(timer);
        } else {
          const val = Math.floor(current);
          counter.textContent = val >= 1000 ? val.toLocaleString('en-US') : val;
        }
      }, stepTime);
    });
  }

  const heroStats = document.getElementById('hero-stats');
  if (heroStats) {
    const rect = heroStats.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      runCounterAnimation();
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runCounterAnimation();
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(heroStats);
    }
  }
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
        }
      });
    },
    { threshold: 0.1 }
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
   9. ARCHIVE PROJECTS ACCORDION TOGGLE
   ========================================================== */
function initArchiveProjectsToggle() {
  const toggleBtn = document.getElementById('archive-toggle-btn');
  const container = document.getElementById('archive-projects');
  if (!toggleBtn || !container) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = container.classList.contains('active');
    if (isOpen) {
      container.classList.remove('active');
      toggleBtn.classList.remove('open');
      toggleBtn.querySelector('.archive-toggle-text').textContent = 'View Past & Academic Projects (PHP / MySQL)';
    } else {
      container.classList.add('active');
      toggleBtn.classList.add('open');
      toggleBtn.querySelector('.archive-toggle-text').textContent = 'Hide Past & Academic Projects';
    }
  });
}

/* ==========================================================
   10. INTERACTIVE PROJECT PREVIEW MODAL
   ========================================================== */
const projectModalData = {
  warehouse: {
    title: 'Warehouse Management System',
    badge: 'Production Flutter & Firebase Architecture',
    tags: ['Flutter 3', 'Dart', 'Firebase Firestore', 'Riverpod 2.0', 'Camera Barcode Scanner', 'Offline-First'],
    image: 'images/warehouse-real-screens.jpg',
    desc: 'Production-grade mobile inventory solution designed for multi-godown stock management. Features dynamic product groups, detailed item cataloging with unit pricing, location-based storage tracking across godown floors, instant search, and cloud Firestore synchronization with offline persistence.',
    features: [
      {
        icon: '📷',
        title: 'Barcode Camera Scanner & Search',
        desc: 'Instant camera recognition and live SKU search across categories and godown floors.'
      },
      {
        icon: '📦',
        title: 'Multi-Godown Stock Overview',
        desc: 'Live stock quantity counters, product groups (Toys, Electronics, Sports), and inventory valuation.'
      },
      {
        icon: '🔄',
        title: 'Cloud Firestore Sync Engine',
        desc: 'Idempotent document mutations with offline persistence cache & automated background conflict resolution.'
      },
      {
        icon: '🏷️',
        title: 'Product Catalog & Pricing',
        desc: 'Comprehensive product attributes including company brand, cost, quantity, and floor locations.'
      }
    ],
    github: 'https://github.com/Subbham829584/warehouse_management'
  },
  etl: {
    title: 'Enterprise ETL & Data Orchestration Pipeline',
    badge: 'Automated Data Engineering Framework',
    tags: ['Python 3.11', 'Apache Airflow', 'Docker Compose', 'FastAPI', 'Streamlit', 'Data Quality Engine'],
    image: 'images/proj-etl.jpg',
    desc: 'Automated enterprise data ingestion and orchestration platform processing 10,000+ multi-format records (CSV, Excel, JSON, PDF, DOCX) across Apache Airflow DAGs. Features a proprietary 5-dimension data quality engine, 8 containerized microservices, and Streamlit analytics dashboard.',
    features: [
      {
        icon: '🌪️',
        title: 'Airflow DAG Orchestration',
        desc: 'Multi-stage scheduled DAG execution with intelligent retry policies and decoupled stage dependencies.'
      },
      {
        icon: '🎯',
        title: '5-Dimension Quality Engine',
        desc: 'Automated data scoring covering Completeness, Validity, Consistency, Accuracy, and Uniqueness.'
      },
      {
        icon: '📊',
        title: 'Streamlit Real-Time Monitoring',
        desc: 'Interactive visual pipeline dashboard reducing manual operational oversight by ~40%.'
      },
      {
        icon: '🐳',
        title: '8-Service Container Architecture',
        desc: 'Containerized stack with FastAPI, Airflow, Celery, Redis, and PostgreSQL for 1-command deployment.'
      }
    ],
    github: 'https://github.com/Subbham829584/enterprise_etl'
  },
  taskflow: {
    title: 'TaskFlow Pro — Enterprise PM Backend',
    badge: 'Enterprise Spring Boot Architecture',
    tags: ['Java 21', 'Spring Boot 3.3', 'Spring Security', 'JWT Auth', 'PostgreSQL', 'Docker'],
    image: 'images/proj-taskflow.jpg',
    desc: 'High-concurrency project management and employee operations backend engineered with Java 21 and Spring Boot 3.3. Built with clean separation of concerns, stateless JWT authentication, and strict Role-Based Access Control (RBAC).',
    features: [
      {
        icon: '☕',
        title: 'Spring Boot 3.3 & Java 21',
        desc: 'Modular layered architecture with Controller, Service, and Repository patterns for high throughput.'
      },
      {
        icon: '🛡️',
        title: 'Stateless JWT & RBAC Security',
        desc: 'Granular role-based authorization securing employee and administrative workflows.'
      },
      {
        icon: '📑',
        title: 'OpenAPI Contracts & Swagger',
        desc: 'Strict DTO validation with interactive API documentation for client teams.'
      },
      {
        icon: '🐘',
        title: 'PostgreSQL Relational Storage',
        desc: 'Optimized relational schema modeling with JPA/Hibernate transactions and audit logging.'
      }
    ],
    github: 'https://github.com/Subbham829584/taskflow-pro-complete'
  },
  chatbot: {
    title: 'AI-Powered Smart Chatbot & Notifications',
    badge: 'OpenAI API & Async WebSocket System',
    tags: ['Python / Kotlin', 'OpenAI API', 'WebSockets', 'AsyncIO', 'Real-Time Streaming'],
    image: 'images/proj-chatbot.jpg',
    desc: 'Asynchronous intelligent chatbot engineered for low-latency conversations. Integrates OpenAI models with real-time WebSocket notifications, streaming response generation, and concurrent message queuing.',
    features: [
      {
        icon: '🤖',
        title: 'OpenAI Streaming Architecture',
        desc: 'Chunked asynchronous token streaming delivering immediate perceptual response.'
      },
      {
        icon: '⚡',
        title: '35% Latency Optimization',
        desc: 'Engineered non-blocking I/O event loops reducing conversation latency significantly.'
      },
      {
        icon: '🔔',
        title: 'Real-Time Notification Pipeline',
        desc: 'Persistent WebSocket connections handling concurrent user broadcasts and alerts.'
      },
      {
        icon: '🛡️',
        title: 'Robust Session & Token Management',
        desc: 'Context memory persistence with token budget limiting and structured error handling.'
      }
    ],
    github: 'https://github.com/Subbham829584/OpenAI-Chatbot'
  },
  leavems: {
    title: 'Leave Management System',
    badge: 'Role-Based Enterprise Portal',
    tags: ['PHP', 'MySQL', 'HTML/CSS', 'RBAC', 'Approval Workflows'],
    image: 'images/proj-leavems.jpg',
    desc: 'Role-based employee leave portal managing 100+ employee records. Features multi-level administrative approvals, leave quota calculations, historical auditing, and automated status notifications.',
    features: [
      {
        icon: '👥',
        title: 'Role-Based Access Control (RBAC)',
        desc: 'Strict authorization separation between Employees, Managers, and HR Administrators.'
      },
      {
        icon: '📝',
        title: 'Multi-Tier Approval Pipeline',
        desc: 'Automated request routing with manager review stages and instant status updates.'
      },
      {
        icon: '📊',
        title: 'Leave Balance & Quota Engine',
        desc: 'Dynamic quota tracking for sick, casual, and paid leaves with rollover calculations.'
      },
      {
        icon: '📋',
        title: 'Auditing & Reporting Module',
        desc: 'Exportable attendance and leave history logs for organizational HR compliance.'
      }
    ],
    github: 'https://github.com/Subbham829584/LeaveManagementSystem'
  },
  smartportal: {
    title: 'SmartPortal Enterprise Hub',
    badge: 'Modular Node.js & REST Architecture',
    tags: ['JavaScript', 'Node.js', 'Express', 'REST API', 'JWT Auth'],
    image: 'images/proj-smartportal.jpg',
    desc: 'Centralized enterprise portal providing structured management of users, records, and service workflows. Built with a modular Express backend, JWT session security, and clean API endpoints.',
    features: [
      {
        icon: '🌐',
        title: 'Modular REST API Endpoints',
        desc: 'Decoupled route controllers following standard RESTful design principles and validation.'
      },
      {
        icon: '🔐',
        title: 'JWT Authentication & Security',
        desc: 'Secure token issuance, password hashing with bcrypt, and middleware-level route guards.'
      },
      {
        icon: '📦',
        title: 'Centralized Administrative Hub',
        desc: 'Unified interface for monitoring operations, updating records, and service diagnostics.'
      },
      {
        icon: '⚡',
        title: 'Scalable Client-Server Structure',
        desc: 'Production-ready architecture easily extensible for microservice integration.'
      }
    ],
    github: 'https://github.com/Subbham829584/SmartPortal'
  }
};

function initProjectModal() {
  const backdrop = document.getElementById('project-modal');
  if (!backdrop) return;

  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeDemoModal);
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeDemoModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closeDemoModal();
    }
  });
}

window.openDemoModal = function (projectId) {
  const data = projectModalData[projectId];
  if (!data) return;

  const backdrop = document.getElementById('project-modal');
  const badgeEl = document.getElementById('modal-badge');
  const titleEl = document.getElementById('modal-title');
  const tagsEl = document.getElementById('modal-tags');
  const imgEl = document.getElementById('modal-img');
  const descEl = document.getElementById('modal-desc');
  const featuresEl = document.getElementById('modal-features');
  const githubLinkEl = document.getElementById('modal-github-link');

  if (badgeEl) badgeEl.textContent = data.badge;
  if (titleEl) titleEl.textContent = data.title;
  if (imgEl) {
    imgEl.src = data.image;
    imgEl.alt = data.title;
  }
  if (descEl) descEl.textContent = data.desc;

  if (tagsEl) {
    tagsEl.innerHTML = data.tags.map((t) => `<span class="modal-tag">${t}</span>`).join('');
  }

  if (featuresEl) {
    featuresEl.innerHTML = data.features
      .map(
        (f) => `
        <div class="modal-feature-card">
          <h4><span>${f.icon}</span> ${f.title}</h4>
          <p>${f.desc}</p>
        </div>
      `
      )
      .join('');
  }

  if (githubLinkEl) {
    githubLinkEl.href = data.github;
  }

  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeDemoModal = function () {
  const backdrop = document.getElementById('project-modal');
  if (backdrop) {
    backdrop.classList.remove('active');
  }
  document.body.style.overflow = '';
};

/* ==========================================================
   11. CONTACT FORM INTERACTION (With Real AJAX Email Delivery)
   ========================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successBox = document.getElementById('form-success');
  if (!form || !successBox) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : 'Portfolio Contact';
    const message = messageInput ? messageInput.value.trim() : '';

    submitBtn.innerHTML = '<span>Sending message... 🚀</span>';
    submitBtn.disabled = true;

    try {
      const response = await fetch('https://formsubmit.co/ajax/subham.builds.ai@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          subject: subject,
          message: message,
          _replyto: email,
          _subject: `[Portfolio Contact] ${subject} from ${name}`
        })
      });

      const result = await response.json();

      if (response.ok || result.success === 'true' || result.success === true) {
        form.style.display = 'none';
        successBox.classList.add('active');
        successBox.innerHTML = `
          <div class="success-icon">🎉</div>
          <h4>Message Delivered!</h4>
          <p>Thank you <strong>${name || 'there'}</strong>! Your message has been sent directly to <strong>subham.builds.ai@gmail.com</strong>. I'll get back to you shortly.</p>
        `;
      } else {
        throw new Error('Formsubmit endpoint error');
      }
    } catch (err) {
      console.warn('Direct AJAX send fallback triggered:', err);
      // Fallback: Show success with instant direct Gmail compose button
      form.style.display = 'none';
      successBox.classList.add('active');
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=subham.builds.ai@gmail.com&su=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(`Hi Subham,\n\n${message}\n\nFrom: ${name} (${email})`)}`;

      successBox.innerHTML = `
        <div class="success-icon">✉️</div>
        <h4>Almost Done!</h4>
        <p>If direct network submission was restricted by an ad-blocker, click below to send your pre-filled email directly via Gmail or Mail client:</p>
        <div style="margin-top: 18px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <a href="${gmailUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 10px 20px; font-size: 0.9rem;">
            <span>Open in Gmail ↗</span>
          </a>
          <a href="mailto:subham.builds.ai@gmail.com?subject=${encodeURIComponent(
            subject
          )}&body=${encodeURIComponent(message)}" class="btn-secondary" style="padding: 10px 20px; font-size: 0.9rem;">
            <span>Open Mail Client ↗</span>
          </a>
        </div>
      `;
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

