/* ═══════════════════════════════════════════
   NEOSYS AEON — App Logic
   Particles / Reveal / Badge / Nav / i18n
   ═══════════════════════════════════════════ */

// ── Global Localization Setup ─────────────────────
let currentLang = localStorage.getItem('neosys_lang') || 'en';
if (!['es', 'en', 'cn'].includes(currentLang)) currentLang = 'en';
const version = "4.7.0"; // Refined Versioning for V2.0
console.log("Neosys Aeon Loader v" + version);

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

const APP_VERSION = "4.7.0"; // Unifying versioning

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

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('neosys_lang', lang);
    const t = translations[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) el.innerHTML = t[key];
    });

    // Sync Badge
    if (typeof drawBadge === 'function') drawBadge();

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key] !== undefined) el.placeholder = t[key];
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
        const key = el.getAttribute('data-i18n-alt');
        if (t[key] !== undefined) el.alt = t[key];
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.documentElement.lang = lang === 'cn' ? 'zh-Hant' : lang;

    // Update Whitepaper Links (Dynamic)
    document.querySelectorAll('.wp-link-dynamic').forEach(link => {
        if (lang === 'en') {
            link.href = 'neosysaeon-whitepaper-v4.1-EN.pdf';
        } else if (lang === 'cn') {
            link.href = 'neosysaeon-whitepaper-v4.1-ZH.pdf';
        } else {
            link.href = 'neosysaeon-whitepaper-v4.1.pdf';
        }
    });

    if (typeof populateSourceSelects === 'function') populateSourceSelects();
    if (typeof fetchEvidencias === 'function') fetchEvidencias();

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
                const card = document.createElement('div');
                card.className = 'outreach-card reveal';
                card.innerHTML = `
                    <div class="outreach-icon">${c.icon}</div>
                    <div class="outreach-name">${c.name}</div>
                    <div class="outreach-topic">${c.topic}</div>
                `;
                grid.appendChild(card);
            });
            outreachGrid.appendChild(header);
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
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });
    window.revealObserver = observer;
    // Initial check for elements already in view
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
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

