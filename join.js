/* ═══════════════════════════════════════════
   NEOSYS AEON — Luxury Badge Generator v4.9.9.0
   Identical Replication based on User Image
   ═══════════════════════════════════════════ */

(function initBadgeGenerator() {
    const canvas = document.getElementById('badge-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const previewImg = document.getElementById('badge-preview');
    const form = document.getElementById('badge-form');
    const registerBtn = document.getElementById('btn-register-final');
    
    // Set Canvas Size (v4.9.9.0 - Tall for philosophy)
    canvas.width = 800;
    canvas.height = 1000;

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
                const prev = document.getElementById('photo-preview');
                if (prev) {
                    prev.src = ev.target.result;
                    prev.style.display = 'block';
                }
                const placeholder = document.getElementById('photo-placeholder');
                if (placeholder) placeholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // ── Badge Drawing Logic (Replication v4.9.9.0) ──
    function updateBadge() {
        const w = canvas.width; const h = canvas.height;
        ctx.clearRect(0,0,w,h);

        // 1. Background (Dark Blue/Black)
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, w, h);

        // 2. Subtle Grid
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= w; x += 50) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 0; y <= h; y += 50) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // 3. Bokeh Particles (Static stars)
        ctx.fillStyle = 'rgba(167, 139, 250, 0.3)';
        const stars = [[100,200],[700,100],[50,600],[750,800],[300,50],[500,900],[200,400],[600,700]];
        stars.forEach(s => {
            ctx.beginPath(); ctx.arc(s[0], s[1], 2, 0, Math.PI*2); ctx.fill();
        });

        // 4. Sparkle ✨ Top
        ctx.shadowBlur = 0; ctx.fillStyle = '#ffef33'; ctx.font = '70px Inter';
        ctx.textAlign = 'center'; ctx.fillText('✨', w/2, 100);

        // 5. Header: NEOSYS AEON
        ctx.shadowColor = 'rgba(167, 139, 250, 0.8)'; ctx.shadowBlur = 30;
        ctx.fillStyle = '#fff'; ctx.font = 'bold 80px Inter'; ctx.letterSpacing = '5px';
        ctx.fillText('NEOSYS AEON', w/2, 180);
        ctx.shadowBlur = 0; // Reset shadow

        // 6. PHOTO (Circle with circular mask and glow)
        const photoY = 360; const photoR = 170;
        ctx.save();
        ctx.beginPath(); ctx.arc(w/2, photoY, photoR, 0, Math.PI * 2); ctx.clip();
        if (userPhoto) {
            const ratio = Math.max((photoR*2)/userPhoto.width, (photoR*2)/userPhoto.height);
            ctx.drawImage(userPhoto, w/2 - (userPhoto.width*ratio)/2, photoY - (userPhoto.height*ratio)/2, userPhoto.width*ratio, userPhoto.height*ratio);
        } else {
            ctx.fillStyle = '#1a1a2e'; ctx.fillRect(w/2-photoR, photoY-photoR, photoR*2, photoR*2);
            ctx.fillStyle = '#fff'; ctx.font = '30px Inter'; ctx.fillText('SUBE FOTO', w/2, photoY);
        }
        ctx.restore();
        // Photo Ring Glow
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.6)'; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.arc(w/2, photoY, photoR+2, 0, Math.PI * 2); ctx.stroke();

        // 7. NAME: HOLA ES TEST
        ctx.fillStyle = '#fff'; ctx.font = '900 70px Inter'; ctx.letterSpacing = '1px';
        const nameVal = (nameInput.value || 'TU NOMBRE').toUpperCase();
        ctx.fillText(nameVal, w/2, 600);
        
        // Horizontal Line
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(w/2-250, 620); ctx.lineTo(w/2+250, 620); ctx.stroke();

        // 8. Role: MEMBER OF THE MOVEMENT
        ctx.fillStyle = '#a78bfa'; ctx.font = '700 30px Inter'; ctx.letterSpacing = '2px';
        ctx.fillText('MEMBER OF THE MOVEMENT', w/2, 670);

        // 9. Philosophy Text Block
        ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = '400 28px Inter';
        ctx.fillText('Without science there is no clarity.', w/2, 740);
        ctx.fillText('Without validation there is no progress.', w/2, 780);
        
        ctx.font = '400 26px Inter';
        ctx.fillText('An open framework for understanding reality', w/2, 830);
        ctx.fillText('through verifiable evidence.', w/2, 870);

        // 10. CTA: Learn the 10 Principles...
        ctx.fillStyle = '#a78bfa'; ctx.font = 'bold 32px Inter';
        ctx.fillText('Learn the 10 Principles of the Cosmos today!', w/2, 930);

        // 11. Hashtags
        ctx.font = 'bold 36px Inter';
        ctx.fillText('#ThinkWithEvidence  #Neosys', w/2, 980);

        // 12. Footer Website (Very small)
        ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = '16px Inter'; ctx.letterSpacing = '1px';
        ctx.fillText('YEPZHI.COM/NEOSYS', w/2, 1010); // Wait, adjusted height if needed
        
        // Push to preview img
        previewImg.src = canvas.toDataURL('image/png');
    }

    // ── Listeners ─────────────────────────────────
    [nameInput, cityInput, stateInput].forEach(el => el && el.addEventListener('input', updateBadge));

    // ── Firebase Registration (Sync v4.9.9.0) ──────
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
                city: cityInput.value || '',
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
                const actions = document.getElementById('badge-actions');
                if (actions) actions.style.display = 'flex';
                alert("¡Bienvenido al movimiento! Tu gafete ha sido generado y tus datos están en el directorio.");
            } catch (err) {
                console.error("Error al registrar:", err);
                registerBtn.disabled = false;
                registerBtn.innerText = "Reintentar Registro";
                alert("Error al conectar con el servidor: " + err.message);
            }
        });
    }

    updateBadge();
})();
