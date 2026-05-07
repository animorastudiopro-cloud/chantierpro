// Gestion des vidéos avec gestion d'erreurs améliorée
const videos = document.querySelectorAll(".video");

// Fonction de lecture vidéo avec gestion des erreurs
const playVideo = async (video) => {
    try {
        await video.play();
        video.classList.add("active");
    } catch (err) {
        console.warn("Lecture automatique impossible:", err);
        // Afficher un indicateur visuel que la vidéo nécessite une interaction
        showPlayButton(video);
    }
};

// Fonction pour afficher un bouton play personnalisé
const showPlayButton = (video) => {
    const parent = video.parentElement;
    if (!parent.querySelector('.video-play-btn')) {
        const playBtn = document.createElement('button');
        playBtn.className = 'video-play-btn';
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playBtn.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 81, 0, 0.8);
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            z-index: 10;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;
        playBtn.addEventListener('mouseenter', () => {
            playBtn.style.transform = 'translate(-50%, -50%) scale(1.1)';
            playBtn.style.background = '#e65c00';
        });
        playBtn.addEventListener('mouseleave', () => {
            playBtn.style.transform = 'translate(-50%, -50%) scale(1)';
            playBtn.style.background = 'rgba(255, 81, 0, 0.8)';
        });
        playBtn.addEventListener('click', () => {
            playVideo(video);
            playBtn.remove();
        });
        parent.style.position = 'relative';
        parent.appendChild(playBtn);
    }
};

// Lecture initiale des vidéos
videos.forEach(video => {
    playVideo(video);

    video.addEventListener("mouseenter", () => {
        videos.forEach(v => {
            v.pause();
            v.classList.remove("active");
        });

        playVideo(video);
    });
});

// Animation du footer au scroll
const footer = document.querySelector(".footer-container");

window.addEventListener("scroll", () => {
    const triggerBottom = window.innerHeight * 0.85;
    const footerTop = footer.getBoundingClientRect().top;

    if (footerTop < triggerBottom) {
        footer.classList.add("active");
    }
});

// Animation des compteurs statistiques
const animateNumbers = () => {
    const counters = document.querySelectorAll('.stat-number');

    const animateCounter = (counter) => {
        const targetText = counter.getAttribute('data-target');
        if (!targetText) return;

        const target = parseInt(targetText);
        let current = 0;
        const increment = target / 50;
        const suffix = counter.innerText.includes('%') ? '%' : '';

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                const displayValue = Math.ceil(current);
                counter.innerText = displayValue + (suffix ? (displayValue === 100 ? '%' : '') : '');
                if (displayValue === 100 && suffix) {
                    counter.innerText = '100%';
                }
                setTimeout(updateCounter, 30);
            } else {
                counter.innerText = target + (suffix ? (target === 100 ? '%' : '') : '');
            }
        };

        updateCounter();
    };

    counters.forEach(counter => {
        // Observer pour déclencher l'animation quand l'élément devient visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(counter);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
};

// Validation et gestion du formulaire de devis
const handleDevis = (event) => {
    event.preventDefault();

    const form = event.target;
    const nom = form.querySelector('#nom') || form.querySelector('input[placeholder="Nom complet"]');
    const telephone = form.querySelector('#telephone') || form.querySelector('input[placeholder="Téléphone"]');
    const email = form.querySelector('#email') || form.querySelector('input[placeholder="Email"]');
    const projet = form.querySelector('#projet') || form.querySelector('select');
    const message = form.querySelector('#message') || form.querySelector('textarea');

    // Validation
    if (!nom.value || nom.value.length < 2) {
        showNotification("Veuillez entrer un nom valide", "error");
        nom.focus();
        return false;
    }

    if (!telephone.value || telephone.value.length < 8) {
        showNotification("Veuillez entrer un numéro de téléphone valide", "error");
        telephone.focus();
        return false;
    }

    if (projet.value === "") {
        showNotification("Veuillez sélectionner un type de projet", "error");
        projet.focus();
        return false;
    }

    // Création du message pour WhatsApp
    const messageText = `Nouveau devis :
📋 Nom: ${nom.value}
📞 Téléphone: ${telephone.value}
✉️ Email: ${email.value || 'Non renseigné'}
🏗️ Projet: ${projet.value}
📝 Message: ${message.value || 'Aucun détail supplémentaire'}`;

    const encodedMessage = encodeURIComponent(messageText);
    const whatsappNumber = "22500000000"; // À remplacer par votre numéro

    // Option 1: Envoyer via WhatsApp
    if (confirm("Souhaitez-vous envoyer cette demande via WhatsApp ?")) {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
        showNotification("Demande envoyée ! Nous vous contacterons sous 24h.", "success");
        form.reset();
    } else {
        // Option 2: Simuler envoi (à remplacer par appel API)
        console.log("Devis envoyé:", { nom: nom.value, telephone: telephone.value, projet: projet.value });
        showNotification("Votre demande a été enregistrée ! Nous vous contacterons sous 24h.", "success");
        form.reset();
    }

    return false;
};

// Système de notifications
const showNotification = (message, type = "info") => {
    // Supprimer les notifications existantes
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) existingNotif.remove();

    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle')}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Styles de la notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 350px;
    `;

    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        background: ${type === 'success' ? '#4CAF50' : (type === 'error' ? '#f44336' : '#2196F3')};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: auto;
        padding: 0 5px;
    `;

    document.body.appendChild(notification);

    // Auto-fermeture après 5 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Fermeture manuelle
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
};

