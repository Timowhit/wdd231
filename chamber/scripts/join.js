/**
 * Gilbert Chamber of Commerce
 * Join Page - Membership form validation and submission
 */

// DOM Elements
const membershipForm = document.getElementById('membership-form');
const formSuccess = document.getElementById('form-success');
const selectedTierDisplay = document.getElementById('selected-tier-display');
const selectedTierName = document.getElementById('selected-tier-name');
const selectedTierPrice = document.getElementById('selected-tier-price');
const charCount = document.getElementById('char-count');
const descriptionTextarea = document.getElementById('business-description');

// Tier pricing
const tierPricing = {
  nonprofit: { name: 'Nonprofit', price: '$99/year' },
  silver: { name: 'Silver', price: '$299/year' },
  gold: { name: 'Gold', price: '$599/year' }
};

/**
 * Initialize join page functionality
 */
function initJoinPage() {
  setupTierSelection();
  setupCharacterCount();
  setupFormValidation();
  setupPhoneFormatting();
}

/**
 * Handle tier selection from cards
 */
function setupTierSelection() {
  const tierButtons = document.querySelectorAll('.select-tier');
  const membershipRadios = document.querySelectorAll('input[name="membershipLevel"]');
  
  tierButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tier = btn.dataset.tier;
      
      // Select the corresponding radio button
      const radio = document.querySelector(`input[name="membershipLevel"][value="${tier}"]`);
      if (radio) {
        radio.checked = true;
        updateSelectedTierDisplay(tier);
      }
      
      // Scroll to form
      const form = document.getElementById('application-form');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  // Update display when radio buttons change
  membershipRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      updateSelectedTierDisplay(radio.value);
    });
  });
}

/**
 * Update the selected tier display banner
 */
function updateSelectedTierDisplay(tier) {
  if (!selectedTierDisplay || !tierPricing[tier]) return;
  
  selectedTierDisplay.style.display = 'block';
  selectedTierName.textContent = tierPricing[tier].name;
  selectedTierPrice.textContent = tierPricing[tier].price;
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
  const phoneInput = document.getElementById('business-phone');
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
 * Form validation
 */
function setupFormValidation() {
  if (!membershipForm) return;
  
  membershipForm.addEventListener('submit', handleFormSubmit);
  membershipForm.addEventListener('reset', handleFormReset);
  
  // Real-time validation on blur
  const inputs = membershipForm.querySelectorAll('.form-input, .form-select, .form-textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });
}

/**
 * Handle form submission
 */
function handleFormSubmit(e) {
  e.preventDefault();
  
  // Validate all fields
  const isValid = validateForm();
  
  if (isValid) {
    // Collect form data
    const formData = new FormData(membershipForm);
    const data = Object.fromEntries(formData.entries());
    
    // Store submission (in real app, this would be sent to server)
    const submissions = window.chamberUtils.getData('membershipSubmissions') || [];
    submissions.push({
      ...data,
      submittedAt: new Date().toISOString(),
      id: Date.now()
    });
    window.chamberUtils.storeData('membershipSubmissions', submissions);
    
    // Show success message
    membershipForm.style.display = 'none';
    formSuccess.style.display = 'block';
    
    // Scroll to success message
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    console.log('Form submitted:', data);
  }
}

/**
 * Handle form reset
 */
function handleFormReset() {
  // Clear all error states
  membershipForm.querySelectorAll('.error').forEach(el => {
    el.classList.remove('error');
  });
  
  // Hide selected tier display
  if (selectedTierDisplay) {
    selectedTierDisplay.style.display = 'none';
  }
  
  // Reset character count
  if (charCount) {
    charCount.textContent = '0/200 characters';
    charCount.style.color = 'var(--color-text-muted)';
  }
}

/**
 * Validate entire form
 */
function validateForm() {
  let isValid = true;
  
  // Validate all required inputs
  const requiredInputs = membershipForm.querySelectorAll('[required]');
  requiredInputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });
  
  // Validate membership level selection
  const membershipSelected = membershipForm.querySelector('input[name="membershipLevel"]:checked');
  const membershipError = document.getElementById('membership-error');
  if (!membershipSelected) {
    if (membershipError) membershipError.style.display = 'block';
    isValid = false;
  } else {
    if (membershipError) membershipError.style.display = 'none';
  }
  
  // Validate terms checkbox
  const termsCheckbox = document.getElementById('terms');
  const termsError = document.getElementById('terms-error');
  if (!termsCheckbox?.checked) {
    if (termsError) termsError.style.display = 'block';
    isValid = false;
  } else {
    if (termsError) termsError.style.display = 'none';
  }
  
  // Scroll to first error
  if (!isValid) {
    const firstError = membershipForm.querySelector('.error, [style*="display: block"]');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  return isValid;
}

/**
 * Validate individual field
 */
function validateField(input) {
  const value = input.value.trim();
  let isValid = true;
  
  // Check required
  if (input.required && !value) {
    isValid = false;
  }
  
  // Check email format
  if (input.type === 'email' && value) {
    isValid = window.chamberUtils.isValidEmail(value);
  }
  
  // Check phone format (basic validation)
  if (input.type === 'tel' && value) {
    const digits = value.replace(/\D/g, '');
    isValid = digits.length >= 10;
  }
  
  // Check URL format
  if (input.type === 'url' && value) {
    try {
      new URL(value);
      isValid = true;
    } catch {
      isValid = false;
    }
  }
  
  // Check select has value
  if (input.tagName === 'SELECT' && input.required && !value) {
    isValid = false;
  }
  
  // Update UI
  if (isValid) {
    input.classList.remove('error');
  } else {
    input.classList.add('error');
  }
  
  return isValid;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initJoinPage);
