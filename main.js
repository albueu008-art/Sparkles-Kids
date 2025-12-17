// Sparkles Kids Website - Main JavaScript
// Modern interactive functionality for kids entertainment center

class SparklesApp {
    constructor() {
        this.currentStep = 1;
        this.bookingData = {};
        this.reviews = this.loadReviews();
        this.currentImageIndex = 0;
        this.init();
    }

    init() {
        this.initAnimations();
        this.initCarousels();
        this.initForms();
        this.initGallery();
        this.initParticles();
        this.initScrollAnimations();
    }

    // Initialize animations using Anime.js
    initAnimations() {
        // Aurora background animation
        if (document.querySelector('.aurora-bg')) {
            anime({
                targets: '.aurora-bg',
                background: [
                    'linear-gradient(45deg, #FF8A80, #00695C, #B39DDB)',
                    'linear-gradient(45deg, #B39DDB, #FF8A80, #00695C)',
                    'linear-gradient(45deg, #00695C, #B39DDB, #FF8A80)'
                ],
                duration: 8000,
                loop: true,
                easing: 'easeInOutSine'
            });
        }

        // Button hover animations
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                anime({
                    targets: btn,
                    scale: 1.05,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });

            btn.addEventListener('mouseleave', () => {
                anime({
                    targets: btn,
                    scale: 1,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
        });

        // Card hover effects
        document.querySelectorAll('.service-card, .team-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    translateY: -8,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });

            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    translateY: 0,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
        });
    }

    // Initialize image carousels using Splide
    initCarousels() {
        // Hero image carousel
        if (document.querySelector('.hero-carousel')) {
            new Splide('.hero-carousel', {
                type: 'loop',
                autoplay: true,
                interval: 4000,
                speed: 1000,
                arrows: false,
                pagination: false,
                drag: false
            }).mount();
        }

        // Testimonials carousel
        if (document.querySelector('.testimonials-carousel')) {
            new Splide('.testimonials-carousel', {
                type: 'loop',
                autoplay: true,
                interval: 5000,
                speed: 800,
                arrows: true,
                pagination: true,
                perPage: 1,
                gap: '2rem'
            }).mount();
        }

        // Gallery carousel for homepage
        if (document.querySelector('.gallery-preview')) {
            new Splide('.gallery-preview', {
                type: 'loop',
                autoplay: true,
                interval: 3000,
                speed: 600,
                arrows: false,
                pagination: false,
                perPage: 4,
                perMove: 1,
                gap: '1rem',
                breakpoints: {
                    768: { perPage: 2 },
                    480: { perPage: 1 }
                }
            }).mount();
        }
    }

    // Initialize form functionality
    initForms() {
        // Reservation form
        const reservationForm = document.getElementById('reservationForm');
        if (reservationForm) {
            this.initReservationForm();
        }

        // Review form
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            this.initReviewForm();
        }

        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            this.initContactForm();
        }

