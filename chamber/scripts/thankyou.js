/**
 * Gilbert Chamber of Commerce - Thank You Page JavaScript
 * Parses URL parameters and displays submission details
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  displaySubmissionDetails();
});

/**
 * Parse URL parameters and display submission details
 */
function displaySubmissionDetails() {
  const params = new URLSearchParams(window.location.search);
  
  // Get form field values from URL parameters
  const firstName = params.get('first-name') || '';
  const lastName = params.get('last-name') || '';
  const title = params.get('title') || '';
  const email = params.get('email') || '';
  const phone = params.get('phone') || '';
  const orgName = params.get('org-name') || '';
  const membership = params.get('membership') || '';
  const timestamp = params.get('timestamp') || '';

  // Display name
  const nameDisplay = document.getElementById('display-name');
  if (nameDisplay) {
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    const displayName = title ? `${fullName} (${title})` : fullName;
    nameDisplay.textContent = displayName || '—';
  }

  // Display organization
  const orgDisplay = document.getElementById('display-org');
  if (orgDisplay) {
    orgDisplay.textContent = orgName || '—';
  }

  // Display email
  const emailDisplay = document.getElementById('display-email');
  if (emailDisplay) {
    emailDisplay.textContent = email || '—';
  }

  // Display phone
  const phoneDisplay = document.getElementById('display-phone');
  if (phoneDisplay) {
    phoneDisplay.textContent = phone || '—';
  }

  // Display membership level
  const membershipDisplay = document.getElementById('display-membership');
  if (membershipDisplay) {
    membershipDisplay.textContent = formatMembership(membership);
  }

  // Display timestamp
  const timestampDisplay = document.getElementById('display-timestamp');
  if (timestampDisplay) {
    timestampDisplay.textContent = formatTimestamp(timestamp);
  }
}

/**
 * Format membership level for display
 */
function formatMembership(membership) {
  const levels = {
    'np': 'NP Membership (Nonprofit)',
    'bronze': 'Bronze Membership',
    'silver': 'Silver Membership',
    'gold': 'Gold Membership'
  };
  return levels[membership.toLowerCase()] || membership || '—';
}

/**
 * Format timestamp for display
 */
function formatTimestamp(timestamp) {
  if (!timestamp) return '—';
  
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;
    
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    };
    
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    return timestamp;
  }
}