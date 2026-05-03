console.log('main.js loaded');

// Ensure preloader is always hidden, even if everything else fails
function hidePreloader() {
    console.log('Hiding preloader');
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
    }
}

// Safety net: force-show content and hide preloader after 5s no matter what
const safetyTimeout = setTimeout(() => {
    console.warn('Safety timeout reached - force hiding preloader');
    hidePreloader();
}, 5000);

window.addEventListener('load', () => {
    console.log('Window load event fired');
    const loaderProgress = document.querySelector('.loader-progress');

    // Animate progress bar to 100%
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 25 + 10;
        if (progress >= 100) {
            progress = 100;
            if (loaderProgress) loaderProgress.style.width = '100%';
            clearInterval(interval);

            setTimeout(() => {
                console.log('Progress finished, booting animations');
                clearTimeout(safetyTimeout);
                hidePreloader();

                // Boot animations only if GSAP loaded
                try {
                    if (typeof gsap === 'undefined') {
                        throw new Error('GSAP not loaded');
                    }
                    if (typeof ScrollTrigger === 'undefined') {
                        throw new Error('ScrollTrigger not loaded');
                    }
                    
                    console.log('Registering ScrollTrigger');
                    gsap.registerPlugin(ScrollTrigger);
                    
                    console.log('Initializing modules');
                    initNavbar();
                    initMobileMenu();
                    initHeroAnimations();
                    initScrollAnimations();
                    
                    console.log('Refreshing ScrollTrigger');
                    ScrollTrigger.refresh();
                } catch (e) {
                    console.error('Animation init failed:', e.message);
                    // Non-GSAP interactivity still works
                    initNavbar();
                    initMobileMenu();
                }
            }, 400);
        } else {
            if (loaderProgress) loaderProgress.style.width = `${progress}%`;
        }
    }, 150);
});

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.mobile-menu');
    const links = document.querySelectorAll('.mobile-nav-links a');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        menu.classList.toggle('active');
        btn.classList.toggle('active');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            btn.classList.remove('active');
        });
    });
}

function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } });

    tl.fromTo('.hero-date.reveal-hero', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, delay: 0.5 }
    )
    .fromTo('.hero-title.reveal-hero', 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1 }, 
        '-=0.6'
    )
    .fromTo('.hero-subtitle.reveal-hero', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1 }, 
        '-=0.8'
    )
    .fromTo('.hero-motto.reveal-hero', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1 }, 
        '-=0.6'
    )
    .fromTo('.hero-cta.reveal-hero', 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, ease: 'back.out(1.7)' }, 
        '-=0.6'
    );
}

function initScrollAnimations() {
    // Reveal sections
    gsap.utils.toArray('.reveal').forEach((elem) => {
        gsap.fromTo(elem, 
            { 
                y: 50, 
                opacity: 0 
            }, 
            {
                y: 0,
                opacity: 1,
                duration: 1,
                scrollTrigger: {
                    trigger: elem,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Card Hover Parallax (Subtle)
    const cards = gsap.utils.toArray('.card, .pilar-item, .program-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            
            gsap.to(card, {
                rotateY: x * 10,
                rotateX: -y * 10,
                scale: 1.02,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateY: 0,
                rotateX: 0,
                scale: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });

    // Parallax Hero Video
    gsap.to(".hero-video", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Staggered reveal for pilar items
    gsap.from(".pilar-item", {
        opacity: 0,
        y: 60,
        stagger: 0.25,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".pilar-grid",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });

    // Logo decor scroll-in animation
    const logoDec = document.querySelector('.logo-decor--left');
    if (logoDec) {
        gsap.to(logoDec, {
            opacity: 0.55,
            x: 30,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".latar-belakang",
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });

        // Gentle float animation
        gsap.to(logoDec, {
            y: "+=18",
            rotation: "+=6",
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    // CTA box slide-up with scale
    gsap.from(".cta-box", {
        opacity: 0,
        y: 60,
        scale: 0.96,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".sponsor",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });

    // CTA logo wiggle on hover
    const ctaLogo = document.querySelector('.cta-logo');
    const ctaBox = document.querySelector('.cta-box');
    if (ctaLogo && ctaBox) {
        ctaBox.addEventListener('mouseenter', () => {
            gsap.to(ctaLogo, { rotation: -10, scale: 1.1, duration: 0.4, ease: "back.out(2)" });
        });
        ctaBox.addEventListener('mouseleave', () => {
            gsap.to(ctaLogo, { rotation: -20, scale: 1, duration: 0.4, ease: "power2.out" });
        });
    }

    // Extra refresh after layout stabilization
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 1000);
}
