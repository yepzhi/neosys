/* ═══════════════════════════════════════════
   NEOSYS AEON — App Logic
   Particles / Reveal / Badge / Nav / i18n
   ═══════════════════════════════════════════ */

// ── Global Localization Setup ─────────────────────
let currentLang = localStorage.getItem('neosys_lang') || 'en';
if (!['es', 'en', 'cn'].includes(currentLang)) currentLang = 'en';
const version = "4.8.6"; 
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

const APP_VERSION = "4.8.6"; 

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
            link.href = 'neosysaeon-whitepaper-v4.2-EN.pdf';
        } else if (lang === 'cn') {
            link.href = 'neosysaeon-whitepaper-v4.2-ZH.pdf';
        } else {
            link.href = 'neosysaeon-whitepaper-v4.2-ES.pdf';
        }
    });

    if (typeof drawBadge === 'function') drawBadge();
    if (typeof populateOutreachCategories === 'function') populateOutreachCategories();
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
    if (!val) return null;
    if (typeof val.toDate === 'function') return val.toDate();
    if (val instanceof Date) return val;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
}

function fetchEvidencias(filterValue = 'all') {
    const list = document.getElementById('evidencias-list');
    if (!list || !db) return;
    
    console.log(`[Neosys] Fetching evidence (filter: ${filterValue})...`);
    list.innerHTML = `<div style="text-align: center; color: var(--text-tertiary); width: 100%; padding: 60px;">🚀 Analizando base de datos científica...</div>`;

    db.collection('miembros').onSnapshot((snapshot) => {
        const t = translations[currentLang] || translations.es;
        const docs = [];
        
        console.log(`[Neosys] Snapshot received: ${snapshot.size} total docs.`);

        snapshot.forEach(doc => {
            const data = doc.data();
            if (!data.decision_evidencia || String(data.decision_evidencia).trim() === '') return;
            if (filterValue !== 'all' && data.tipo_fuente !== filterValue) return;
            docs.push({ id: doc.id, ...data });
        });

        console.log(`[Neosys] Found ${docs.length} valid records.`);

        docs.sort((a, b) => {
            const dateA = safeToDate(a.decision_fecha || a.timestamp);
            const dateB = safeToDate(b.decision_fecha || b.timestamp);
            const timeA = dateA ? dateA.getTime() : 0;
            const timeB = dateB ? dateB.getTime() : 0;
            return timeB - timeA;
        });

        list.innerHTML = '';
        
        if (docs.length === 0) {
            list.innerHTML += `<div style="text-align: center; color: var(--text-tertiary); width: 100%; padding: 60px;">No se encontraron registros de aplicación para esta categoría.</div>`;
            return;
        }

        docs.forEach(data => {
            try {
                const card = document.createElement('div');
                card.className = 'evidence-card'; // REMOVED REVEAL: Guaranteed Visibility v4.8.6
                
                const sourceText = (t.source_types && t.source_types[data.tipo_fuente]) || data.tipo_fuente || 'Scientific Source';
                const jsDate = safeToDate(data.decision_fecha || data.timestamp);
                const dateStr = jsDate ? jsDate.toLocaleDateString() : '';

                card.innerHTML = `
                    <div class="evidence-card-header">
                        <div class="evidence-card-name">${data.name || 'Anonymous Researcher'}</div>
                        <div class="evidence-card-meta">
                            <span>${data.city || ''}${data.country ? `, ${data.country}` : ''}</span>
                            ${data.social ? `<span class="evidence-card-social">${data.social}</span>` : ''}
                            ${dateStr ? `<span>${dateStr}</span>` : ''}
                        </div>
                    </div>
                    <div class="evidence-card-body">
                        <div class="evidence-card-label">${t.card_decision_label || 'DECISIÓN:'}</div>
                        <div class="evidence-card-decision">"${data.decision_evidencia}"</div>
                    </div>
                    <div class="evidence-card-footer">
                        <div class="evidence-card-source">
                            <span class="evidence-card-source-icon">🔬</span>
                            <span>${t.card_source_label || 'FUENTE:'} ${sourceText}</span>
                        </div>
                        ${data.fuente_referencia ? `
                            <a href="${String(data.fuente_referencia).startsWith('http') ? data.fuente_referencia : '#'}" target="_blank" class="evidence-card-ref">
                                🔗 Ref: ${data.fuente_referencia}
                            </a>
                        ` : ''}
                    </div>
                `;
                list.appendChild(card);
            } catch (err) {
                console.error("[Neosys] Render error:", err);
            }
        });

        if (typeof ScrollReveal !== 'undefined') {
            ScrollReveal().reveal('.reveal', { 
                origin: 'bottom', distance: '20px', duration: 1000, delay: 200, interval: 100 
            });
        } else {
            document.querySelectorAll('.reveal').forEach(el => {
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                el.style.transform = 'none';
            });
        }
    }, (err) => {
        console.error("[Neosys] DB Error:", err);
        list.innerHTML = `<div style="text-align: center; color: var(--text-tertiary); padding: 60px;">Error de conexión con la base de datos.</div>`;
    });
}

