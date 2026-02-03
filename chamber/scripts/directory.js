/**
 * Gilbert Chamber of Commerce - Directory JavaScript
 * Handles business directory listing, search, filtering, and view toggle
 */

// State
let businesses = [];
let filteredBusinesses = [];
let currentView = 'grid';
let currentCategory = 'all';
let currentMembership = 'all';
let currentSort = 'name-asc';
let searchQuery = '';

// DOM Elements
const businessGrid = document.getElementById('business-grid');
const searchInput = document.getElementById('search-input');
const gridViewBtn = document.getElementById('grid-view-btn');
const listViewBtn = document.getElementById('list-view-btn');
const categoryFilters = document.getElementById('category-filters');
const membershipFilters = document.getElementById('membership-filters');
const sortSelect = document.getElementById('sort-select');
const resultsCount = document.getElementById('results-count');
const noResults = document.getElementById('no-results');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', async () => {
  await loadBusinesses();
  initCategoryFilters();
  initEventListeners();
  renderBusinesses();
});

/**
 * Load businesses from JSON data file
 */
async function loadBusinesses() {
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error('Failed to load businesses');
    businesses = await response.json();
    filteredBusinesses = [...businesses];
  } catch (error) {
    console.error('Error loading businesses:', error);
    // Use sample data if fetch fails
    businesses = getSampleBusinesses();
    filteredBusinesses = [...businesses];
  }
}

/**
 * Initialize category filter buttons based on data
 */
function initCategoryFilters() {
  if (!categoryFilters) return;

  // Get unique categories from businesses
  const categories = [...new Set(businesses.map(b => b.category))].sort();
  
  // Create filter buttons
  let html = '<button class="filter-btn active" data-filter="all">All</button>';
  categories.forEach(category => {
    html += `<button class="filter-btn" data-filter="${category.toLowerCase()}">${category}</button>`;
  });
  
  categoryFilters.innerHTML = html;

  // Add click listeners to category buttons
  categoryFilters.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      categoryFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      applyFilters();
    });
  });
}

/**
 * Initialize all event listeners
 */
function initEventListeners() {
  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  // View toggle
  if (gridViewBtn) {
    gridViewBtn.addEventListener('click', () => {
      currentView = 'grid';
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
      businessGrid.classList.remove('list-view');
    });
  }

  if (listViewBtn) {
    listViewBtn.addEventListener('click', () => {
      currentView = 'list';
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
      businessGrid.classList.add('list-view');
    });
  }

  // Membership filters
  if (membershipFilters) {
    membershipFilters.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        membershipFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMembership = btn.getAttribute('data-filter');
        applyFilters();
      });
    });
  }

  // Sort select
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFilters();
    });
  }
}

/**
 * Apply all filters and sorting to businesses
 */
function applyFilters() {
  filteredBusinesses = businesses.filter(business => {
    // Category filter
    if (currentCategory !== 'all' && business.category.toLowerCase() !== currentCategory) {
      return false;
    }

    // Membership filter
    if (currentMembership !== 'all' && business.membership.toLowerCase() !== currentMembership) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const searchFields = [
        business.name,
        business.description,
        business.category,
        business.address
      ].join(' ').toLowerCase();
      
      if (!searchFields.includes(searchQuery)) {
        return false;
      }
    }

    return true;
  });

  // Apply sorting
  sortBusinesses();
  
  // Render the filtered results
  renderBusinesses();
}

/**
 * Sort businesses based on current sort option
 */
function sortBusinesses() {
  switch (currentSort) {
    case 'name-asc':
      filteredBusinesses.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filteredBusinesses.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'newest':
      filteredBusinesses.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
      break;
    case 'oldest':
      filteredBusinesses.sort((a, b) => new Date(a.joinDate) - new Date(b.joinDate));
      break;
  }
}

/**
 * Render businesses to the grid/list
 */
function renderBusinesses() {
  if (!businessGrid) return;

  // Update results count
  if (resultsCount) {
    const count = filteredBusinesses.length;
    resultsCount.textContent = `${count} business${count !== 1 ? 'es' : ''} found`;
  }

  // Show/hide no results message
  if (noResults) {
    noResults.hidden = filteredBusinesses.length > 0;
  }

  // Generate HTML for businesses
  businessGrid.innerHTML = filteredBusinesses.map(business => createBusinessCard(business)).join('');
}

/**
 * Create HTML for a single business card
 */
