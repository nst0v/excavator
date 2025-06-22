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
                showNotification('Заявка отправлена! Свяжемся с вами в течение 15 минут.', 'success');
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
class SpezzApp {
    constructor() {
        this.init();
    }

    init() {
        this.initScrollAnimations();
        this.initEquipmentCarousel(); // Добавляем карусель
        this.initForms();
        this.initHeader();
        this.initModal();
    }

    initScrollAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        if (elements.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            elements.forEach(element => {
                observer.observe(element);
            });
        }
    }

    initEquipmentCarousel() {
        const track = document.getElementById('equipmentTrack');
        if (!track) return;

        // Сохраняем оригинальные элементы
        const originalItems = Array.from(track.children);
        
        // Создаем один полный набор дубликатов в правильном порядке
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            // Убираем возможность взаимодействия с клонами
            clone.style.pointerEvents = 'none';
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });

        // Обработка кликов только для оригинальных элементов
        originalItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const equipmentType = item.dataset.equipment;
                
                // Визуальная обратная связь
                item.style.transform = 'translateY(-2px) scale(0.95)';
                setTimeout(() => {
                    item.style.transform = '';
                }, 150);
                
                // Прокрутка к форме
                setTimeout(() => {
                    const contactForm = document.getElementById('contactForm');
                    if (contactForm) {
                        contactForm.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Заполнение формы
                        setTimeout(() => {
                            const selectElement = contactForm.querySelector('select[required]');
                            if (selectElement && equipmentType) {
                                const option = selectElement.querySelector(`option[value="${equipmentType}"]`);
                                if (option) {
                                    selectElement.value = equipmentType;
                                    // Подсветка выбранного поля
                                    selectElement.style.borderColor = '#FF6B35';
                                    setTimeout(() => {
                                        selectElement.style.borderColor = '';
                                    }, 2000);
                                }
                            }
                        }, 300);
                    }
                }, 200);
            });
        });
    }

    initForms() {
        // Форма обратного звонка
        const callbackForm = document.getElementById('callbackForm');
        if (callbackForm) {
            callbackForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const phone = callbackForm.querySelector('input[type="tel"]').value;
                
                if (phone) {
                    alert('Спасибо! Мы перезвоним вам в ближайшее время.');
                    callbackForm.reset();
                }
            });
        }

        // Основная форма контактов
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
                contactForm.reset();
            });
        }
    }

    initHeader() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.background = 'rgba(45, 52, 54, 0.98)';
            } else {
                header.style.background = 'rgba(45, 52, 54, 0.95)';
            }

            lastScrollY = currentScrollY;
        });
    }

    initModal() {
        // Кнопки для открытия модалов
        const orderBtn = document.getElementById('orderBtn');
        const calculateBtn = document.getElementById('calculateBtn');

        if (orderBtn) {
            orderBtn.addEventListener('click', () => {
                const contactForm = document.getElementById('contactForm');
                if (contactForm) {
                    contactForm.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }

        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                const contactForm = document.getElementById('contactForm');
                if (contactForm) {
                    contactForm.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new SpezzApp();
});
//# sourceMappingURL=main.js.map
