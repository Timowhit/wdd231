/**
 * Gilbert Chamber of Commerce
 * Directory Page - Business filtering, sorting, and display
 */

// State management
let allMembers = [];
let filteredMembers = [];
let currentCategory = 'All';
let currentMembership = 'all';
let currentSearch = '';
let currentSort = 'name-asc';
let currentView = 'grid';

// DOM Elements
const businessGrid = document.getElementById('business-grid');
const categoryFilters = document.getElementById('category-filters');
const membershipFilters = document.getElementById('membership-filters');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const resultsCount = document.getElementById('results-count');
const noResults = document.getElementById('no-results');
const gridViewBtn = document.getElementById('grid-view-btn');
const listViewBtn = document.getElementById('list-view-btn');

/**
 * Initialize directory
 */
async function initDirectory() {
  try {
    // Load member data
    const response = await fetch('data/members.json');
    const data = await response.json();
    allMembers = data.members;
    
    // Build category filters
    buildCategoryFilters(data.categories);
    
    // Set up event listeners
    setupEventListeners();
    
    // Initial render
    applyFilters();
    
  } catch (error) {
    console.error('Error loading directory:', error);
    businessGrid.innerHTML = `
      <div class="no-results">
        <h3>Unable to load directory</h3>
        <p>Please try refreshing the page.</p>
      </div>
    `;
  }
}

/**
 * Build category filter buttons
 */
function buildCategoryFilters(categories) {
  if (!categoryFilters) return;
  
  categoryFilters.innerHTML = categories.map(category => `
    <button class="filter-btn ${category === 'All' ? 'active' : ''}" data-filter="${category}">
      ${category}
    </button>
  `).join('');
  
  // Add click handlers
  categoryFilters.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      categoryFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.filter;
      applyFilters();
    });
  });
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
  // Search input with debounce
  if (searchInput) {
    searchInput.addEventListener('input', window.chamberUtils.debounce((e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      applyFilters();
    }, 300));
  }
  
  // Membership filter buttons
  if (membershipFilters) {
    membershipFilters.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        membershipFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMembership = btn.dataset.filter;
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
  
  // View toggle buttons
  if (gridViewBtn) {
    gridViewBtn.addEventListener('click', () => {
      currentView = 'grid';
      gridViewBtn.classList.add('active');
      listViewBtn?.classList.remove('active');
      businessGrid?.classList.remove('list-view');
    });
  }
  
  if (listViewBtn) {
    listViewBtn.addEventListener('click', () => {
      currentView = 'list';
      listViewBtn.classList.add('active');
      gridViewBtn?.classList.remove('active');
      businessGrid?.classList.add('list-view');
    });
  }
}

/**
 * Apply all filters and render
 */
function applyFilters() {
  // Start with all members
  filteredMembers = [...allMembers];
  
  // Filter by category
  if (currentCategory !== 'All') {
    filteredMembers = filteredMembers.filter(m => m.category === currentCategory);
  }
  
  // Filter by membership level
  if (currentMembership !== 'all') {
    filteredMembers = filteredMembers.filter(m => m.membershipLevel === currentMembership);
  }
  
  // Filter by search term
  if (currentSearch) {
    filteredMembers = filteredMembers.filter(m => 
      m.name.toLowerCase().includes(currentSearch) ||
      m.description.toLowerCase().includes(currentSearch) ||
      m.category.toLowerCase().includes(currentSearch)
    );
  }
  
  // Sort results
  sortMembers();
  
  // Render
  renderDirectory();
}

/**
 * Sort filtered members
 */
function sortMembers() {
  switch (currentSort) {
    case 'name-asc':
      filteredMembers.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filteredMembers.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'newest':
      filteredMembers.sort((a, b) => b.yearEstablished - a.yearEstablished);
      break;
    case 'oldest':
      filteredMembers.sort((a, b) => a.yearEstablished - b.yearEstablished);
      break;
  }
}

/**
 * Render the directory grid
 */
function renderDirectory() {
  // Update results count
  if (resultsCount) {
    const countText = filteredMembers.length === 1 
      ? '1 business found' 
      : `${filteredMembers.length} businesses found`;
    resultsCount.textContent = countText;
  }
  
  // Show/hide no results message
  if (filteredMembers.length === 0) {
    businessGrid.style.display = 'none';
    noResults.style.display = 'block';
    return;
  }
  
  businessGrid.style.display = '';
  noResults.style.display = 'none';
  
  // Render business cards
  businessGrid.innerHTML = filteredMembers.map(member => createBusinessCard(member)).join('');
}

/**
 * Create HTML for a business card
 */
function createBusinessCard(member) {
  const membershipLabels = {
    gold: 'Gold Member',
    silver: 'Silver Member',
    nonprofit: 'Nonprofit'
  };
  
  return `
    <article class="card business-card" data-id="${member.id}">
      <div class="card-header">
        <img src="${member.image}" alt="${member.name} logo" class="business-logo" loading="lazy">
        <div class="business-info">
          <h3>${member.name}</h3>
          <span class="business-category">${member.category}</span>
          <span class="membership-badge ${member.membershipLevel}">${membershipLabels[member.membershipLevel]}</span>
        </div>
      </div>
      <div class="card-body">
        <p class="card-text">${member.description}</p>
        <div class="business-details">
          <span>
            <svg class="icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${member.address}
          </span>
          <span>
            <svg class="icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <a href="tel:${member.phone.replace(/\D/g, '')}">${member.phone}</a>
          </span>
          <span>
            <svg class="icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
          </span>
        </div>
      </div>
    </article>
  `;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initDirectory);