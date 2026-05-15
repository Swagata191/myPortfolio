/* ── Custom cursor ── */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

document.addEventListener('mousemove', e => {
  cursor.style.left    = e.clientX + 'px';
  cursor.style.top     = e.clientY + 'px';
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top  = e.clientY + 'px';
});

/* ── Navbar scroll shrink + active link ── */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  // Highlight active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

/* ── Mobile nav toggle ── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll('.reveal');
const observer  = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

/* ── Animated counters ── */
function animateCounter(el) {
  const target  = parseFloat(el.dataset.target);
  const decimal = parseInt(el.dataset.decimal) || 0;
  const duration = 1600;
  const step     = 16;
  const steps    = duration / step;
  let current    = 0;
  const inc      = target / steps;

  const timer = setInterval(() => {
    current += inc;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = decimal > 0 ? current.toFixed(decimal) : Math.floor(current);
  }, step);
}

const statEls = document.querySelectorAll('.stat-n');
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statEls.forEach(el => statObserver.observe(el));

const barEls = document.querySelectorAll('.edu-bar');
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

barEls.forEach(el => {
  el.style.animationPlayState = 'paused'; // pause until visible
  barObserver.observe(el);
});

/* ── Skill tabs ── */
const tabs   = document.querySelectorAll('.skill-tab');
const panels = document.querySelectorAll('.skill-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

/* ── Skill Carousel ── */
(function () {
  const cards = Array.from(document.querySelectorAll('.skill-card'));
  const dots  = Array.from(document.querySelectorAll('.dot'));
  const total = cards.length;
  let current = 0;

  const positions = ['left2', 'left1', 'center', 'right1', 'right2'];

  function getPos(cardIndex, activeIndex) {
    const diff = (cardIndex - activeIndex + total) % total;
    if (diff === 0)                      return 'center';
    if (diff === 1)                      return 'right1';
    if (diff === 2)                      return 'right2';
    if (diff === total - 1)              return 'left1';
    if (diff === total - 2)              return 'left2';
    return 'hidden';
  }

  function update() {
    cards.forEach((card, i) => {
      card.setAttribute('data-pos', getPos(i, current));
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  document.getElementById('skillNext').addEventListener('click', () => {
    current = (current + 1) % total;
    update();
  });
  document.getElementById('skillPrev').addEventListener('click', () => {
    current = (current - 1 + total) % total;
    update();
  });
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      current = parseInt(dot.dataset.dot);
      update();
    });
  });
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const pos = card.getAttribute('data-pos');
      if (pos === 'right1' || pos === 'right2') {
        current = (current + 1) % total; update();
      } else if (pos === 'left1' || pos === 'left2') {
        current = (current - 1 + total) % total; update();
      }
    });
  });

  update();
})();

/* ── Experience Lightbox ── */
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  const closeBtn = document.getElementById('lightboxClose');
  const nextBtn = document.getElementById('lightboxNext');
  const prevBtn = document.getElementById('lightboxPrev');

  let currentImages = [];
  let currentIndex = 0;

  // Function to update the lightbox view
  const updateLightbox = () => {
    const imageData = currentImages[currentIndex];
    lightboxImg.src = imageData.src;
    counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
  };

  // Open Lightbox when clicking a pocket
  document.querySelectorAll('.folder').forEach(folder => {
    const imagesInFolder = Array.from(folder.querySelectorAll('.cert-img')).map(img => ({
      src: img.src
    }));

    folder.querySelectorAll('.pocket').forEach((pocket, index) => {
      pocket.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImages = imagesInFolder;
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
      });
    });
  });

  // Navigation Logic
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateLightbox();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateLightbox();
  });

  // Close Logic
  closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === document.querySelector('.lightbox-inner')) {
      lightbox.classList.remove('active');
    }
  });

  // Keyboard support (Escape and Arrows)
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') lightbox.classList.remove('active');
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
  });
});

const strip = document.querySelector('.poster-strip');
const track = document.querySelector('.poster-track');

strip.addEventListener('mouseenter', () => {
  track.style.animationPlayState = 'paused';
});
strip.addEventListener('mouseleave', () => {
  track.style.animationPlayState = 'running';
});


/* ── Contact form ── */
function handleSubmit(e) {
  e.preventDefault();
  const note = document.getElementById('form-note');
  const btn  = e.target.querySelector('.submit-btn');
  const name = document.getElementById('name').value.trim();

  btn.disabled     = true;
  btn.textContent  = 'Sending…';
  note.className   = 'form-note';
  note.textContent = '';

  // Simulate send (replace with real API/EmailJS call)
  // setTimeout(() => {
  //   note.textContent = `Thanks ${name}! Your message has been sent. Swagata will get back to you soon.`;
  //   note.className   = 'form-note success';
  //   btn.textContent  = 'Message sent ✓';
  //   e.target.reset();
  //   setTimeout(() => {
  //     btn.disabled    = false;
  //     btn.textContent = 'Send message →';
  //   }, 4000);
  // }, 1200);
  // In script.js, replace the setTimeout block with:
  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
    from_name: document.getElementById('name').value.trim(),
    from_email: document.getElementById('email').value.trim(),
    subject: document.getElementById('subject').value.trim(),
    message: document.getElementById('message').value.trim(),
  }).then(() => {
    note.textContent = `Thanks ${name}! Your message has been sent.`;
    note.className = 'form-note success';
    btn.textContent = 'Message sent ✓';
    e.target.reset();
  }).catch(() => {
    note.textContent = 'Something went wrong. Please email me directly.';
    note.className = 'form-note error';
    btn.disabled = false;
    btn.textContent = 'Send message →';
  });
}

/* ── Smooth scroll for all anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Subtle parallax on hero bg text ── */
const heroBg = document.querySelector('.hero-bg-text');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translate(-50%, calc(-50% + ${y * 0.15}px))`;
  }, { passive: true });
}
