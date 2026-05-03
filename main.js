// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Safety fallback: if something goes wrong, show all content after 4s
const safetyTimeout = setTimeout(() => {
    document.querySelectorAll('.reveal, .reveal-hero').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
    }
}, 4000);

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const loaderProgress = document.querySelector('.loader-progress');

    // Animate progress bar smoothly to 100
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 25 + 5; // always advances, never stalls
        if (progress >= 100) {
            progress = 100;
            loaderProgress.style.width = '100%';
            clearInterval(interval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                clearTimeout(safetyTimeout); // cancel fallback if we got here normally

                // Initialize animations
                try {
                    initNavbar();
                    initMobileMenu();
                    initHeroAnimations();
                    initScrollAnimations();
                    ScrollTrigger.refresh(); // ensure correct positions after layout
                } catch (e) {
                    console.warn('GSAP init error:', e);
                    // Show all hidden content as fallback
                    document.querySelectorAll('.reveal, .reveal-hero').forEach(el => {
                        el.style.opacity = '1';
                        el.style.transform = 'none';
                    });
                }
            }, 400);
        } else {
            loaderProgress.style.width = `${progress}%`;
        }
    }, 150);
});

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.mobile-menu');
    const links = document.querySelectorAll('.mobile-nav-links a');

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
                    end: 'bottom 20%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Reveal left
    gsap.utils.toArray('.reveal-left').forEach((elem) => {
        gsap.fromTo(elem, 
            { 
                x: -50, 
                opacity: 0 
            }, 
            {
                x: 0,
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

    // Reveal right
    gsap.utils.toArray('.reveal-right').forEach((elem) => {
        gsap.fromTo(elem, 
            { 
                x: 50, 
                opacity: 0 
            }, 
            {
                x: 0,
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

    // Banana decor scroll-in animation
    const bananaDec = document.querySelector('.banana-decor--left');
    if (bananaDec) {
        gsap.to(bananaDec, {
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
        gsap.to(bananaDec, {
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

    // CTA banana wiggle on hover
    const ctaBanana = document.querySelector('.cta-banana');
    const ctaBox = document.querySelector('.cta-box');
    if (ctaBanana && ctaBox) {
        ctaBox.addEventListener('mouseenter', () => {
            gsap.to(ctaBanana, { rotation: -10, scale: 1.1, duration: 0.4, ease: "back.out(2)" });
        });
        ctaBox.addEventListener('mouseleave', () => {
            gsap.to(ctaBanana, { rotation: -20, scale: 1, duration: 0.4, ease: "power2.out" });
        });
    }
}