function createBusinessCard(business) {
  const membershipClass = business.membership.toLowerCase();
  const membershipBadge = getMembershipBadge(business.membership);
  
  return `
    <article class="business-card ${membershipClass}">
      <div class="business-image">
        <img src="${business.image || 'images/placeholder-business.jpg'}" 
             alt="${business.name}" 
             loading="lazy"
             onerror="this.src='images/placeholder-business.jpg'">
        ${membershipBadge}
      </div>
      <div class="business-content">
        <h3 class="business-name">${business.name}</h3>
        <p class="business-category">${business.category}</p>
        <p class="business-description">${business.description}</p>
        <div class="business-details">
          <p class="business-address">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${business.address}
          </p>
          ${business.phone ? `
          <p class="business-phone">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <a href="tel:${business.phone.replace(/[^0-9+]/g, '')}">${business.phone}</a>
          </p>
          ` : ''}
          ${business.website ? `
          <p class="business-website">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <a href="${business.website}" target="_blank" rel="noopener noreferrer">Visit Website</a>
          </p>
          ` : ''}
        </div>
      </div>
    </article>
  `;
}

/**
 * Get membership badge HTML
 */
function getMembershipBadge(membership) {
  const badges = {
    gold: '<span class="membership-badge gold">Gold Member</span>',
    silver: '<span class="membership-badge silver">Silver Member</span>',
    nonprofit: '<span class="membership-badge nonprofit">Nonprofit</span>',
    bronze: ''
  };
  return badges[membership.toLowerCase()] || '';
}

/**
 * Sample businesses data (fallback if JSON fails to load)
 */
function getSampleBusinesses() {
  return [
    {
      name: "Gilbert Tech Solutions",
      category: "Technology",
      description: "Full-service IT solutions for businesses of all sizes, including managed services, cloud computing, and cybersecurity.",
      address: "456 Innovation Way, Gilbert, AZ 85296",
      phone: "(480) 555-0101",
      website: "https://gilberttech.example.com",
      membership: "gold",
      image: "images/businesses/tech-solutions.jpg",
      joinDate: "2021-03-15"
    },
    {
      name: "Desert Bloom Nursery",
      category: "Retail",
      description: "Specializing in native Arizona plants, landscaping supplies, and expert gardening advice for desert environments.",
      address: "789 Garden Lane, Gilbert, AZ 85234",
      phone: "(480) 555-0202",
      website: "https://desertbloom.example.com",
      membership: "silver",
      image: "images/businesses/desert-bloom.jpg",
      joinDate: "2020-06-20"
    },
    {
      name: "Gilbert Family Dental",
      category: "Healthcare",
      description: "Comprehensive dental care for the whole family, from routine cleanings to cosmetic dentistry.",
      address: "123 Health Center Dr, Gilbert, AZ 85295",
      phone: "(480) 555-0303",
      website: "https://gilbertdental.example.com",
      membership: "gold",
      image: "images/businesses/family-dental.jpg",
      joinDate: "2019-01-10"
    },
    {
      name: "Agave Accounting",
      category: "Professional Services",
      description: "Expert accounting, tax preparation, and financial consulting for individuals and small businesses.",
      address: "567 Finance Plaza, Gilbert, AZ 85233",
      phone: "(480) 555-0404",
      website: "https://agaveaccounting.example.com",
      membership: "silver",
      image: "images/businesses/agave-accounting.jpg",
      joinDate: "2022-02-28"
    },
    {
      name: "Sunrise Coffee Roasters",
      category: "Food & Beverage",
      description: "Local craft coffee roaster featuring single-origin beans, fresh pastries, and a cozy café atmosphere.",
      address: "890 Morning Sun Blvd, Gilbert, AZ 85234",
      phone: "(480) 555-0505",
      website: "https://sunrisecoffee.example.com",
      membership: "bronze",
      image: "images/businesses/sunrise-coffee.jpg",
      joinDate: "2023-05-12"
    },
    {
      name: "Gilbert Community Foundation",
      category: "Nonprofit",
      description: "Dedicated to improving quality of life in Gilbert through community grants, volunteer programs, and charitable initiatives.",
      address: "100 Community Way, Gilbert, AZ 85234",
      phone: "(480) 555-0606",
      website: "https://gilbertfoundation.example.org",
      membership: "nonprofit",
      image: "images/businesses/community-foundation.jpg",
      joinDate: "2018-09-01"
    }
  ];
}