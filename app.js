/* ═══════════════════════════════════════════
   NEOSYS AEON — App Logic
   Particles / Reveal / Badge / Nav / i18n
   ═══════════════════════════════════════════ */

// ── Global Localization Setup ─────────────────────
let currentLang = localStorage.getItem('neosys_lang') || 'en';
if (!['es', 'en', 'cn'].includes(currentLang)) currentLang = 'en';
const version = "4.8.7.5"; 
console.log("Neosys Aeon Loader v" + version);

// ═══════════════════════════════════════════
// FIREBASE CONFIGURATION
// ═══════════════════════════════════════════
const firebaseConfig = {
    apiKey: "AIzaSyD-tbdD6eHip2fCBAJnGEj3_4eqLMc1EhE",
    authDomain: "neosys-4dc42.firebaseapp.com",
    projectId: "neosys-4dc42",
    storageBucket: "neosys-4dc42.firebasestorage.app",
    messagingSenderId: "1009059504450",
    appId: "1:1009059504450:web:d26dd042f2139dcaa6e8db",
    measurementId: "G-V2FD2WR82B"
};

const APP_VERSION = "4.8.7.5"; 

let db = null;
try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
        if (typeof firebase.analytics === 'function') {
            firebase.analytics();
        }
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

function showRegistrationSuccess() {
    const t = translations[currentLang] || translations.es;
    const toast = document.createElement('div');
    toast.className = 'neo-success-toast';
    toast.innerHTML = `
        <div class="neo-success-title">${t.join_success_title || 'Welcome!'}</div>
        <div class="neo-success-msg">${t.join_success_msg || 'Registration successful.'}</div>
    `;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('visible'), 100);
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 600);
    }, 6000);
}

// ── Country/State Selector Logic ──────────
(function initLocationSelector() {
    const countrySelect = document.getElementById('badge-country');
    const stateSelect = document.getElementById('badge-state');
    if (!countrySelect || !stateSelect) return;

    countrySelect.addEventListener('change', () => {
        const country = countrySelect.value;
        const stateContainer = document.getElementById('state-container');
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
            if (stateContainer) stateContainer.style.display = 'block';
            stateSelect.required = true;
        } else {
            if (stateContainer) stateContainer.style.display = 'none';
            stateSelect.required = false;
        }
    });
})();

function loadCommunity() {
    const list = document.getElementById('community-list');
    if (!list || !db) return;
    
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
    });
}

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('neosys_lang', lang);
    const t = translations[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else {
                el.innerHTML = t[key];
            }
        }
    });

    if (typeof populateSourceSelects === 'function') populateSourceSelects();
    if (typeof fetchEvidencias === 'function') fetchEvidencias();

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.documentElement.lang = lang === 'cn' ? 'zh-Hant' : lang;

    document.querySelectorAll('.wp-link-dynamic').forEach(link => {
        if (lang === 'en') {
            link.href = 'neosysaeon-whitepaper-v4.1-EN.pdf';
        } else if (lang === 'cn') {
            link.href = 'neosysaeon-whitepaper-v4.1-ZH.pdf';
        } else {
            link.href = 'neosysaeon-whitepaper-v4.1.pdf';
        }
    });

    if (typeof drawBadge === 'function') drawBadge();
}

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

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
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

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
})();

let userPhoto = null;

function drawBadge() {
    const canvas = document.getElementById('badge-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const targetW = 1200;
    const targetH = 1600;
    canvas.width = targetW;
    canvas.height = targetH;

    const w = targetW;
    const h = targetH;
    const t = translations[currentLang] || translations.es;

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0a0a20');
    grad.addColorStop(1, '#020208');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(167, 139, 250, 1)';
    ctx.font = '600 120px Inter, sans-serif';
    ctx.fillText('✨', w / 2, 100);

    ctx.fillStyle = '#fff';
    ctx.font = '900 110px Inter, sans-serif';
    ctx.fillText('NEOSYS AEON', w / 2, 230);

    const nameInput = document.getElementById('badge-name');
    const nameStr = nameInput ? (nameInput.value.trim() || 'TU NOMBRE') : 'TU NOMBRE';
    ctx.font = '900 90px Inter, sans-serif';
    ctx.fillText(nameStr.toUpperCase(), w / 2, 820);

    const preview = document.getElementById('badge-preview');
    if (preview) preview.src = canvas.toDataURL('image/png');
}

(function initSystems() {
    const form = document.getElementById('badge-form');
    if (!form) return;

    const nameInput = document.getElementById('badge-name');
    if (nameInput) nameInput.addEventListener('input', drawBadge);
    
    const photoInput = document.getElementById('badge-photo');
    if (photoInput) {
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    userPhoto = img;
                    drawBadge();
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    const submitBtn = document.getElementById('btn-register-final');
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            
            submitBtn.disabled = true;
            const t = translations[currentLang] || translations.es;
            
            const memberData = {
                name: document.getElementById('badge-name').value.trim(),
                email: document.getElementById('badge-email').value.trim(),
                social: document.getElementById('badge-social').value.trim(),
                city: document.getElementById('badge-city').value.trim(),
                country: document.getElementById('badge-country').value,
                state: document.getElementById('badge-state').value,
                decision_evidencia: document.getElementById('decision_evidencia').value.trim(),
                tipo_fuente: document.getElementById('tipo_fuente').value,
                fuente_referencia: document.getElementById('fuente_referencia').value.trim(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                decision_fecha: firebase.firestore.FieldValue.serverTimestamp()
            };

            if (db) {
                await db.collection('miembros').add(memberData);
                showRegistrationSuccess();
            }
            submitBtn.disabled = false;
        });
    }
})();

