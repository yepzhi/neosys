/* ═══════════════════════════════════════════
   NEOSYS AEON — App Logic v5.1.4 FINAL STABLE
   Particles / Reveal / Badge / Nav / i18n / Firestore
   ═══════════════════════════════════════════ */

// ── Global Localization Setup ─────────────────────
let currentLang = localStorage.getItem('neosys_lang') || 'en';
if (!['es', 'en', 'cn'].includes(currentLang)) currentLang = 'en';
const version = "5.1.4"; 
console.log(`%c[NEOSYS] Platform v${version} Active`, "color: #a78bfa; font-weight: bold;");

// ── Firebase Initialization (Shared Config) ───────
let db = null;
try {
    if (typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
    }
} catch (e) {
    console.warn("[NEOSYS] Firebase Init Error:", e);
}

// ── Particles & Animations ───────────────────────
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    function createParticles() {
        particles = []; const count = Math.min(Math.floor(w * h / 15000), 100);
        for (let i = 0; i < count; i++) {
            particles.push({ x: Math.random() * w, y: Math.random() * h, dx: (Math.random() - 0.5) * 0.5, dy: (Math.random() - 0.5) * 0.5, radius: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.5 + 0.1, pulse: Math.random() * Math.PI, pulseSpeed: Math.random() * 0.02 + 0.005 });
        }
    }
    function draw() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.x += p.dx; p.y += p.dy; p.pulse += p.pulseSpeed;
            if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
            if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            const a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(167, 139, 250, ${a})`; ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    resize(); createParticles(); draw();
    window.addEventListener('resize', () => { resize(); createParticles(); });
})();

(function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

(function initNav() {
    const nav = document.getElementById('main-nav');
    if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));
})();

function initi18n() {
    if (typeof translations === 'undefined') return;
    const t = translations[currentLang] || translations.en;
    
    function getVal(key) {
        if (!key) return null;
        if (key.includes('.')) {
            const parts = key.split('.');
            let val = t;
            parts.forEach(p => val = val ? val[p] : null);
            return val;
        }
        return t[key];
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const val = getVal(el.getAttribute('data-i18n'));
        if (val) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
            else el.innerHTML = val;
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const val = getVal(el.getAttribute('data-i18n-placeholder'));
        if (val) el.placeholder = val;
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
    });
}

// ── UTILS ────────────────────────────────────────
function safeToDate(val) {
    if (!val) return null;
    if (typeof val.toDate === 'function') return val.toDate();
    if (val instanceof Date) return val;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
}

const STATE_CODES = {
    'VERACRUZ': 'VE', 'JALISCO': 'JA', 'CDMX': 'MX', 'MEXICO': 'MX', 'MÉXICO': 'MX',
    'NUEVO LEON': 'NL', 'PUEBLA': 'PU', 'QUERETARO': 'QT', 'GUANAJUATO': 'GT',
    'CALIFORNIA': 'CA', 'TEXAS': 'TX', 'NEW YORK': 'NY', 'FLORIDA': 'FL'
};

function getShortLoc(data) {
    const s = (data.state || data.estado || '').toUpperCase().trim();
    const c = (data.country || data.pais || '').toUpperCase().trim();
    const st = STATE_CODES[s] || s.substring(0, 2);
    const co = c.length > 2 ? c.substring(0, 2) : c;
    return (st && co) ? `${st}, ${co}` : (st || co || '');
}

// ── Evidence Loading ─────────────────────────────
function fetchEvidencias(filterValue = 'all') {
    const list = document.getElementById('evidencias-list');
    if (!list || !db) return;
    
    db.collection('miembros').limit(100).onSnapshot((snapshot) => {
        const t = (translations && translations[currentLang]) || (translations && translations.es) || {};
        const docs = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (filterValue !== 'all' && data.tipo_fuente !== filterValue) return;
            docs.push({ id: doc.id, ...data });
        });
        docs.sort((a, b) => {
            const dateA = safeToDate(a.timestamp); const dateB = safeToDate(b.timestamp);
            return (dateB ? dateB.getTime() : 0) - (dateA ? dateA.getTime() : 0);
        });
        list.innerHTML = '';
        if (docs.length === 0) { list.innerHTML = `<p style="text-align:center; padding:40px;">No se encontraron registros activos.</p>`; return; }
        docs.forEach(data => {
            const card = document.createElement('div'); card.className = 'evidence-card';
            const loc = getShortLoc(data);
            card.innerHTML = `<div class="evidence-card-header"><div class="evidence-card-name">${data.name || data.nombre || 'Member'}</div><div class="evidence-card-meta"><span>${loc}</span></div></div><div class="evidence-card-body"><p>${data.decision_evidencia || 'Registro Neosys Aeon.'}</p></div>`;
            list.appendChild(card);
        });
    }, (err) => console.error("[NEOSYS] Permission Error:", err));
}

// ── Community Directory ──────────────────────────
function loadCommunity() {
    const list = document.getElementById('community-list');
    if (!list || !db) return;
    db.collection('miembros').limit(100).onSnapshot((snapshot) => {
        list.innerHTML = '';
        if (snapshot.empty) { list.innerHTML = '<p style="color: var(--text-tertiary); width: 100%;">Esperando primer registro...</p>'; return; }
        snapshot.forEach(doc => {
            const data = doc.data();
            const el = document.createElement('div'); el.className = 'community-member';
            const loc = getShortLoc(data);
            el.innerHTML = `<div class="member-dot"></div><span class="member-name">${data.name || data.nombre || 'Member'}</span>${loc ? `<span class="member-location" style="margin-left:auto; opacity:0.6; font-size:0.8em;">${loc}</span>` : ''}`;
            list.appendChild(el);
        });
    }, (err) => console.error("[NEOSYS] Permission Error:", err));
}

// ── Community Map ────────────────────────────────
let communityMap = null;
let mapMarkers = [];

const CITY_COORDS = {
    'GUADALAJARA': [20.6597, -103.3496], 'JALISCO': [20.6597, -103.3496],
    'CDMX': [19.4326, -99.1332], 'MEXICO': [19.4326, -99.1332], 'MÉXICO': [19.4326, -99.1332],
    'MONTERREY': [25.6866, -100.3161], 'VERACRUZ': [19.1738, -96.1342],
    'SONORA': [29.2972, -110.3309], 'HERMOSILLO': [29.0892, -110.9613],
    'TIJUANA': [32.5149, -117.0382], 'BAJA CALIFORNIA': [32.5149, -117.0382],
    'MERIDA': [20.9674, -89.5926], 'MÉRIDA': [20.9674, -89.5926], 'YUCATAN': [20.9674, -89.5926],
    'CHIHUAHUA': [28.6330, -106.0691], 'QUERETARO': [20.5888, -100.3899]
};

function initCommunityMap() {
    const div = document.getElementById('community-map');
    if (!div || !db) return;
    if (!communityMap) {
        communityMap = L.map('community-map', { zoomControl: false }).setView([20, -100], 3);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(communityMap);
    }
    db.collection('miembros').onSnapshot((snapshot) => {
        mapMarkers.forEach(m => communityMap.removeLayer(m)); mapMarkers = [];
        const stateCounts = {};

        snapshot.forEach(doc => {
            const data = doc.data();
            const state = (data.state || data.estado || 'UNKNOWN').toUpperCase().trim();
            stateCounts[state] = (stateCounts[state] || 0) + 1;
        });

        for (const [state, count] of Object.entries(stateCounts)) {
            let lat = 23.6345, lng = -102.5528;
            if (CITY_COORDS[state]) [lat, lng] = CITY_COORDS[state];

            const countIcon = L.divIcon({
                html: `<div class="map-badge" style="background: var(--accent); color: #000; width: 28px; height: 18px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; box-shadow: 0 0 10px var(--accent); border: 1.5px solid #fff; font-size: 11px;">${count}</div>`,
                className: '',
                iconSize: [28, 18]
            });

            const marker = L.marker([lat, lng], { icon: countIcon }).addTo(communityMap);
            marker.bindPopup(`<strong style="color:#000;">${state}</strong><br><span style="color:#666;">${count} Members</span>`);
            mapMarkers.push(marker);
        }
    }, (err) => console.error("[NEOSYS] Map Permission Error:", err));
}

// ── Initialize Event Listeners ───────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('community-list')) loadCommunity();
    
    // Tab switching logic (v5.1.4)
    const btnDir = document.getElementById('tab-directory');
    const btnMap = document.getElementById('tab-map');
    const dirContent = document.getElementById('directory-view');
    const mapContent = document.getElementById('map-view');

    if (btnDir && btnMap && dirContent && mapContent) {
        btnDir.addEventListener('click', () => {
            dirContent.style.display = 'block';
            mapContent.style.display = 'none';
            btnDir.classList.add('active');
            btnMap.classList.remove('active');
        });
        btnMap.addEventListener('click', () => {
            dirContent.style.display = 'none';
            mapContent.style.display = 'block';
            btnMap.classList.add('active');
            btnDir.classList.remove('active');
            // Force map resize check
            setTimeout(() => { if (communityMap) communityMap.invalidateSize(); }, 300);
            initCommunityMap();
        });
    }

    if (document.getElementById('evidencias-list')) fetchEvidencias();

    // Language Switcher Logic
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentLang = btn.getAttribute('data-lang');
            localStorage.setItem('neosys_lang', currentLang);
            initi18n();
            if (document.getElementById('outreach-grid')) renderOutreach();
            window.dispatchEvent(new CustomEvent('neosys:langChange', { detail: { lang: currentLang } }));
        });
    });

    // Mobile Menu Toggle (v5.1.4)
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // HD Poster Download (v5.1.4 restored)
    const downloadPosterBtn = document.getElementById('download-poster-btn');
    if (downloadPosterBtn) {
        downloadPosterBtn.addEventListener('click', async () => {
            const originalText = downloadPosterBtn.innerHTML;
            downloadPosterBtn.innerHTML = "<span>Generando HD...</span>";
            downloadPosterBtn.disabled = true;
            
            try {
                if (window.NeosysPoster) {
                    await window.NeosysPoster.download(currentLang);
                } else {
                    // Fallback to static if script somehow missing
                    const link = document.createElement('a');
                    link.href = 'neosysaeon-principios-hd.jpg';
                    link.download = 'Neosys-Aeon-10-Principios-Cosmos.jpg';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            } catch (e) {
                console.error("Poster Gen Error:", e);
            } finally {
                downloadPosterBtn.innerHTML = originalText;
                downloadPosterBtn.disabled = false;
            }
        });
    }

    if (document.getElementById('outreach-grid')) renderOutreach();
    initi18n();
});

function renderOutreach() {
    const grid = document.getElementById('outreach-grid');
    if (!grid) return;
    const t = translations[currentLang] || translations.en;
    const categories = t.outreach_categories || [];
    
    grid.innerHTML = categories.map(cat => `
        <div class="outreach-category reveal">
            <h3 class="outreach-category-title">${cat.title}</h3>
            <div class="outreach-grid-items">
                ${cat.items.map(item => `
                    <div class="outreach-card">
                        <div class="outreach-icon">${item.icon}</div>
                        <h4 class="outreach-name">${item.name}</h4>
                        <p class="outreach-topic">${item.topic}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}