// Scroll to top button
const createScrollTopButton = () => {
    const button = document.querySelector('.scroll-top');
    if (!button) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// Mobile menu toggle
const createMobileMenu = () => {
    const navLinks = document.querySelector('.nav-links');
    const btnHead = document.querySelector('.btn-head');
    const navContainer = document.querySelector('.nav-container');

    // Vérifier si le menu toggle existe déjà
    if (window.innerWidth <= 768 && !document.querySelector('.menu-toggle')) {
        const toggle = document.createElement('button');
        toggle.classList.add('menu-toggle');
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
        toggle.style.cssText = `
            background: rgb(255, 81, 0);
            border: none;
            color: white;
            font-size: 20px;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            display: none;
        `;

        if (window.innerWidth <= 768) {
            toggle.style.display = 'block';
            navLinks.style.display = 'none';
            btnHead.style.display = 'none';
        }

        toggle.onclick = () => {
            const isVisible = navLinks.style.display === 'flex';
            navLinks.style.display = isVisible ? 'none' : 'flex';
            btnHead.style.display = isVisible ? 'none' : 'block';
            navLinks.style.flexDirection = 'column';
            navLinks.style.width = '100%';
            navLinks.style.textAlign = 'center';
        };

        navContainer.insertBefore(toggle, navLinks);
    } else if (window.innerWidth > 768) {
        const toggle = document.querySelector('.menu-toggle');
        if (toggle) toggle.remove();
        if (navLinks) navLinks.style.display = 'flex';
        if (btnHead) btnHead.style.display = 'block';
    }
};

// Lightbox pour les images
class Lightbox {
    constructor() {
        this.init();
    }

    init() {
        const images = document.querySelectorAll('.images-overlay img');
        images.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                this.open(img.src, img.alt);
            });
        });
    }

    open(src, alt = '') {
        // Supprimer la lightbox existante
        const existingLightbox = document.querySelector('.lightbox');
        if (existingLightbox) existingLightbox.remove();

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            animation: fadeIn 0.3s ease;
        `;

        lightbox.innerHTML = `
            <div class="lightbox-content" style="position: relative; max-width: 90%; max-height: 90%;">
                <img src="${src}" alt="${alt}" style="max-width: 100%; max-height: 90vh; object-fit: contain; border-radius: 8px;">
                <button class="lightbox-close" style="
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 30px;
                    cursor: pointer;
                    padding: 5px 10px;
                ">&times;</button>
            </div>
        `;

        document.body.appendChild(lightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.className === 'lightbox-close') {
                lightbox.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => lightbox.remove(), 300);
            }
        });

        // Fermeture avec la touche Echap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox) {
                lightbox.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => lightbox.remove(), 300);
            }
        });
    }
}

// Ajouter les animations CSS nécessaires
const addAnimationStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
        
        .menu-toggle {
            transition: all 0.3s ease;
        }
        
        .menu-toggle:hover {
            transform: scale(1.05);
        }
        
        @media (max-width: 768px) {
            .nav-links {
                transition: all 0.3s ease;
            }
        }
    `;
    document.head.appendChild(style);
};

