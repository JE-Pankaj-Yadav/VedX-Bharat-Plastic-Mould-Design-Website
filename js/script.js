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

// Improved mobile menu functionality with outside click/scroll detection
document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav ul');
    const header = document.querySelector('header');

    // Toggle menu function
    function toggleMenu() {
        nav.classList.toggle('show');
        menuBtn.querySelector('i').classList.toggle('fa-bars');
        menuBtn.querySelector('i').classList.toggle('fa-times');
    }

    // Close menu function
    function closeMenu() {
        nav.classList.remove('show');
        menuBtn.querySelector('i').classList.add('fa-bars');
        menuBtn.querySelector('i').classList.remove('fa-times');
    }

    // Mobile menu button click
    menuBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInsideMenu = nav.contains(event.target) || menuBtn.contains(event.target);
        if (!isClickInsideMenu && nav.classList.contains('show')) {
            closeMenu();
        }
    });

    // Close menu when scrolling
    let scrollTimeout;
    window.addEventListener('scroll', function () {
        if (nav.classList.contains('show')) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function () {
                closeMenu();
            }, 150);
        }
    });

    // Close menu when a nav link is clicked (for single page navigation)
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
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
document.querySelector('.scroll-top').addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Update the toggleSubOptions function in script.js
function toggleSubOptions() {
    const serviceType = document.getElementById('serviceType').value;
    const subOptionsContainer = document.getElementById('subOptionsContainer');
    const allSubOptions = document.querySelectorAll('.sub-options');

    allSubOptions.forEach(option => {
        option.style.display = 'none';
    });

    if (serviceType === 'part-design') {
        subOptionsContainer.style.display = 'block';
        document.getElementById('partDesignOptions').style.display = 'block';
    } else if (serviceType === 'mold-design') {
        subOptionsContainer.style.display = 'block';
        document.getElementById('moldDesignOptions').style.display = 'block';
    } else if (serviceType === 'mold-rectification') {
        subOptionsContainer.style.display = 'block';
        document.getElementById('moldRectificationOptions').style.display = 'block';
    } else if (serviceType) {
        // Show the container for other service types but hide specific sub-options
        subOptionsContainer.style.display = 'block';
    } else {
        subOptionsContainer.style.display = 'none';
    }
}

// Update form submission to handle case when no service type is selected
document.getElementById('quoteForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const serviceType = document.getElementById('serviceType').value;

    // Only get these values if service type is selected
    let application, volume, material, timeline, message;
    if (serviceType) {
        application = document.getElementById('application').value;
        volume = document.getElementById('volume').value;
        material = document.getElementById('material').value;
        timeline = document.getElementById('timeline').value;
        message = document.getElementById('message').value;
    }

    // Get selected sub-options
    let subOptions = [];
    if (serviceType === 'part-design') {
        document.querySelectorAll('input[name="part-material"]:checked').forEach(checkbox => {
            subOptions.push(checkbox.value);
        });
    } else if (serviceType === 'mold-design') {
        document.querySelectorAll('input[name="mold-type"]:checked').forEach(checkbox => {
            subOptions.push(checkbox.value);
        });
    } else if (serviceType === 'mold-rectification') {
        document.querySelectorAll('input[name="rectification-type"]:checked').forEach(checkbox => {
            subOptions.push(checkbox.value);
        });
    }

    // Show success popup instead of alert
    showSuccessModal();

    // Reset form
    this.reset();

    // Hide sub-options container
    document.getElementById('subOptionsContainer').style.display = 'none';
});

// Tab functionality for Philosophy section
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(`${tabId}-content`).classList.add('active');
    });
});

// Mobile hover simulation for touch devices
function handleTouchInteractions() {
    if ('ontouchstart' in window) {
        const touchElements = [
            '.meaning-item',
            '.value-item',
            '.principle-item',
            '.goal-item',
            '.service-card',
            '.portfolio-item',
            '.testimonial-card'
        ];

        touchElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);

            elements.forEach(element => {
                element.addEventListener('touchstart', function () {
                    this.classList.add('touch-active');
                }, { passive: true });

                element.addEventListener('touchend', function () {
                    this.classList.remove('touch-active');
                }, { passive: true });

                element.addEventListener('touchcancel', function () {
                    this.classList.remove('touch-active');
                }, { passive: true });
            });
        });

        const buttons = document.querySelectorAll('button, .btn, .tab-btn');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function () {
                this.classList.add('touch-active');
            }, { passive: true });

            button.addEventListener('touchend', function () {
                this.classList.remove('touch-active');
            }, { passive: true });
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    handleTouchInteractions();
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.add('non-touch-device');
    }
});

// Prevent sticky hover on mobile devices
function removeHoverEffectsOnTouch() {
    if ('ontouchstart' in window) {
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
                    box-shadow: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

removeHoverEffectsOnTouch();


