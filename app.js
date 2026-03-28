/* ═══════════════════════════════════════════
   NEOSYS AEON — App Logic v4.9.1.0 FINAL
   Particles / Reveal / Badge / Nav / i18n / Firestore
   ═══════════════════════════════════════════ */

// ── Global Localization Setup ─────────────────────
let currentLang = localStorage.getItem('neosys_lang') || 'en';
if (!['es', 'en', 'cn'].includes(currentLang)) currentLang = 'en';
const version = "4.9.0"; 
console.log(`%c[NEOSYS] Platform v${version} Stable`, "color: #a78bfa; font-weight: bold; font-size: 1.1rem;");

// ── Firebase Initialization (Shared Config) ───────
let db = null;
try {
    if (typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
        console.log(`%c[NEOSYS] Connected to ${firebaseConfig.projectId}`, "color: #00ffff; font-weight: bold;");
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

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(Math.floor(w * h / 15000), 100);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w, y: Math.random() * h,
                dx: (Math.random() - 0.5) * 0.5, dy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.5 + 0.1,
                pulse: Math.random() * Math.PI, pulseSpeed: Math.random() * 0.02 + 0.005
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
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

(function initNav() {
    const nav = document.getElementById('main-nav');
    const toggle = document.getElementById('nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!nav) return;
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));
    if (toggle && links) {
        toggle.addEventListener('click', () => links.classList.toggle('open'));
        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => links.classList.remove('open'));
        });
    }
})();

// ── UTILS ────────────────────────────────────────
function safeToDate(val) {
    if (!val) return null;
    if (typeof val.toDate === 'function') return val.toDate();
    if (val instanceof Date) return val;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
}

// ── Evidence Loading ─────────────────────────────
function fetchEvidencias(filterValue = 'all') {
    const list = document.getElementById('evidencias-list');
    if (!list || !db) return;
    
    list.innerHTML = `<div style="text-align: center; color: var(--text-tertiary); width: 100%; padding: 60px;">🚀 Sincronizando evidencia científica...</div>`;

    db.collection('miembros').limit(100).onSnapshot((snapshot) => {
        const t = (translations && translations[currentLang]) || (translations && translations.es) || {};
        const docs = [];
        
        snapshot.forEach(doc => {
            const data = doc.data();
            if (filterValue !== 'all' && data.tipo_fuente !== filterValue) return;
            docs.push({ id: doc.id, ...data });
        });

        // Manual Sort (preventing Firestore filtering issue)
        docs.sort((a, b) => {
            const dateA = safeToDate(a.timestamp);
            const dateB = safeToDate(b.timestamp);
            return (dateB ? dateB.getTime() : 0) - (dateA ? dateA.getTime() : 0);
        });

        list.innerHTML = '';
        if (docs.length === 0) {
            list.innerHTML = `<div style="text-align: center; color: var(--text-tertiary); width: 100%; padding: 60px;">No se encontraron registros activos.</div>`;
            return;
        }

        docs.forEach(data => {
            const card = document.createElement('div');
            card.className = 'evidence-card';
            const sourceText = (t.source_types && t.source_types[data.tipo_fuente]) || data.tipo_fuente || 'Scientific Source';
            const jsDate = safeToDate(data.decision_fecha || data.timestamp);
            const dateStr = jsDate ? jsDate.toLocaleDateString() : '';
            const name = data.name || data.nombre || 'Anonymous Researcher';

            card.innerHTML = `
                <div class="evidence-card-header">
                    <div class="evidence-card-name">${name}</div>
                    <div class="evidence-card-meta">
                        <span>${data.city || data.ciudad || ''}${ (data.country || data.pais) ? `, ${data.country || data.pais}` : ''}</span>
                        ${data.social ? `<span class="evidence-card-social">${data.social}</span>` : ''}
                        ${dateStr ? `<span>${dateStr}</span>` : ''}
                    </div>
                </div>
                <div class="evidence-card-body">
                    <div class="evidence-card-tag">${sourceText}</div>
                    <p>${data.decision_evidencia || 'Registro de participación de Neosys Aeon.'}</p>
                    ${data.fuente_referencia ? `<a href="${String(data.fuente_referencia).startsWith('http') ? data.fuente_referencia : '#'}" target="_blank" class="evidence-card-ref">🔗 Ref: ${data.fuente_referencia}</a>` : ''}
                </div>
            `;
            list.appendChild(card);
        });
    });
}

