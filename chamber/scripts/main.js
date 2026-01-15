/**
 * Gilbert Chamber of Commerce
 * Main JavaScript - Shared functionality across all pages
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  updateCopyright();
  initSmoothScroll();
  initAnimations();
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!navToggle || !mainNav) return;
  
  // Toggle mobile menu
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.contains('active');
    toggleNav(!isOpen);
  });
  
  // Close menu when clicking overlay
  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      toggleNav(false);
    });
  }
  
  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleNav(false);
    });
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
      toggleNav(false);
    }
  });
  
  function toggleNav(open) {
    navToggle.classList.toggle('active', open);
    mainNav.classList.toggle('active', open);
    navOverlay?.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', open);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = open ? 'hidden' : '';
  }
}

/**
 * Update copyright year
 */
function updateCopyright() {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * Intersection Observer for scroll animations
 */
function initAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .card, .stat-item');
  
  if (!animatedElements.length) return;
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
  
  // Add CSS for animated state
  const style = document.createElement('style');
  style.textContent = `
    .animated {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Utility: Format phone number
 */
function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Utility: Validate email
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Utility: Store data in localStorage
 */
function storeData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn('localStorage not available');
    return false;
  }
}

/**
 * Utility: Get data from localStorage
 */
function getData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('localStorage not available');
    return null;
  }
}

/**
 * Track last visit (for "Visit X" counter on directory)
 */
function trackVisit() {
  const visits = getData('chamberVisits') || 0;
  storeData('chamberVisits', visits + 1);
  storeData('lastVisit', new Date().toISOString());
}

// Track visit on page load
trackVisit();

// Export utilities for use in other scripts
window.chamberUtils = {
  debounce,
  formatPhoneNumber,
  isValidEmail,
  storeData,
  getData
};
