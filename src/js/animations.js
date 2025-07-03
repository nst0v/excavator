// Hero image slider
class HeroSlider {
    constructor() {
        this.images = document.querySelectorAll('.hero__image');
        this.currentIndex = 0;
        this.intervalId = null;
        
        if (this.images.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.startSlider();
        this.addEventListeners();
    }
    
    startSlider() {
        this.intervalId = setInterval(() => {
            this.nextSlide();
        }, 4000);
    }
    
    nextSlide() {
        this.images[this.currentIndex].classList.remove('active');
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.images[this.currentIndex].classList.add('active');
    }
    
    addEventListeners() {
        // Pause on hover
        const heroVisual = document.querySelector('.hero__visual');
        if (heroVisual) {
            heroVisual.addEventListener('mouseenter', () => {
                clearInterval(this.intervalId);
            });
            
            heroVisual.addEventListener('mouseleave', () => {
                this.startSlider();
            });
        }
    }
}

// Scroll animations
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.animate-on-scroll');
        this.observer = null;
        
        if (this.elements.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.elements.forEach(element => {
            this.observer.observe(element);
        });
    }
}

// Choice cards interaction
class ChoiceCards {
    constructor() {
        this.cards = document.querySelectorAll('.choice-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('click', (e) => {
                const choice = card.dataset.choice;
                this.handleChoice(choice, card);
            });
        });
    }
    
    handleChoice(choice, cardElement) {
        // Remove active class from all cards
        this.cards.forEach(card => card.classList.remove('choice-card--active'));
        
        // Add active class to clicked card
        cardElement.classList.add('choice-card--active');
        
        // Track choice
        if (typeof trackChoiceSelection === 'function') {
            trackChoiceSelection(choice);
        }
        
        // Show personalized message
        this.showPersonalizedMessage(choice);
        
        // Scroll to contact form after delay
        setTimeout(() => {
            const contactSection = document.getElementById('contacts');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 2000);
    }
    
    showPersonalizedMessage(choice) {
        const messages = {
            price: 'Отлично! Найдем для вас самое выгодное предложение на рынке.',
            speed: 'Понятно! Организуем быструю подачу техники на ваш объект.',
            quality: 'Замечательно! Подберем только проверенную технику в отличном состоянии.',
            service: 'Прекрасно! Обеспечим полное сопровождение на всех этапах работы.'
        };
        
        const message = messages[choice] || 'Спасибо за выбор! Свяжемся с вами в ближайшее время.';
        
        if (typeof showNotification === 'function') {
            showNotification(message, 'success');
        }
    }
}

// Smooth header behavior
class SmoothHeader {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScrollY = window.scrollY;
        
        if (this.header) {
            this.init();
        }
    }
    
    init() {
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            this.header.classList.add('header--scrolled');
        } else {
            this.header.classList.remove('header--scrolled');
        }
        
        // Hide header on scroll down, show on scroll up
        if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
            this.header.classList.add('header--hidden');
        } else {
            this.header.classList.remove('header--hidden');
        }
        
        this.lastScrollY = currentScrollY;
    }
}

// Form validation
class FormValidator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.errors = {};
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateForm();
        });
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }
    
    validateForm() {
        this.errors = {};
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            this.validateField(input);
        });
        
        if (Object.keys(this.errors).length === 0) {
            this.submitForm();
        } else {
            this.showErrors();
        }
    }
    
    validateField(field) {
        const value = field.value.trim();
        const name = field.name || field.id;
        
        // Required validation
        if (field.hasAttribute('required') && !value) {
            this.errors[name] = 'Это поле обязательно для заполнения';
            return;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.errors[name] = 'Введите корректный email адрес';
                return;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
            if (!phoneRegex.test(value)) {
                this.errors[name] = 'Введите корректный номер телефона';
                return;
            }
        }
        
        // Remove error if validation passed
        delete this.errors[name];
    }
    
    showErrors() {
        // Clear previous errors
        this.form.querySelectorAll('.field-error').forEach(error => error.remove());
        this.form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
        
        // Show new errors
        Object.keys(this.errors).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"], #${fieldName}`);
            if (field) {
                field.classList.add('error');
                
                const errorElement = document.createElement('div');
                errorElement.className = 'field-error';
                errorElement.textContent = this.errors[fieldName];
                
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            }
        });
        
        // Focus first error field
        const firstErrorField = this.form.querySelector('.error');
        if (firstErrorField) {
            firstErrorField.focus();
        }
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправляем...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Reset form
            this.form.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            if (typeof showNotification === 'function') {
                showNotification('Заявка отправлена! Мы свяжемся с вами.', 'success');
            }
            
            // Track form submission
            if (typeof trackFormSubmission === 'function') {
                trackFormSubmission(data);
            }
        }, 2000);
    }
}

// Initialize all animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    new HeroSlider();
    new ScrollAnimations();
    new ChoiceCards();
    new SmoothHeader();
    new FormValidator('#contactForm');
    
    // Add animate-on-scroll class to elements
    const elementsToAnimate = [
        '.choice-card',
        '.service-card',
        '.advantage-card',
        '.map-info',
        '.contact-info'
    ];
    
    elementsToAnimate.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.classList.add('animate-on-scroll');
        });
    });
});