// ── Draw Gafete Badge ─────────────────────
function drawBadge() {
    const canvas = document.getElementById('badge-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set HD Resolution (1200x1600)
    const targetW = 1200;
    const targetH = 1600;
    if (canvas.width !== targetW) canvas.width = targetW;
    if (canvas.height !== targetH) canvas.height = targetH;

    const w = targetW;
    const h = targetH;
    const t = translations[currentLang] || translations.es;
    console.log("Neosys: Rendering badge in " + currentLang);

    // --- 1. Background (Deep Space Premium + Pulse Sparkles) ---
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0a0a20');
    grad.addColorStop(1, '#020208');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle Grid
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 120) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 120) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Light Sparkles effect
    for (let i = 0; i < 30; i++) {
        const sx = Math.random() * w;
        const sy = Math.random() * h;
        const size = Math.random() * 3 + 1;
        const alpha = Math.random() * 0.5 + 0.1;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
        if (i % 5 === 0) { // Glowy ones
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#a78bfa';
            ctx.fillText('✨', sx, sy);
            ctx.shadowBlur = 0;
        }
    }

    // --- 2. Logo & Title (Top) ---
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Sparkle (2.5x larger, slightly lower)
    ctx.fillStyle = 'rgba(167, 139, 250, 1)';
    ctx.font = '600 120px Inter, sans-serif';
    ctx.fillText('✨', w / 2, 100);

    // Neosys Aeon (Hero Style: Large & Glowing)
    ctx.fillStyle = '#fff';
    ctx.font = '900 110px Inter, sans-serif';
    ctx.letterSpacing = '12px';
    ctx.shadowColor = 'rgba(167, 139, 250, 0.7)';
    ctx.shadowBlur = 30;
    ctx.fillText('NEOSYS AEON', w / 2, 230);
    ctx.shadowBlur = 0;
    ctx.letterSpacing = '0px';

    // --- 3. User Photo ---
    const photoY = 560; 
    const photoSize = 400;
    
    // Glowing ring
    ctx.beginPath();
    ctx.arc(w / 2, photoY, (photoSize / 2) + 15, 0, Math.PI * 2);
    const radGrad = ctx.createRadialGradient(w/2, photoY, photoSize/2, w/2, photoY, photoSize/2 + 20);
    radGrad.addColorStop(0, 'rgba(167, 139, 250, 0.8)');
    radGrad.addColorStop(1, 'rgba(167, 139, 250, 0)');
    ctx.strokeStyle = radGrad;
    ctx.lineWidth = 20;
    ctx.stroke();

    if (userPhoto) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(w / 2, photoY, photoSize / 2, 0, Math.PI * 2);
        ctx.clip();
        const aspect = userPhoto.width / userPhoto.height;
        let drawW, drawH;
        if (aspect > 1) {
            drawH = photoSize;
            drawW = photoSize * aspect;
        } else {
            drawW = photoSize;
            drawH = photoSize / aspect;
        }
        ctx.drawImage(userPhoto, w / 2 - drawW / 2, photoY - drawH / 2, drawW, drawH);
        ctx.restore();
    } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.arc(w / 2, photoY, photoSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '100px serif';
        ctx.fillText('👤', w / 2, photoY + 15);
    }

    // --- 4. Identification ---
    const nameY = 820;
    const nameInput = document.getElementById('badge-name');
    const defaultName = t.badge_name_placeholder || 'TU NOMBRE';
    const nameStr = nameInput ? (nameInput.value.trim() || defaultName) : defaultName;
    
    ctx.fillStyle = '#fff';
    ctx.font = '900 90px Inter, sans-serif';
    ctx.fillText(nameStr.toUpperCase(), w / 2, nameY);

    // Line under name
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 400, nameY + 50);
    ctx.lineTo(w / 2 + 400, nameY + 50);
    ctx.stroke();

    ctx.fillStyle = 'rgba(167, 139, 250, 0.9)';
    ctx.font = '600 40px Inter, sans-serif';
    ctx.fillText(t.badge_member || 'MIEMBRO DEL MOVIMIENTO', w / 2, nameY + 110);

    // --- 5. Centered Phrases (Enlarged & Clearer) ---
    const phraseStartY = nameY + 220;
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; // Brighter gray
    ctx.font = '500 38px Inter, sans-serif'; 

    // Phrase 1
    ctx.fillText(t.badge_phrase1_l1 || 'Sin ciencia no hay claridad.', w / 2, phraseStartY);
    ctx.fillText(t.badge_phrase1_l2 || 'Sin validación no hay progreso.', w / 2, phraseStartY + 50);

    // Phrase 2
    ctx.fillText(t.badge_phrase2_l1 || 'Un marco abierto para entender la realidad', w / 2, phraseStartY + 120);
    ctx.fillText(t.badge_phrase2_l2 || 'a través de evidencia verificable.', w / 2, phraseStartY + 170);

    // Call to Action (Purple)
    ctx.fillStyle = 'rgba(167, 139, 250, 1)';
    ctx.font = '700 42px Inter, sans-serif'; 
    ctx.fillText(t.badge_phrase3 || '¡Conoce los 10 principios del Cosmos hoy!', w / 2, phraseStartY + 270);

    // --- 6. Footer & Tags ---
    ctx.fillStyle = 'rgba(167, 139, 250, 0.8)';
    ctx.font = '700 52px Inter, sans-serif';
    ctx.fillText('#ThinkWithEvidence  #NeosysAeon', w / 2, h - 140);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.font = '300 24px Inter, sans-serif';
    ctx.fillText('YEPZHI.COM/NEOSYS', w / 2, h - 60);

    const preview = document.getElementById('badge-preview');
    if (preview) {
        preview.src = canvas.toDataURL('image/png');
    }
}

// Helper to wrap text on canvas
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let testY = y;

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, testY);
            line = words[n] + ' ';
            testY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, testY);
}