// ── Community Map Logic (v4.8.6) ──────────────────
let communityMap = null;
let mapMarkers = [];

// Geocoding Fallback for common cities
const CITY_COORDINATES = {
    'GUADALAJARA': [20.6597, -103.3496],
    'JALISCO': [20.6597, -103.3496],
    'CDMX': [19.4326, -99.1332],
    'MÉXICO': [19.4326, -99.1332],
    'MEXICO': [19.4326, -99.1332],
    'CIUDAD DE MÉXICO': [19.4326, -99.1332],
    'DF': [19.4326, -99.1332],
    'MONTERREY': [25.6866, -100.3161],
    'NUEVO LEÓN': [25.6866, -100.3161],
    'PUEBLA': [19.0413, -98.2062],
    'QUERÉTARO': [20.5888, -100.3899],
    'MÉRIDA': [20.9674, -89.5926],
    'ZACATECAS': [22.7709, -102.5831],
    'CANCÚN': [21.1619, -86.8515],
    'TIJUANA': [32.5149, -117.0382],
    'LEÓN': [21.1224, -101.6851],
    'GUANAJUATO': [21.0190, -101.2574],
    'MADRID': [40.4168, -3.7038],
    'BARCELONA': [41.3851, 2.1734],
    'BOGOTÁ': [4.7110, -74.0721],
    'NEW YORK': [40.7128, -74.0060],
    'LOS ANGELES': [34.0522, -118.2437],
    'MIAMI': [25.7617, -80.1918],
    'LIMA': [-12.0464, -77.0428],
    'SANTIAGO': [-33.4489, -70.6693],
    'BUENOS AIRES': [-34.6037, -58.3816]
};

