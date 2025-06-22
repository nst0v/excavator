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