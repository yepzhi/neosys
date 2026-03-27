// ── Admin Logic for Neosys Dashboard ──

const firebaseConfig = {
    apiKey: "AIzaSyD-tbdD6eHip2fCBAJnGEj3_4eqLMc1EhE",
    authDomain: "neosys-4dc42.firebaseapp.com",
    projectId: "neosys-4dc42",
    storageBucket: "neosys-4dc42.firebasestorage.app",
    messagingSenderId: "1009059504450",
    appId: "1:1009059504450:web:d26dd042f2139dcaa6e8db",
    measurementId: "G-V2FD2WR82B"
};

// Simple Password Prompt for Privacy (Run immediately)
const adminKey = prompt("Please enter the Admin Access Key:");
if (adminKey !== "neosys2026") {
    alert("Unauthorized access.");
    window.location.href = "index.html";
}

// ── Initialize Animations ───────────────────
document.addEventListener('DOMContentLoaded', () => {
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            origin: 'bottom',
            distance: '20px',
            duration: 1000,
            delay: 200,
            easing: 'cubic-bezier(0.5, 0, 0, 1)',
            mobile: true
        });
        sr.reveal('.reveal', { interval: 100 });
    }
});

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const tbody = document.getElementById('admin-tbody');
const statTotal = document.getElementById('stat-total');
const statRegions = document.getElementById('stat-regions');
const statRecent = document.getElementById('stat-recent');

// Load Data from 'miembros'
db.collection('miembros').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
    let total = 0;
    let regions = new Set();
    let recent = 0;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    tbody.innerHTML = '';
    
    snapshot.forEach(doc => {
        const data = doc.data();
        total++;
        if (data.city) regions.add(data.city);
        if (data.timestamp && (now - data.timestamp.toMillis() < oneDay)) {
            recent++;
        }

        const dateStr = data.timestamp ? data.timestamp.toDate().toLocaleDateString() : 'N/A';
        
        const locParts = [];
        if (data.city) locParts.push(data.city);
        if (data.state) locParts.push(data.state);
        if (data.country) locParts.push(data.country);
        const locStr = locParts.length > 0 ? locParts.join(', ') : 'N/A';

        const row = `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${data.photoUrl || 'https://via.placeholder.com/40'}" class="badge-img" alt="Photo">
                        <div>
                            <strong>${data.name || 'Anonymous'}</strong><br>
                            <span style="font-size: 0.75rem; opacity: 0.6;">${data.occupation || 'Member'}</span>
                        </div>
                    </div>
                </td>
                <td>${locStr}</td>
                <td>
                    <div style="font-size: 0.8rem;">
                        ${data.email || '-'}<br>
                        <span style="color: var(--accent);">${data.social || '-'}</span>
                    </div>
                </td>
                <td style="max-width: 300px; font-size: 0.8rem; line-height: 1.4;">
                    <strong>Decision:</strong> ${data.decision_evidencia || 'No description'}<br>
                    <em style="opacity: 0.7;">Source: ${data.tipo_fuente || 'N/A'}</em>
                </td>
                <td>${dateStr}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    statTotal.innerText = total;
    statRegions.innerText = regions.size;
    statRecent.innerText = recent;
});

// Particles Background (Partial copy from app.js)
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', initCanvas);
initCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random();
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = `rgba(167, 139, 250, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}
function createParticles() {
    for (let i = 0; i < 50; i++) particles.push(new Particle());
}
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
createParticles();
animate();
