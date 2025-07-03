class SpezzApp {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.isAnimating = false;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 секунд
        
        // Для карусели оборудования
        this.equipmentCarousel = {
            track: null,
            isAnimating: false,
            currentTranslate: 0,
            startPos: 0,
            isDragging: false,
            animationId: null
        };
        
        this.init();
    }

    init() {
        this.initScrollAnimations();
        this.initEquipmentIcons();
        this.initForms();
        this.initHeader();
        this.initModal();
        this.initHeroSlider();
        this.initEquipmentCarousel();
    }

    initEquipmentCarousel() {
        const track = document.getElementById('equipmentTrack');
        if (!track) return;

        this.equipmentCarousel.track = track;
        
        // Останавливаем CSS анимацию
        const groups = track.querySelectorAll('.equipment-icons__group');
        groups.forEach(group => {
            group.style.animationPlayState = 'paused';
        });

        // Инициализируем позицию
        this.equipmentCarousel.currentTranslate = 0;
        this.updateCarouselPosition();

        // Добавляем обработчики событий
        this.addCarouselEventListeners();
        
        // Запускаем автопрокрутку
        this.startEquipmentAutoScroll();
    }

    addCarouselEventListeners() {
        const track = this.equipmentCarousel.track;
        
        // Touch события
        track.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        track.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        track.addEventListener('touchend', this.handleTouchEnd.bind(this));

        // Mouse события для десктопа
        track.addEventListener('mousedown', this.handleMouseDown.bind(this));
        track.addEventListener('mousemove', this.handleMouseMove.bind(this));
        track.addEventListener('mouseup', this.handleMouseUp.bind(this));
        track.addEventListener('mouseleave', this.handleMouseUp.bind(this));

        // Предотвращаем выделение текста
        track.addEventListener('selectstart', (e) => e.preventDefault());
        
        // Останавливаем автопрокрутку при взаимодействии
        track.addEventListener('mouseenter', () => this.pauseEquipmentAutoScroll());
        track.addEventListener('mouseleave', () => this.startEquipmentAutoScroll());
    }

    handleTouchStart(e) {
        this.equipmentCarousel.isDragging = true;
        this.equipmentCarousel.startPos = e.touches[0].clientX;
        this.pauseEquipmentAutoScroll();
        
        // Останавливаем текущую анимацию
        if (this.equipmentCarousel.animationId) {
            cancelAnimationFrame(this.equipmentCarousel.animationId);
        }
    }

    handleTouchMove(e) {
        if (!this.equipmentCarousel.isDragging) return;
        
        e.preventDefault();
        const currentPosition = e.touches[0].clientX;
        const diff = currentPosition - this.equipmentCarousel.startPos;
        
        this.equipmentCarousel.currentTranslate += diff * 0.8; // Коэффициент чувствительности
        this.equipmentCarousel.startPos = currentPosition;
        
        this.updateCarouselPosition();
    }

    handleTouchEnd() {
        this.equipmentCarousel.isDragging = false;
        this.checkCarouselBounds();
        this.startEquipmentAutoScroll();
    }

    handleMouseDown(e) {
        this.equipmentCarousel.isDragging = true;
        this.equipmentCarousel.startPos = e.clientX;
        this.pauseEquipmentAutoScroll();
        
        if (this.equipmentCarousel.animationId) {
            cancelAnimationFrame(this.equipmentCarousel.animationId);
        }
    }

    handleMouseMove(e) {
        if (!this.equipmentCarousel.isDragging) return;
        
        e.preventDefault();
        const currentPosition = e.clientX;
        const diff = currentPosition - this.equipmentCarousel.startPos;
        
        this.equipmentCarousel.currentTranslate += diff * 0.8;
        this.equipmentCarousel.startPos = currentPosition;
        
        this.updateCarouselPosition();
    }

    handleMouseUp() {
        this.equipmentCarousel.isDragging = false;
        this.checkCarouselBounds();
        this.startEquipmentAutoScroll();
    }

    updateCarouselPosition() {
        const track = this.equipmentCarousel.track;
        if (!track) return;

        track.style.transform = `translateX(${this.equipmentCarousel.currentTranslate}px)`;
    }

    checkCarouselBounds() {
        const track = this.equipmentCarousel.track;
        if (!track) return;

        const firstGroup = track.querySelector('.equipment-icons__group');
        if (!firstGroup) return;

        const groupWidth = firstGroup.offsetWidth + 20; // 20px - это gap между группами
        
        // Если прокрутили слишком далеко влево (показываем вторую группу)
        if (this.equipmentCarousel.currentTranslate <= -groupWidth) {
            this.equipmentCarousel.currentTranslate += groupWidth;
        }
        
        // Если прокрутили слишком далеко вправо
        if (this.equipmentCarousel.currentTranslate > 0) {
            this.equipmentCarousel.currentTranslate -= groupWidth;
        }

        // Плавно возвращаем в правильную позицию
        this.animateCarouselToPosition();
    }

    animateCarouselToPosition() {
        const track = this.equipmentCarousel.track;
        if (!track) return;

        const animate = () => {
            track.style.transform = `translateX(${this.equipmentCarousel.currentTranslate}px)`;
        };

        // Используем CSS transition для плавности
        track.style.transition = 'transform 0.3s ease-out';
        animate();
        
        setTimeout(() => {
            track.style.transition = '';
        }, 300);
    }

    startEquipmentAutoScroll() {
        this.pauseEquipmentAutoScroll();
        
        const autoScroll = () => {
            if (!this.equipmentCarousel.isDragging) {
                this.equipmentCarousel.currentTranslate -= 0.3; // Скорость автопрокрутки
                this.updateCarouselPosition();
                this.checkCarouselBounds();
            }
            this.equipmentCarousel.animationId = requestAnimationFrame(autoScroll);
        };
        
        this.equipmentCarousel.animationId = requestAnimationFrame(autoScroll);
    }

    pauseEquipmentAutoScroll() {
        if (this.equipmentCarousel.animationId) {
            cancelAnimationFrame(this.equipmentCarousel.animationId);
            this.equipmentCarousel.animationId = null;
        }
    }

    initHeroSlider() {
        // Данные для слайдов
        this.slides = [
            {
                title: "1500+ единиц техники",
                text: "В моей базе более <strong>1500 единиц</strong> техники<br>С каждым владельцем я знаком лично."
            },
            {
                title: "Лучшие цены",
                text: "Договорюсь по лучшей цене за вас<br>Я беру себе <strong>5-10%</strong> от стоимости заказа."
            },
            {
                title: "Для бизнеса",
                text: "Предлагаю <strong>лучшие цены</strong> для бизнеса<br>Всю технику вы оплачиваете на один счёт."
            },
            {
                title: "Замена техники",
                text: "Я могу <strong>подменить технику</strong> если она сломается<br>Есть собственный бульдозер и кое что еще."
            },
            {
                title: "Работа с НДС",
                text: "Я работаю <strong>с НДС</strong> (от 10 смен)<br>Есть скидка на ГСМ и строительные материалы."
            }
        ];

        this.createHeroSlider();
        this.initSliderControls();
        this.startAutoplay();
    }

    createHeroSlider() {
        const heroContent = document.querySelector('.hero__content');
        if (!heroContent) return;

        // Создаем структуру слайдера
        const sliderHTML = `
            <h1 class="hero__title">
                Надежный диспетчер
                <span class="hero__title-accent">спецтехники в Крыму</span>
            </h1>
            
            <div class="hero__main-container">
                <div class="hero__background">
                    <img src="images/man.png" alt="Спецтехника в работе" class="hero__background-image">
                </div>
                
                <div class="hero__advantages-stack">
                    ${this.slides.map((slide, index) => `
                        <div class="hero__advantage-card ${index === 0 ? 'active' : ''}" data-slide="${index}">
                            <div class="hero__advantage-content">
                                <h3 class="hero__advantage-title">${slide.title}</h3>
                                <p class="hero__advantage-text">${slide.text}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="hero__navigation">
                    <button class="hero__nav-btn hero__nav-btn--prev" id="prevBtn">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                        </svg>
                    </button>
                    <button class="hero__nav-btn hero__nav-btn--next" id="nextBtn">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="hero__progress-indicators">
                ${this.slides.map((_, index) => `
                    <div class="hero__progress-dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></div>
                `).join('')}
            </div>
            
            <div class="hero__actions">
                <button class="btn btn--primary" id="orderBtn">
                    Заказать технику
                </button>
                <button class="btn btn--secondary" id="calculateBtn">
                    Рассчитать стоимость
                </button>
            </div>
        `;

        heroContent.innerHTML = sliderHTML;
    }

    initSliderControls() {
        // Навигационные кнопки
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Индикаторы прогресса
        const progressDots = document.querySelectorAll('.hero__progress-dot');
        progressDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Карточки (клик для перехода)
        const cards = document.querySelectorAll('.hero__advantage-card');
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (index !== this.currentSlide) {
                    this.goToSlide(index);
                }
            });
        });

        // Пауза автопроигрывания при наведении
        const heroContainer = document.querySelector('.hero__main-container');
        if (heroContainer) {
            heroContainer.addEventListener('mouseenter', () => this.pauseAutoplay());
            heroContainer.addEventListener('mouseleave', () => this.startAutoplay());
        }

        // Управление с клавиатуры
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });

        // Touch/swipe поддержка
        this.initTouchControls();
    }

    initTouchControls() {
        const container = document.querySelector('.hero__advantages-stack');
        if (!container) return;

        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe();
        });

        const handleSwipe = () => {
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const minSwipeDistance = 50;

            // Проверяем, что это горизонтальный свайп
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            }
        };

        this.handleSwipe = handleSwipe;
    }

    nextSlide() {
        if (this.isAnimating) return;
        
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        if (this.isAnimating) return;
        
        const prevIndex = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.goToSlide(prevIndex);
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;

        this.isAnimating = true;
        const cards = document.querySelectorAll('.hero__advantage-card');
        const dots = document.querySelectorAll('.hero__progress-dot');

        // Убираем активные классы
        cards.forEach(card => {
            card.classList.remove('active', 'next', 'prev');
        });
        
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Устанавливаем новые классы
        cards[index].classList.add('active');
        dots[index].classList.add('active');

        // Устанавливаем соседние карточки
        const nextIndex = (index + 1) % this.slides.length;
        const prevIndex = index === 0 ? this.slides.length - 1 : index - 1;

        if (cards[nextIndex]) {
            cards[nextIndex].classList.add('next');
        }
        
        if (cards[prevIndex]) {
            cards[prevIndex].classList.add('prev');
        }

        this.currentSlide = index;

        // Разблокируем анимацию через время перехода
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);

        // Перезапускаем автопроигрывание
        this.restartAutoplay();
    }

    startAutoplay() {
        this.pauseAutoplay(); // Очищаем предыдущий интервал
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }

    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    restartAutoplay() {
        this.pauseAutoplay();
        setTimeout(() => {
            this.startAutoplay();
        }, 1000); // Небольшая задержка после ручного переключения
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
        // ИСПРАВЛЕНИЕ: Обрабатываем клики на ВСЕХ иконках оборудования (включая дублированные)
        const equipmentIcons = document.querySelectorAll('.equipment-icon');
        
        equipmentIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                // Предотвращаем всплытие события, чтобы не мешать drag/swipe
                e.stopPropagation();
                
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
                    // Находим соответствующий option по значению
                    const option = selectElement.querySelector(`option[value="${equipmentType}"]`);
                    if (option) {
                        selectElement.value = equipmentType;
                    } else {
                        // Если точного совпадения нет, выбираем "Другое"
                        const otherOption = selectElement.querySelector('option[value="other"]');
                        if (otherOption) {
                            selectElement.value = 'other';
                        }
                    }
                    
                    // Добавляем небольшую задержку перед фокусом
                    setTimeout(() => {
                        selectElement.focus();
                    }, 500);
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
        document.addEventListener('click', (e) => {
            if (e.target.id === 'orderBtn') {
                const contactForm = document.getElementById('contactForm');
                if (contactForm) {
                    contactForm.scrollIntoView({ 
                        behavior: 'smooth' 
                    });
                }
            }
            
            if (e.target.id === 'calculateBtn') {
                this.showCalculatorModal();
            }
        });
    }

    initModal() {
        // Создаем модальное окно для калькулятора (повторяет полную форму обратной связи)
        const modalHTML = `
            <div class="modal" id="calculatorModal">
                <div class="modal__content">
                    <div class="modal__header">
                        <h3 class="modal__title">Рассчитать стоимость</h3>
                        <button class="modal__close" type="button">&times;</button>
                    </div>
                    <div class="modal__body">
                        <p class="modal__text">
                            Заполните форму и мы рассчитаем стоимость для вашего проекта.
                        </p>
                        <form class="calculator-form" id="calculatorForm">
                            <input type="text" placeholder="Ваше имя" class="form-input" required>
                            <input type="tel" placeholder="Телефон" class="form-input" required>
                            <input type="text" placeholder="Место проведения работ" class="form-input" required>
                            <select class="form-select" required>
                                <option value="">Тип техники</option>
                                <option value="excavator">Экскаватор</option>
                                <option value="truck">Самосвал</option>
                                <option value="crane">Кран</option>
                                <option value="bulldozer">Бульдозер</option>
                                <option value="loader">Погрузчик</option>
                                <option value="mixer">Автомиксер</option>
                                <option value="manipulator">Манипулятор</option>
                                <option value="miniloader">Минипогрузчик</option>
                                <option value="asphalt-roller">Каток</option>
                                <option value="tral">Трал</option>
                                <option value="yamobur">Ямобур</option>
                                <option value="other">Другое</option>
                            </select>
                            <select class="form-select" required>
                                <option value="">Желаемая дата</option>
                                <option value="today">Сегодня</option>
                                <option value="tomorrow">Завтра</option>
                                <option value="this-week">На этой неделе</option>
                                <option value="next-week">На следующей неделе</option>
                            </select>
                            <textarea placeholder="Объём работ" class="form-textarea" required></textarea>
                            <button type="submit" class="btn btn--primary btn--full">Рассчитать стоимость</button>
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
        
        // Пауза автопроигрывания при открытии модального окна
        this.pauseAutoplay();
        
        // Фокус на поле имени
        setTimeout(() => {
            const nameInput = modal.querySelector('input[type="text"]');
            if (nameInput) nameInput.focus();
        }, 300);
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Возобновляем автопроигрывание при закрытии модального окна
        this.startAutoplay();
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
            name: formData.get('name') || form.querySelector('input[type="text"]').value,
            phone: formData.get('phone') || form.querySelector('input[type="tel"]').value,
            location: formData.get('location') || form.querySelectorAll('input[type="text"]')[1].value,
            equipment: form.querySelectorAll('select')[0].value,
            date: form.querySelectorAll('select')[1].value,
            volume: formData.get('volume') || form.querySelector('textarea').value
        };
        
        // Скрываем модальное окно
        this.hideModal('calculatorModal');
        
        // Показываем уведомление
        this.showNotification('Спасибо! Мы рассчитаем стоимость и перезвоним в течение 30 минут.', 'success');
        
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

    // Метод для остановки автопроигрывания при уходе со страницы
    destroy() {
        this.pauseAutoplay();
        this.pauseEquipmentAutoScroll();
    }
}

