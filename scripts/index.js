// Set the current year in the footer
document.getElementById('currentyear').textContent = `© ${new Date().getFullYear()} Timothy Whitehead`;

// Add event listener to hamburger menu for mobile navigation
document.querySelector('.hamburger-menu').addEventListener('click', function() {
    document.querySelector('nav ul').classList.toggle('show');
});

//toggle active filter buttons
const filterButtons = document.querySelectorAll('button');
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});

// identify if configured dark mode preference and set theme accordingly
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
}

// detect active page
const currentPage = window.location.pathname.split('/').pop();
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

//logo click event to go to home page
document.querySelector('.logo').addEventListener('click', function() {
    window.location.href = 'index.html';
});