function populateSourceSelects() {
    const selects = [document.getElementById('tipo_fuente'), document.getElementById('filter-source-type')];
    if (typeof translations === 'undefined') return;
    const t = translations[currentLang];
    if (!t || !t.source_types) return;

    selects.forEach(select => {
        if (!select) return;
        const isFilter = select.id === 'filter-source-type';
        select.innerHTML = '';
        const defaultOpt = document.createElement('option');
        defaultOpt.value = isFilter ? 'all' : '';
        defaultOpt.textContent = isFilter ? (t.filter_all || 'Todas') : (t.source_types.placeholder || 'Selecciona...');
        select.appendChild(defaultOpt);

        Object.entries(t.source_types).forEach(([key, label]) => {
            if (key === 'placeholder') return;
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = label;
            select.appendChild(opt);
        });
    });
}

function safeToDate(val) {
    if (!val) return 0;
    if (typeof val.toDate === 'function') return val.toDate();
    if (val instanceof Date) return val;
    const d = new Date(val);
    return isNaN(d.getTime()) ? 0 : d;
}

function fetchEvidencias(filterValue = 'all') {
    const list = document.getElementById('evidencias-list');
    if (!list || !db) return;
    
    console.log(`[Neosys] Fetching evidence (filter: ${filterValue})...`);
    list.innerHTML = `<div style="text-align: center; color: var(--text-tertiary); width: 100%; padding: 60px;">🚀 Analizando base de datos científica...</div>`;

    // Usar onSnapshot para máxima fiabilidad (como en el directorio)
    db.collection('miembros').onSnapshot((snapshot) => {
        const t = translations[currentLang] || translations.es;
        const docs = [];
        
        snapshot.forEach(doc => {
            const data = doc.data();
            // Filtrar solo los que tienen testimonio
            if (!data.decision_evidencia || String(data.decision_evidencia).trim() === '') return;
            // Filtrar por fuente si no es 'all'
            if (filterValue !== 'all' && String(data.tipo_fuente).toLowerCase() !== filterValue.toLowerCase()) return;
            
            docs.push({ id: doc.id, ...data });
        });

        // Ordenar con seguridad
        docs.sort((a, b) => {
            const dateA = safeToDate(a.decision_fecha || a.timestamp);
            const dateB = safeToDate(b.decision_fecha || b.timestamp);
            return (dateB?.getTime ? dateB.getTime() : 0) - (dateA?.getTime ? dateA.getTime() : 0);
        });

        list.innerHTML = '';
        if (docs.length === 0) {
            list.innerHTML = `<div style="text-align: center; color: var(--text-tertiary); width: 100%; padding: 60px;">No se encontraron registros científicos para esta categoría.</div>`;
            return;
        }

        docs.forEach(data => {
            const card = document.createElement('div');
            card.className = 'evidence-card reveal';
            
            const sourceText = (t.source_types && t.source_types[data.tipo_fuente]) || data.tipo_fuente;
            const jsDate = safeToDate(data.decision_fecha || data.timestamp);
            const dateStr = (jsDate && jsDate.toLocaleDateString) ? jsDate.toLocaleDateString() : '';

            card.innerHTML = `
                <div class="evidence-card-header">
                    <div class="evidence-card-name">${data.name}</div>
                    <div class="evidence-card-meta">
                        <span>${data.city || ''}${data.country ? `, ${data.country}` : ''}</span>
                        ${data.social ? `<span class="evidence-card-social">${data.social}</span>` : ''}
                        ${dateStr ? `<span>${dateStr}</span>` : ''}
                    </div>
                </div>
                <div class="evidence-card-body">
                    <div class="evidence-card-label">${t.card_decision_label || 'DECI SIÓN:'}</div>
                    <div class="evidence-card-decision">"${data.decision_evidencia}"</div>
                </div>
                <div class="evidence-card-footer">
                    <div class="evidence-card-source">
                        <span class="evidence-card-source-icon">🔬</span>
                        <span>${t.card_source_label || 'FUENTE:'} ${sourceText}</span>
                    </div>
                    ${data.fuente_referencia ? `
                        <a href="${data.fuente_referencia.startsWith('http') ? data.fuente_referencia : '#'}" target="_blank" class="evidence-card-ref">
                            🔗 ${data.fuente_referencia}
                        </a>
                    ` : ''}
                </div>
            `;
            list.appendChild(card);
        });

        // REVEAL ANIMATION (Crucial for newly injected DOM)
        if (typeof ScrollReveal !== 'undefined') {
            console.log("[Neosys] Triggering ScrollReveal on new elements (v4.8.7.5).");
            ScrollReveal().reveal('.reveal', { 
                origin: 'bottom',
                distance: '20px',
                duration: 1000,
                delay: 200,
                easing: 'cubic-bezier(0.5, 0, 0, 1)',
                interval: 100 
            });
        } else {
            console.warn("[Neosys] ScrollReveal not found! Forcing evidence visibility (v4.8.7.5).");
            document.querySelectorAll('.reveal').forEach(el => {
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                el.style.transform = 'none';
            });
        }
    }, (err) => {
        console.error("[Neosys] Access Error (v4.8.7.5):", err);
        list.innerHTML = `<div style="text-align: center; color: var(--text-tertiary); width: 100%; padding: 60px;">Error al conectar con la base de datos científica. Revisa tu conexión.</div>`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadCommunity();
    applyLanguage(currentLang);
    populateSourceSelects();
    
    const filterSelect = document.getElementById('filter-source-type');
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => fetchEvidencias(e.target.value));
    }
    fetchEvidencias();
});
