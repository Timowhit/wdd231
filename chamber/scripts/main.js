/**
 * Gilbert Chamber of Commerce - Main JavaScript
 * Handles site-wide functionality including navigation and footer year
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCurrentYear();
});

/**
 * Initialize mobile navigation toggle
 */
function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navOverlay = document.querySelector('.nav-overlay');
  const body = document.body;

  if (!navToggle || !mainNav) return;

  // Toggle navigation on button click
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    mainNav.classList.toggle('active');
    body.classList.toggle('nav-open');
  });

  // Close navigation when overlay is clicked
  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('active');
      body.classList.remove('nav-open');
    });
  }

  // Close navigation when a nav link is clicked (mobile)
  const navLinks = mainNav.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
        body.classList.remove('nav-open');
      }
    });
  });

  // Close navigation on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
      navToggle.setAttribute('aria-expanded', 'false');
      mainNav.classList.remove('active');
      body.classList.remove('nav-open');
    }
  });
}

/**
 * Set current year in footer
 */
function initCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}