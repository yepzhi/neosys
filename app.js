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

// ═══════════════════════════════════════════
// STATE LISTS FOR USA & MEXICO
// ═══════════════════════════════════════════
const statesMX = [
    'Aguascalientes','Baja California','Baja California Sur','Campeche','Chiapas','Chihuahua',
    'Ciudad de México','Coahuila','Colima','Durango','Estado de México','Guanajuato','Guerrero',
    'Hidalgo','Jalisco','Michoacán','Morelos','Nayarit','Nuevo León','Oaxaca','Puebla',
    'Querétaro','Quintana Roo','San Luis Potosí','Sinaloa','Sonora','Tabasco','Tamaulipas',
    'Tlaxcala','Veracruz','Yucatán','Zacatecas'
];

const statesUS = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
    'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
    'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
    'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
    'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
    'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
    'Virginia','Washington','West Virginia','Wisconsin','Wyoming'
];

// ── Country/State Selector Logic ──────────
(function initLocationSelector() {
    const countrySelect = document.getElementById('badge-country');
    const stateSelect = document.getElementById('badge-state');
    if (!countrySelect || !stateSelect) return;

    countrySelect.addEventListener('change', () => {
        const country = countrySelect.value;
        stateSelect.innerHTML = '';
        if (country === 'MX' || country === 'US') {
            const states = country === 'MX' ? statesMX : statesUS;
            const defaultOpt = document.createElement('option');
            defaultOpt.value = '';
            defaultOpt.textContent = country === 'MX' ? 'Selecciona tu estado' : 'Select your state';
            stateSelect.appendChild(defaultOpt);
            states.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s;
                opt.textContent = s;
                stateSelect.appendChild(opt);
            });
            stateSelect.style.display = 'block';
            stateSelect.required = true;
        } else {
            stateSelect.style.display = 'none';
            stateSelect.required = false;
        }
    });
})();

