// =============================================
// VEDX BHARAT - MAIN JAVASCRIPT FILE
// Handles animations, interactions, and functionality
// =============================================

// DOM Ready and Initialization
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality when DOM is fully loaded
    initScrollAnimations();
    initMobileMenu();
    initSmoothScrolling();
    initFormInteractions();
    initTabFunctionality();
    initTouchInteractions();
    initLazyLoading();
    createParticles();
    initSymbolExplanationToggle();

    // Check initial scroll position
    checkScroll();
});

// =============================================
// SCROLL ANIMATIONS
// =============================================

/**
 * Initialize scroll animations
 * Sets up event listeners for scroll-based animations
 */
function initScrollAnimations() {
    window.addEventListener('scroll', debounce(checkScroll, 100));
    window.addEventListener('load', checkScroll);
    window.addEventListener('resize', debounce(checkScroll, 100));
}

/**
 * Check scroll position and trigger animations
 * Handles section visibility, header changes, and back-to-top button
 */
function checkScroll() {
    const sections = document.querySelectorAll('section');
    const elements = document.querySelectorAll('.service-card, .value-item, .portfolio-item, .testimonial-card');
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;

    // Section animations
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        // Check if section is in viewport
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

    // Scroll to top button visibility
    const scrollTopBtn = document.querySelector('.back-to-top');
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

// =============================================
// ENHANCED MOBILE MENU FUNCTIONALITY
// =============================================

/**
 * Initialize mobile menu functionality
 * Handles menu toggle, backdrop, and keyboard navigation
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav ul');
    const menuBackdrop = document.createElement('div');

    // Create backdrop element for mobile menu
    menuBackdrop.className = 'menu-backdrop';
    document.body.appendChild(menuBackdrop);

    if (!menuBtn || !nav) return;

    /**
     * Toggle mobile menu visibility
     */
    function toggleMenu() {
        nav.classList.toggle('active');
        menuBtn.classList.toggle('active');
        menuBackdrop.classList.toggle('active');
        document.body.classList.toggle('menu-open');

        // Update aria-expanded attribute for accessibility
        const isExpanded = nav.classList.contains('active');
        menuBtn.setAttribute('aria-expanded', isExpanded);
    }

    /**
     * Close mobile menu
     */
    function closeMenu() {
        nav.classList.remove('active');
        menuBtn.classList.remove('active');
        menuBackdrop.classList.remove('active');
        document.body.classList.remove('menu-open');
        menuBtn.setAttribute('aria-expanded', 'false');
    }

    // Mobile menu button click event
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
// SMOOTH SCROLLING
// =============================================

/**
 * Initialize smooth scrolling functionality
 * Handles anchor link navigation and scroll-to-top
 */
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

                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
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
// ENHANCED FORM INTERACTIONS & VALIDATION
// =============================================

/**
 * Initialize form interactions and validation
 * Sets up form validation, field interactions, and submission handling
 */
function initFormInteractions() {
    // Toggle sub-options based on service type
    const serviceTypeSelect = document.getElementById('serviceType');
    if (serviceTypeSelect) {
        serviceTypeSelect.addEventListener('change', toggleSubOptions);
    }

    // Form submission handling
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

/**
 * Validate form field
 * @param {HTMLElement} field - The form field to validate
 * @returns {boolean} - Whether the field is valid
 */
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

/**
 * Create validation message element
 * @param {HTMLElement} field - The field to add validation message to
 * @returns {HTMLElement} - The validation message element
 */
function createValidationMessage(field) {
    const message = document.createElement('span');
    message.className = 'validation-message';
    field.parentElement.appendChild(message);
    return message;
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - Whether email is valid
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether phone number is valid
 */
function isValidPhone(phone) {
    const re = /^[+]?[\d\s\-()]{10,}$/;
    return re.test(phone);
}

/**
 * Toggle sub-options based on selected service type
 * Shows/hides additional form fields based on selection
 */
function toggleSubOptions() {
    const serviceType = document.getElementById('serviceType').value;
    const subOptionsContainer = document.getElementById('subOptionsContainer');
    const allSubOptions = document.querySelectorAll('.sub-options');

    // Hide all sub-options first
    allSubOptions.forEach(option => {
        option.style.display = 'none';
    });

    // Show relevant sub-options based on selection
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

/**
 * Handle form submission
 * @param {Event} e - Form submit event
 */
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

/**
 * Show success modal after form submission
 */
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

/**
 * Show error modal with message
 * @param {string} message - Error message to display
 */
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

/**
 * Close modal by ID
 * @param {string} modalId - ID of the modal to close
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// =============================================
// TAB FUNCTIONALITY
// =============================================

/**
 * Initialize tab functionality
 * Handles tab switching with animations
 */
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
// TOUCH DEVICE INTERACTIONS
// =============================================

/**
 * Initialize touch interactions
 * Handles touch-specific interactions and hover effects
 */
function initTouchInteractions() {
    handleTouchInteractions();
    removeHoverEffectsOnTouch();

    // Add device class to body for CSS targeting
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.add('non-touch-device');
    }
}

/**
 * Handle touch interactions for various elements
 */
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

        // Add touch events to all interactive elements
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

        // Add touch events to buttons
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

/**
 * Remove hover effects on touch devices
 * Prevents sticky hover states on touch devices
 */
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
// LAZY LOADING FOR IMAGES
// =============================================

/**
 * Initialize lazy loading for images
 * Uses Intersection Observer for performance
 */
function initLazyLoading() {
    // Skip if Intersection Observer is not supported
    if (!('IntersectionObserver' in window)) return;

    const lazyImages = document.querySelectorAll('img.lazy-load');
    if (lazyImages.length === 0) return;

    // Create Intersection Observer for lazy loading
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

    // Observe all lazy images
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// =============================================
// PARTICLE EFFECTS
// =============================================

/**
 * Create particle effects for hero section
 * Adds animated particles to the hero background
 */
function createParticles() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    heroSection.appendChild(particlesContainer);

    // Create multiple particles with random properties
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random properties for variety
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
// SYMBOL EXPLANATION TOGGLE
// =============================================

/**
 * Initialize symbol explanation toggle functionality
 * Handles show/hide of symbol explanation content
 */
function initSymbolExplanationToggle() {
    const toggleBtn = document.querySelector('.toggle-btn');
    if (!toggleBtn) return;
    
    toggleBtn.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        const content = this.nextElementSibling;
        
        // Toggle aria-expanded attribute
        this.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle content visibility
        if (isExpanded) {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
            
            // Smooth scroll to ensure content is visible
            setTimeout(() => {
                content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }
    });
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Throttle function for performance optimization
 * Limits how often a function can be called
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
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

/**
 * Debounce function for performance optimization
 * Delays function execution until after wait time
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Whether to execute immediately
 * @returns {Function} - Debounced function
 */
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

/**
 * Initialize floating animations for elements
 * Adds floating animation to selected elements
 */
function initFloatingAnimations() {
    const floatingElements = document.querySelectorAll('.about-image img, .logo-symbol, .value-item i');
    floatingElements.forEach(el => {
        el.classList.add('floating');
    });
}

/**
 * Initialize typing effect for hero text
 * Creates a typewriter effect for hero paragraph
 */
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