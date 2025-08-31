// =============================================
// DOM Ready and Initialization
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initScrollAnimations();
    initMobileMenu();
    initSmoothScrolling();
    initFormInteractions();
    initTabFunctionality();
    initTouchInteractions();
    initLazyLoading();
    createParticles();

    // Check initial scroll position
    checkScroll();
});

// =============================================
// Scroll Animations
// =============================================
function initScrollAnimations() {
    window.addEventListener('scroll', debounce(checkScroll, 100));
    window.addEventListener('load', checkScroll);
    window.addEventListener('resize', debounce(checkScroll, 100));
}

function checkScroll() {
    const sections = document.querySelectorAll('section');
    const elements = document.querySelectorAll('.service-card, .value-item, .portfolio-item, .testimonial-card');
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;

    // Section animations
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollTop + windowHeight * 0.7 > sectionTop && scrollTop < sectionTop + sectionHeight) {
            section.classList.add('visible');

            // Stagger animations for child elements
            const delayIncrement = 100;
            let delay = 0;

            section.querySelectorAll('.service-card, .value-item, .portfolio-item, .testimonial-card').forEach(el => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, delay);
                delay += delayIncrement;
            });
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
    const scrollTopBtn = document.querySelector('.back-to-top');
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

// =============================================
// Enhanced Mobile Menu Functionality
// =============================================
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav ul');
    const menuBackdrop = document.createElement('div');

    // Create backdrop element
    menuBackdrop.className = 'menu-backdrop';
    document.body.appendChild(menuBackdrop);

    if (!menuBtn || !nav) return;

    // Toggle menu function
    function toggleMenu() {
        nav.classList.toggle('active');
        menuBtn.classList.toggle('active');
        menuBackdrop.classList.toggle('active');
        document.body.classList.toggle('menu-open');

        // Update aria-expanded attribute
        const isExpanded = nav.classList.contains('active');
        menuBtn.setAttribute('aria-expanded', isExpanded);
    }

    // Close menu function
    function closeMenu() {
        nav.classList.remove('active');
        menuBtn.classList.remove('active');
        menuBackdrop.classList.remove('active');
        document.body.classList.remove('menu-open');
        menuBtn.setAttribute('aria-expanded', 'false');
    }

    // Mobile menu button click
    menuBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking on backdrop
    menuBackdrop.addEventListener('click', closeMenu);

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInsideMenu = nav.contains(event.target) || menuBtn.contains(event.target);
        if (!isClickInsideMenu && nav.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close menu when scrolling
    window.addEventListener('scroll', function () {
        if (nav.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close menu when a nav link is clicked
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 1024) {
                closeMenu();
            }
        });
    });

    // Add keyboard navigation to menu
    nav.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMenu();
            menuBtn.focus();
        }
    });
}

