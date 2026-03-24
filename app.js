/* ═══════════════════════════════════════════
   NEOSYS AEON — App Logic
   Particles / Reveal / Badge / Nav / i18n
   ═══════════════════════════════════════════ */

// ── Language System ───────────────────────
let actLang = localStorage.getItem('nsa_lang') || 'es';

// ═══════════════════════════════════════════
// FIREBASE CONFIGURATION
// ═══════════════════════════════════════════
// NOTA: Reemplazar este objeto con tus credenciales reales y habilitar Firestore.
const firebaseConfig = {
    apiKey: "AIzaSyD-tbdD6eHip2fCBAJnGEj3_4eqLMc1EhE",
    authDomain: "neosys-4dc42.firebaseapp.com",
    projectId: "neosys-4dc42",
    storageBucket: "neosys-4dc42.firebasestorage.app",
    messagingSenderId: "1009059504450",
    appId: "1:1009059504450:web:d26dd042f2139dcaa6e8db",
    measurementId: "G-V2FD2WR82B"
};

let db = null;
try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
    }
} catch (e) {
    console.warn("Firebase no inicializado aún:", e);
}

function loadCommunity() {
    const list = document.getElementById('community-list');
    if (!list || !db) return;
    
    // Si sigue con la configuración por defecto, mostramos un aviso
    if (firebaseConfig.projectId === "YOUR_PROJECT_ID") {
        list.innerHTML = `<p style="color: var(--accent); width: 100%;">Pendiente de conectar a Firebase</p>
        <div class="community-member"><div class="member-dot"></div>Carlos G.</div>
        <div class="community-member"><div class="member-dot"></div>Ana P.</div>
        <div class="community-member"><div class="member-dot"></div>Elena R.</div>`;
        return;
    }

    db.collection('miembros').orderBy('timestamp', 'desc').limit(100).onSnapshot((snapshot) => {
        list.innerHTML = '';
        if (snapshot.empty) {
            list.innerHTML = '<p style="color: var(--text-tertiary); width: 100%;">Sé el primero en unirte al directorio.</p>';
            return;
        }
        snapshot.forEach(doc => {
            const data = doc.data();
            const el = document.createElement('div');
            el.className = 'community-member reveal';
            
            const dot = document.createElement('div');
            dot.className = 'member-dot';
            
            const txt = document.createTextNode(data.name || 'Constructor Anónimo');
            
            el.appendChild(dot);
            el.appendChild(txt);
            list.appendChild(el);
        });
        
        setTimeout(() => {
            if (window.revealObserver) {
                list.querySelectorAll('.reveal').forEach(el => window.revealObserver.observe(el));
            }
        }, 50);
    }, (error) => {
        console.error("Error cargando comunidad:", error);
        list.innerHTML = '<p style="color: #ef4444; width: 100%;">Inicia Firestore para ver el registro.</p>';
    });
}
document.addEventListener('DOMContentLoaded', loadCommunity);

// ═══════════════════════════════════════════
let currentLang = actLang; // Keep currentLang for applyLanguage, initialized from actLang

function applyLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) el.innerHTML = t[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key] !== undefined) el.placeholder = t[key];
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.documentElement.lang = lang === 'cn' ? 'zh-Hant' : lang;

    // Update Whitepaper Link
    const pdfBtn = document.getElementById('download-pdf');
    if (pdfBtn) {
        if (lang === 'en') {
            pdfBtn.href = 'neosysaeon-whitepaper-en.pdf';
        } else if (lang === 'cn') {
            pdfBtn.href = 'neosysaeon-whitepaper-cn.pdf';
        } else {
            pdfBtn.href = 'neosysaeon-whitepaper.pdf';
        }
    }

    // Update Outreach Content
    const outreachGrid = document.getElementById('outreach-grid');
    if (outreachGrid && t.outreach_categories) {
        outreachGrid.innerHTML = '';
        t.outreach_categories.forEach(cat => {
            const header = document.createElement('h3');
            header.className = 'outreach-category-title reveal';
            header.textContent = cat.title;
            outreachGrid.appendChild(header);

            cat.items.forEach(c => {
                const card = document.createElement('a');
                card.className = 'outreach-card reveal';
                card.href = c.link;
                card.target = '_blank';
                card.rel = 'noopener noreferrer';
                card.innerHTML = `
                    <div class="outreach-icon">${c.icon}</div>
                    <div class="outreach-name">${c.name}</div>
                    <div class="outreach-topic">${c.topic}</div>
                `;
                outreachGrid.appendChild(card);
            });
        });
        
        setTimeout(() => {
            if (window.revealObserver) {
                outreachGrid.querySelectorAll('.reveal').forEach(el => {
                    el.classList.remove('visible');
                    window.revealObserver.observe(el);
                });
            }
        }, 50);
    }

    drawBadge();
}

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

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
                x: Math.random() * w, y: Math.random() * h,
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
            p.x += p.dx; p.y += p.dy; p.pulse += p.pulseSpeed;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            const a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(167, 139, 250, ${a})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    resize(); createParticles(); draw();
    window.addEventListener('resize', () => { resize(); createParticles(); });
})();

// ── Scroll Reveal ─────────────────────────
(function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                let index = Array.from(siblings).indexOf(entry.target);
                // Simple cap on delay
                index = index === -1 ? 0 : index % 8;
                setTimeout(() => entry.target.classList.add('visible'), index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    window.revealObserver = observer;
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ── Nav Scroll Effect ─────────────────────
(function initNav() {
    const nav = document.getElementById('main-nav');
    const toggle = document.getElementById('nav-toggle');
    const links = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    if (toggle && links) {
        toggle.addEventListener('click', () => links.classList.toggle('open'));
        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => links.classList.remove('open'));
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
})();

// ═══════════════════════════════════════════
// BADGE / GAFETE GENERATOR (with photo + share)
// ═══════════════════════════════════════════
let userPhoto = null;

// Polyfill for roundRect (Safari < 16, older mobile browsers)
function roundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// ── Photo Upload ──────────────────────────
(function initPhotoUpload() {
    const fileInput = document.getElementById('badge-photo');
    const preview = document.getElementById('photo-preview');
    const placeholder = document.getElementById('photo-placeholder');
    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                userPhoto = img;
                preview.src = ev.target.result;
                preview.style.display = 'block';
                placeholder.style.display = 'none';
                drawBadge();
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    });
})();