// Gestionnaire de chargement de page
const initLoader = () => {
    // Créer le loader s'il n'existe pas
    if (!document.querySelector('.loader')) {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = `
            <div class="loader-spinner" style="
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255, 81, 0, 0.3);
                border-top-color: #ff6600;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
        `;
        document.body.appendChild(loader);

        // Masquer le loader après chargement
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 500);
            }, 500);
        });
    }

    // Ajouter l'animation spin
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);
};

// ==================== SLIDER HORIZONTAL ====================
class HorizontalSlider {
    constructor() {
        this.wrapper = document.querySelector('.services-grid-wrapper');
        this.grid = document.querySelector('.services-grid');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.dotsContainer = document.querySelector('.slider-dots');
        this.currentIndex = 0;
        this.cardWidth = 0;
        this.visibleCards = 0;
        this.autoScrollInterval = null;
        this.isAutoScrolling = true;

        if (this.wrapper && this.grid) {
            this.init();
            this.startAutoScroll();
        }
    }

    init() {
        this.calculateDimensions();
        this.createDots();
        this.updateDots();
        this.attachEvents();
        this.enableDragScroll();
    }

    calculateDimensions() {
        const cards = this.grid.querySelectorAll('.service-card');
        if (cards.length > 0) {
            const card = cards[0];
            const cardWidth = card.offsetWidth;
            const gap = parseInt(window.getComputedStyle(this.grid).gap) || 20;
            this.cardWidth = cardWidth + gap;

            // Calculer combien de cartes sont visibles
            const wrapperWidth = this.wrapper.clientWidth;
            this.visibleCards = Math.max(1, Math.floor(wrapperWidth / (cardWidth + gap)));

            this.totalCards = cards.length;
            this.maxIndex = Math.max(0, this.totalCards - this.visibleCards);
        }
    }

    createDots() {
        if (!this.dotsContainer) return;
        this.dotsContainer.innerHTML = '';
        const numberOfDots = Math.ceil(this.totalCards / this.visibleCards);

        for (let i = 0; i < numberOfDots; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.dataset.index = i;
            dot.addEventListener('click', () => {
                this.stopAutoScroll();
                this.scrollToIndex(i * this.visibleCards);
                this.restartAutoScroll();
            });
            this.dotsContainer.appendChild(dot);
        }
    }