function loadCommunity() {
    const list = document.getElementById('community-list');
    if (!list || !db) return;
    
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
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'member-name';
            nameSpan.textContent = data.name || 'Constructor Anónimo';
            
            el.appendChild(dot);
            el.appendChild(nameSpan);

            // Show location if available
            if (data.country) {
                const locSpan = document.createElement('span');
                locSpan.className = 'member-location';
                const countryEl = document.getElementById('badge-country');
                let countryName = data.country;
                if (countryEl) {
                    const opt = countryEl.querySelector(`option[value="${data.country}"]`);
                    if (opt) countryName = opt.textContent;
                }
                locSpan.textContent = data.state ? `${data.state}, ${countryName}` : countryName;
                el.appendChild(locSpan);
            }

            // Show social handle if available
            if (data.social) {
                const socialSpan = document.createElement('span');
                socialSpan.className = 'member-social';
                socialSpan.textContent = data.social;
                el.appendChild(socialSpan);
            }

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
    localStorage.setItem('nsa_lang', lang);
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
            const grid = document.createElement('div');
            grid.className = 'outreach-grid-items';
            
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
                grid.appendChild(card);
            });
            outreachGrid.appendChild(grid);
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
            const href = a.getAttribute('href');
            if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
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

    // Secondary descriptive tagline
    const descY = hashY - 45;
    ctx.font = 'italic 400 12px Inter, sans-serif';
    ctx.fillStyle = 'rgba(245, 245, 247, 0.45)';
    const desc = t.join_badge_desc2 || 'Una propuesta para vivir en ciencia, frente a la pseudociencia.';
    
    // Auto-wrap the description to max 2 lines
    const maxWidth = w - 60;
    const words = desc.split(' ');
    let line = '';
    let line1 = '';
    let line2 = '';
    for(let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            if (!line1) {
                line1 = line;
                line = words[n] + ' ';
            } else {
                line2 = line;
                break;
            }
        } else {
            line = testLine;
        }
    }
    if (!line1) line1 = line;
    else if (!line2) line2 = line;
    
    if (line1 && line2) {
        ctx.fillText(line1.trim(), w / 2, descY - 14);
        ctx.fillText(line2.trim(), w / 2, descY);
    } else {
        ctx.fillText(line1.trim(), w / 2, descY);
    }

    // Hashtag
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

    // Photo Upload Logic
    const photoInput = document.getElementById('badge-photo');
    const photoPreview = document.getElementById('photo-preview');
    const photoPlaceholder = document.getElementById('photo-placeholder');
    if (photoInput && photoPreview && photoPlaceholder) {
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    photoPreview.src = event.target.result;
                    photoPreview.style.display = 'block';
                    photoPlaceholder.style.display = 'none';
                    
                    const img = new Image();
                    img.onload = () => {
                        userPhoto = img;
                        drawBadge();
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('badge-name');
        const emailInput = document.getElementById('badge-email');
        const phoneInput = document.getElementById('badge-phone');
        const socialInput = document.getElementById('badge-social');
        const cityInput = document.getElementById('badge-city');
        const countryInput = document.getElementById('badge-country');
        const stateInput = document.getElementById('badge-state');
        
        // Build member data
        const memberData = {
            name: nameInput ? nameInput.value : '',
            email: emailInput ? emailInput.value : '',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        if (phoneInput && phoneInput.value.trim()) memberData.phone = phoneInput.value.trim();
        if (socialInput && socialInput.value.trim()) memberData.social = socialInput.value.trim();
        if (cityInput && cityInput.value.trim()) memberData.city = cityInput.value.trim();
        if (countryInput && countryInput.value) memberData.country = countryInput.value;
        if (stateInput && stateInput.value) memberData.state = stateInput.value;

        // Guardar a Firebase
        if (db && firebaseConfig.projectId !== "YOUR_PROJECT_ID" && nameInput && emailInput) {
            try {
                await db.collection('miembros').add(memberData);
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
    const shareText = '✨ Soy parte del movimiento Neosys Aeon\n\n#NeosysAeon #ThinkWithEvidence #SinCienciaNoHayVerdad\n\n' + shareUrl;

    function downloadBadge() {
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
    }

    // Copiar Texto
    const copyBtn = document.getElementById('share-copy');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(shareText).then(() => {
                downloadBadge();
                alert('✅ Texto copiado y gafete descargado.\n\nPégalo en tu red social favorita junto con la imagen.');
            });
        });
    }

    // Instagram
    const igBtn = document.getElementById('share-instagram');
    if (igBtn) {
        igBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(shareText).then(() => {
                downloadBadge();
                alert('✅ Texto copiado y gafete descargado.\n\nAbre Instagram → Nueva publicación → Selecciona la imagen del gafete → Pega el texto.');
            });
        });
    }

    // Twitter/X
    const twBtn = document.getElementById('share-twitter');
    if (twBtn) {
        twBtn.addEventListener('click', () => {
            downloadBadge();
            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
            window.open(url, '_blank');
        });
    }

    // Facebook
    const fbBtn = document.getElementById('share-facebook');
    if (fbBtn) {
        fbBtn.addEventListener('click', () => {
            downloadBadge();
            const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            window.open(url, '_blank');
        });
    }

    // WhatsApp
    const waBtn = document.getElementById('share-whatsapp');
    if (waBtn) {
        waBtn.addEventListener('click', () => {
            const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
            window.open(url, '_blank');
        });
    }

    // Native Share (with image file if supported)
    const shareNativeBtn = document.getElementById('share-native');
    if (shareNativeBtn) {
        if (!navigator.share) {
            shareNativeBtn.style.display = 'none';
        } else {
            shareNativeBtn.addEventListener('click', async () => {
                try {
                    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                    const file = new File([blob], 'neosysaeon-gafete.png', { type: 'image/png' });
                    const shareData = {
                        title: 'Neosys Aeon ✨',
                        text: shareText,
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

// ═══════════════════════════════════════════
// COMMUNITY TABS (Directory / Map)
// ═══════════════════════════════════════════
(function initCommunityTabs() {
    const tabDir = document.getElementById('tab-directory');
    const tabMap = document.getElementById('tab-map');
    const dirView = document.getElementById('directory-view');
    const mapView = document.getElementById('map-view');
    if (!tabDir || !tabMap || !dirView || !mapView) return;

    let mapInitialized = false;

    tabDir.addEventListener('click', () => {
        tabDir.classList.add('active');
        tabMap.classList.remove('active');
        dirView.style.display = '';
        mapView.style.display = 'none';
    });

    tabMap.addEventListener('click', () => {
        tabMap.classList.add('active');
        tabDir.classList.remove('active');
        mapView.style.display = '';
        dirView.style.display = 'none';
        if (!mapInitialized) {
            mapInitialized = true;
            initCommunityMap();
        }
    });
})();

// ═══════════════════════════════════════════
// COMMUNITY MAP (Leaflet)
// ═══════════════════════════════════════════
const stateCoords = {
    // Mexico
    'Aguascalientes': [21.88, -102.29], 'Baja California': [30.84, -115.28], 'Baja California Sur': [25.04, -111.67],
    'Campeche': [18.93, -90.32], 'Chiapas': [16.75, -93.12], 'Chihuahua': [28.63, -106.09],
    'Ciudad de México': [19.43, -99.13], 'Coahuila': [27.06, -101.71], 'Colima': [19.24, -103.72],
    'Durango': [24.03, -104.65], 'Estado de México': [19.49, -99.68], 'Guanajuato': [21.02, -101.26],
    'Guerrero': [17.44, -99.55], 'Hidalgo': [20.12, -98.73], 'Jalisco': [20.66, -103.35],
    'Michoacán': [19.57, -101.71], 'Morelos': [18.68, -99.10], 'Nayarit': [21.75, -104.85],
    'Nuevo León': [25.67, -100.32], 'Oaxaca': [17.07, -96.73], 'Puebla': [19.04, -98.20],
    'Querétaro': [20.59, -100.39], 'Quintana Roo': [19.18, -88.48], 'San Luis Potosí': [22.15, -100.98],
    'Sinaloa': [24.79, -107.39], 'Sonora': [29.07, -110.96], 'Tabasco': [17.99, -92.93],
    'Tamaulipas': [24.27, -98.84], 'Tlaxcala': [19.32, -98.24], 'Veracruz': [19.17, -96.13],
    'Yucatán': [20.97, -89.62], 'Zacatecas': [22.77, -102.58],
    // USA
    'Alabama': [32.32, -86.90], 'Alaska': [63.59, -154.49], 'Arizona': [34.05, -111.09],
    'Arkansas': [34.97, -92.37], 'California': [36.78, -119.42], 'Colorado': [39.55, -105.78],
    'Connecticut': [41.60, -72.76], 'Delaware': [38.91, -75.53], 'Florida': [27.66, -81.52],
    'Georgia': [32.16, -82.90], 'Hawaii': [19.90, -155.58], 'Idaho': [44.07, -114.74],
    'Illinois': [40.63, -89.40], 'Indiana': [40.27, -86.13], 'Iowa': [41.88, -93.10],
    'Kansas': [39.01, -98.48], 'Kentucky': [37.84, -84.27], 'Louisiana': [30.98, -91.96],
    'Maine': [45.25, -69.45], 'Maryland': [39.05, -76.64], 'Massachusetts': [42.41, -71.38],
    'Michigan': [44.31, -85.60], 'Minnesota': [46.73, -94.69], 'Mississippi': [32.35, -89.40],
    'Missouri': [37.96, -91.83], 'Montana': [46.88, -110.36], 'Nebraska': [41.49, -99.90],
    'Nevada': [38.80, -116.42], 'New Hampshire': [43.19, -71.57], 'New Jersey': [40.06, -74.41],
    'New Mexico': [34.52, -105.87], 'New York': [43.30, -74.22], 'North Carolina': [35.76, -79.02],
    'North Dakota': [47.55, -101.00], 'Ohio': [40.42, -82.91], 'Oklahoma': [35.47, -97.52],
    'Oregon': [43.80, -120.55], 'Pennsylvania': [41.20, -77.19], 'Rhode Island': [41.58, -71.48],
    'South Carolina': [33.84, -81.16], 'South Dakota': [43.97, -99.90], 'Tennessee': [35.52, -86.58],
    'Texas': [31.97, -99.90], 'Utah': [39.32, -111.09], 'Vermont': [44.56, -72.58],
    'Virginia': [37.43, -78.66], 'Washington': [47.75, -120.74], 'West Virginia': [38.60, -80.45],
    'Wisconsin': [43.78, -88.79], 'Wyoming': [43.08, -107.29]
};

// Country center coords for non-US/MX members
const countryCoords = {
    'AR': [-38.42, -63.62], 'BR': [-14.24, -51.93], 'CL': [-35.68, -71.54],
    'CO': [4.57, -74.30], 'CR': [9.75, -83.75], 'CU': [21.52, -77.78],
    'DO': [18.74, -70.16], 'EC': [-1.83, -78.18], 'SV': [13.79, -88.90],
    'GT': [15.78, -90.23], 'HN': [15.20, -86.24], 'NI': [12.87, -85.21],
    'PA': [8.54, -80.78], 'PY': [-23.44, -58.44], 'PE': [-9.19, -75.02],
    'UY': [-32.52, -55.77], 'VE': [6.42, -66.59],
    'ES': [40.46, -3.75], 'FR': [46.23, 2.21], 'DE': [51.17, 10.45],
    'IT': [41.87, 12.57], 'GB': [55.38, -3.44], 'PT': [39.40, -8.22],
    'CA': [56.13, -106.35], 'JP': [36.20, 138.25], 'CN': [35.86, 104.20],
    'IN': [20.59, 78.96], 'AU': [-25.27, 133.77], 'KR': [35.91, 127.77]
};

function initCommunityMap() {
    if (typeof L === 'undefined') return;

    const map = L.map('community-map', {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView([23.63, -102.55], 4); // Center on Mexico

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    if (!db) return;

    // Aggregate members by location
    db.collection('miembros').orderBy('timestamp', 'desc').limit(500).get().then((snapshot) => {
        const locationCounts = {};

        snapshot.forEach(doc => {
            const data = doc.data();
            let coords = null;
            let label = '';

            if (data.state && stateCoords[data.state]) {
                coords = stateCoords[data.state];
                label = data.state;
            } else if (data.country && countryCoords[data.country]) {
                coords = countryCoords[data.country];
                label = data.country;
            }

            if (coords) {
                const key = coords.join(',');
                if (!locationCounts[key]) {
                    locationCounts[key] = { coords, label, count: 0 };
                }
                locationCounts[key].count++;
            }
        });

        Object.values(locationCounts).forEach(loc => {
            const size = Math.min(16 + loc.count * 4, 40);
            const icon = L.divIcon({
                className: 'map-marker-custom',
                html: `<div style="
                    background: rgba(167, 139, 250, 0.8);
                    border: 2px solid #a78bfa;
                    border-radius: 50%;
                    width: ${size}px;
                    height: ${size}px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: ${Math.max(10, size / 2.5)}px;
                    font-weight: 700;
                    color: #fff;
                    box-shadow: 0 0 12px rgba(167, 139, 250, 0.5);
                ">${loc.count}</div>`,
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2]
            });

            L.marker(loc.coords, { icon }).addTo(map)
                .bindPopup(`<strong>${loc.label}</strong><br>${loc.count} miembro${loc.count > 1 ? 's' : ''}`);
        });
    });
}

// Inicializar idioma al final para evitar errores de inicialización de variables (Temporal Dead Zone)
applyLanguage(currentLang);