// ── Draw Gafete Badge ─────────────────────
function drawBadge() {
    const canvas = document.getElementById('badge-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const t = translations[currentLang] || translations.es;

    const nameInput = document.getElementById('badge-name');
    const name = nameInput ? (nameInput.value.trim() || (t.join_placeholder || 'Tu nombre')) : 'Tu nombre';

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#07071a');
    bg.addColorStop(0.4, '#10102e');
    bg.addColorStop(1, '#07071a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Outer border (using polyfill)
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.35)';
    ctx.lineWidth = 2;
    roundRectPath(ctx, 6, 6, w - 12, h - 12, 20);
    ctx.stroke();

    // Top accent bar
    const accent = ctx.createLinearGradient(0, 0, w, 0);
    accent.addColorStop(0, '#a78bfa');
    accent.addColorStop(1, '#7dd3fc');
    ctx.fillStyle = accent;
    ctx.fillRect(30, 6, w - 60, 3);

    // Header: ✨ NEOSYS AEON
    ctx.textAlign = 'center';
    ctx.font = '32px serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('✨', w / 2, 55);
    ctx.font = '700 20px Inter, sans-serif';
    ctx.fillStyle = '#a78bfa';
    ctx.fillText('NEOSYS AEON', w / 2, 88);

    // Thin divider
    ctx.fillStyle = 'rgba(167, 139, 250, 0.25)';
    ctx.fillRect(w / 2 - 50, 100, 100, 1);

    // Photo circle area
    const photoY = 180;
    const photoRadius = 75;
    if (userPhoto) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(w / 2, photoY, photoRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const imgAspect = userPhoto.width / userPhoto.height;
        let sx = 0, sy = 0, sw = userPhoto.width, sh = userPhoto.height;
        if (imgAspect > 1) {
            sx = (userPhoto.width - userPhoto.height) / 2;
            sw = userPhoto.height;
        } else {
            sy = (userPhoto.height - userPhoto.width) / 2;
            sh = userPhoto.width;
        }
        ctx.drawImage(userPhoto, sx, sy, sw, sh,
            w / 2 - photoRadius, photoY - photoRadius, photoRadius * 2, photoRadius * 2);
        ctx.restore();

        // Photo ring
        ctx.beginPath();
        ctx.arc(w / 2, photoY, photoRadius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();
    } else {
        // Placeholder circle
        ctx.beginPath();
        ctx.arc(w / 2, photoY, photoRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(167, 139, 250, 0.08)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '36px serif';
        ctx.fillStyle = 'rgba(167, 139, 250, 0.25)';
        ctx.fillText('📷', w / 2, photoY + 12);
    }

    // Name (big)
    const nameY = photoY + photoRadius + 55;
    ctx.font = '800 32px Inter, sans-serif';
    ctx.fillStyle = '#f5f5f7';
    ctx.fillText(name.toUpperCase(), w / 2, nameY);

    // Member label
    ctx.font = '600 12px monospace';
    ctx.fillStyle = 'rgba(245, 245, 247, 0.35)';
    ctx.fillText(t.join_badge_member || 'MIEMBRO DEL MOVIMIENTO', w / 2, nameY + 32);

    // Divider
    ctx.fillStyle = 'rgba(167, 139, 250, 0.2)';
    ctx.fillRect(w / 2 - 60, nameY + 50, 120, 1);

    // Tagline
    const taglineY = nameY + 80;
    ctx.font = 'italic 500 14px Inter, sans-serif';
    ctx.fillStyle = 'rgba(245, 245, 247, 0.45)';
    const tagline = t.join_badge_tagline || '"Sin ciencia no hay verdad. Sin validación no hay progreso."';
    const cleanTagline = tagline.replace(/"/g, '');
    const tagParts = cleanTagline.split(/[.。]/);
    if (tagParts.length >= 2 && tagParts[1].trim()) {
        ctx.fillText('"' + tagParts[0].trim() + '.', w / 2, taglineY);
        ctx.fillText(tagParts[1].trim() + '."', w / 2, taglineY + 22);
    } else {
        ctx.fillText(tagline, w / 2, taglineY);
    }

    // Hashtag
    const hashY = h - 55;
    ctx.font = '700 18px monospace';
    ctx.fillStyle = '#a78bfa';
    ctx.fillText('#NeosysAeon  #ThinkWithEvidence', w / 2, hashY);

    // Bottom accent bar
    ctx.fillStyle = accent;
    ctx.fillRect(30, h - 9, w - 60, 3);

    // Corner sparkles
    ctx.font = '14px serif';
    ctx.fillStyle = '#a78bfa';
    ctx.fillText('✨', 25, 28);
    ctx.fillText('✨', w - 25, 28);
    ctx.fillText('✨', 25, h - 16);
    ctx.fillText('✨', w - 25, h - 16);
}

// ── Badge Form + Actions ──────────────────
(function initBadge() {
    const form = document.getElementById('badge-form');
    const actions = document.getElementById('badge-actions');
    const canvas = document.getElementById('badge-canvas');
    if (!form || !canvas) return;

    // Draw initial preview
    drawBadge();
    // Show actions right away so users see share/download buttons
    if (actions) actions.style.display = 'flex';

    // Live preview as user types
    const nameInput = document.getElementById('badge-name');
    if (nameInput) {
        nameInput.addEventListener('input', drawBadge);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('badge-name');
        const emailInput = document.getElementById('badge-email');
        
        // Guardar a Firebase
        if (db && firebaseConfig.projectId !== "YOUR_PROJECT_ID" && nameInput && emailInput) {
            try {
                await db.collection('miembros').add({
                    name: nameInput.value,
                    email: emailInput.value, // Sugerencia: En Firebase Rules, no permitas la lectura pública de este array; restringe la UI a solo leer nombres.
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            } catch (err) {
                console.error("Error al registrar miembro:", err);
            }
        }

        drawBadge();
        // Auto-download badge when generating
        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = 'neosysaeon-gafete.png';
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, 'image/png');
    });

    // ── Share helpers ──
    const shareUrl = 'https://yepzhi.com/neosys/';

    // Copiar Texto
    const copyBtn = document.getElementById('share-copy');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const textToShare = t.join_share_text || 'Soy parte del movimiento #NeosysAeon #ThinkWithEvidence — Sin ciencia no hay verdad. Sin validación no hay progreso. https://yepzhi.com/neosys/';
            navigator.clipboard.writeText(textToShare).then(() => {
                const isEs = document.documentElement.lang === 'es' || !document.documentElement.lang;
                alert(isEs ? 'Texto copiado. ¡Listo para pegar!' : 'Text copied. Ready to paste!');
            });
        });
    }

    // Instagram
    const igBtn = document.getElementById('share-instagram');
    if (igBtn) {
        igBtn.addEventListener('click', () => {
            const textToShare = t.join_share_text || 'Soy parte del movimiento #NeosysAeon #ThinkWithEvidence — Sin ciencia no hay verdad. Sin validación no hay progreso. https://yepzhi.com/neosys/';
            navigator.clipboard.writeText(textToShare).then(() => {
                const isEs = document.documentElement.lang === 'es' || !document.documentElement.lang;
                alert(isEs ? 'Texto copiado.\n\nAbre Instagram y pega el texto al compartir tu Gafete descargado.' : 'Text copied.\n\nOpen Instagram and paste the text when sharing your saved Badge.');
            });
        });
    }

    // Twitter/X
    document.getElementById('share-twitter').addEventListener('click', () => {
        const textToShare = t.join_share_text || 'Soy parte del movimiento #NeosysAeon #ThinkWithEvidence — Sin ciencia no hay verdad. Sin validación no hay progreso. https://yepzhi.com/neosys/';
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToShare)}`;
        window.open(url, '_blank');
    });

    // Facebook
    document.getElementById('share-facebook').addEventListener('click', () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
    });

    // WhatsApp
    document.getElementById('share-whatsapp').addEventListener('click', () => {
        const textToShare = t.join_share_text || 'Soy parte del movimiento #NeosysAeon #ThinkWithEvidence — Sin ciencia no hay verdad. Sin validación no hay progreso. https://yepzhi.com/neosys/';
        const url = `https://wa.me/?text=${encodeURIComponent(textToShare)}`;
        window.open(url, '_blank');
    });

    // Native Share (with image file if supported)
    const shareNativeBtn = document.getElementById('share-native');
    if (!navigator.share) {
        // Hide native share button if Web Share API not available
        shareNativeBtn.style.display = 'none';
    } else {
        shareNativeBtn.addEventListener('click', async () => {
            try {
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                const file = new File([blob], 'neosysaeon-gafete.png', { type: 'image/png' });

                const shareData = {
                    title: 'Neosys Aeon ✨',
                    text: t.join_share_text || 'Soy parte del movimiento #NeosysAeon #ThinkWithEvidence — Sin ciencia no hay verdad. Sin validación no hay progreso. https://yepzhi.com/neosys/',
                    url: shareUrl
                };

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    shareData.files = [file];
                }

                await navigator.share(shareData);
            } catch (err) {
                if (err.name !== 'AbortError') console.log('Share:', err);
            }
        });
    }
})();

// ── Mandamiento Cards Stagger ─────────────
(function initMandamientoStagger() {
    const cards = document.querySelectorAll('.mandamiento-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = Array.from(cards).indexOf(entry.target);
                setTimeout(() => entry.target.classList.add('visible'), idx * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });
    cards.forEach(card => observer.observe(card));
})();
