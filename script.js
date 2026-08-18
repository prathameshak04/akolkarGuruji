document.addEventListener('DOMContentLoaded', () => {
  // Constants
  const PHONE_NUMBER = '919422261154';
  const NAVBAR_HEIGHT = 70;

  // 1. MOBILE MENU
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

  // 2. STICKY NAVBAR & 11. BACK TO TOP
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    
    if (backToTop) {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
    
    updateActiveNavLink();
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 3. LANGUAGE TOGGLE
  const langToggleBtn = document.querySelector('.lang-toggle');
  const translatableElements = document.querySelectorAll('[data-en][data-mr]');
  
  let currentLang = localStorage.getItem('lang') || 'en';
  applyLanguage(currentLang);

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'mr' : 'en';
      localStorage.setItem('lang', currentLang);
      applyLanguage(currentLang);
    });
  }

  function applyLanguage(lang) {
    translatableElements.forEach(el => {
      el.textContent = el.getAttribute(`data-${lang}`);
    });
  }

  // 4. SCROLL ANIMATIONS (IntersectionObserver)
  const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right');
  
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => scrollObserver.observe(el));

  // 5. COUNTER ANIMATION
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => counterObserver.observe(num));

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const current = Math.min(Math.floor((progress / duration) * target), target);
      element.textContent = current + '+';
      
      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = target + '+';
      }
    }
    window.requestAnimationFrame(step);
  }

  // 6. POOJA DETAIL MODALS
  const poojaCards = document.querySelectorAll('.pooja-card[data-pooja]');
  const poojaModals = document.querySelectorAll('.pooja-modal');
  
  poojaCards.forEach(card => {
    card.addEventListener('click', () => {
      const poojaId = card.getAttribute('data-pooja');
      const modal = document.querySelector(`.pooja-modal[data-pooja-modal="${poojaId}"]`);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
      }
    });
  });

  poojaModals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
  });

  // 7. GALLERY LIGHTBOX
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          lightboxImg.src = img.src; // Assuming full-size src is same or set properly
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 300);
      document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Handle ESC key for Modals and Lightbox
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      poojaModals.forEach(m => {
        if (m.classList.contains('active')) {
          m.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
      if (lightbox && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // 8. TESTIMONIAL AUTO-SCROLL
  const testimonialTrack = document.querySelector('.testimonial-track');
  if (testimonialTrack) {
    let scrollInterval;
    const speed = 1; // pixels per step
    const intervalTime = 20;

    const startScroll = () => {
      scrollInterval = setInterval(() => {
        testimonialTrack.scrollLeft += speed;
        // Reset if reached the end
        if (testimonialTrack.scrollLeft + testimonialTrack.clientWidth >= testimonialTrack.scrollWidth - 1) {
          testimonialTrack.scrollLeft = 0;
        }
      }, intervalTime);
    };

    const stopScroll = () => {
      clearInterval(scrollInterval);
    };

    startScroll();
    testimonialTrack.addEventListener('mouseenter', stopScroll);
    testimonialTrack.addEventListener('mouseleave', startScroll);
    // For touch devices
    testimonialTrack.addEventListener('touchstart', stopScroll);
    testimonialTrack.addEventListener('touchend', startScroll);
  }

  // 9. BOOKING FORM
  const bookingForm = document.getElementById('booking-form');
  
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Clear previous errors
      bookingForm.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('form-error');
      });

      let isValid = true;
      
      const nameInput = bookingForm.querySelector('input[name="name"]');
      const phoneInput = bookingForm.querySelector('input[name="phone"]');
      const poojaSelect = bookingForm.querySelector('select[name="pooja"]');
      const dateInput = bookingForm.querySelector('input[name="date"]');
      const countInput = bookingForm.querySelector('input[name="count"]');
      const messageInput = bookingForm.querySelector('textarea[name="message"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const pooja = poojaSelect ? poojaSelect.value : '';
      const date = dateInput ? dateInput.value : '';
      const count = countInput ? countInput.value : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || name.length < 2) {
        isValid = false;
        if (nameInput) nameInput.closest('.form-group').classList.add('form-error');
      }

      // Basic phone validation (10 digits)
      const phoneRegex = /^\d{10}$/;
      if (!phone || !phoneRegex.test(phone.replace(/\D/g, ''))) {
        isValid = false;
        if (phoneInput) phoneInput.closest('.form-group').classList.add('form-error');
      }

      if (!pooja) {
        isValid = false;
        if (poojaSelect) poojaSelect.closest('.form-group').classList.add('form-error');
      }

      if (isValid) {
        const waMessage = `🙏 नमस्कार गुरुजी,
     
I would like to book a pooja:

📿 Pooja: ${pooja}
👤 Name: ${name}
📞 Phone: ${phone}
📅 Preferred Date: ${date || 'Not specified'}
👥 Number of People: ${count || 'Not specified'}
📝 Special Requirements: ${message || 'None'}

कृपया माहिती द्यावी. 🙏`;

        const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(waMessage)}`;
        window.open(waUrl, '_blank');
        bookingForm.reset();
      }
    });
  }

  // 10. SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - NAVBAR_HEIGHT;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 12. FLOATING WHATSAPP & 13. FLOATING CALL
  const floatingWa = document.querySelector('.floating-whatsapp');
  const floatingCall = document.querySelector('.floating-call');

  if (floatingWa) {
    floatingWa.addEventListener('click', () => {
      const text = encodeURIComponent('🙏 नमस्कार गुरुजी, मला पूजेबद्दल माहिती हवी आहे.');
      window.open(`https://wa.me/${PHONE_NUMBER}?text=${text}`, '_blank');
    });
  }

  if (floatingCall) {
    floatingCall.addEventListener('click', () => {
      window.location.href = `tel:+${PHONE_NUMBER}`;
    });
  }

  // 14. ACTIVE NAV LINK
  const sections = document.querySelectorAll('section[id]');
  
  function updateActiveNavLink() {
    let currentId = '';
    const scrollPos = window.scrollY + NAVBAR_HEIGHT + 10; // offset

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (currentId && link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  // Initial call to set active link
  updateActiveNavLink();
});
