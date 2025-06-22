class SpezzApp {
    constructor() {
        this.init();
    }

    init() {
        this.initScrollAnimations();
        this.initEquipmentIcons();
        this.initForms();
        this.initHeader();
        this.initModal();
        this.initMobileTextRotation();
    }

    initMobileTextRotation() {
        const mobileTextCard = document.getElementById('mobileTextCard');
        
        if (!mobileTextCard || window.innerWidth > 992) {
            return;
        }
        
        const texts = [
            'В моей базе более <strong>1500 единиц</strong> техники<br>С каждым владельцем я знаком лично.',
            'Договорюсь по лучшей цене за вас<br>Я беру себе <strong>5-10%</strong> от стоимости заказа.',
            'Предлагаю <strong>лучшие цены</strong> для бизнеса<br>Всю технику вы оплачиваете на один счёт.',
            'Я могу <strong>подменить технику</strong> если она сломается<br>Есть собственный бульдозер и кое что еще.',
            'Я работаю <strong>с НДС</strong> (от 10 смен)<br>Есть скидка на ГСМ и строительные материалы.'
        ];
        
        let currentIndex = 0;
        
        const rotateText = () => {
            mobileTextCard.classList.add('fade-out');
            
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % texts.length;
                mobileTextCard.innerHTML = texts[currentIndex];
                mobileTextCard.classList.remove('fade-out');
                mobileTextCard.classList.add('fade-in');
                
                setTimeout(() => {
                    mobileTextCard.classList.remove('fade-in');
                }, 500);
            }, 250);
        };
        
        setInterval(rotateText, 4000);
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

    initEquipmentIcons() {
        const equipmentIcons = document.querySelectorAll('.equipment-icon');
        
        equipmentIcons.forEach(icon => {
            icon.addEventListener('click', () => {
                const contactForm = document.getElementById('contactForm');
                if (contactForm) {
                    contactForm.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                const equipmentType = icon.dataset.equipment;
                const selectElement = contactForm.querySelector('select[required]');
                if (selectElement && equipmentType) {
                    selectElement.value = equipmentType;
                    selectElement.focus();
                }
            });
        });
    }

    initForms() {
        // Форма обратного звонка
        const callbackForm = document.getElementById('callbackForm');
        if (callbackForm) {
            callbackForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCallbackForm(callbackForm);
            });
        }

        // Основная форма заявки
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });
        }

        // Кнопки в hero секции
        const orderBtn = document.getElementById('orderBtn');
        const calculateBtn = document.getElementById('calculateBtn');

        if (orderBtn) {
            orderBtn.addEventListener('click', () => {
                document.getElementById('contactForm').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
        }

        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                this.showCalculatorModal();
            });
        }
    }

    initModal() {
        // Создаем модальное окно для калькулятора
        const modalHTML = `
            <div class="modal" id="calculatorModal">
                <div class="modal__content">
                    <div class="modal__header">
                        <h3 class="modal__title">Расчет стоимости</h3>
                        <button class="modal__close" type="button">&times;</button>
                    </div>
                    <div class="modal__body">
                        <form class="calculator-form" id="calculatorForm">
                            <div class="calculator-form__row">
                                <select class="form-select" required>
                                    <option value="">Тип техники</option>
                                    <option value="excavator">Экскаватор</option>
                                    <option value="truck">Самосвал</option>
                                    <option value="crane">Кран</option>
                                    <option value="bulldozer">Бульдозер</option>
                                    <option value="loader">Погрузчик</option>
                                </select>
                                <input type="number" placeholder="Часов работы" class="form-input" min="1" required>
                            </div>
                            <input type="text" placeholder="Место работ" class="form-input" required>
                            <textarea placeholder="Описание работ" class="form-textarea" rows="3"></textarea>
                            <input type="tel" placeholder="Ваш телефон для расчета" class="form-input" required>
                            <button type="submit" class="btn btn--primary btn--full">Получить расчет</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Обработчики для модального окна
        const modal = document.getElementById('calculatorModal');
        const closeBtn = modal.querySelector('.modal__close');
        const form = document.getElementById('calculatorForm');
        
        closeBtn.addEventListener('click', () => {
            this.hideModal('calculatorModal');
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal('calculatorModal');
            }
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCalculatorForm(form);
        });
        
        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                this.hideModal('calculatorModal');
            }
        });
    }

    showCalculatorModal() {
        const modal = document.getElementById('calculatorModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Фокус на первое поле
        setTimeout(() => {
            const firstInput = modal.querySelector('.form-select');
            if (firstInput) firstInput.focus();
        }, 300);
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    handleCallbackForm(form) {
        const formData = new FormData(form);
        const phone = formData.get('phone') || form.querySelector('input[type="tel"]').value;
        
        // Показываем уведомление
        this.showNotification('Спасибо! Мы перезвоним вам в течение 15 минут.', 'success');
        
        // Очищаем форму
        form.reset();
        
        // Здесь можно добавить отправку данных на сервер
        console.log('Callback request:', { phone });
    }

    handleContactForm(form) {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name') || form.querySelector('input[type="text"]').value,
            phone: formData.get('phone') || form.querySelector('input[type="tel"]').value,
            location: formData.get('location') || form.querySelectorAll('input[type="text"]')[1].value,
            equipment: form.querySelectorAll('select')[0].value,
            date: form.querySelectorAll('select')[1].value,
            volume: formData.get('volume') || form.querySelector('textarea').value
        };
        
        // Показываем уведомление
        this.showNotification('Заявка отправлена! Мы свяжемся с вами в течение 30 минут.', 'success');
        
        // Очищаем форму
        form.reset();
        
        // Здесь можно добавить отправку данных на сервер
        console.log('Order request:', data);
    }

    handleCalculatorForm(form) {
        const formData = new FormData(form);
        const data = {
            equipment: form.querySelector('select').value,
            hours: form.querySelector('input[type="number"]').value,
            location: form.querySelector('input[type="text"]').value,
            description: form.querySelector('textarea').value,
            phone: form.querySelector('input[type="tel"]').value
        };
        
        // Скрываем модальное окно
        this.hideModal('calculatorModal');
        
        // Показываем уведомление
        this.showNotification('Спасибо за заявку! Мы рассчитаем стоимость и перезвоним в течение 30 минут.', 'success');
        
        // Очищаем форму
        form.reset();
        
        // Здесь можно добавить отправку данных на сервер
        console.log('Calculator request:', data);
    }

    showNotification(message, type = 'info') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <div class="notification__icon">
                    ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
                </div>
                <span class="notification__text">${message}</span>
                <button class="notification__close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Автоматически скрываем через 5 секунд
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
        
        // Обработчик закрытия
        notification.querySelector('.notification__close').addEventListener('click', () => {
            this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    initHeader() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Добавляем класс при прокрутке
            if (currentScrollY > 50) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
            
            lastScrollY = currentScrollY;
        });
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new SpezzApp();
});

// Дополнительные утилиты
class Utils {
    static formatPhone(phone) {
        // Форматирование телефона
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
        if (match) {
            return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
        }
        return phone;
    }

    static validatePhone(phone) {
        const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
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
    }
}

// Автоматическое форматирование телефонных номеров
document.addEventListener('DOMContentLoaded', () => {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
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
                e.target.value = formatted;
            }
        });
        
        input.addEventListener('keydown', (e) => {
            // Разрешаем: backspace, delete, tab, escape, enter
            if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
                // Разрешаем: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true) ||
                // Разрешаем: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
            }
            // Запрещаем все, кроме цифр
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    });
});