// Sentinel Framework Main JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Initialize core behavior
    initializeSentinel();
    addInteractiveEffects();
    initializeNavigation();
    initializePageSpecificFeatures();
});

function initializeSentinel() {
    console.log('🛡️ Sentinel Framework initialized');
    console.log('⚡ EverLightOS quantum substrata stabilized');
    console.log('🔮 SphinxGuardian protocols active');

    // Add loading animation
    document.body.classList.add('loaded');
}

function addInteractiveEffects() {
    // Hover effects for feature cards
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 15px 30px rgba(138, 43, 226, 0.3)';
        });

        feature.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // Ripple click effect for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

function initializeNavigation() {
    // Smooth scrolling for on-page anchors (only real targets)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        link.addEventListener('click', function (e) {
            // Only intercept if target exists on this page
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active navigation highlighting
    const navLinks = document.querySelectorAll('nav a');
    if (!navLinks.length) return;

    const path = window.location.pathname;
    // When deployed with Cloudflare Pages using `sentinel-framework` as output dir,
    // this will see just `/` or `/page.html` at the domain root.
    let current = path.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const rawHref = link.getAttribute('href') || '';

        // Ignore absolute external links
        if (/^https?:\/\//i.test(rawHref)) return;

        // Normalize href to compare with current file
        const normalized = rawHref
            .replace(window.location.origin, '')
            .replace(/^\.\//, '')
            .replace(/\/$/, '');

        const isHomeLink =
            normalized === '' ||
            normalized === '/' ||
            normalized.toLowerCase() === 'index' ||
            normalized.toLowerCase() === 'index.html';

        const isCurrentHome =
            current === '' ||
            current === '/' ||
            current.toLowerCase() === 'index.html';

        if (
            (isHomeLink && isCurrentHome) ||
            (!isHomeLink && normalized === current)
        ) {
            link.classList.add('active');
        }
    });
}

function initializePageSpecificFeatures() {
    // Lattice visualization page
    if (document.getElementById('lattice-canvas')) {
        initializeLatticeVisualization();
    }

    // Quantum field background
    if (document.getElementById('quantum-field')) {
        initializeQuantumField();
    }
}

// Lattice visualization (for lattice.html page)
function initializeLatticeVisualization() {
    const canvas = document.getElementById('lattice-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let time = 0;

    function drawSierpinskiLattice() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const size = Math.min(canvas.width, canvas.height) * 0.4;

        drawTriangle(ctx, centerX, centerY - size / 2, size, 0, time);

        time += 0.02;
        requestAnimationFrame(drawSierpinskiLattice);
    }

    function drawTriangle(ctx, x, y, size, depth, t) {
        if (depth > 5 || size < 2) return;

        const height = size * Math.sqrt(3) / 2;
        const hue = (depth * 60 + t * 50) % 360;

        ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
        ctx.lineWidth = Math.max(1, 3 - depth * 0.5);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - size / 2, y + height);
        ctx.lineTo(x + size / 2, y + height);
        ctx.closePath();
        ctx.stroke();

        const newSize = size / 2;
        drawTriangle(ctx, x, y, newSize, depth + 1, t);
        drawTriangle(ctx, x - newSize / 2, y + height / 2, newSize, depth + 1, t);
        drawTriangle(ctx, x + newSize / 2, y + height / 2, newSize, depth + 1, t);
    }

    drawSierpinskiLattice();
}

// Quantum field animation
function initializeQuantumField() {
    const canvas = document.getElementById('quantum-field');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            hue: Math.random() * 360
        });
    }

    function animateField() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, 0.8)`;
            ctx.fill();

            particle.hue = (particle.hue + 1) % 360;
        });

        requestAnimationFrame(animateField);
    }

    animateField();
}

// Inject CSS for ripple + active nav state
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .loaded {
        animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    nav a.active {
        color: var(--highlight-color);
    }

    nav a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);