        // Star rating system
        this.initStarRatings();
    }

    // Initialize reservation form with multi-step functionality
    initReservationForm() {
        const form = document.getElementById('reservationForm');
        if (!form) return;

        // Initialize price calculation triggers
        const guestCountInput = document.getElementById('guestCount');
        if (guestCountInput) {
            guestCountInput.addEventListener('input', () => this.updatePrice());
        }

        document.querySelectorAll('input[name="packageType"]').forEach(radio => {
            radio.addEventListener('change', () => this.updatePrice());
        });

        // Add form submission handler
        form.addEventListener('submit', (e) => {
            if (!this.validateForm(form)) {
                e.preventDefault();
                return;
            }
            // Update the final price before submission
            this.updatePrice();
        });

        // Package selection
        document.querySelectorAll('input[name="packageType"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.bookingData.package = radio.value;
                this.updatePrice();
            });
        });

        // Add-ons selection
        document.querySelectorAll('.addon-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updatePrice();
            });
        });

        // Date picker
        const dateInput = document.getElementById('partyDate');
        if (dateInput) {
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
            
            dateInput.addEventListener('change', () => {
                this.checkAvailability();
            });
        }

        // Form submission
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitReservation();
        });
    }

    // Initialize review form
    initReviewForm() {
        const form = document.getElementById('reviewForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitReview();
        });

        // Photo upload preview
        const photoInput = document.getElementById('reviewPhotos');
        if (photoInput) {
            photoInput.addEventListener('change', (e) => {
                this.previewPhotos(e.target.files);
            });
        }
    }

    // Initialize star rating system
    initStarRatings() {
        document.querySelectorAll('.star-rating').forEach(rating => {
            const stars = rating.querySelectorAll('.star');
            let currentRating = 0;

            stars.forEach((star, index) => {
                star.addEventListener('click', () => {
                    currentRating = index + 1;
                    this.setStarRating(stars, currentRating);
                    rating.dataset.rating = currentRating;
                });

                star.addEventListener('mouseenter', () => {
                    this.setStarRating(stars, index + 1);
                });
            });

            rating.addEventListener('mouseleave', () => {
                this.setStarRating(stars, currentRating);
            });
        });
    }

    // Initialize photo gallery
    initGallery() {
        if (!document.querySelector('.gallery-grid')) return;

        // Lightbox functionality
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                this.openLightbox(item.querySelector('img').src);
            });
        });

        // Category filtering
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.filterGallery(filter);
                
                // Update active button
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    // Initialize particle system using p5.js
    initParticles() {
        if (typeof p5 === 'undefined') return;

        const particleContainer = document.getElementById('particles');
        if (!particleContainer) return;

        new p5((p) => {
            let particles = [];

            p.setup = () => {
                const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
                canvas.parent('particles');
                canvas.style('position', 'fixed');
                canvas.style('top', '0');
                canvas.style('left', '0');
                canvas.style('z-index', '-1');
                canvas.style('pointer-events', 'none');

                // Create particles
                for (let i = 0; i < 50; i++) {
                    particles.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        size: p.random(2, 6),
                        speedX: p.random(-0.5, 0.5),
                        speedY: p.random(-0.5, 0.5),
                        opacity: p.random(0.3, 0.8)
                    });
                }
            };

            p.draw = () => {
                p.clear();
                
                particles.forEach(particle => {
                    p.fill(255, 255, 255, particle.opacity * 255);
                    p.noStroke();
                    p.circle(particle.x, particle.y, particle.size);

                    // Move particle
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;

                    // Wrap around edges
                    if (particle.x < 0) particle.x = p.width;
                    if (particle.x > p.width) particle.x = 0;
                    if (particle.y < 0) particle.y = p.height;
                    if (particle.y > p.height) particle.y = 0;
                });
            };

            p.windowResized = () => {
                p.resizeCanvas(window.innerWidth, window.innerHeight);
            };
        });
    }

    // Initialize scroll animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    anime({
                        targets: element,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 600,
                        easing: 'easeOutQuad',
                        delay: anime.stagger(100)
                    });

                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

    // Multi-step form navigation
    nextStep() {
        const currentStepEl = document.querySelector(`.booking-step[data-step="${this.currentStep}"]`);
        this.currentStep++;
        const nextStepEl = document.querySelector(`.booking-step[data-step="${this.currentStep}"]`);

        if (currentStepEl && nextStepEl) {
            anime({
                targets: currentStepEl,
                opacity: 0,
                translateX: -50,
                duration: 300,
                complete: () => {
                    currentStepEl.style.display = 'none';
                    nextStepEl.style.display = 'block';
                    nextStepEl.style.opacity = '0';
                    nextStepEl.style.transform = 'translateX(50px)';

                    anime({
                        targets: nextStepEl,
                        opacity: 1,
                        translateX: 0,
                        duration: 300
                    });
                }
            });
        }

        this.updateProgressBar();
    }

    prevStep() {
        const currentStepEl = document.querySelector(`.booking-step[data-step="${this.currentStep}"]`);
        this.currentStep--;
        const prevStepEl = document.querySelector(`.booking-step[data-step="${this.currentStep}"]`);

        if (currentStepEl && prevStepEl) {
            anime({
                targets: currentStepEl,
                opacity: 0,
                translateX: 50,
                duration: 300,
                complete: () => {
                    currentStepEl.style.display = 'none';
                    prevStepEl.style.display = 'block';
                    prevStepEl.style.opacity = '0';
                    prevStepEl.style.transform = 'translateX(-50px)';

                    anime({
                        targets: prevStepEl,
                        opacity: 1,
                        translateX: 0,
                        duration: 300
                    });
                }
            });
        }

        this.updateProgressBar();
    }

    updateProgressBar() {
        const progress = (this.currentStep / 4) * 100;
        const progressBar = document.querySelector('.progress-bar .progress-fill');
        if (progressBar) {
            anime({
                targets: progressBar,
                width: `${progress}%`,
                duration: 400,
                easing: 'easeOutQuad'
            });
        }
    }

    validateCurrentStep() {
        const currentStepEl = document.querySelector(`.booking-step[data-step="${this.currentStep}"]`);
        if (!currentStepEl) return true;

        const requiredFields = currentStepEl.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'Acest câmp este obligatoriu');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error text-red-500 text-sm mt-1';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
        field.classList.add('border-red-500');
    }

    clearFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.classList.remove('border-red-500');
    }

    updatePrice() {
        let totalPrice = 0;
        const selectedPackage = document.querySelector('input[name="packageType"]:checked + .package-card');
        const guestCount = parseInt(document.getElementById('guestCount')?.value) || 0;

        if (selectedPackage) {
            const basePrice = parseInt(selectedPackage.dataset.price) || 0;
            // For themed party, multiply by number of guests
            if (selectedPackage.dataset.package === 'themed') {
                totalPrice = basePrice * guestCount;
            } else {
                totalPrice = basePrice; // For anniversary package, it's a flat rate
            }
        }

        const priceDisplay = document.querySelector('.total-price');
        if (priceDisplay) {
            priceDisplay.textContent = `${totalPrice} RON`;
        }

        // Update hidden input for Formspree
        const priceInput = document.querySelector('input[name="calculatedPrice"]');
        if (priceInput) {
            priceInput.value = `${totalPrice} RON`;
        }
    }

    checkAvailability() {
        // Set minimum date to today
        const dateInput = document.getElementById('partyDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
    }

    submitReservation() {
        const form = document.getElementById('reservationForm');
        if (!form) return;

        // Add hidden input for the calculated price
        let priceInput = form.querySelector('input[name="calculatedPrice"]');
        if (!priceInput) {
            priceInput = document.createElement('input');
            priceInput.type = 'hidden';
            priceInput.name = 'calculatedPrice';
            form.appendChild(priceInput);
        }
        
        // Update the price one final time before submission
        this.updatePrice();

        // Add event listener for form submission success
        form.addEventListener('formspree:submit', () => {
            this.showSuccessModal('Rezervare trimisă cu succes! Vă vom contacta în curând.');
            form.reset();
        });
    }

    submitReview() {
        const formData = new FormData(document.getElementById('reviewForm'));
        const reviewData = Object.fromEntries(formData.entries());
        const rating = document.querySelector('.star-rating').dataset.rating;
        
        const review = {
            ...reviewData,
            rating: parseInt(rating) || 0,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            approved: false
        };

        const reviews = this.loadReviews();
        reviews.push(review);
        this.saveReviews(reviews);

        this.showSuccessModal('Recenzia a fost trimisă și va fi publicată după verificare.');
        document.getElementById('reviewForm').reset();
    }

    setStarRating(stars, rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('text-yellow-400');
                star.classList.remove('text-gray-300');
            } else {
                star.classList.add('text-gray-300');
                star.classList.remove('text-yellow-400');
            }
        });
    }

    openLightbox(imageSrc) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50';
        lightbox.innerHTML = `
            <div class="relative max-w-4xl max-h-full p-4">
                <img src="${imageSrc}" alt="" class="max-w-full max-h-full object-contain">
                <button class="close-lightbox absolute top-4 right-4 text-white text-2xl hover:text-gray-300">&times;</button>
            </div>
        `;

        document.body.appendChild(lightbox);

        // Close on click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('close-lightbox')) {
                lightbox.remove();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                lightbox.remove();
            }
        });
    }

    filterGallery(filter) {
        const items = document.querySelectorAll('.gallery-item');
        
        items.forEach(item => {
            const category = item.dataset.category;
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                anime({
                    targets: item,
                    opacity: [0, 1],
                    scale: [0.8, 1],
                    duration: 300
                });
            } else {
                anime({
                    targets: item,
                    opacity: 0,
                    scale: 0.8,
                    duration: 200,
                    complete: () => {
                        item.style.display = 'none';
                    }
                });
            }
        });
    }

    showSuccessModal(message) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
                <div class="text-green-500 text-6xl mb-4">✓</div>
                <h3 class="text-xl font-bold mb-4">Succes!</h3>
                <p class="text-gray-600 mb-6">${message}</p>
                <button class="btn-primary px-6 py-2 rounded-lg">Închide</button>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('button').addEventListener('click', () => {
            modal.remove();
        });

        setTimeout(() => {
            modal.remove();
        }, 5000);
    }

    loadReviews() {
        return JSON.parse(localStorage.getItem('reviews') || '[]');
    }

    saveReviews(reviews) {
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                this.showFieldError(field, 'Acest câmp este obligatoriu');
            } else {
                this.clearFieldError(field);
            }
        });

        // Check if a package is selected
        const packageSelected = form.querySelector('input[name="packageType"]:checked');
        if (!packageSelected) {
            isValid = false;
            const packageSection = form.querySelector('.package-selection');
            if (packageSection) {
                this.showFieldError(packageSection, 'Vă rugăm să selectați un tip de petrecere');
            }
        }

        return isValid;
    }

    // Utility functions
    previewPhotos(files) {
        const preview = document.getElementById('photoPreview');
        if (!preview) return;

        preview.innerHTML = '';
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.className = 'w-20 h-20 object-cover rounded-lg';
                preview.appendChild(img);
            }
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sparklesApp = new SparklesApp();
});

// Handle page visibility for animations
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        anime.running.forEach(animation => animation.pause());
    } else {
        // Resume animations when page is visible
        anime.running.forEach(animation => animation.play());
    }
});