// Set the current year in the footer
document.getElementById('currentyear').textContent = `© ${new Date().getFullYear()} Timothy Whitehead`;

// Set last modified date
document.getElementById('lastmodified').textContent = document.lastModified;

// Add event listener to hamburger menu for mobile navigation
document.querySelector('.hamburger-menu').addEventListener('click', function() {
    document.querySelector('nav ul').classList.toggle('show');
});

// Course filtering and credit calculation
const filterButtons = document.querySelectorAll('.filter-buttons button');
const courseItems = document.querySelectorAll('.course-list li');
const creditCount = document.getElementById('credit-count');

function updateCredits() {
    let total = 0;
    courseItems.forEach(item => {
        if (!item.classList.contains('hidden')) {
            total += parseInt(item.dataset.credits);
        }
    });
    creditCount.textContent = total;
}

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Toggle active class on buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        // Get filter value
        const filter = this.dataset.filter;

        // Show/hide courses based on filter
        courseItems.forEach(item => {
            if (filter === 'ALL' || item.dataset.category === filter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        // Update credit total
        updateCredits();
    });
});

// Identify if configured dark mode preference and set theme accordingly
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
}

// Detect active page
const currentPage = window.location.pathname.split('/').pop();
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

// Logo click event to go to home page
document.querySelector('.logo').addEventListener('click', function() {
    window.location.href = 'index.html';
});