function initCommunityMap() {
    const mapContainer = document.getElementById('community-map');
    if (!mapContainer || communityMap) return;

    console.log("[Neosys] Initializing Map v4.8.6");
    communityMap = L.map('community-map').setView([20, 0], 2);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(communityMap);

    // Real-time listener for markers
    if (db) {
        console.log("[Neosys] Map: Listening for members...");
        db.collection('miembros').onSnapshot((snapshot) => {
            console.log(`[Neosys] Map Update: ${snapshot.size} members found.`);
            
            // Clear old markers if any
            mapMarkers.forEach(m => communityMap.removeLayer(m));
            mapMarkers = [];

            snapshot.forEach(doc => {
                const data = doc.data();
                let lat = data.lat;
                let lng = data.lng;

                if (!lat || !lng) {
                    const rawCity = (data.city || '').toUpperCase().trim();
                    const cityKey = rawCity.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    if (CITY_COORDINATES[cityKey]) [lat, lng] = CITY_COORDINATES[cityKey];
                    else if (CITY_COORDINATES[rawCity]) [lat, lng] = CITY_COORDINATES[rawCity];
                    else if (rawCity.includes("MEXICO")) [lat, lng] = CITY_COORDINATES['MEXICO'];
                    else if (rawCity.includes("GUADALAJARA")) [lat, lng] = CITY_COORDINATES['GUADALAJARA'];
                    else if (rawCity.includes("JALISCO")) [lat, lng] = CITY_COORDINATES['GUADALAJARA'];
                }

                if (lat && lng) {
                    console.log(`[Neosys] Markers: Placing ${data.name} at [${lat}, ${lng}]`);
                    const marker = L.circleMarker([lat, lng], {
                        radius: 8,
                        fillColor: "#a78bfa",
                        color: "#fff",
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(communityMap);
                    
                    marker.bindPopup(`<b>${data.name}</b><br>${data.city || ''}, ${data.country || ''}`);
                    mapMarkers.push(marker);
                }
            });
            
            // Triple-Refresh Layout Strategy (Safari/Firefox)
            setTimeout(() => { if (communityMap) communityMap.invalidateSize(); }, 300);
            setTimeout(() => { if (communityMap) communityMap.invalidateSize(); }, 600);
            setTimeout(() => { if (communityMap) communityMap.invalidateSize(); }, 1200);
        }, (err) => {
            console.error("[Neosys] Map Error:", err);
        });
    }
}

function switchCommunityTab(tabId) {
    const dirView = document.getElementById('directory-view');
    const mapView = document.getElementById('map-view');
    const btnDir = document.getElementById('tab-directory');
    const btnMap = document.getElementById('tab-map');

    if (!dirView || !mapView || !btnDir || !btnMap) return;

    if (tabId === 'map') {
        dirView.style.display = 'none';
        mapView.style.display = 'block';
        btnDir.classList.remove('active');
        btnMap.classList.add('active');
        
        // Triple-Refresh Layout Strategy for Cross-Browser Consistency
        setTimeout(() => {
            initCommunityMap();
            if (communityMap) communityMap.invalidateSize();
        }, 150);
        setTimeout(() => { if (communityMap) communityMap.invalidateSize(); }, 500);
        setTimeout(() => { if (communityMap) communityMap.invalidateSize(); }, 1000);
        window.dispatchEvent(new Event('resize'));
    } else {
        dirView.style.display = 'block';
        mapView.style.display = 'none';
        btnDir.classList.add('active');
        btnMap.classList.remove('active');
    }
}

const slidesData = [
    { id: 1, title: 'm1_title', body: 'm1_body' }, { id: 2, title: 'm2_title', body: 'm2_body' },
    { id: 3, title: 'm3_title', body: 'm3_body' }, { id: 4, title: 'm4_title', body: 'm4_body' },
    { id: 5, title: 'm5_title', body: 'm5_body' }, { id: 6, title: 'm6_title', body: 'm6_body' },
    { id: 7, title: 'm7_title', body: 'm7_body' }, { id: 8, title: 'm8_title', body: 'm8_body' },
    { id: 9, title: 'm9_title', body: 'm9_body' }, { id: 10, title: 'm10_title', body: 'm10_body' }
];

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let testY = y;
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, testY);
            line = words[n] + ' ';
            testY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, testY);
}

