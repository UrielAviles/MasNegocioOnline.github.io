// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');
const navOverlay = document.querySelector('.nav-overlay');

function closeMenu() {
  navLinks.classList.remove('open');
  navOverlay.classList.remove('active');
}

mobileToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navOverlay.classList.toggle('active');
});
navOverlay.addEventListener('click', closeMenu);
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// ===== SCROLL ANIMATIONS =====
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
fadeEls.forEach(el => observer.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// ===== PARTICLES =====
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 60; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== FORM HANDLING =====
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const original = btn.textContent;
    btn.textContent = 'Enviando...';
    
    const formData = new FormData(form);
    
    fetch('https://formsubmit.co/ajax/contacto@masnegocioonline.com', {
        method: "POST",
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        btn.textContent = '¡Mensaje Enviado! ✓';
        btn.style.background = '#25d366';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          form.reset();
        }, 3000);
    })
    .catch(error => {
        console.error(error);
        btn.textContent = 'Error al enviar';
        btn.style.background = '#e74c3c';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
        }, 3000);
    });
  });
}

// ===== THEME TOGGLE =====
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Check saved preference or default to dark (no class)
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
  document.body.classList.add('light-mode');
  if (themeIcon) themeIcon.textContent = '🌙';
} else {
  if (themeIcon) themeIcon.textContent = '☀️';
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    if (document.body.classList.contains('light-mode')) {
      localStorage.setItem('theme', 'light');
      themeIcon.textContent = '🌙';
    } else {
      localStorage.setItem('theme', 'dark');
      themeIcon.textContent = '☀️';
    }
  });
}

// ===== SERVICE MODALS =====
const serviceData = {
  web: {
    title: "Creación de Sitios Web",
    icon: "🌐",
    content: `
      <p>Diseñamos y desarrollamos plataformas web enfocadas en la conversión y experiencia de usuario. Entendemos que tu sitio web es la carta de presentación de tu negocio.</p>
      <ul>
        <li>Diseño UX/UI Premium y personalizado.</li>
        <li>Optimización SEO técnica para motores de búsqueda.</li>
        <li>Integración con pasarelas de pago y CRMs.</li>
        <li>Rendimiento y velocidad de carga ultrarrápida.</li>
      </ul>
    `
  },
  publicidad: {
    title: "Grabación de Publicidad",
    icon: "🎬",
    content: `
      <p>Creamos contenido audiovisual que capta la atención y transmite el valor de tu marca. Desde la idea original hasta el rodaje.</p>
      <ul>
        <li>Producción en formato cine (4K/6K).</li>
        <li>Dirección de arte y guion adaptado a tu audiencia.</li>
        <li>Equipo de iluminación y sonido profesional.</li>
        <li>Optimizado para redes sociales, TV y plataformas web.</li>
      </ul>
    `
  },
  edicion_video: {
    title: "Edición de Video",
    icon: "✂️",
    content: `
      <p>Transformamos material en bruto en piezas maestras que conectan emocionalmente con tu público y aumentan el engagement.</p>
      <ul>
        <li>Corrección de color y etalonaje profesional.</li>
        <li>Integración de Motion Graphics y efectos visuales.</li>
        <li>Diseño sonoro y mezcla de audio.</li>
        <li>Adaptación multiformato (Reels, TikTok, YouTube, TV).</li>
      </ul>
    `
  },
  edicion_imagen: {
    title: "Edición de Imágenes",
    icon: "🎨",
    content: `
      <p>Llevamos tu identidad visual al siguiente nivel con diseño gráfico y retoque fotográfico de alta gama.</p>
      <ul>
        <li>Retoque fotográfico avanzado (Beauty, producto, editorial).</li>
        <li>Diseño de branding e identidad corporativa.</li>
        <li>Creación de creatividades para campañas publicitarias (Ads).</li>
        <li>Manipulación digital e ilustraciones a medida.</li>
      </ul>
    `
  },
  backend: {
    title: "Desarrollo de Software Backend",
    icon: "⚙️",
    content: `
      <p>Construimos la inteligencia y la infraestructura detrás de tu aplicación con arquitecturas escalables y seguras.</p>
      <ul>
        <li>Desarrollo de APIs RESTful y GraphQL.</li>
        <li>Arquitectura de microservicios y despliegue Cloud (AWS, Azure, GCP).</li>
        <li>Gestión y optimización de Bases de Datos (SQL y NoSQL).</li>
        <li>Sistemas de alta disponibilidad y seguridad informática.</li>
      </ul>
    `
  },
  llamadas: {
    title: "Sistema de Llamadas Automatizadas",
    icon: "📞",
    content: `
      <p>Revoluciona tu atención al cliente con agentes virtuales impulsados por IA, capaces de mantener conversaciones fluidas por teléfono.</p>
      <ul>
        <li>Agentes de voz con IA natural y reconocimiento de intenciones.</li>
        <li>Atención 24/7 sin tiempos de espera.</li>
        <li>Agendamiento automático de citas en tu calendario.</li>
        <li>Clasificación de leads (Lead Scoring) en tiempo real.</li>
      </ul>
    `
  },
  whatsapp: {
    title: "Sistema de WhatsApp Automatizado",
    icon: "💬",
    content: `
      <p>Convierte WhatsApp en tu mejor canal de ventas y soporte con chatbots inteligentes que guían al usuario hacia la conversión.</p>
      <ul>
        <li>Flujos conversacionales dinámicos y personalizados.</li>
        <li>Integración con tu catálogo de productos y CRM.</li>
        <li>Recuperación de carritos abandonados automáticamente.</li>
        <li>Soporte y preguntas frecuentes gestionadas por IA.</li>
      </ul>
    `
  }
};

