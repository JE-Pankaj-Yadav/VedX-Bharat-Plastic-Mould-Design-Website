// Scroll animations
function checkScroll() {
    const sections = document.querySelectorAll('section');
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollTop + windowHeight * 0.7 > sectionTop && scrollTop < sectionTop + sectionHeight) {
            section.classList.add('visible');
        }
    });
    
    // Header background change on scroll
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Scroll to top button
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }
}

window.addEventListener('scroll', checkScroll);
window.addEventListener('load', checkScroll);

// Mobile menu toggle
const menuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav ul');

menuBtn.addEventListener('click', function() {
    nav.classList.toggle('show');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            nav.classList.remove('show');
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll to top functionality
document.querySelector('.scroll-top').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form submission
document.getElementById('quoteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your inquiry! We will get back to you soon.');
    this.reset();
});

// Tab functionality for Philosophy section
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Show corresponding content
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(`${tabId}-content`).classList.add('active');
    });
});

// Mobile hover simulation for touch devices
function handleTouchInteractions() {
    if ('ontouchstart' in window) {
        // Elements that need touch simulation
        const touchElements = [
            '.meaning-item',
            '.value-item',
            '.principle-item',
            '.goal-item',
            '.service-card',
            '.portfolio-item',
            '.testimonial-card'
        ];
        
        // Add touch event listeners to all elements
        touchElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            
            elements.forEach(element => {
                // Touch start
                element.addEventListener('touchstart', function() {
                    this.classList.add('touch-active');
                }, {passive: true});
                
                // Touch end
                element.addEventListener('touchend', function() {
                    this.classList.remove('touch-active');
                }, {passive: true});
                
                // Touch cancel
                element.addEventListener('touchcancel', function() {
                    this.classList.remove('touch-active');
                }, {passive: true});
            });
        });
        
        // Make all buttons more touch-friendly
        const buttons = document.querySelectorAll('button, .btn, .tab-btn');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, {passive: true});
            
            button.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            }, {passive: true});
        });
    }
}

// Initialize touch interactions
document.addEventListener('DOMContentLoaded', function() {
    handleTouchInteractions();
    
    // Add a class to body if it's a touch device
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.add('non-touch-device');
    }
});

// Prevent sticky hover on mobile devices
function removeHoverEffectsOnTouch() {
    if ('ontouchstart' in window) {
        // Remove all hover styles for touch devices
        const style = document.createElement('style');
        style.textContent = `
            @media (hover: none) {
                .meaning-item:hover,
                .value-item:hover,
                .principle-item:hover,
                .goal-item:hover,
                .service-card:hover,
                .portfolio-item:hover,
                .testimonial-card:hover {
                    transform: none !important;
                }
                
                .meaning-item:hover::before,
                .value-item:hover,
                .principle-item:hover,
                .goal-item:hover,
                .service-card:hover::before,
                .portfolio-item:hover .portfolio-overlay,
                .testimonial-card:hover {
                    /* Reset hover styles for touch devices */
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Call the function to remove hover effects on touch devices
removeHoverEffectsOnTouch();