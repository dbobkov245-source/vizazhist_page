// Mobile Menu Toggle
(() => {
    const burger = document.getElementById('navBurger');
    const menu = document.getElementById('mobileMenu');
    const links = menu?.querySelectorAll('.mobile-menu__link');
    const cta = menu?.querySelector('.mobile-menu__cta');

    if (!burger || !menu) return;

    const toggleMenu = () => {
        const isOpen = menu.classList.contains('active');
        menu.classList.toggle('active');
        burger.classList.toggle('active');
        burger.setAttribute('aria-expanded', !isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
    };

    const closeMenu = () => {
        menu.classList.remove('active');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    burger.addEventListener('click', toggleMenu);

    // Close menu on link click
    links?.forEach(link => link.addEventListener('click', closeMenu));
    cta?.addEventListener('click', closeMenu);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMenu();
        }
    });
})();

// Sticky Navigation
(() => {
    const nav = document.getElementById('nav');
    if (!nav) return;

    let lastScroll = 0;

    const handleScroll = () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
})();

// Full-screen Zoom Effect
(() => {
    const wrapper = document.getElementById('heroWrapper');
    const portraitOriginal = document.getElementById('heroPortrait');
    const content = document.getElementById('heroContent');
    const hero = document.getElementById('hero');
    const heroFace = document.getElementById('heroFace');
    const nav = document.getElementById('nav');

    if (!wrapper || !portraitOriginal || !content || !hero || !heroFace) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Create fixed portrait overlay
    const fixedPortrait = document.createElement('div');
    fixedPortrait.className = 'hero__portrait-fixed';
    fixedPortrait.innerHTML = `
        <img src="${heroFace.src}" alt="${heroFace.alt}">
        <div class="hero-zoom-text">
            <span>Макияж — это не маска.</span>
            <strong>Это уверенность.</strong>
        </div>
    `;
    document.body.appendChild(fixedPortrait);

    // Get initial portrait state
    const getInitialState = () => {
        const rect = portraitOriginal.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2
        };
    };

    let initialState = getInitialState();
    let ticking = false;

    const updateZoom = () => {
        const wrapperRect = wrapper.getBoundingClientRect();
        const wrapperHeight = wrapper.offsetHeight;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Calculate scroll progress (0 to 1) through the wrapper
        const scrolled = -wrapperRect.top;
        const scrollRange = wrapperHeight - viewportHeight;
        const progress = Math.max(0, Math.min(1, scrolled / scrollRange));

        // Calculate target size to fully cover viewport
        // Use the larger of viewport dimensions to ensure full coverage
        const aspectRatio = initialState.width / initialState.height;
        let targetWidth, targetHeight;

        // Calculate sizes needed to cover the viewport completely
        // considering the aspect ratio of the original portrait
        if (viewportWidth / viewportHeight > aspectRatio) {
            // Viewport is wider than portrait, scale by width
            targetWidth = viewportWidth * 1.05; // 5% extra for safety
            targetHeight = targetWidth / aspectRatio;
        } else {
            // Viewport is taller than portrait, scale by height
            targetHeight = viewportHeight * 1.05;
            targetWidth = targetHeight * aspectRatio;
        }

        // Interpolate state based on progress
        const currentWidth = initialState.width + (targetWidth - initialState.width) * progress;
        const currentHeight = initialState.height + (targetHeight - initialState.height) * progress;

        // Interpolate position from original center to viewport center
        const targetCenterX = viewportWidth / 2;
        const targetCenterY = viewportHeight / 2;
        const currentCenterX = initialState.centerX + (targetCenterX - initialState.centerX) * progress;
        const currentCenterY = initialState.centerY + (targetCenterY - initialState.centerY) * progress;

        // Apply to fixed portrait
        fixedPortrait.style.width = `${currentWidth}px`;
        fixedPortrait.style.height = `${currentHeight}px`;
        fixedPortrait.style.transform = `translate(${currentCenterX - currentWidth / 2}px, ${currentCenterY - currentHeight / 2}px)`;

        // Show/hide fixed portrait and original
        if (progress > 0.005) { // Smaller threshold for instant hand-off
            if (!fixedPortrait.classList.contains('active')) {
                fixedPortrait.classList.add('active');
                portraitOriginal.style.visibility = 'hidden';
            }
        } else {
            if (fixedPortrait.classList.contains('active')) {
                fixedPortrait.classList.remove('active');
                portraitOriginal.style.visibility = 'visible';
            }
        }

        // Remove border-radius when expanding (earlier to ensure smooth transition)
        if (progress > 0.2) {
            fixedPortrait.classList.add('fullscreen');
        } else {
            fixedPortrait.classList.remove('fullscreen');
        }

        // Hide navigation earlier in the scroll to prevent text overlap
        if (nav) {
            if (progress > 0.15) {
                nav.classList.add('hidden');
            } else {
                nav.classList.remove('hidden');
            }
        }

        // Fade out text content as zoom progresses
        const fadeThreshold = 0.05;
        if (progress > fadeThreshold) {
            const fadeProgress = Math.min(1, (progress - fadeThreshold) / 0.15);
            content.style.opacity = 1 - fadeProgress;
        } else {
            content.style.opacity = 1;
        }

        // Hide fixed portrait after hero section ends
        if (progress >= 0.98) {
            fixedPortrait.style.opacity = '0';
        } else if (progress > 0.02) {
            fixedPortrait.style.opacity = '1';
        }

        ticking = false;
    };

    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(updateZoom);
            ticking = true;
        }
    };

    // Recalculate on resize
    window.addEventListener('resize', () => {
        initialState = getInitialState();
        updateZoom();
    }, { passive: true });

    window.addEventListener('scroll', onScroll, { passive: true });
    updateZoom();
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Background Canvas Animation (Moving Lines)
(() => {
    const canvas = document.getElementById('background-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let lines = [];

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Visibility observer - pause animation when not visible
    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
    }, { threshold: 0 });
    observer.observe(canvas);

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initLines();
    };

    class Line {
        constructor(index) {
            this.index = index;
            this.reset();
        }

        reset() {
            this.amp = 50 + Math.random() * 100; // Amplitude
            this.period = 200 + Math.random() * 300; // Period
            this.speed = 0.001 + Math.random() * 0.003; // Speed
            this.phase = Math.random() * Math.PI * 2;
            this.y = (height / 10) * this.index + (Math.random() * 50); // Vertical position
            this.hue = Math.random() > 0.5 ? 10 : 330; // Close to brand colors (reddish/pink/orange)
            this.saturation = 20 + Math.random() * 40;
            this.lightness = 40 + Math.random() * 40;
        }

        update(time) {
            this.phase += this.speed;
        }

        draw() {
            ctx.beginPath();
            for (let x = 0; x < width; x += 10) {
                const y = this.y + Math.sin((x / this.period) + this.phase) * this.amp + Math.cos((x / (this.period * 1.5)) + this.phase * 0.5) * (this.amp * 0.5);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            // Gradient stroke
            const gradient = ctx.createLinearGradient(0, this.y - 50, width, this.y + 50);
            gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`);
            gradient.addColorStop(0.5, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0.5)`);
            gradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    const initLines = () => {
        lines = [];
        const numLines = Math.floor(height / 100); // 1 line per 100px height
        for (let i = 0; i < numLines + 2; i++) {
            lines.push(new Line(i));
        }
    };

    const animate = (time) => {
        // Skip rendering when not visible to save resources
        if (!isVisible) {
            requestAnimationFrame(animate);
            return;
        }

        ctx.clearRect(0, 0, width, height);
        lines.forEach(line => {
            line.update(time);
            line.draw();
        });
        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();
    requestAnimationFrame(animate);
})();

// 3D Gallery Animation
(() => {
    // Old guard clause removed



    const galleryContainer = document.querySelector('.gallery-3d-content');
    const items = document.querySelectorAll('.gallery-3d-item');

    // Configuration
    const CONFIG = {
        speed: 0.8, // Pixels per frame
        cardWidth: 460, // Match new CSS width (15% larger)
        // cardWidth will be dynamic in initTicker to match CSS if we want, or just fixed logic
        gap: 60, // Spacing
        heroX: 0.5, // Center of container (0.5 = 50%)
        zScale: 300, // Deeper depth
        rotationMax: 50, // Max rotation
        scaleMin: 0.5 // Scale down to 50% at edges
    };

    // State
    let scrollPos = 0;
    let totalWidth = 0;
    let itemSpacing = 0;

    // Check mobile or desktop size for config overrides
    const updateConfig = () => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            CONFIG.cardWidth = window.innerWidth * 0.75; // Slightly larger on mobile too
            CONFIG.gap = 20;
        } else {
            CONFIG.cardWidth = 460;
            CONFIG.gap = 60;
        }
        itemSpacing = CONFIG.cardWidth + CONFIG.gap;
    };

    function initTicker() {
        if (!galleryContainer || items.length === 0) return;

        updateConfig();

        // Calculate total width of the virtual track
        totalWidth = items.length * itemSpacing;

        // Start the loop
        requestAnimationFrame(renderLoop);
    }

    function renderLoop() {
        // 1. Update Scroll
        scrollPos -= CONFIG.speed;

        // 2. Get Container Dimensions
        const containerRect = galleryContainer.getBoundingClientRect();
        const containerWidth = containerRect.width;

        // Hero position in pixels (center)
        const heroPixel = containerWidth * CONFIG.heroX;

        // 3. Render Each Item
        items.forEach((item, index) => {
            // A. Calculate Raw Position on Track
            let rawX = scrollPos + (index * itemSpacing);

            // B. Wrap Logic (Modulo)
            // Range for clean wrapping needs to cover the active view plus buffers.
            // We want smooth infinite scroll.

            // Adjust wrap so it happens far off-screen
            const wrapOffset = CONFIG.cardWidth * 2;

            // Standard modulo wrap
            let wrappedX = ((rawX + wrapOffset) % totalWidth);
            if (wrappedX < 0) wrappedX += totalWidth;
            wrappedX -= wrapOffset;

            // C. Reactive Transforms based on position relative to Hero
            // Distance from Hero point (center)
            const dist = wrappedX - heroPixel + (CONFIG.cardWidth / 2);
            // Note: wrappedX is left edge. Center of card is left + width/2.
            // Let's calculate distance from Card Center to Hero Pixel.
            const cardCenter = wrappedX + (CONFIG.cardWidth / 2);
            const distFromCenter = cardCenter - heroPixel;

            // Normalized distance (-1 to 1 range roughly based on container width)
            const maxDist = containerWidth / 1.5; // Influence range
            const progress = Math.min(Math.abs(distFromCenter) / maxDist, 1);

            // Scale: 1.0 at center, drops to scaleMin
            let scale = 1 - (progress * (1 - CONFIG.scaleMin));

            // Opacity: Fade out near edges
            let opacity = 1;
            if (progress > 0.6) {
                opacity = 1 - ((progress - 0.6) * 2.5); // Fade from 0.6 to 1.0
            }
            if (opacity < 0) opacity = 0;

            // Rotation: tilt away from center
            // Left of center (negative dist): rotate positive (face right)
            // Right of center (positive dist): rotate negative (face left)
            let rotateY = 0;
            if (distFromCenter < 0) {
                rotateY = progress * CONFIG.rotationMax;
            } else {
                rotateY = progress * -CONFIG.rotationMax;
            }

            // Z-Index: closer to center = higher
            let zIndex = 100 - Math.floor(progress * 100);

            // D. Apply
            // Fix vertical alignment: explicitly center
            item.style.zIndex = zIndex;
            item.style.width = `${CONFIG.cardWidth}px`; // Force width from JS to match logic

            // On Mobile we need to adjust height or let CSS handle it?
            // Let's set generic height or reset it. 
            // CSS has height: 600px. Let's rely on CSS aspect ratio or fixed height?
            // Let's just update transform. width is handled.

            item.style.transform = `
                translate3d(${wrappedX}px, -50%, 0) 
                scale(${scale}) 
                rotateY(${rotateY}deg)
            `;
            item.style.opacity = opacity;
        });

        requestAnimationFrame(renderLoop);
    }

    // Initialize
    initTicker();

    // Handle Resize
    window.addEventListener('resize', () => {
        updateConfig();
        // Recalc total width if needed
        totalWidth = items.length * itemSpacing;
    });
})();