// ── Badge & Interactive Systems ──────────
(function initSystems() {
    const form = document.getElementById('badge-form');
    const actions = document.getElementById('badge-actions');
    const canvas = document.getElementById('badge-canvas');
    if (!form || !canvas) return;

    // --- 1. Badge Live Preview ---
    const nameInput = document.getElementById('badge-name');
    if (nameInput) nameInput.addEventListener('input', drawBadge);
    
    // --- 2. Photo Upload ---
    const photoInput = document.getElementById('badge-photo');
    const photoPreview = document.getElementById('photo-preview');
    const photoPlaceholder = document.getElementById('photo-placeholder');
    if (photoInput) {
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    userPhoto = img;
                    if (photoPreview) {
                        photoPreview.src = ev.target.result;
                        photoPreview.style.display = 'block';
                    }
                    if (photoPlaceholder) photoPlaceholder.style.display = 'none';
                    drawBadge();
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // --- 3. Decision Character Count ---
    const decisionInput = document.getElementById('decision_evidencia');
    const charCountDisplay = document.getElementById('decision-char-count');
    if (decisionInput && charCountDisplay) {
        decisionInput.addEventListener('input', () => {
            const count = decisionInput.value.length;
            charCountDisplay.textContent = `${count} / 30 min`;
            if (count >= 30) {
                charCountDisplay.classList.add('valid');
            } else {
                charCountDisplay.classList.remove('valid');
            }
        });
    }

    // --- 4. Registration & Download ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        const t = translations[currentLang] || translations.es;

        // Validation
        const decisionVal = decisionInput ? decisionInput.value.trim() : '';
        const sourceVal = sourceInput ? sourceInput.value : '';
        
        if (!userPhoto) {
            alert(currentLang === 'es' ? 'Sube tu foto para generar el gafete.' : 'Upload your photo to generate the badge.');
            return;
        }
        if (decisionVal.length < 30) {
            alert(currentLang === 'es' ? 'Describe tu decisión. Mínimo 30 caracteres.' : 'Describe your decision. Minimum 30 characters.');
            return;
        }
        if (!sourceVal) {
            alert(currentLang === 'es' ? 'Selecciona el tipo de evidencia que utilizaste.' : 'Select the type of evidence you used.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> ' + (t.comm_loading_register || (currentLang === 'es' ? 'Registrando...' : 'Registering...'));

        const emailInput = document.getElementById('badge-email');
        const socialInput = document.getElementById('badge-social');
        const cityInput = document.getElementById('badge-city');
        const countryInput = document.getElementById('badge-country');
        const sourceInput = document.getElementById('tipo_fuente');
        const refInput = document.getElementById('fuente_referencia');
        
        // Build member data with ALL fields
        const memberData = {
            name: nameInput ? nameInput.value.trim() : '',
            email: emailInput ? emailInput.value.trim() : '',
            social: socialInput ? socialInput.value.trim() : '',
            city: cityInput ? cityInput.value.trim() : '',
            country: countryInput ? countryInput.value : '',
            decision_evidencia: decisionVal,
            tipo_fuente: sourceInput ? sourceInput.value : '',
            fuente_referencia: refInput ? refInput.value.trim() : '',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            decision_fecha: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Guardar a Firebase
        if (db && firebaseConfig.projectId !== "YOUR_PROJECT_ID" && memberData.name && memberData.email) {
            try {
                await db.collection('miembros').add(memberData);
            } catch (err) {
                console.error("Error al registrar miembro:", err);
            }
        }

        drawBadge();
        
        // Finalize Download
        try {
            const canvas = document.getElementById('badge-canvas');
            if (canvas) {
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = `neosysaeon-gafete-${memberData.name.replace(/\s+/g, '-').toLowerCase()}.png`;
                    link.href = url;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                }
            }
        } catch (downloadErr) {
            console.error("Download error:", downloadErr);
        }

        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Ensure actions are visible
        if (actions) actions.style.display = 'flex';
    });
})();

// --- 5. Populate Source Selects ---
function populateSourceSelects() {
    const selects = [document.getElementById('tipo_fuente'), document.getElementById('filter-source-type')];
    if (typeof translations === 'undefined') return;
    const t = translations[currentLang];
    if (!t || !t.source_types) return;

    selects.forEach(select => {
        if (!select) return;
        const isFilter = select.id === 'filter-source-type';
        select.innerHTML = '';
        
        // Add placeholder/default
        const defaultOpt = document.createElement('option');
        defaultOpt.value = isFilter ? 'all' : '';
        defaultOpt.textContent = isFilter ? (t.filter_all || 'Todas') : (t.source_types.placeholder || 'Selecciona...');
        select.appendChild(defaultOpt);

        // Add other options
        Object.entries(t.source_types).forEach(([key, label]) => {
            if (key === 'placeholder') return;
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = label;
            select.appendChild(opt);
        });
    });
}

// --- 6. Evidencias Page Logic ---
async function fetchEvidencias(filterValue = 'all') {
    const evidenciasList = document.getElementById('evidencias-list');
    if (!evidenciasList || !db) return;
    
    evidenciasList.innerHTML = `<p style="text-align: center; color: var(--text-tertiary); width: 100%;" data-i18n="comm_loading">${translations[currentLang].comm_loading || 'Cargando...'}</p>`;

    try {
        let query = db.collection('miembros').orderBy('decision_fecha', 'desc');
        const snapshot = await query.get();
        
        evidenciasList.innerHTML = '';
        const t = translations[currentLang];
        
        snapshot.forEach(doc => {
            const data = doc.data();
            if (!data.decision_evidencia) return;

            // Filter logic (client side)
            if (filterValue !== 'all' && data.tipo_fuente !== filterValue) return;

            const card = document.createElement('div');
            card.className = 'evidence-card reveal';
            
            const sourceText = (t.source_types && t.source_types[data.tipo_fuente]) || data.tipo_fuente;
            const date = data.decision_fecha ? data.decision_fecha.toDate().toLocaleDateString() : '';

            card.innerHTML = `
                <div class="evidence-card-header">
                    <div class="evidence-card-name">${data.name}</div>
                    <div class="evidence-card-meta">
                        <span>${data.city}, ${data.country}</span>
                        ${data.social ? `<span class="evidence-card-social">${data.social}</span>` : ''}
                        <span>${date}</span>
                    </div>
                </div>
                <div class="evidence-card-body">
                    <div class="evidence-card-label">${t.card_decision_label || 'Decisión:'}</div>
                    <div class="evidence-card-decision">${data.decision_evidencia}</div>
                </div>
                <div class="evidence-card-footer">
                    <div class="evidence-card-source">
                        <span class="evidence-card-source-icon">🔬</span>
                        <span>${t.card_source_label || 'Fuente:'} ${sourceText}</span>
                    </div>
                    ${data.fuente_referencia ? `
                        <a href="${data.fuente_referencia.startsWith('http') ? data.fuente_referencia : '#'}" target="_blank" class="evidence-card-ref">
                            ${t.card_ref_label || 'Referencia:'} ${data.fuente_referencia}
                        </a>
                    ` : ''}
                </div>
            `;
            evidenciasList.appendChild(card);
        });

        if (evidenciasList.innerHTML === '') {
            evidenciasList.innerHTML = `<p style="text-align: center; color: var(--text-tertiary); width: 100%;">No hay evidencias registradas en esta categoría.</p>`;
        }

    } catch (err) {
        console.error("Error fetching evidencias:", err);
        evidenciasList.innerHTML = `<p style="text-align: center; color: var(--text-tertiary); width: 100%;">Error al cargar los datos.</p>`;
    }
}

    // ── Principles Section Logic (Grid is static) ────────────


    // ── Poster Generator Logic ───────────────
    const posterBtn = document.getElementById('download-poster');
    if (posterBtn) {
        posterBtn.addEventListener('click', generateCommandmentsPoster);
    }

    function generateCommandmentsPoster() {
        const slidesData = [
            { id: 1, title: 'm1_title', body: 'm1_body' }, { id: 2, title: 'm2_title', body: 'm2_body' },
            { id: 3, title: 'm3_title', body: 'm3_body' }, { id: 4, title: 'm4_title', body: 'm4_body' },
            { id: 5, title: 'm5_title', body: 'm5_body' }, { id: 6, title: 'm6_title', body: 'm6_body' },
            { id: 7, title: 'm7_title', body: 'm7_body' }, { id: 8, title: 'm8_title', body: 'm8_body' },
            { id: 9, title: 'm9_title', body: 'm9_body' }, { id: 10, title: 'm10_title', body: 'm10_body' }
        ];
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 1400; // More compact card format
        const ctx = canvas.getContext('2d');
        const t = translations[currentLang] || translations.es;

        // Background
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#0a0a20');
        grad.addColorStop(1, '#020208');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '900 80px Inter, sans-serif';
        ctx.shadowColor = 'rgba(167, 139, 250, 0.4)';
        ctx.shadowBlur = 20;
        ctx.fillText('NEOSYS AEON ✨', canvas.width / 2, 120);
        ctx.shadowBlur = 0;

        // Subtitle (Commonly used as the smaller title)
        ctx.font = '700 32px Inter, sans-serif';
        ctx.fillStyle = 'rgba(167, 139, 250, 1)';
        const posterTitle = (t.mand_title || "10 PRINCIPIOS OPERATIVOS").replace('<br>', ' ').replace(/<[^>]*>?/gm, '').toUpperCase();
        ctx.fillText(posterTitle, canvas.width / 2, 190);

        // Tagline (Top - now even closer to the title/subtitle)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = 'italic 300 22px Inter, sans-serif';
        ctx.fillText(t.hero_tagline || 'Sin ciencia no hay verdad. Sin validación no hay progreso.', canvas.width / 2, 270);

        // 2-Column Grid of 10 Principles
        ctx.textAlign = 'left';
        const startY = 340; // Shifted up slightly to fill space
        const col1X = 180; // Centered columns more effectively
        const col2X = 590; // Centered columns more effectively
        const spacingY = 190;

        slidesData.forEach((s, i) => {
            const isSecondCol = i >= 5;
            const x = isSecondCol ? col2X : col1X;
            const row = isSecondCol ? i - 5 : i;
            const y = startY + (row * spacingY);

            const title = t[s.title] || '';
            const body = t[s.body] || '';

            // Roman Number (Watermark style)
            ctx.fillStyle = 'rgba(167, 139, 250, 0.12)';
            ctx.font = '900 110px Inter, sans-serif';
            const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
            ctx.fillText(roman[i], x - 10, y + 45);

            // Title (Multiline support v4.4.0)
            ctx.fillStyle = '#fff';
            ctx.font = '700 22px Inter, sans-serif'; 
            const titleParts = (title || '').toUpperCase().split('\n');
            titleParts.forEach((part, index) => {
                ctx.fillText(part, x + 90, y + (index * 28));
            });
            
            // Body (Adjusted for title height)
            const bodyOffset = titleParts.length > 1 ? 65 : 45;
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.font = '400 14px Inter, sans-serif'; 
            wrapText(ctx, body, x + 90, y + bodyOffset, 430, 20); 
        });

        // Footer
        ctx.fillStyle = 'rgba(167, 139, 250, 0.9)';
        ctx.font = '700 40px Inter, sans-serif';
        ctx.fillText('#ThinkWithEvidence  #NeosysAeon', canvas.width / 2, canvas.height - 110);

        // Website
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.font = '300 20px Inter, sans-serif';
        ctx.fillText('YEPZHI.COM/NEOSYS', canvas.width / 2, canvas.height - 60);

        // Download
        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `neosysaeon-poster-${currentLang}.jpg`;
            link.href = url;
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, 'image/jpeg', 0.9);
    }

    // ── Share helpers ──
    const shareUrl = 'https://yepzhi.com/neosys/';
    const shareText = 'Implementando el Framework NEOSYS #SystemsThinking #EvidenceBased — Hacia una toma de decisiones basada en datos. #NeosysAeon ' + shareUrl;

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
    if (copyBtn) { // Changed from shareCopy to copyBtn
        copyBtn.addEventListener('click', () => {
            const t = translations[currentLang] || translations.es; // Get translations for dynamic text
            const fullText = t.join_share_text || "Implementando el Framework NEOSYS #SystemsThinking #EvidenceBased — Hacia una toma de decisiones basada en datos. #NeosysAeon https://yepzhi.com/neosys/";
            navigator.clipboard.writeText(fullText).then(() => {
                const originalContent = copyBtn.innerHTML; // Changed from shareCopy to copyBtn
                copyBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                setTimeout(() => copyBtn.innerHTML = originalContent, 2000); // Changed from shareCopy to copyBtn
            });
        });
    }

    // Copiar Slogan Especial
    const sloganBtn = document.getElementById('copy-slogan-btn');
    if (sloganBtn) {
        sloganBtn.addEventListener('click', () => {
            const slogan = "Soy parte del movimiento NEOSYS AEON ✨ — Hacia una toma de decisiones basada en evidencias con el método cientifico. #NeosysAeon #EvidenceBased https://yepzhi.com/neosys/";
            navigator.clipboard.writeText(slogan).then(() => {
                const original = sloganBtn.innerHTML;
                sloganBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> ¡Copiado!';
                setTimeout(() => sloganBtn.innerHTML = original, 2000);
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

document.addEventListener('DOMContentLoaded', () => {
    loadCommunity();
    applyLanguage(actLang); 
    
    // v2.0 Initializations
    if (typeof populateSourceSelects === 'function') populateSourceSelects();
    
    const filterSelect = document.getElementById('filter-source-type');
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => fetchEvidencias(e.target.value));
    }
    if (typeof fetchEvidencias === 'function') fetchEvidencias();
});