function generateCommandmentsPoster() {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600; 
    const ctx = canvas.getContext('2d');
    const t = translations[currentLang] || translations.es;

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#0a0a20');
    grad.addColorStop(1, '#020208');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 90px Inter, sans-serif';
    ctx.shadowColor = 'rgba(167, 139, 250, 0.4)';
    ctx.shadowBlur = 20;
    ctx.fillText('NEOSYS AEON ✨', canvas.width / 2, 140);
    ctx.shadowBlur = 0;

    ctx.font = '700 36px Inter, sans-serif';
    ctx.fillStyle = 'rgba(167, 139, 250, 1)';
    const posterTitle = (t.mand_title || "10 PRINCIPIOS OPERATIVOS").replace('<br>', ' ').replace(/<[^>]*>?/gm, '').toUpperCase();
    ctx.fillText(posterTitle, canvas.width / 2, 220);

    // Grid Layout
    ctx.textAlign = 'left';
    const startY = 380;
    const col1X = 80;
    const col2X = 680;
    const spacingY = 220;

    slidesData.forEach((s, i) => {
        const isSecondCol = i >= 5;
        const x = isSecondCol ? col2X : col1X;
        const row = isSecondCol ? i - 5 : i;
        const y = startY + (row * spacingY);

        const title = t[s.title] || '';
        const body = t[s.body] || '';

        // Background Roman Numeral
        ctx.fillStyle = 'rgba(167, 139, 250, 0.12)';
        ctx.font = '900 130px Inter, sans-serif';
        const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
        ctx.fillText(roman[i], x - 15, y + 60);

        // Title
        ctx.fillStyle = '#fff';
        ctx.font = '700 24px Inter, sans-serif';
        const titleClean = title.replace(/\*\*/g, '').toUpperCase();
        const titleParts = titleClean.split('\n');
        titleParts.forEach((part, idx) => {
            ctx.fillText(part, x + 100, y + (idx * 30));
        });

        // Body
        const bodyOffset = titleParts.length > 1 ? 70 : 50;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.font = '400 15px Inter, sans-serif';
        wrapText(ctx, body, x + 100, y + bodyOffset, 380, 22);
    });

    // Footer Tagline
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'italic 300 28px Inter, sans-serif';
    ctx.fillText(t.hero_tagline || 'Sin ciencia no hay verdad. Sin validación no hay progreso.', canvas.width / 2, canvas.height - 200);

    // Brand
    ctx.fillStyle = '#a78bfa';
    ctx.font = '700 48px Inter, sans-serif';
    ctx.fillText('#ThinkWithEvidence  #Neosys', canvas.width / 2, canvas.height - 120);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.font = '300 22px Inter, sans-serif';
    ctx.fillText('YEPZHI.COM/NEOSYS', canvas.width / 2, canvas.height - 60);

    // Save and Trigger
    canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `neosysaeon-poster-${currentLang}.jpg`;
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/jpeg', 0.95);
}

function populateOutreachCategories() {
    const outreachGrid = document.getElementById('outreach-grid');
    if (!outreachGrid) return;

    const t = translations[currentLang] || translations.es;
    if (!t.outreach_categories) return;

    outreachGrid.innerHTML = '';
    t.outreach_categories.forEach(cat => {
        const header = document.createElement('h3');
        header.className = 'outreach-category-title'; // Removed reveal
        header.textContent = cat.title;
        
        const grid = document.createElement('div');
        grid.className = 'outreach-grid-items';
        
        cat.items.forEach(c => {
            const card = document.createElement('a');
            card.className = 'outreach-card';
            card.href = c.link || '#';
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            card.innerHTML = `
                <div class="outreach-icon">${c.icon || '✨'}</div>
                <div class="outreach-name">${c.name}</div>
                <div class="outreach-topic">${c.topic}</div>
            `;
            grid.appendChild(card);
        });
        
        outreachGrid.appendChild(header);
        outreachGrid.appendChild(grid);
    });

    // Ensure visibility with a short timeout to trigger CSS transition
    setTimeout(() => {
        document.querySelectorAll('.outreach-card').forEach((el, index) => {
            setTimeout(() => el.classList.add('loaded'), index * 50);
        });
    }, 100);

    // Re-initialize ScrollReveal is no longer needed for dynamic titles
}

document.addEventListener('DOMContentLoaded', () => {
    loadCommunity();
    applyLanguage(currentLang);
    populateSourceSelects();
    
    // Community Tabs
    const btnDir = document.getElementById('tab-directory');
    const btnMap = document.getElementById('tab-map');
    if (btnDir) btnDir.addEventListener('click', () => switchCommunityTab('directory'));
    if (btnMap) btnMap.addEventListener('click', () => switchCommunityTab('map'));
    
    const filterSelect = document.getElementById('filter-source-type');
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => fetchEvidencias(e.target.value));
    }
    fetchEvidencias();
    if (typeof populateOutreachCategories === 'function') populateOutreachCategories();

    // ── Poster Download Handler (v4.8.6) ───────────────────
    const posterBtn = document.getElementById('download-poster');
    if (posterBtn) {
        posterBtn.addEventListener('click', () => {
            // Trigger dynamic generator
            generateCommandmentsPoster();
        });
    }
});

// Global responsiveness for map (v4.8.6)
window.addEventListener('resize', () => {
    if (typeof communityMap !== 'undefined' && communityMap) {
        communityMap.invalidateSize();
    }
});
