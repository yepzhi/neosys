/* ═══════════════════════════════════════════
   NEOSYS AEON — App Logic v4.9.3.0 PERMISSION FIX
   Particles / Reveal / Badge / Nav / i18n / Firestore
   ═══════════════════════════════════════════ */

// ── Global Localization Setup ─────────────────────
let currentLang = localStorage.getItem('neosys_lang') || 'en';
if (!['es', 'en', 'cn'].includes(currentLang)) currentLang = 'en';
const version = "4.9.3.0"; 
console.log(`%c[NEOSYS] VERSION v${version} READY.`, "color: #ff0; font-weight: bold; background: #000;");

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
            if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
            const a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(167, 139, 250, ${a})`; ctx.fill();
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
    if (!nav) return;
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));
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
    
    list.innerHTML = `<div style="text-align: center; color: var(--text-tertiary); width: 100%; padding: 60px;">🚀 Sincronizando evidencia...</div>`;

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
        if (docs.length === 0) {
            list.innerHTML = `<p style="text-align:center; padding:40px;">No se encontraron registros activos.</p>`;
            return;
        }
        docs.forEach(data => {
            const card = document.createElement('div');
            card.className = 'evidence-card';
            card.innerHTML = `<div class="evidence-card-header"><div class="evidence-card-name">${data.name || data.nombre || 'Member'}</div><div class="evidence-card-meta"><span>${data.city || data.ciudad || ''}</span></div></div><div class="evidence-card-body"><p>${data.decision_evidencia || 'Registro Neosys Aeon.'}</p></div>`;
            list.appendChild(card);
        });
    }, (error) => {
        console.error("[NEOSYS] Evidence Load Error:", error);
        list.innerHTML = `<p style="color:#f44; text-align:center; padding:40px;">❌ Error de permisos en Firebase. Actualiza tus Reglas de Firestore.</p>`;
    });
}

// ── Community Directory ──────────────────────────
function loadCommunity() {
    const list = document.getElementById('community-list');
    if (!list || !db) return;
    
    db.collection('miembros').limit(100).onSnapshot((snapshot) => {
        console.log(`%c[NEOSYS] Data Size: ${snapshot.size}`, "font-weight:bold; color:#0f0;");
        list.innerHTML = '';
        if (snapshot.empty) {
            list.innerHTML = '<p style="color: var(--text-tertiary); width: 100%;">Esperando primer registro...</p>';
            return;
        }
        snapshot.forEach(doc => {
            const data = doc.data();
            const el = document.createElement('div');
            el.className = 'community-member';
            el.innerHTML = `<div class="member-dot"></div><span class="member-name">${data.name || data.nombre || 'Member'}</span>`;
            list.appendChild(el);
        });
    }, (error) => {
        console.error("[NEOSYS] Community Load Error:", error);
        list.innerHTML = '<p style="color:#f44; padding:20px;">❌ Error de permisos en Firebase.</p>';
    });
}

// ── Community Map ────────────────────────────────
let communityMap = null;
let mapMarkers = [];
const DEFAULT_LOC = [20, -100];

function initCommunityMap() {
    const mapDiv = document.getElementById('community-map');
    if (!mapDiv || !db) return;

    if (!communityMap) {
        communityMap = L.map('community-map', { zoomControl: false }).setView(DEFAULT_LOC, 3);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(communityMap);
    }

    db.collection('miembros').limit(100).onSnapshot((snapshot) => {
        mapMarkers.forEach(m => communityMap.removeLayer(m));
        mapMarkers = [];
        snapshot.forEach(doc => {
            const circle = L.circleMarker(DEFAULT_LOC, { radius: 10, fillColor: '#0f0', color: '#fff', weight: 2, fillOpacity: 0.8 }).addTo(communityMap);
            mapMarkers.push(circle);
        });
    }, (error) => {
        console.error("[NEOSYS] Map Load Error:", error);
    });
}

// ── Initialize ───────────────────────────────────
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
        if (communityMap) setTimeout(() => communityMap.invalidateSize(), 300);
        initCommunityMap();
    });

    if (document.getElementById('evidencias-list')) fetchEvidencias();

    // Remove old force sync button if exists
    const oldBtn = document.querySelector('button[style*="top:20px"]');
    if (oldBtn) oldBtn.remove();
});
