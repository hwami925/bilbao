/* =========================================
   BILBAO OFFICIAL WEBSITE
   SCRIPT.JS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       1. MOBILE MENU
    ===================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".navigation");

    if (menuToggle && navigation) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navigation.classList.toggle("active");

            menuToggle.setAttribute("aria-expanded", String(isOpen));

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "메뉴 닫기" : "메뉴 열기"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";

        });

        navigation.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navigation.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "메뉴 열기");

                menuToggle.textContent = "☰";

            });

        });

    }


    /* =====================================
       2. PARALLAX EFFECT
    ===================================== */

    const hero = document.querySelector(".hero");

    const sky = document.querySelector(".layer-sky");
    const city = document.querySelector(".layer-city");
    const scrapyard = document.querySelector(".layer-scrapyard");
    const foreground = document.querySelector(".layer-foreground");
    const pillar = document.querySelector(".red-pillar");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (hero && !reducedMotion) {

        let mouseX = 0;
        let mouseY = 0;

        let currentX = 0;
        let currentY = 0;

        hero.addEventListener("pointermove", (event) => {

            if (event.pointerType === "touch") return;

            const rect = hero.getBoundingClientRect();

            mouseX = (
                (event.clientX - rect.left) / rect.width - 0.5
            ) * 2;

            mouseY = (
                (event.clientY - rect.top) / rect.height - 0.5
            ) * 2;

        });

        hero.addEventListener("pointerleave", () => {

            mouseX = 0;
            mouseY = 0;

        });

        function animateParallax() {

            currentX += (mouseX - currentX) * 0.045;
            currentY += (mouseY - currentY) * 0.045;

            const move = (element, strength) => {

                if (!element) return;

                element.style.transform =
                    `translate3d(
                        ${currentX * strength}px,
                        ${currentY * strength * 0.5}px,
                        0
                    )`;

            };

            move(sky, 3);
            move(city, 9);
            move(scrapyard, 17);
            move(foreground, 28);
            move(pillar, 14);

            requestAnimationFrame(animateParallax);

        }

        animateParallax();

    }


    /* =====================================
       3. FLOATING DUST PARTICLES
    ===================================== */

    const canvas = document.getElementById("dust-canvas");

    if (canvas && hero && !reducedMotion) {

        const ctx = canvas.getContext("2d");

        if (ctx) {

            let width = 0;
            let height = 0;

            let particles = [];

            const particleCount = 65;

            function resizeCanvas() {

                width = hero.clientWidth;
                height = hero.clientHeight;

                const dpr = Math.min(
                    window.devicePixelRatio || 1,
                    2
                );

                canvas.width = Math.round(width * dpr);
                canvas.height = Math.round(height * dpr);

                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            }

            function createParticle() {

                return {
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.6 + 0.3,
                    speedX: (Math.random() - 0.5) * 0.25,
                    speedY: -(Math.random() * 0.35 + 0.08),
                    opacity: Math.random() * 0.35 + 0.08
                };

            }

            function initializeParticles() {

                particles = Array.from(
                    { length: particleCount },
                    createParticle
                );

            }

            function animateDust() {

                ctx.clearRect(0, 0, width, height);

                for (const particle of particles) {

                    particle.x += particle.speedX;
                    particle.y += particle.speedY;

                    if (particle.y < -10) {
                        particle.y = height + 10;
                        particle.x = Math.random() * width;
                    }

                    if (particle.x < -10) {
                        particle.x = width + 10;
                    }

                    if (particle.x > width + 10) {
                        particle.x = -10;
                    }

                    ctx.beginPath();

                    ctx.arc(
                        particle.x,
                        particle.y,
                        particle.radius,
                        0,
                        Math.PI * 2
                    );

                    ctx.fillStyle =
                        `rgba(230, 230, 230, ${particle.opacity})`;

                    ctx.fill();

                }

                requestAnimationFrame(animateDust);

            }

            resizeCanvas();
            initializeParticles();
            animateDust();

            window.addEventListener("resize", () => {

                resizeCanvas();
                initializeParticles();

            });

        }

    }


    /* =====================================
       4. SCROLL REVEAL ANIMATION
    ===================================== */

    const sections = document.querySelectorAll(
        ".content-section .section-inner"
    );

    if ("IntersectionObserver" in window && !reducedMotion) {

        const observer = new IntersectionObserver(
            (entries) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.1
            }
        );

        sections.forEach(section => {

            section.classList.add("reveal");
            observer.observe(section);

        });

    } else {

        sections.forEach(section => {
            section.classList.add("visible");
        });

    }


    /* =====================================
       5. HEADER SCROLL EFFECT
    ===================================== */

    const header = document.querySelector(".header");

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 40) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();

});
