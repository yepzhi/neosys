/* ═══════════════════════════════════════════
   NEOSYS AEON — App Logic
   Particles / Reveal / Badge / Nav
   ═══════════════════════════════════════════ */

// ── Particle Canvas ───────────────────────
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(Math.floor((w * h) / 15000), 80);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                radius: Math.random() * 1.8 + 0.3,
                alpha: Math.random() * 0.5 + 0.1,
                dx: (Math.random() - 0.5) * 0.3,
                dy: (Math.random() - 0.5) * 0.2,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.02 + 0.005
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            p.pulse += p.pulseSpeed;
            
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h;
            if (p.y > h) p.y = 0;

            const a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(167, 139, 250, ${a})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();
    
    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
})();

// ── Scroll Reveal ─────────────────────────
(function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger the reveal of sibling elements
                const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                let index = Array.from(siblings).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ── Nav Scroll Effect ─────────────────────
(function initNav() {
    const nav = document.getElementById('main-nav');
    const toggle = document.getElementById('nav-toggle');
    const links = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
        });
        // Close on link click
        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                links.classList.remove('open');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();

// ── Badge Generator ───────────────────────
(function initBadge() {
    const form = document.getElementById('badge-form');
    const canvas = document.getElementById('badge-canvas');
    const saveBtn = document.getElementById('save-badge');
    if (!form || !canvas) return;

    const ctx = canvas.getContext('2d');

    // Draw default badge
    drawBadge('Tu Nombre');

    function drawBadge(name) {
        const w = canvas.width;
        const h = canvas.height;
        
        // Background
        const bg = ctx.createLinearGradient(0, 0, w, h);
        bg.addColorStop(0, '#0a0a1a');
        bg.addColorStop(0.5, '#12122e');
        bg.addColorStop(1, '#0a0a1a');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        // Border
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.4)';
        ctx.lineWidth = 2;
        ctx.roundRect(4, 4, w - 8, h - 8, 16);
        ctx.stroke();

        // Top accent line
        const accent = ctx.createLinearGradient(0, 0, w, 0);
        accent.addColorStop(0, '#a78bfa');
        accent.addColorStop(1, '#7dd3fc');
        ctx.fillStyle = accent;
        ctx.fillRect(20, 4, w - 40, 2);

        // Sparkle emoji
        ctx.font = '40px serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨', w / 2, 65);

        // Title
        ctx.font = '600 18px Inter, sans-serif';
        ctx.fillStyle = '#a78bfa';
        ctx.letterSpacing = '3px';
        ctx.fillText('NEOSYS AEON', w / 2, 100);

        // Divider
        ctx.fillStyle = 'rgba(167, 139, 250, 0.3)';
        ctx.fillRect(w / 2 - 40, 115, 80, 1);

        // Name
        ctx.font = '800 28px Inter, sans-serif';
        ctx.fillStyle = '#f5f5f7';
        ctx.fillText(name.toUpperCase(), w / 2, 160);

        // Member label
        ctx.font = '500 12px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(245, 245, 247, 0.4)';
        ctx.fillText('MIEMBRO DEL MOVIMIENTO', w / 2, 195);

        // Tagline
        ctx.font = 'italic 500 14px Inter, sans-serif';
        ctx.fillStyle = 'rgba(245, 245, 247, 0.5)';
        ctx.fillText('"No exige creencia. Exige coherencia."', w / 2, 240);

        // Hashtag
        ctx.font = '700 16px "JetBrains Mono", monospace';
        ctx.fillStyle = '#a78bfa';
        ctx.fillText('#NeosysAeon', w / 2, 280);

        // Subtle corner sparkles
        ctx.font = '16px serif';
        ctx.fillText('✨', 30, 30);
        ctx.fillText('✨', w - 30, 30);
        ctx.fillText('✨', 30, h - 15);
        ctx.fillText('✨', w - 30, h - 15);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('badge-name').value.trim();
        if (name) {
            drawBadge(name);
            saveBtn.style.display = 'inline-flex';
        }
    });

    saveBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'neosysaeon-badge.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
})();

// ── Mandamiento Cards Stagger ─────────────
(function initMandamientoStagger() {
    const cards = document.querySelectorAll('.mandamiento-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = Array.from(cards).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    cards.forEach(card => observer.observe(card));
})();