// =============================================
// Smooth Scrolling
// =============================================
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Add animation class to target section
                targetElement.classList.add('highlight');
                setTimeout(() => {
                    targetElement.classList.remove('highlight');
                }, 2000);

                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll to top functionality
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// =============================================
// Enhanced Form Interactions & Validation
// =============================================
function initFormInteractions() {
    // Toggle sub-options based on service type
    const serviceTypeSelect = document.getElementById('serviceType');
    if (serviceTypeSelect) {
        serviceTypeSelect.addEventListener('change', toggleSubOptions);
    }

    // Form submission
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        // Add input validation
        const inputs = quoteForm.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateField(this);
            });

            input.addEventListener('input', function () {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });

        quoteForm.addEventListener('submit', handleFormSubmit);
    }

    // Enhanced form interactions
    const formControls = document.querySelectorAll('.form-control');

    formControls.forEach(control => {
        control.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        control.addEventListener('blur', function () {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.getAttribute('id');
    const validationMessage = field.parentElement.querySelector('.validation-message') ||
        createValidationMessage(field);

    // Clear previous validation
    field.classList.remove('error', 'success');
    validationMessage.classList.remove('show');
    validationMessage.textContent = '';

    // Skip validation if field is not required and empty
    if (!field.hasAttribute('required') && value === '') {
        return true;
    }

    let isValid = true;
    let message = '';

    switch (field.type) {
        case 'email':
            if (!isValidEmail(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
            break;
        case 'tel':
        case 'number':
            if (!isValidPhone(value)) {
                isValid = false;
                message = 'Please enter a valid phone number';
            }
            break;
        default:
            if (field.hasAttribute('required') && value === '') {
                isValid = false;
                message = 'This field is required';
            }
    }

    // Apply validation state
    if (!isValid) {
        field.classList.add('error');
        validationMessage.textContent = message;
        validationMessage.classList.add('show');
    } else {
        field.classList.add('success');
    }

    return isValid;
}

function createValidationMessage(field) {
    const message = document.createElement('span');
    message.className = 'validation-message';
    field.parentElement.appendChild(message);
    return message;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    const re = /^[+]?[\d\s\-()]{10,}$/;
    return re.test(phone);
}

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

function handleFormSubmit(e) {
    e.preventDefault();

    // Validate all fields
    const form = e.target;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
            // Focus on first invalid field
            if (isValid) {
                input.focus();
                isValid = false;
            }
        }
    });

    if (!isValid) {
        // Show error message
        showErrorModal('Please fill all required fields correctly.');
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual AJAX call)
    setTimeout(() => {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Show success popup
        showSuccessModal();

        // Reset form
        form.reset();

        // Hide sub-options container
        document.getElementById('subOptionsContainer').style.display = 'none';
    }, 1500);
}

function showSuccessModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('successModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'successModal';
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="success-modal-content">
                <span class="close-modal">&times;</span>
                <i class="fas fa-check-circle"></i>
                <h3>Thank You!</h3>
                <p>Your request has been submitted successfully. We'll get back to you soon.</p>
                <button class="btn" onclick="closeModal('successModal')">OK</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Add close functionality
        modal.querySelector('.close-modal').addEventListener('click', function () {
            closeModal('successModal');
        });

        // Close modal when clicking outside
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal('successModal');
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeModal('successModal');
            }
        });
    }

    // Show modal
    modal.classList.add('active');
}

function showErrorModal(message) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('errorModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'errorModal';
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="success-modal-content">
                <span class="close-modal">&times;</span>
                <i class="fas fa-exclamation-circle" style="color: var(--error)"></i>
                <h3>Oops!</h3>
                <p class="error-message"></p>
                <button class="btn" onclick="closeModal('errorModal')">OK</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Add close functionality
        modal.querySelector('.close-modal').addEventListener('click', function () {
            closeModal('errorModal');
        });

        // Close modal when clicking outside
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal('errorModal');
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeModal('errorModal');
            }
        });
    }

    // Set error message
    modal.querySelector('.error-message').textContent = message;

    // Show modal
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// =============================================
// Tab Functionality
// =============================================
function initTabFunctionality() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Add animation class to current active tab content
            const currentActive = document.querySelector('.tab-content.active');
            if (currentActive) {
                currentActive.classList.add('fade-out');
            }

            setTimeout(() => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                const newTab = document.getElementById(`${tabId}-content`);

                newTab.classList.add('active');
                if (currentActive) {
                    currentActive.classList.remove('fade-out');
                }
            }, 300);
        });
    });
}

// =============================================
// Touch Device Interactions
// =============================================
function initTouchInteractions() {
    handleTouchInteractions();
    removeHoverEffectsOnTouch();

    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.add('non-touch-device');
    }
}

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

// =============================================
// Lazy Loading for Images
// =============================================
function initLazyLoading() {
    // Skip if Intersection Observer is not supported
    if (!('IntersectionObserver' in window)) return;

    const lazyImages = document.querySelectorAll('img.lazy-load');

    if (lazyImages.length === 0) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// =============================================
// Particle Effects
// =============================================
function createParticles() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    heroSection.appendChild(particlesContainer);

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random properties
        const size = Math.random() * 10 + 2;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 10 + 10;
        const animationDelay = Math.random() * 5;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${animationDelay}s`;

        particlesContainer.appendChild(particle);
    }
}

// =============================================
// Utility Functions
// =============================================
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Add floating animation to elements
function initFloatingAnimations() {
    const floatingElements = document.querySelectorAll('.about-image img, .logo-symbol, .value-item i');
    floatingElements.forEach(el => {
        el.classList.add('floating');
    });
}

// Initialize typing effect for hero text
function initTypingEffect() {
    const heroText = document.querySelector('.hero p');
    if (heroText) {
        heroText.style.overflow = 'hidden';
        heroText.style.whiteSpace = 'nowrap';
        heroText.style.borderRight = '3px solid var(--accent)';

        setTimeout(() => {
            heroText.style.whiteSpace = 'normal';
            heroText.style.borderRight = 'none';
        }, 3500);
    }
}