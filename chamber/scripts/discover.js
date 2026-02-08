/**
 * Gilbert Chamber of Commerce - Discover Page JavaScript
 * Handles visit tracking using localStorage and lazy loading
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  displayVisitMessage();
  animateProgressBars();
});

/**
 * Display personalized visit message based on localStorage
 */
function displayVisitMessage() {
  const messageElement = document.getElementById('visit-message');
  if (!messageElement) return;

  const lastVisit = localStorage.getItem('lastVisit');
  const now = Date.now();

  if (!lastVisit) {
    // First visit
    messageElement.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    // Calculate days since last visit
    const timeDiff = now - parseInt(lastVisit);
    const daysSince = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysSince < 1) {
      // Less than a day (same day visit)
      messageElement.textContent = "Back so soon! Awesome!";
    } else if (daysSince === 1) {
      messageElement.textContent = "You last visited 1 day ago.";
    } else {
      messageElement.textContent = `You last visited ${daysSince} days ago.`;
    }
  }

  // Store current visit timestamp
  localStorage.setItem('lastVisit', now.toString());
}

/**
 * Animate progress bars on scroll into view
 */
function animateProgressBars() {
  const progressFills = document.querySelectorAll('.progress-fill');
  
  if (!progressFills.length || !('IntersectionObserver' in window)) {
    // Fallback: just set the widths immediately
    progressFills.forEach(fill => {
      const width = fill.getAttribute('data-width');
      if (width) {
        fill.style.width = width + '%';
      }
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        if (width) {
          // Delay slightly for better effect
          setTimeout(() => {
            fill.style.width = width + '%';
          }, 100);
        }
        observer.unobserve(fill);
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
  });

  progressFills.forEach(fill => {
    fill.style.width = '0%';
    fill.style.transition = 'width 1s ease-out';
    observer.observe(fill);
  });
}
