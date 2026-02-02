/**
 * Gilbert Chamber of Commerce
 * Thank You Page - Display submitted form data from URL parameters
 */

/**
 * Initialize thank you page
 */
function initThankYouPage() {
  displayFormData();
}

/**
 * Get URL parameters and display the form data
 */
function displayFormData() {
  // Get URL parameters
  const params = new URLSearchParams(window.location.search);
  
  // Membership level labels
  const membershipLabels = {
    'np': 'NP Membership (Nonprofit)',
    'bronze': 'Bronze Membership',
    'silver': 'Silver Membership',
    'gold': 'Gold Membership'
  };
  
  // Map of parameter names to display element IDs
  const fieldMappings = {
    'first-name': 'display-first-name',
    'last-name': 'display-last-name',
    'email': 'display-email',
    'phone': 'display-phone',
    'org-name': 'display-org-name',
    'membership': 'display-membership',
    'timestamp': 'display-timestamp'
  };
  
  // Update each display element with the corresponding parameter value
  for (const [paramName, elementId] of Object.entries(fieldMappings)) {
    const element = document.getElementById(elementId);
    if (element) {
      let value = params.get(paramName);
      
      if (value) {
        // Decode URI component for proper display
        value = decodeURIComponent(value.replace(/\+/g, ' '));
        
        // Special handling for membership level
        if (paramName === 'membership') {
          value = membershipLabels[value] || value;
        }
        
        element.textContent = value;
      }
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initThankYouPage);