    updateDots() {
        if (!this.dotsContainer) return;
        const dots = this.dotsContainer.querySelectorAll('.dot');
        const currentPage = Math.floor(this.currentIndex / this.visibleCards);

        dots.forEach((dot, index) => {
            if (index === currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    scrollToIndex(index) {
        this.currentIndex = Math.min(Math.max(0, index), this.maxIndex);
        const scrollPosition = this.currentIndex * this.cardWidth;
        this.wrapper.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        this.updateDots();
    }

    scrollLeft() {
        this.stopAutoScroll();
        if (this.currentIndex > 0) {
            this.scrollToIndex(this.currentIndex - this.visibleCards);
        } else {
            // Effet de rebound au début
            this.wrapper.style.transform = 'translateX(10px)';
            setTimeout(() => {
                this.wrapper.style.transform = '';
            }, 200);
        }
        this.restartAutoScroll();
    }

    scrollRight() {
        this.stopAutoScroll();
        if (this.currentIndex < this.maxIndex) {
            this.scrollToIndex(this.currentIndex + this.visibleCards);
        } else {
            // Revenir au début pour un défilement infini
            this.scrollToIndex(0);
        }
        this.restartAutoScroll();
    }

    startAutoScroll() {
        if (this.autoScrollInterval) clearInterval(this.autoScrollInterval);
        this.autoScrollInterval = setInterval(() => {
            if (this.isAutoScrolling && this.maxIndex > 0) {
                if (this.currentIndex >= this.maxIndex) {
                    this.scrollToIndex(0);
                } else {
                    this.scrollToIndex(this.currentIndex + this.visibleCards);
                }
            }
        }, 5000);
    }

    stopAutoScroll() {
        this.isAutoScrolling = false;
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }

    restartAutoScroll() {
        this.isAutoScrolling = true;
        this.startAutoScroll();
    }

    attachEvents() {
        // Boutons précédent/suivant
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.scrollLeft());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.scrollRight());
        }

        // Pause auto-scroll au survol
        this.wrapper.addEventListener('mouseenter', () => {
            this.stopAutoScroll();
        });

        this.wrapper.addEventListener('mouseleave', () => {
            this.restartAutoScroll();
        });

        // Écouter le scroll manuel
        this.wrapper.addEventListener('scroll', () => {
            const scrollLeft = this.wrapper.scrollLeft;
            this.currentIndex = Math.round(scrollLeft / this.cardWidth);
            this.updateDots();
        });

        // Recalculer les dimensions au redimensionnement
        let resizeTimer;
        window.addEventListener('resize', () => {
            this.stopAutoScroll();
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.calculateDimensions();
                this.createDots();
                this.scrollToIndex(this.currentIndex);
                this.restartAutoScroll();
            }, 250);
        });
    }

    enableDragScroll() {
        let isDown = false;
        let startX;
        let scrollLeft;

        this.wrapper.addEventListener('mousedown', (e) => {
            this.stopAutoScroll();
            isDown = true;
            this.wrapper.style.cursor = 'grabbing';
            startX = e.pageX - this.wrapper.offsetLeft;
            scrollLeft = this.wrapper.scrollLeft;
        });

        this.wrapper.addEventListener('mouseleave', () => {
            isDown = false;
            this.wrapper.style.cursor = 'grab';
            this.restartAutoScroll();
        });

        this.wrapper.addEventListener('mouseup', () => {
            isDown = false;
            this.wrapper.style.cursor = 'grab';
            this.restartAutoScroll();
        });

        this.wrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - this.wrapper.offsetLeft;
            const walk = (x - startX) * 1.5;
            this.wrapper.scrollLeft = scrollLeft - walk;
        });

        this.wrapper.style.cursor = 'grab';

        // Support tactile pour mobile
        let touchStartX = 0;
        let touchScrollLeft = 0;

        this.wrapper.addEventListener('touchstart', (e) => {
            this.stopAutoScroll();
            touchStartX = e.touches[0].clientX;
            touchScrollLeft = this.wrapper.scrollLeft;
        });

        this.wrapper.addEventListener('touchmove', (e) => {
            if (!touchStartX) return;
            const touchX = e.touches[0].clientX;
            const diff = touchStartX - touchX;
            this.wrapper.scrollLeft = touchScrollLeft + diff;
        });

        this.wrapper.addEventListener('touchend', () => {
            touchStartX = 0;
            this.restartAutoScroll();
        });
    }
}

// Initialiser le slider horizontal
const initHorizontalSlider = () => {
    new HorizontalSlider();
};

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Attacher le gestionnaire au formulaire
    const devisForm = document.querySelector('.devis form');
    if (devisForm) {
        devisForm.addEventListener('submit', handleDevis);
    }

    // Initialiser les animations
    animateNumbers();
    createScrollTopButton();
    createMobileMenu();
    initLoader();
    addAnimationStyles();

    // Initialiser la lightbox
    new Lightbox();

    // Initialiser le slider horizontal
    initHorizontalSlider();

    // Gérer le redimensionnement pour le menu mobile
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            createMobileMenu();
        }, 250);
    });

    // Animation des cartes au scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .choix-cards, .video-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.5s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        elements.forEach(el => observer.observe(el));
    };

    animateOnScroll();
});

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
    console.error('Erreur globale:', e.error);
    // Afficher une notification discrète en cas d'erreur critique
    if (e.filename && e.filename.includes('accueil')) {
        console.warn('Erreur dans le script:', e.message);
    }
});