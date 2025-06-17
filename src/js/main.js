// Main JavaScript functionality
(function() {
    'use strict';

    // Global variables
    let isLoading = false;
    let notifications = [];

    // Utility functions
    const utils = {
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        formatPhone: function(phone) {
            const cleaned = phone.replace(/\D/g, '');
            if (cleaned.length === 11 && cleaned.startsWith('7')) {
                return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
            }
            return phone;
        },

        validateEmail: function(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
    };

    // Notification system
    const NotificationManager = {
        create: function(message, type = 'info', duration = 5000) {
            const notification = document.createElement('div');
            notification.className = `notification notification--${type}`;
            
            const icons = {
                success: '✅',
                error: '❌',
                warning: '⚠️',
                info: 'ℹ️'
            };
            
            notification.innerHTML = `
                <div class="notification__content">
                    <span class="notification__icon">${icons[type] || icons.info}</span>
                    <span class="notification__text">${message}</span>
                    <button class="notification__close" type="button">×</button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => notification.classList.add('show'), 100);
            
            // Auto hide
            const autoHide = setTimeout(() => {
                this.remove(notification);
            }, duration);
            
            // Manual close
            const closeBtn = notification.querySelector('.notification__close');
            closeBtn.addEventListener('click', () => {
                clearTimeout(autoHide);
                this.remove(notification);
            });
            
            notifications.push(notification);
            return notification;
        },
        
        remove: function(notification) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                const index = notifications.indexOf(notification);
                if (index > -1) {
                    notifications.splice(index, 1);
                }
            }, 300);
        },
        
        clear: function() {
            notifications.forEach(notification => this.remove(notification));
        }
    };

    // Modal system
    const ModalManager = {
        current: null,
        
        open: function(content, options = {}) {
            this.close(); // Close any existing modal
            
            const modal = document.createElement('div');
            modal.className = 'modal';
            
            modal.innerHTML = `
                <div class="modal__content">
                    <div class="modal__header">
                        <h3 class="modal__title">${options.title || 'Модальное окно'}</h3>
                        <button class="modal__close" type="button">×</button>
                    </div>
                    <div class="modal__body">
                        ${content}
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            // Show modal
            setTimeout(() => modal.classList.add('show'), 100);
            
            // Close handlers
            const closeBtn = modal.querySelector('.modal__close');
            closeBtn.addEventListener('click', () => this.close());
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.close();
                }
            });
            
            // ESC key handler
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    this.close();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
            
            this.current = modal;
            return modal;
        },
        
        close: function() {
            if (this.current) {
                this.current.classList.remove('show');
                setTimeout(() => {
                    if (this.current && this.current.parentNode) {
                        this.current.parentNode.removeChild(this.current);
                    }
                    document.body.style.overflow = '';
                    this.current = null;
                }, 300);
            }
        }
    };

    // Calculator functionality
    const Calculator = {
        rates: {
            excavator: { base: 2500, hourly: 1200 },
            truck: { base: 2000, hourly: 800 },
            crane: { base: 4000, hourly: 2000 },
            other: { base: 3000, hourly: 1500 }
        },
        
        calculate: function(type, hours, distance = 0) {
            const rate = this.rates[type] || this.rates.other;
            const basePrice = rate.base;
            const workPrice = rate.hourly * hours;
            const deliveryPrice = distance * 50; // 50 руб за км
            
            return {
                base: basePrice,
                work: workPrice,
                delivery: deliveryPrice,
                total: basePrice + workPrice + deliveryPrice
            };
        },
        
        showCalculator: function() {
            const content = `
                <form class="calculator__form" id="calculatorForm">
                    <h3 class="calculator__title">Калькулятор стоимости</h3>
                    
                    <div class="calculator__row">
                        <select name="type" class="form-select" required>
                            <option value="">Выберите тип техники</option>
                            <option value="excavator">Экскаватор</option>
                            <option value="truck">Самосвал</option>
                            <option value="crane">Кран</option>
                            <option value="other">Другое</option>
                        </select>
                        
                        <input type="number" name="hours" class="form-input" placeholder="Количество часов" min="1" required>
                    </div>
                    
                    <div class="calculator__row">
                        <input type="number" name="distance" class="form-input" placeholder="Расстояние доставки (км)" min="0" value="0">
                        
                        <input type="date" name="date" class="form-input" required>
                    </div>
                    
                    <button type="submit" class="btn btn--primary btn--full">Рассчитать стоимость</button>
                    
                    <div class="calculator__result" id="calculatorResult" style="display: none;">
                        <div class="calculator__result-title">Предварительная стоимость:</div>
                        <div class="calculator__result-price" id="totalPrice">0 ₽</div>
                        <div class="calculator__result-note">
                            * Окончательная стоимость может отличаться в зависимости от условий работы
                        </div>
                    </div>
                </form>
            `;
            
            const modal = ModalManager.open(content, { title: 'Калькулятор стоимости аренды' });
            
            const form = modal.querySelector('#calculatorForm');
            const result = modal.querySelector('#calculatorResult');
            const totalPrice = modal.querySelector('#totalPrice');
            
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const type = formData.get('type');
                const hours = parseInt(formData.get('hours'));
                const distance = parseInt(formData.get('distance')) || 0;
                
                const calculation = this.calculate(type, hours, distance);
                
                totalPrice.textContent = `${calculation.total.toLocaleString()} ₽`;
                result.style.display = 'block';
                
                // Track calculation
                if (typeof trackCalculation === 'function') {
                    trackCalculation({ type, hours, distance, total: calculation.total });
                }
            });
        }
    };

    // Phone formatting
    const PhoneFormatter = {
        init: function() {
            const phoneInputs = document.querySelectorAll('input[type="tel"]');
            phoneInputs.forEach(input => {
                input.addEventListener('input', this.formatInput.bind(this));
                input.addEventListener('keydown', this.handleKeydown.bind(this));
            });
        },
        
        formatInput: function(e) {
            const input = e.target;
            let value = input.value.replace(/\D/g, '');
            
            if (value.startsWith('8')) {
                value = '7' + value.slice(1);
            }
            
            if (value.startsWith('7') && value.length <= 11) {
                let formatted = '+7';
                if (value.length > 1) {
                    formatted += ' (' + value.slice(1, 4);
                }
                if (value.length >= 5) {
                    formatted += ') ' + value.slice(4, 7);
                }
                if (value.length >= 8) {
                    formatted += '-' + value.slice(7, 9);
                }
                if (value.length >= 10) {
                    formatted += '-' + value.slice(9, 11);
                }
                input.value = formatted;
            }
        },
        
        handleKeydown: function(e) {
            // Allow backspace, delete, tab, escape, enter
            if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true)) {
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        }
    };

    // Smooth scrolling for anchor links
    const SmoothScroll = {
        init: function() {
            const links = document.querySelectorAll('a[href^="#"]');
            links.forEach(link => {
                link.addEventListener('click', this.handleClick.bind(this));
            });
        },
        
        handleClick: function(e) {
            e.preventDefault();
            const href = e.currentTarget.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    };

    // Back to top button
    const BackToTop = {
        button: null,
        
        init: function() {
            this.createButton();
            this.addEventListeners();
        },
        
        createButton: function() {
            this.button = document.createElement('button');
            this.button.className = 'back-to-top';
            this.button.innerHTML = '↑';
            this.button.setAttribute('aria-label', 'Наверх');
            document.body.appendChild(this.button);
        },
        
        addEventListeners: function() {
            window.addEventListener('scroll', utils.throttle(() => {
                if (window.pageYOffset > 300) {
                    this.button.classList.add('show');
                } else {
                    this.button.classList.remove('show');
                }
            }, 100));
            
            this.button.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    };

    // FAQ functionality
    const FAQ = {
        init: function() {
            const faqItems = document.querySelectorAll('.faq__item');
            faqItems.forEach(item => {
                const question = item.querySelector('.faq__question');
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all items
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });
                    
                    // Open clicked item if it wasn't active
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            });
        }
    };

    // Global functions for external use
    window.showNotification = function(message, type, duration) {
        return NotificationManager.create(message, type, duration);
    };

    window.showModal = function(content, options) {
        return ModalManager.open(content, options);
    };

    window.showCalculator = function() {
        Calculator.showCalculator();
    };

    window.trackChoiceSelection = function(choice) {
        console.log('Choice selected:', choice);
        // Here you can add analytics tracking
    };

    window.trackFormSubmission = function(data) {
        console.log('Form submitted:', data);
        // Here you can add analytics tracking
    };

    window.trackCalculation = function(data) {
        console.log('Calculation performed:', data);
        // Here you can add analytics tracking
    };

    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize core functionality
        PhoneFormatter.init();
        SmoothScroll.init();
        BackToTop.init();
        FAQ.init();
        
        // Button event handlers
        const orderBtn = document.getElementById('orderBtn');
        const calculateBtn = document.getElementById('calculateBtn');
        
        if (orderBtn) {
            orderBtn.addEventListener('click', () => {
                const contactSection = document.getElementById('contacts');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                Calculator.showCalculator();
            });
        }
        
        // Add loading states to forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn && !submitBtn.disabled) {
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;
                    
                    // Remove loading state after form processing
                    setTimeout(() => {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }, 2000);
                }
            });
        });
        
        // Initialize lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
        
        // Performance optimization: preload critical resources
        const preloadLinks = [
            { href: '/dist/css/main.css', as: 'style' },
            { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', as: 'style' }
        ];
        
        preloadLinks.forEach(link => {
            const linkElement = document.createElement('link');
            linkElement.rel = 'preload';
            linkElement.href = link.href;
            linkElement.as = link.as;
            document.head.appendChild(linkElement);
        });
        
        // Add error handling for images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', function() {
                this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect fill="%23f0f0f0" width="400" height="300"/><text x="200" y="150" text-anchor="middle" fill="%23999" font-size="16" font-family="Arial">Изображение недоступно</text></svg>';
            });
        });
        
        // Initialize service worker for offline functionality
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
        
        // Add keyboard navigation support
        document.addEventListener('keydown', function(e) {
            // ESC key closes modals
            if (e.key === 'Escape') {
                ModalManager.close();
            }
            
            // Enter key on choice cards
            if (e.key === 'Enter' && e.target.classList.contains('choice-card')) {
                e.target.click();
            }
        });
        
        // Add focus management for accessibility
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.modal.show');
                if (modal) {
                    const focusableContent = modal.querySelectorAll(focusableElements);
                    const firstFocusableElement = focusableContent[0];
                    const lastFocusableElement = focusableContent[focusableContent.length - 1];
                    
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                            lastFocusableElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusableElement) {
                            firstFocusableElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            }
        });
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, pause animations
            document.body.classList.add('page-hidden');
        } else {
            // Page is visible, resume animations
            document.body.classList.remove('page-hidden');
        }
    });

    // Handle online/offline status
    window.addEventListener('online', function() {
        NotificationManager.create('Соединение восстановлено', 'success', 3000);
    });

    window.addEventListener('offline', function() {
        NotificationManager.create('Нет соединения с интернетом', 'warning', 5000);
    });

})();