/**
 * Gilbert Chamber of Commerce
 * Join Page - Form functionality, modals, and validation
 */

// DOM Elements
const membershipForm = document.getElementById('membership-form');
const timestampField = document.getElementById('timestamp');
const charCount = document.getElementById('char-count');
const descriptionTextarea = document.getElementById('description');

/**
 * Initialize join page functionality
 */
function initJoinPage() {
  setTimestamp();
  setupCharacterCount();
  setupPhoneFormatting();
  setupModals();
}

/**
 * Set the hidden timestamp field with current date/time
 */
function setTimestamp() {
  if (timestampField) {
    const now = new Date();
    // Format: "January 15, 2024 at 3:45 PM"
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    timestampField.value = now.toLocaleString('en-US', options);
  }
}

/**
 * Character count for description textarea
 */
function setupCharacterCount() {
  if (!descriptionTextarea || !charCount) return;
  
  descriptionTextarea.addEventListener('input', () => {
    const count = descriptionTextarea.value.length;
    const max = descriptionTextarea.maxLength;
    charCount.textContent = `${count}/${max} characters`;
    
    // Visual feedback when approaching limit
    if (count >= max * 0.9) {
      charCount.style.color = 'var(--color-primary)';
    } else {
      charCount.style.color = 'var(--color-text-muted)';
    }
  });
}

/**
 * Phone number formatting
 */
function setupPhoneFormatting() {
  const phoneInput = document.getElementById('phone');
  if (!phoneInput) return;
  
  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length >= 3) {
      value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    
    e.target.value = value;
  });
}

/**
 * Setup modal functionality
 */
function setupModals() {
  const modalLinks = document.querySelectorAll('.membership-info-link');
  const modals = document.querySelectorAll('.membership-modal');
  
  // Open modal when clicking links
  modalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = link.dataset.modal;
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.showModal();
      }
    });
  });
  
  // Close modal functionality
  modals.forEach(modal => {
    // Close button
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.close();
      });
    }
    
    // Close when clicking backdrop
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.close();
      }
    });
    
    // Close with Escape key (handled automatically by dialog element)
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initJoinPage);