const serviceModal = document.getElementById('service-modal');
const modalClose = document.getElementById('modal-close');
const modalBody = document.getElementById('modal-body');
const modalCta = document.getElementById('modal-cta');
const openModalBtns = document.querySelectorAll('.js-open-modal');

if (serviceModal && openModalBtns.length > 0) {
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceId = btn.getAttribute('data-service');
      const data = serviceData[serviceId];
      
      if (data) {
        let contentHtml = '';
        if (serviceId === 'edicion_video') {
          contentHtml = `
            <div class="modal-split-layout">
              <div class="modal-video-wrapper">
                <video controls>
                  <source src="assets/images/Edificios.mp4" type="video/mp4">
                  Tu navegador no soporta la reproducción de videos.
                </video>
              </div>
              <div style="align-self: start;">
                <div class="service-modal-icon">${data.icon}</div>
                <h3>${data.title}</h3>
                ${data.content}
              </div>
            </div>
          `;
        } else {
          contentHtml = `
            <div class="service-modal-icon">${data.icon}</div>
            <h3>${data.title}</h3>
            ${data.content}
          `;
        }
        
        modalBody.innerHTML = contentHtml;
        
        // Auto-select the service in the contact form when clicking the modal CTA
        modalCta.addEventListener('click', () => {
          serviceModal.classList.remove('active');
          document.body.style.overflow = '';
          const selectElement = document.getElementById('service');
          if (selectElement) {
            selectElement.value = data.title;
          }
        }, { once: true });
        
        serviceModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    });
  });

  const closeModal = () => {
    serviceModal.classList.remove('active');
    document.body.style.overflow = '';
    
    const video = serviceModal.querySelector('video');
    if (video) {
      video.pause();
    }
  };

  modalClose.addEventListener('click', closeModal);
  serviceModal.addEventListener('click', (e) => {
    if (e.target === serviceModal) {
      closeModal();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceModal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ===== PORTFOLIO CAROUSEL =====
const carouselTrack = document.getElementById('carousel-track');
if (carouselTrack) {
  const slides = Array.from(carouselTrack.children);
  const nextBtn = document.getElementById('carousel-next');
  const prevBtn = document.getElementById('carousel-prev');
  const dotsContainer = document.getElementById('carousel-dots');
  
  let currentSlide = 0;

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
  
  const dots = Array.from(dotsContainer.children);

  const loadEmbed = (slide) => {
    const template = slide.querySelector('.lazy-embed');
    const container = slide.querySelector('.embed-container');
    if (template && container && !container.hasChildNodes()) {
      container.appendChild(template.content.cloneNode(true));
      
      // Re-trigger embeds parsing for TikTok and Instagram if they exist
      if (window.instgrm) { 
        window.instgrm.Embeds.process(); 
      }
      // TikTok doesn't have a reliable global process function, 
      // but usually the script handles dynamically added blockquotes if inserted properly,
      // or we can load the script manually if needed.
    }
  };

  const updateCarousel = () => {
    slides.forEach((slide, index) => {
      slide.classList.remove('current-slide');
      dots[index].classList.remove('active');
    });
    
    slides[currentSlide].classList.add('current-slide');
    dots[currentSlide].classList.add('active');
    
    // Calculate translation to center the current slide
    const slideCenter = slides[currentSlide].offsetLeft + (slides[currentSlide].offsetWidth / 2);
    const containerCenter = carouselTrack.parentElement.offsetWidth / 2;
    const translateValue = containerCenter - slideCenter;
    
    carouselTrack.style.transform = `translateX(${translateValue}px)`;
    
    // Lazy load current and adjacent slides
    loadEmbed(slides[currentSlide]);
    if (currentSlide > 0) loadEmbed(slides[currentSlide - 1]);
    if (currentSlide < slides.length - 1) loadEmbed(slides[currentSlide + 1]);
  };

  const goToSlide = (index) => {
    currentSlide = index;
    updateCarousel();
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentSlide < slides.length - 1) {
        currentSlide++;
      } else {
        currentSlide = 0; // Loop al inicio
      }
      updateCarousel();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentSlide > 0) {
        currentSlide--;
      } else {
        currentSlide = slides.length - 1; // Loop al final
      }
      updateCarousel();
    });
  }

  // Click on side slides to navigate to them
  slides.forEach((slide, index) => {
    slide.addEventListener('click', () => {
      if (index !== currentSlide) {
        goToSlide(index);
      }
    });
  });

  window.addEventListener('resize', () => {
    setTimeout(updateCarousel, 100);
  });

  // Initial layout calculation
  setTimeout(updateCarousel, 250);
}