// Инициализация приложения
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new SpezzApp();
});

// Остановка автопроигрывания при уходе со страницы
window.addEventListener('beforeunload', () => {
    if (app) {
        app.destroy();
    }
});

// Пауза при потере фокуса страницы
document.addEventListener('visibilitychange', () => {
    if (app) {
        if (document.hidden) {
            app.pauseAutoplay();
            app.pauseEquipmentAutoScroll();
        } else {
            app.startAutoplay();
            app.startEquipmentAutoScroll();
        }
    }
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

// SEO Toggle функциональность
document.addEventListener('DOMContentLoaded', function() {
    const seoToggle = document.getElementById('seoToggle');
    const seoSection = document.getElementById('seoSection');
    
    if (seoToggle && seoSection) {
        seoToggle.addEventListener('click', function() {
            if (seoSection.style.display === 'none' || seoSection.style.display === '') {
                seoSection.style.display = 'block';
                seoSection.classList.add('show');
                seoToggle.textContent = '×';
                seoToggle.title = 'Скрыть дополнительную информацию';
            } else {
                seoSection.style.display = 'none';
                seoSection.classList.remove('show');
                seoToggle.textContent = '.';
                seoToggle.title = 'Дополнительная информация';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация карты с кастомными иконками
    if (typeof ymaps !== 'undefined') {
        ymaps.ready(function () {
            var myMap = new ymaps.Map('yandex-map', {
                center: [44.9572, 34.1108],
                zoom: 8,
                controls: ['zoomControl', 'fullscreenControl']
            });
            
            // Массив с данными о технике в разных городах
            var equipmentLocations = [
                // Симферополь
                {name: 'Симферополь', coords: [44.9572, 34.1108], equipment: 'excavator', count: '15+ экскаваторов'},
                {name: 'Симферополь', coords: [44.9672, 34.1208], equipment: 'truck', count: '25+ самосвалов'},
                {name: 'Симферополь', coords: [44.9472, 34.1008], equipment: 'crane', count: '8+ кранов'},
                
                // Севастополь
                {name: 'Севастополь', coords: [44.6054, 33.5221], equipment: 'bulldozer', count: '12+ бульдозеров'},
                {name: 'Севастополь', coords: [44.6154, 33.5321], equipment: 'loader', count: '20+ погрузчиков'},
                {name: 'Севастополь', coords: [44.5954, 33.5121], equipment: 'mixer', count: '10+ автомиксеров'},
                
                // Ялта
                {name: 'Ялта', coords: [44.4952, 34.1664], equipment: 'manipulator', count: '6+ манипуляторов'},
                {name: 'Ялта', coords: [44.5052, 34.1764], equipment: 'miniloader', count: '8+ минипогрузчиков'},
                
                // Евпатория
                {name: 'Евпатория', coords: [45.1983, 33.3669], equipment: 'asphalt-roller', count: '5+ катков'},
                {name: 'Евпатория', coords: [45.2083, 33.3769], equipment: 'excavator', count: '10+ экскаваторов'},
                {name: 'Евпатория', coords: [45.1883, 33.3569], equipment: 'truck', count: '18+ самосвалов'},
                
                // Керчь
                {name: 'Керчь', coords: [45.3606, 36.4706], equipment: 'tral', count: '4+ трала'},
                {name: 'Керчь', coords: [45.3706, 36.4806], equipment: 'yamobur', count: '3+ ямобура'},
                {name: 'Керчь', coords: [45.3506, 36.4606], equipment: 'crane', count: '7+ кранов'},
                
                // Феодосия
                {name: 'Феодосия', coords: [45.0308, 35.3828], equipment: 'loader', count: '15+ погрузчиков'},
                {name: 'Феодосия', coords: [45.0408, 35.3928], equipment: 'bulldozer', count: '8+ бульдозеров'},
                
                // Джанкой
                {name: 'Джанкой', coords: [45.7117, 34.3911], equipment: 'mixer', count: '6+ автомиксеров'},
                {name: 'Джанкой', coords: [45.7217, 34.4011], equipment: 'excavator', count: '12+ экскаваторов'},
                
                // Алушта
                {name: 'Алушта', coords: [44.6748, 34.4108], equipment: 'manipulator', count: '4+ манипулятора'},
                {name: 'Алушта', coords: [44.6848, 34.4208], equipment: 'truck', count: '8+ самосвалов'},
                
                // Бахчисарай
                {name: 'Бахчисарай', coords: [44.7539, 33.8578], equipment: 'miniloader', count: '6+ минипогрузчиков'},
                {name: 'Бахчисарай', coords: [44.7639, 33.8678], equipment: 'asphalt-roller', count: '3+ катка'},
                
                // Красноперекопск
                {name: 'Красноперекопск', coords: [45.9597, 33.7947], equipment: 'yamobur', count: '2+ ямобура'},
                {name: 'Красноперекопск', coords: [45.9697, 33.8047], equipment: 'tral', count: '3+ трала'},
                
                // Армянск
                {name: 'Армянск', coords: [46.1058, 33.6892], equipment: 'excavator', count: '8+ экскаваторов'},
                {name: 'Армянск', coords: [46.1158, 33.6992], equipment: 'loader', count: '10+ погрузчиков'},
                
                // Саки
                {name: 'Саки', coords: [45.1322, 33.6011], equipment: 'crane', count: '5+ кранов'},
                {name: 'Саки', coords: [45.1422, 33.6111], equipment: 'bulldozer', count: '4+ бульдозера'},
                
                // Белогорск
                {name: 'Белогорск', coords: [45.0561, 34.6014], equipment: 'truck', count: '12+ самосвалов'},
                {name: 'Белогорск', coords: [45.0661, 34.6114], equipment: 'mixer', count: '5+ автомиксеров'}
            ];
            
            // Создаем кастомные иконки для каждого типа техники
            equipmentLocations.forEach(function(location) {
                // Создаем кастомную иконку
                var customIcon = ymaps.templateLayoutFactory.createClass(
                    '<div class="custom-map-icon" style="' +
                    'width: 40px; height: 40px; ' +
                    'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); ' +
                    'border-radius: 50%; ' +
                    'display: flex; align-items: center; justify-content: center; ' +
                    'box-shadow: 0 4px 12px rgba(0,0,0,0.3); ' +
                    'border: 2px solid white; ' +
                    'position: relative; ' +
                    'cursor: pointer; ' +
                    'transition: transform 0.2s ease;' +
                    '">' +
                    '<img src="images/equipment/' + getEquipmentImage(location.equipment) + '" ' +
                    'style="width: 24px; height: 24px; filter: brightness(0) invert(1);" ' +
                    'alt="' + location.equipment + '">' +
                    '</div>',
                    {
                        build: function () {
                            customIcon.superclass.build.call(this);
                            var element = this.getParentElement().getElementsByClassName('custom-map-icon')[0];
                            
                            // Добавляем эффекты при наведении
                            element.addEventListener('mouseenter', function() {
                                element.style.transform = 'scale(1.1)';
                                element.style.zIndex = '1000';
                            });
                            
                            element.addEventListener('mouseleave', function() {
                                element.style.transform = 'scale(1)';
                                element.style.zIndex = 'auto';
                            });
                        }
                    }
                );
                
                var placemark = new ymaps.Placemark(location.coords, {
                    balloonContent: 
                        '<div style="padding: 10px; font-family: Inter, sans-serif;">' +
                        '<h4 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">' + location.name + '</h4>' +
                        '<p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">' + location.count + '</p>' +
                        '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">' +
                        '<img src="images/equipment/' + getEquipmentImage(location.equipment) + '" ' +
                        'style="width: 20px; height: 20px;" alt="' + location.equipment + '">' +
                        '<span style="color: #333; font-size: 14px;">' + getEquipmentName(location.equipment) + '</span>' +
                        '</div>' +
                        '<a href="tel:+79783210011" style="' +
                        'display: inline-block; padding: 8px 16px; ' +
                        'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); ' +
                        'color: white; text-decoration: none; border-radius: 6px; ' +
                        'font-size: 14px; font-weight: 500; ' +
                        'transition: opacity 0.2s ease;' +
                        '" onmouseover="this.style.opacity=0.9" onmouseout="this.style.opacity=1">' +
                        'Заказать технику' +
                        '</a>' +
                        '</div>',
                    hintContent: location.name + ' - ' + location.count
                }, {
                    iconLayout: customIcon,
                    iconShape: {
                        type: 'Circle',
                        coordinates: [0, 0],
                        radius: 20
                    }
                });
                
                myMap.geoObjects.add(placemark);
            });
            
            // Функция для получения имени файла изображения
            function getEquipmentImage(equipment) {
                const imageMap = {
                    'excavator': 'excavator.png',
                    'truck': 'truck.png',
                    'crane': 'crane.png',
                    'bulldozer': 'bulldozer.png',
                    'loader': 'loader.png',
                    'mixer': 'betonmixer.png',
                    'manipulator': 'manipulator.png',
                    'miniloader': 'miniloader.png',
                    'asphalt-roller': 'asphalt-roller.png',
                    'tral': 'tral.png',
                    'yamobur': 'yamobur.png'
                };
                return imageMap[equipment] || 'excavator.png';
            }
            
            // Функция для получения названия техники
            function getEquipmentName(equipment) {
                const nameMap = {
                    'excavator': 'Экскаваторы',
                    'truck': 'Самосвалы',
                    'crane': 'Краны',
                    'bulldozer': 'Бульдозеры',
                    'loader': 'Погрузчики',
                    'mixer': 'Автомиксеры',
                    'manipulator': 'Манипуляторы',
                    'miniloader': 'Минипогрузчики',
                    'asphalt-roller': 'Катки',
                    'tral': 'Тралы',
                    'yamobur': 'Ямобуры'
                };
                return nameMap[equipment] || 'Спецтехника';
            }
        });
    }
});