// ── Community Directory ──────────────────────────
function loadCommunity() {
    const list = document.getElementById('community-list');
    if (!list || !db) return;
    
    db.collection('miembros').limit(100).onSnapshot((snapshot) => {
        console.log(`[NEOSYS] Data Size: ${snapshot.size}`);
        list.innerHTML = '';
        if (snapshot.empty) {
            list.innerHTML = '<p style="color: var(--text-tertiary); width: 100%;">Sé el primero en unirte al directorio.</p>';
            return;
        }
        snapshot.forEach(doc => {
            const data = doc.data();
            const el = document.createElement('div');
            el.className = 'community-member';
            const dot = document.createElement('div');
            dot.className = 'member-dot';
            const nameSpan = document.createElement('span');
            nameSpan.className = 'member-name';
            nameSpan.textContent = data.name || data.nombre || 'Anonymous Researcher';
            el.appendChild(dot);
            el.appendChild(nameSpan);

            const rawCountry = data.country || data.pais;
            if (rawCountry) {
                const locSpan = document.createElement('span');
                locSpan.className = 'member-location';
                locSpan.textContent = data.city || data.ciudad || rawCountry;
                el.appendChild(locSpan);
            }
            list.appendChild(el);
        });
    });
}

// ── Community Map Logic ──────────────────────────
let communityMap = null;
let mapMarkers = [];

const CITY_COORDINATES = {
    'GUADALAJARA': [20.6597, -103.3496], 'JALISCO': [20.6597, -103.3496],
    'CDMX': [19.4326, -99.1332], 'MEXICO': [19.4326, -99.1332], 'MÉXICO': [19.4326, -99.1332],
    'MONTERREY': [25.6866, -100.3161], 'VERACRUZ': [19.1738, -96.1342]
};

function initCommunityMap() {
    const mapDiv = document.getElementById('community-map');
    if (!mapDiv || !db) return;

    if (!communityMap) {
        communityMap = L.map('community-map', { 
            zoomControl: false, 
            attributionControl: false 
        }).setView([20, -100], 3);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(communityMap);
    }

    db.collection('miembros').limit(100).onSnapshot((snapshot) => {
        mapMarkers.forEach(m => communityMap.removeLayer(m));
        mapMarkers = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            let lat = data.lat, lng = data.lng;
            if (!lat || !lng) {
                const city = (data.city || data.ciudad || '').toUpperCase().trim();
                if (CITY_COORDINATES[city]) [lat, lng] = CITY_COORDINATES[city];
                else [lat, lng] = CITY_COORDINATES['MEXICO'];
            }
            
            const circle = L.circleMarker([lat, lng], {
                radius: 12, fillColor: '#a78bfa', color: '#fff', weight: 3, opacity: 1, fillOpacity: 0.8
            }).addTo(communityMap);
            circle.bindTooltip(data.name || data.nombre || 'Member');
            mapMarkers.push(circle);
        });
    });
}

// ── Initialize Event Listeners ───────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('community-list')) loadCommunity();
    
    const btnDir = document.getElementById('btn-directory');
    const btnMap = document.getElementById('btn-map');
    if (btnDir) btnDir.addEventListener('click', () => {
        document.getElementById('directory-content').style.display = 'block';
        document.getElementById('map-content').style.display = 'none';
        btnDir.classList.add('active'); btnMap.classList.remove('active');
    });
    if (btnMap) btnMap.addEventListener('click', () => {
        document.getElementById('directory-content').style.display = 'none';
        document.getElementById('map-content').style.display = 'block';
        btnMap.classList.add('active'); btnDir.classList.remove('active');
        setTimeout(() => communityMap.invalidateSize(), 300);
        initCommunityMap();
    });

    if (document.getElementById('evidencias-list')) fetchEvidencias();
});
