/* ═══════════════════════════════════════════
   NEOSYS AEON — Luxury Badge Generator v5.0.0.1
   Identical Replication based on User Image
   ═══════════════════════════════════════════ */

(function initBadgeGenerator() {
    const canvas = document.getElementById('badge-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const previewImg = document.getElementById('badge-preview');
    const form = document.getElementById('badge-form');
    const registerBtn = document.getElementById('btn-register-final');
    
    // Set Canvas Size (v5.0.0.1 - Tall for philosophy)
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

    // ── Badge Drawing Logic (Replication v5.0.0.1) ──
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

    // ── Badge Drawing Logic (Ultimate v5.0.0.1) ────
    function updateBadge() {
        const w = canvas.width; const h = canvas.height;
        ctx.clearRect(0,0,w,h);

        // 1. Nebula Background
        ctx.fillStyle = '#050510'; ctx.fillRect(0, 0, w, h);
        const blobs = [[150,200,'rgba(167,139,250,0.08)'],[600,600,'rgba(255,239,51,0.03)'],[400,800,'rgba(167,139,250,0.05)']];
        blobs.forEach(b => {
            const rad = ctx.createRadialGradient(b[0],b[1],0,b[0],b[1],300);
            rad.addColorStop(0, b[2]); rad.addColorStop(1, 'transparent');
            ctx.fillStyle = rad; ctx.fillRect(0,0,w,h);
        });

        // 2. Subtle Grid
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.04)'; ctx.lineWidth = 1;
        for (let x=0; x<=w; x+=100){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
        for (let y=0; y<=h; y+=100){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }

        // 3. Glowing Stars (+20% Size)
        ctx.fillStyle = 'rgba(167, 139, 250, 0.4)'; ctx.shadowBlur = 10; ctx.shadowColor = '#a78bfa';
        const stars = [[80,180],[720,120],[40,650],[740,850],[280,40],[520,950],[180,380],[620,720]];
        stars.forEach(s => {
            ctx.beginPath(); ctx.arc(s[0], s[1], 3.2, 0, Math.PI*2); ctx.fill();
        });
        ctx.shadowBlur = 0;

        // 4. Sparkle ✨ Top
        ctx.fillStyle = '#ffef33'; ctx.font = '60px Helvetica, -apple-system, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('✨', w/2, 90);

        // 5. Header: NEOSYS AEON (Glow 20px)
        ctx.shadowColor = 'rgba(167, 139, 250, 0.6)'; ctx.shadowBlur = 20;
        ctx.fillStyle = '#fff'; ctx.font = 'bold 64px Helvetica'; ctx.letterSpacing = '6px';
        ctx.fillText('NEOSYS AEON', w/2, 170); ctx.shadowBlur = 0;

        // 6. PHOTO
        const photoY = 340; const photoR = 145;
        ctx.save(); ctx.beginPath(); ctx.arc(w/2, photoY, photoR, 0, Math.PI * 2); ctx.clip();
        if (userPhoto) {
            const r = Math.max((photoR*2)/userPhoto.width, (photoR*2)/userPhoto.height);
            ctx.drawImage(userPhoto, w/2 - (userPhoto.width*r)/2, photoY - (userPhoto.height*r)/2, userPhoto.width*r, userPhoto.height*r);
        } else {
            ctx.fillStyle = '#1a1a2e'; ctx.fillRect(w/2-photoR, photoY-photoR, photoR*2, photoR*2);
            ctx.fillStyle = '#fff'; ctx.font = '24px Helvetica'; ctx.fillText('SUBE FOTO', w/2, photoY);
        }
        ctx.restore();
        ctx.strokeStyle = 'rgba(167,139,250,0.5)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(w/2, photoY, photoR+2, 0, Math.PI*2); ctx.stroke();

        // 7. NAME
        ctx.fillStyle = '#fff'; ctx.font = '900 60px Helvetica'; ctx.letterSpacing = '1px';
        ctx.fillText((nameInput.value || 'TU NOMBRE').toUpperCase(), w/2, 560);
        ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(w/2-240, 580); ctx.lineTo(w/2+240, 580); ctx.stroke();

        // 8. Role
        ctx.fillStyle = '#a78bfa'; ctx.font = '700 24px Helvetica'; ctx.letterSpacing = '3px';
        ctx.fillText('MEMBER OF THE MOVEMENT', w/2, 630);

        // 9. Philosophy Phrases (-30%)
        ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '400 18px Helvetica';
        ctx.fillText('Without science there is no clarity.', w/2, 690);
        ctx.fillText('Without validation there is no progress.', w/2, 725);
        ctx.font = '400 16px Helvetica';
        ctx.fillText('An open framework for understanding reality', w/2, 775);
        ctx.fillText('through verifiable evidence.', w/2, 810);

        // 10. CTA Gradient (-15%)
        const ctaGrad = ctx.createLinearGradient(w/2-250, 0, w/2+250, 0);
        ctaGrad.addColorStop(0, '#a78bfa'); ctaGrad.addColorStop(0.5, '#fff'); ctaGrad.addColorStop(1, '#a78bfa');
        ctx.fillStyle = ctaGrad; ctx.font = 'bold 24px Helvetica';
        ctx.fillText('Learn the 10 Principles of the Cosmos today!', w/2, 880);

        // 11. Hashtags (-25% + #NeosysAeon)
        ctx.fillStyle = '#a78bfa'; ctx.font = 'bold 24px Helvetica';
        ctx.fillText('#ThinkWithEvidence  #NeosysAeon', w/2, 940);

        // 12. Footer
        ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.font = '14px Helvetica'; ctx.fillText('YEPZHI.COM/NEOSYS', w/2, 975);
        
        previewImg.src = canvas.toDataURL('image/png');
    }
        
        // Push to preview img
        previewImg.src = canvas.toDataURL('image/png');
    }

    // ── Listeners ─────────────────────────────────
    [nameInput, cityInput, stateInput].forEach(el => el && el.addEventListener('input', updateBadge));

    // ── Firebase Registration (Sync v5.0.0.1) ──────
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
