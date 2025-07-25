document.addEventListener('DOMContentLoaded', function () {
    // 1. Inicijalizacija AOS animacija
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }

    // 2. Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', function () {
            setTimeout(function () {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 1000);
        });
    }

    // 3. Navigacija
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu'); // Promenjeno

    if (navbar) {
        window.addEventListener('scroll', function () {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
            console.log('Hamburger clicked');
            const isActive = this.classList.toggle('active');
            mobileMenu.classList.toggle('active', isActive); // Promenjeno

            const spans = this.querySelectorAll('span');
            if (isActive) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        });

        // Zatvaranje menija kada se klikne na link
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                hamburger.querySelectorAll('span').forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            });
        });
    }

    // 4. Jezički prekidač
    document.querySelectorAll('.language-switcher button, .mobile-language-switcher button').forEach(button => {
        button.addEventListener('click', function () {
            const lang = this.getAttribute('data-lang');
            document.querySelectorAll(`.language-switcher button[data-lang="${lang}"], .mobile-language-switcher button[data-lang="${lang}"]`).forEach(btn => {
                btn.classList.add('active');
            });
            document.querySelectorAll(`.language-switcher button:not([data-lang="${lang}"]), .mobile-language-switcher button:not([data-lang="${lang}"])`).forEach(btn => {
                btn.classList.remove('active');
            });
            console.log('Selected language:', lang);
        });
    });

    // 5. Hero slider
    if (typeof Swiper !== 'undefined') {
        const heroSlider = new Swiper('.hero-slider', {
            loop: true,
            speed: 1000,
            parallax: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }
        });
    }

    // 6. Animacije kartica
    document.querySelectorAll('.service-card, .highlight-box').forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = element.classList.contains('service-card')
                ? 'translateY(-10px)'
                : 'translateY(-5px)';
            element.style.transition = 'transform 0.3s ease';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
        });
    });

    // 7. Cursor efekat
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const cursorScaleElements = document.querySelectorAll('[data-cursor-scale]');

    if (cursor && cursorFollower) {
        let posX = 0, posY = 0;
        let mouseX = 0, mouseY = 0;

        gsap.to({}, {
            duration: 0.016,
            repeat: -1,
            onRepeat: function () {
                posX += (mouseX - posX) / 9;
                posY += (mouseY - posY) / 9;

                gsap.set(cursor, {
                    css: {
                        left: mouseX,
                        top: mouseY
                    }
                });

                gsap.set(cursorFollower, {
                    css: {
                        left: posX - 20,
                        top: posY - 20
                    }
                });
            }
        });

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        if (cursorScaleElements) {
            cursorScaleElements.forEach(element => {
                element.addEventListener('mouseenter', function () {
                    cursor.classList.add('active');
                    cursorFollower.classList.add('active');
                });

                element.addEventListener('mouseleave', function () {
                    cursor.classList.remove('active');
                    cursorFollower.classList.remove('active');
                });
            });
        }
    }

    // 8. Paralaks efekat za dekorativne elemente
    window.addEventListener('scroll', function () {
        const scrollPosition = window.pageYOffset;
        const aboutSection = document.querySelector('.about-section');

        if (aboutSection) {
            const dots = aboutSection.querySelector('.about-dots');
            const line = aboutSection.querySelector('.about-line');

            if (dots) dots.style.transform = `rotate(${scrollPosition * 0.1}deg)`;
            if (line) line.style.transform = `translateX(${scrollPosition * 0.2}px)`;
        }
    });

    // 9. Dodatne interakcije
    document.querySelectorAll('.premium-text-block .text-line').forEach((line, index) => {
        line.style.transitionDelay = `${index * 0.1}s`;

        // 3D tilt effect
        line.addEventListener('mousemove', (e) => {
            const rect = line.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;

            line.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });

        line.addEventListener('mouseleave', () => {
            line.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // 10. Dynamic gradient animation
    const goldGradient = document.querySelector('#gold-gradient');
    if (goldGradient) {
        let offset = 0;

        function animateGradient() {
            offset += 0.2;
            if (offset > 100) offset = 0;

            goldGradient.querySelector('stop:nth-child(1)').setAttribute('offset', `${offset - 20}%`);
            goldGradient.querySelector('stop:nth-child(2)').setAttribute('offset', `${offset}%`);
            goldGradient.querySelector('stop:nth-child(3)').setAttribute('offset', `${offset + 20}%`);

            requestAnimationFrame(animateGradient);
        }

        animateGradient();
    }

    // 11. Galerija - Fullscreen viewer
    const galleryImages = document.querySelectorAll('.yyygallery-image');
    const fullscreenViewer = document.querySelector('.yyyfullscreen-viewer');
    const fullscreenImage = document.querySelector('.yyyfullscreen-image');
    const imageCaption = document.querySelector('.yyyimage-caption');
    const closeBtn = document.querySelector('.yyyclose-btn');

    if (galleryImages.length && fullscreenViewer && fullscreenImage && imageCaption && closeBtn) {
        // Add click event to each image
        galleryImages.forEach(image => {
            image.addEventListener('click', function () {
                const imgSrc = this.getAttribute('src');
                const caption = this.closest('.yyygallery-item').querySelector('h3').textContent;

                fullscreenImage.setAttribute('src', imgSrc);
                imageCaption.textContent = caption;
                fullscreenViewer.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Close fullscreen viewer
        closeBtn.addEventListener('click', function () {
            fullscreenViewer.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close when clicking outside image
        fullscreenViewer.addEventListener('click', function (e) {
            if (e.target === this) {
                fullscreenViewer.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Close with ESC key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && fullscreenViewer.classList.contains('active')) {
                fullscreenViewer.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    console.log('All components initialized successfully');
});
document.addEventListener('DOMContentLoaded', function () {
    // Footer animations
    const footerLinks = document.querySelectorAll('.zzzfooter-list a');

    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.style.transform = 'translateX(5px)';
        });

        link.addEventListener('mouseleave', function () {
            this.style.transform = 'translateX(0)';
        });
    });

    // Social links animation
    const socialLinks = document.querySelectorAll('.zzzsocial-link');

    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.querySelector('i').style.transform = 'scale(1.2)';
        });

        link.addEventListener('mouseleave', function () {
            this.querySelector('i').style.transform = 'scale(1)';
        });
    });

    // Scroll animation for footer
    window.addEventListener('scroll', function () {
        const footer = document.querySelector('.zzzsection-footer');
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const footerPosition = footer.getBoundingClientRect().top;

        if (footerPosition < windowHeight * 0.75) {
            footer.style.opacity = '1';
            footer.style.transform = 'translateY(0)';
        }
    });

    // Initialize footer animation
    const footer = document.querySelector('.zzzsection-footer');
    footer.style.opacity = '0';
    footer.style.transform = 'translateY(20px)';
    footer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    // Trigger animation if footer is already in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footer.style.opacity = '1';
                footer.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    observer.observe(footer);
    // 12. Označi aktivni jezički link na osnovu URL-a
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const langLinks = document.querySelectorAll('.language-switcher .lang-link');

    langLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    // Jezički prekidač preko <button> elemenata
    document.querySelectorAll('.language-switcher .lang-btn').forEach(button => {
        button.addEventListener('click', function () {
            const lang = this.getAttribute('data-lang');

            // Mapa jezika prema fajlovima
            const langMap = {
                bs: 'index.html',
                de: 'de.html',
                en: 'en.html'
            };

            const targetPage = langMap[lang];
            if (targetPage) {
                window.location.href = targetPage;
            }
        });
    });
    // 1. Gallery Filter Functionality
    const initGalleryFilter = () => {
        const filterBtns = document.querySelectorAll('.dfilter-btn');
        const galleryItems = document.querySelectorAll('.dgallery-item');
        
        if (!filterBtns.length || !galleryItems.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    };

    // 2. Fullscreen Image Viewer
    const initFullscreenViewer = () => {
        const galleryImages = document.querySelectorAll('.dgallery-image');
        const fullscreenViewer = document.querySelector('.dfullscreen-viewer');
        const fullscreenImage = document.querySelector('.dfullscreen-image');
        const imageCaption = document.querySelector('.dimage-caption');
        const closeBtn = document.querySelector('.dclose-btn');
        const prevBtn = document.querySelector('.dprev-btn');
        const nextBtn = document.querySelector('.dnext-btn');
        
        if (!galleryImages.length || !fullscreenViewer || !fullscreenImage) return;

        let currentImageIndex = 0;
        const imagesArray = Array.from(galleryImages);

        const showImage = (index) => {
            const imgSrc = imagesArray[index].getAttribute('src');
            const caption = imagesArray[index].closest('.dgallery-item').querySelector('h3').textContent;
            
            fullscreenImage.setAttribute('src', imgSrc);
            if (imageCaption) imageCaption.textContent = caption;
            fullscreenViewer.classList.add('active');
            document.body.style.overflow = 'hidden';
            currentImageIndex = index;
        };

        // Click event for gallery images
        galleryImages.forEach((image, index) => {
            image.addEventListener('click', () => showImage(index));
        });

        // Close button
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                fullscreenViewer.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }

        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showImage((currentImageIndex - 1 + imagesArray.length) % imagesArray.length);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showImage((currentImageIndex + 1) % imagesArray.length);
            });
        }

        // Close when clicking outside image
        fullscreenViewer.addEventListener('click', (e) => {
            if (e.target === fullscreenViewer) {
                fullscreenViewer.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!fullscreenViewer.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                fullscreenViewer.classList.remove('active');
                document.body.style.overflow = 'auto';
            } else if (e.key === 'ArrowLeft') {
                prevBtn?.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn?.click();
            }
        });
    };

    // 3. Load More Button (simulated functionality)
    const initLoadMore = () => {
        const loadMoreBtn = document.querySelector('.dload-more-btn');
        if (!loadMoreBtn) return;
        
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading
            this.textContent = 'Učitavanje...';
            this.disabled = true;
            
            // In a real implementation, this would be an AJAX call
            setTimeout(() => {
                // Simulate adding new items
                const newItems = [
                    { category: 'kuhinje', src: '/galerija/kuhinje/kuhinj4.jpg', title: 'Klasična Kuhinja', desc: 'Toplo drvo sa tradicionalnim detaljima' },
                    { category: 'kupatila', src: '/galerija/kupatila/kupaona2.jpg', title: 'Moderno Kupatilo', desc: 'Staklo i drvo u savršenoj harmoniji' }
                ];
                
                const galleryGrid = document.querySelector('.dgallery-grid');
                
                newItems.forEach(item => {
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'dgallery-item';
                    galleryItem.setAttribute('data-category', item.category);
                    galleryItem.innerHTML = `
                        <div class="dimage-wrapper">
                            <img src="${item.src}" alt="${item.title}" loading="lazy" class="dgallery-image">
                            <div class="dimage-overlay">
                                <div class="doverlay-content">
                                    <h3>${item.title}</h3>
                                    <p>${item.desc}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    galleryGrid.appendChild(galleryItem);
                });
                
                this.textContent = 'Učitaj još projekata';
                this.disabled = false;
                
                // Reinitialize event listeners for new images
                initFullscreenViewer();
            }, 1500);
        });
    };

    // Initialize all gallery functions
    initGalleryFilter();
    initFullscreenViewer();
    initLoadMore();

});