/* ═══════════════════════════════════════════
   NEOSYS AEON — Badge Generator v4.9.8.0
   Restored & Stable Logic for join.html
   ═══════════════════════════════════════════ */

(function initBadgeGenerator() {
    const canvas = document.getElementById('badge-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const previewImg = document.getElementById('badge-preview');
    const form = document.getElementById('badge-form');
    const registerBtn = document.getElementById('btn-register-final');
    
    // Inputs
    const nameInput = document.getElementById('badge-name');
    const cityInput = document.getElementById('badge-city');
    const stateInput = document.getElementById('badge-state');
    const countryInput = document.getElementById('badge-country');
    const photoInput = document.getElementById('badge-photo');
    const stateContainer = document.getElementById('state-container');

    let userPhoto = null;

    // ── State Mapping ────────────────────────────
    const STATES_MX = ["Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Coahuila", "Colima", "CDMX", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "México", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"];
    const STATES_US = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

    countryInput.addEventListener('change', () => {
        const c = countryInput.value;
        stateInput.innerHTML = '';
        if (c === 'MX' || c === 'US') {
            stateContainer.style.display = 'block';
            const list = c === 'MX' ? STATES_MX : STATES_US;
            list.forEach(s => {
                const opt = document.createElement('option'); opt.value = s; opt.textContent = s;
                stateInput.appendChild(opt);
            });
        } else {
            stateContainer.style.display = 'none';
        }
        updateBadge();
    });

    // ── Photo Handling ───────────────────────────
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => { userPhoto = img; updateBadge(); };
                img.src = ev.target.result;
                document.getElementById('photo-preview').src = ev.target.result;
                document.getElementById('photo-preview').style.display = 'block';
                document.getElementById('photo-placeholder').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // ── Badge Drawing ────────────────────────────
    function updateBadge() {
        const w = canvas.width; const h = canvas.height;
        ctx.clearRect(0,0,w,h);

        // Background
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#0a0a1a'); grad.addColorStop(1, '#050510');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);

        // Border
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.3)'; ctx.lineWidth = 10;
        ctx.strokeRect(5, 5, w-10, h-10);

        // Sparkle ✨
        ctx.fillStyle = '#a78bfa'; ctx.font = '80px Inter';
        ctx.textAlign = 'center'; ctx.fillText('✨', w/2, 100);

        // Name
        ctx.fillStyle = '#fff'; ctx.font = 'bold 45px Inter';
        ctx.fillText((nameInput.value || 'TU NOMBRE').toUpperCase(), w/2, 450);

        // Location
        ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '24px Inter';
        const locText = `${cityInput.value || 'CIUDAD'}, ${countryInput.value || 'XX'}`;
        ctx.fillText(locText.toUpperCase(), w/2, 490);

        // Status
        ctx.fillStyle = '#a78bfa'; ctx.font = 'bold 18px JetBrains Mono';
        ctx.fillText('STATUS: NEOSYS AEON MEMBER', w/2, 540);
        ctx.fillText('VERSION: 4.9.8.0', w/2, 570);

        // Photo Mask
        ctx.save();
        ctx.beginPath();
        ctx.arc(w/2, 270, 120, 0, Math.PI * 2);
        ctx.clip();
        if (userPhoto) {
            const ratio = Math.max(240/userPhoto.width, 240/userPhoto.height);
            ctx.drawImage(userPhoto, w/2 - (userPhoto.width*ratio)/2, 270 - (userPhoto.height*ratio)/2, userPhoto.width*ratio, userPhoto.height*ratio);
        } else {
            ctx.fillStyle = '#1a1a2e'; ctx.fillRect(w/2-120, 150, 240, 240);
            ctx.fillStyle = '#333'; ctx.font = '30px Inter'; ctx.fillText('SUBE FOTO', w/2, 280);
        }
        ctx.restore();
        ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(w/2, 270, 122, 0, Math.PI * 2); ctx.stroke();

        // Reveal image
        previewImg.src = canvas.toDataURL('image/png');
    }

    // ── Listeners ─────────────────────────────────
    [nameInput, cityInput, stateInput].forEach(el => el && el.addEventListener('input', updateBadge));

    // ── Firebase Registration ─────────────────────
    if (registerBtn) {
        registerBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!db) return alert("Error: Firebase no inicializado.");
            if (!form.checkValidity()) return form.reportValidity();
            if (!document.getElementById('privacy-consent').checked) return alert("Debes aceptar la política de privacidad.");

            registerBtn.disabled = true;
            registerBtn.innerText = "Sincronizando...";

            const payload = {
                name: nameInput.value,
                email: document.getElementById('badge-email').value,
                city: cityInput.value,
                state: stateInput.value || '',
                country: countryInput.value,
                social: document.getElementById('badge-social').value || '',
                decision_evidencia: document.getElementById('decision_evidencia').value,
                tipo_fuente: document.getElementById('tipo_fuente').value,
                fuente_referencia: document.getElementById('fuente_referencia').value || '',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            try {
                await db.collection('miembros').add(payload);
                registerBtn.innerText = "¡REGISTRO EXITOSO!";
                registerBtn.style.background = "#0f0";
                document.getElementById('badge-actions').style.display = 'flex';
                alert("¡Bienvenido al movimiento! Tu gafete ha sido generado y tus datos están en el directorio.");
            } catch (err) {
                console.error("Error al registrar:", err);
                registerBtn.disabled = false;
                registerBtn.innerText = "Reintentar Registro";
                alert("Error al conectar con el servidor: " + err.message);
            }
        });
    }

    // Init
    updateBadge();
})();
