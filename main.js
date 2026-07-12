// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ---------- Navbar background on scroll ----------
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
  if (backToTop) backToTop.classList.toggle('show', window.scrollY > 500);
});

// ---------- Active link highlight ----------
const sections = document.querySelectorAll('section, header[id]');
const navAnchors = document.querySelectorAll('.nav-link');

if (sections.length > 0 && navAnchors.length > 0) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        // Find which page we are on
        const pageName = window.location.pathname.split('/').pop() || 'index.html';
        const activeLink = document.querySelector(`.nav-link[href="${pageName}#${entry.target.id}"]`) ||
                           document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(sec => navObserver.observe(sec));
}

// ---------- Reveal on scroll ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---------- Typewriter effect ----------
const phrases = ['B.Tech CSE Student', 'Aspiring Developer', 'Problem Solver'];
const typeEl = document.getElementById('typewriter');
let phraseIndex = 0, charIndex = 0, deleting = false;

function type() {
  if (!typeEl) return;
  const current = phrases[phraseIndex];
  if (!deleting) {
    typeEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1400);
      return;
    }
  } else {
    typeEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 45 : 90);
}
if (typeEl) type();

// ---------- Scroll Progress Bar ----------
const progressBar = document.getElementById('scrollProgress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (windowScroll / height) * 100;
    progressBar.style.width = `${scrolled}%`;
  });
}

// ---------- Custom Cursor (Lagging outer ring) ----------
const cursor = document.getElementById('customCursor');
const cursorRing = document.getElementById('customCursorRing');

let cursorX = 0, cursorY = 0; // Current position of mouse
let ringX = 0, ringY = 0;     // Position of outer ring (lagging)
let isCursorMoving = false;

if (cursor && cursorRing) {
  window.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    
    if (!isCursorMoving) {
      isCursorMoving = true;
      cursor.style.display = 'block';
      cursorRing.style.display = 'block';
      ringX = cursorX;
      ringY = cursorY;
    }
    
    // Instantly place inner cursor
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
  });

  // Lerp function for smooth lagging
  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  function animateCursor() {
    if (isCursorMoving) {
      // Outer ring lags behind the inner cursor
      ringX = lerp(ringX, cursorX, 0.15);
      ringY = lerp(ringY, cursorY, 0.15);

      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Custom Cursor hover reactions
  const interactables = document.querySelectorAll('a, button, input, textarea, select, .card, .btn, .nav-toggle');
  interactables.forEach(item => {
    item.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      cursorRing.classList.add('hovering');
    });
    item.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      cursorRing.classList.remove('hovering');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });
}

// ---------- 3D Tilt Effect + Cursor Glow on Cards ----------
const cards = document.querySelectorAll('.card, .btn');
cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const width = rect.width;
    const height = rect.height;
    
    // Calculate rotation angles (-12 to 12 degrees)
    const rotateX = ((y / height) - 0.5) * -12;
    const rotateY = ((x / width) - 0.5) * 12;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    
    // Set the dynamic glow properties
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  });
  
  card.style.transformStyle = 'preserve-3d';
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
});

// ---------- Constellation Canvas Background ----------
const canvas = document.getElementById('bgCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');

  let particlesArray = [];
  const maxParticles = 75;
  const connectionDistance = 110;

  let mouse = {
    x: null,
    y: null,
    radius: 150
  };

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1.5; // particle size 1.5 to 3.5px
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = (Math.random() - 0.5) * 0.6;
      // Randomly assign Ethereal Emerald, Gold, or Comic Pink colors
      const randColor = Math.random();
      this.color = randColor > 0.66 ? '#00ff9d' : (randColor > 0.33 ? '#ffe600' : '#ff007f');
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off boundaries
      if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
      if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

      // Mouse interactive attraction
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.hypot(dx, dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x += (dx / distance) * force * 0.6;
          this.y += (dy / distance) * force * 0.6;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 4;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < maxParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Disable shadow blur for connection line rendering to maintain performance
    ctx.shadowBlur = 0;

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();

      for (let j = i + 1; j < particlesArray.length; j++) {
        const dx = particlesArray[i].x - particlesArray[j].x;
        const dy = particlesArray[i].y - particlesArray[j].y;
        const distance = Math.hypot(dx, dy);

        if (distance < connectionDistance) {
          const opacity = (1 - (distance / connectionDistance)) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
          ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Draw connection lines to mouse (using dynamic pink trail lines)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particlesArray[i].x - mouse.x;
        const dy = particlesArray[i].y - mouse.y;
        const distance = Math.hypot(dx, dy);
        if (distance < mouse.radius) {
          const opacity = (1 - (distance / mouse.radius)) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255, 0, 127, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();
}

// ---------- Back to top ----------
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---------- Contact form (mailto handler) ----------
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:rangerwolf835@gmail.com?subject=${subject}&body=${body}`;

    if (formStatus) formStatus.textContent = 'Opening your email client...';
    form.reset();
  });
}

// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Animated Preloader (Progress bar simulation) ----------
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return; // Skip if preloader is not on this page

  const progressBar = document.getElementById('loaderProgressBar');
  const statusText = document.getElementById('loaderStatus');

  const statuses = [
    'CONNECTING TO SYSTEM...',
    'LOADING STYLESHEETS...',
    'GENERATING CANVAS PARTICLES...',
    'ROTATING COMIC PANELS...',
    'BOOTING GRAPHICS ENGINE...',
    'SYSTEM READY!'
  ];

  let progress = 0;
  let statusIndex = 0;

  const interval = setInterval(() => {
    // Increment progress randomly
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      if (progressBar) progressBar.style.width = '100%';
      if (statusText) statusText.textContent = statuses[statuses.length - 1];

      // Fade out preloader overlay
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 500);
    } else {
      if (progressBar) progressBar.style.width = `${progress}%`;
      
      // Rotate status text based on progress
      statusIndex = Math.floor((progress / 100) * (statuses.length - 1));
      if (statusText) statusText.textContent = `${statuses[statusIndex]} ${progress}%`;
    }
  }, 100);
});
