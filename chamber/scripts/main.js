/**
 * Gilbert Chamber of Commerce
 * Main JavaScript - All functionality in external file
 */

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  updateCopyright();
  initSpotlights();
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
  
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.contains('active');
    toggleNav(!isOpen);
  });
  
  if (navOverlay) {
    navOverlay.addEventListener('click', () => toggleNav(false));
  }
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleNav(false));
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
      toggleNav(false);
    }
  });
  
  function toggleNav(open) {
    navToggle.classList.toggle('active', open);
    mainNav.classList.toggle('active', open);
    if (navOverlay) navOverlay.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', open);
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
 * Business Spotlights Loader
 */
function initSpotlights() {
  const container = document.getElementById('spotlight-container');
  if (!container) return;

  const SPOTLIGHT_FALLBACK = [
    {
      id: 1,
      name: "Gilbert Family Dentistry",
      description: "Comprehensive dental care for the whole family, from routine cleanings to cosmetic procedures.",
      image: "images/business-dental.webp",
      website: "#"
    },
    {
      id: 3,
      name: "Agritopia Farm Stand",
      description: "Fresh, locally grown produce and artisan goods from Gilbert's premier urban farm community.",
      image: "images/business-farm.webp",
      website: "#"
    },
    {
      id: 4,
      name: "Heritage Tech Solutions",
      description: "IT consulting and managed services for small to medium businesses in the East Valley.",
      image: "images/business-tech.webp",
      website: "#"
    },
    {
      id: 8,
      name: "Cactus Creative Agency",
      description: "Full-service marketing and design agency helping Arizona businesses grow.",
      image: "images/business-creative.webp",
      website: "#"
    },
    {
      id: 14,
      name: "East Valley Pediatrics",
      description: "Compassionate pediatric care from newborns through adolescence.",
      image: "images/business-pediatrics.webp",
      website: "#"
    },
    {
      id: 15,
      name: "Arizona Solar Pros",
      description: "Residential and commercial solar installation with financing options.",
      image: "images/business-solar.webp",
      website: "#"
    },
    {
      id: 18,
      name: "Heritage District Realty",
      description: "Local experts in Gilbert residential and commercial real estate.",
      image: "images/business-realty.webp",
      website: "#"
    }
  ];

  loadSpotlights();

  async function loadSpotlights() {
    let goldMembers;

    try {
      const response = await fetch('data/members.json');
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();
      goldMembers = data.members.filter(m => m.membershipLevel === 'gold');
    } catch (error) {
      console.warn('Using fallback spotlight data:', error.message);
      goldMembers = SPOTLIGHT_FALLBACK;
    }

    const spotlights = shuffleArray(goldMembers).slice(0, 3);
    renderSpotlights(spotlights);
  }

  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function renderSpotlights(spotlights) {
    container.innerHTML = spotlights.map(member => {
      const article = document.createElement('article');
      article.className = 'card business-card';
      article.innerHTML = `
        <img src="${member.image}" alt="${member.name}" class="card-image" loading="lazy">
        <div class="card-content">
          <span class="membership-badge gold">Gold Member</span>
          <h3 class="card-title">${member.name}</h3>
          <p class="card-text">${member.description}</p>
          <a href="${member.website}" class="btn btn-outline">Visit Website</a>
        </div>
      `;
      return article.outerHTML;
    }).join('');
  }
}

/**
 * Utility: Debounce
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
 * Utility: Validate email
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Export utilities
window.chamberUtils = {
  debounce,
  isValidEmail
};