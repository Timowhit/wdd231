/**
 * Gilbert Chamber of Commerce - Join Page JavaScript
 * Handles form functionality including timestamp, character counter, and modals
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initTimestamp();
  initCharacterCounter();
  initMembershipModals();
  initMembershipCardAnimation();
});

/**
 * Set the timestamp when the page loads
 */
function initTimestamp() {
  const timestampField = document.getElementById('timestamp');
  if (timestampField) {
    timestampField.value = new Date().toISOString();
  }
}

/**
 * Initialize character counter for textarea
 */
function initCharacterCounter() {
  const textarea = document.getElementById('description');
  const charCount = document.getElementById('char-count');

  if (!textarea || !charCount) return;

  const updateCount = () => {
    const count = textarea.value.length;
    const maxLength = textarea.getAttribute('maxlength') || 200;
    charCount.textContent = `${count}/${maxLength} characters`;
    
    // Add warning class when approaching limit
    if (count >= maxLength * 0.9) {
      charCount.classList.add('warning');
    } else {
      charCount.classList.remove('warning');
    }
  };

  textarea.addEventListener('input', updateCount);
  // Initialize count on page load
  updateCount();
}

/**
 * Initialize membership information modals
 */
function initMembershipModals() {
  const modalLinks = document.querySelectorAll('.membership-info-link');
  const modals = document.querySelectorAll('.modal');
  const body = document.body;

  // Open modal when info link is clicked
  modalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = link.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        body.classList.add('modal-open');
        // Focus the close button for accessibility
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
      }
    });
  });

  // Close modal functionality
  modals.forEach(modal => {
    // Close button
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        closeModal(modal);
      });
    }

    // Click outside modal content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close modal on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('active')) {
          closeModal(modal);
        }
      });
    }
  });

  function closeModal(modal) {
    modal.classList.remove('active');
    body.classList.remove('modal-open');
  }
}

/**
 * Initialize membership card animations on scroll
 */
function initMembershipCardAnimation() {
  const cards = document.querySelectorAll('.membership-card');
  
  if (!cards.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });

  cards.forEach(card => observer.observe(card));
}