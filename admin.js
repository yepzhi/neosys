/* ═══════════════════════════════════════════
   NEOSYS AEON — Admin Logic v5.0.4 FINAL
   Dashboard for User Management
   ═══════════════════════════════════════════ */

// ── Initialize Auth ──────────────────────────
const adminKey = prompt("Please enter the Admin Access Key:");
if (adminKey !== "neosys2026") {
    alert("Unauthorized access.");
    window.location.href = "index.html";
}

let db = null;
try {
    if (typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
    }
} catch (e) {
    console.warn("[NEOSYS] Admin Firebase Error:", e);
}

// ── Dashboard Logic ──────────────────────────
function loadAdminData() {
    const tableBody = document.getElementById('admin-tbody');
    if (!tableBody || !db) return;

    db.collection('miembros').limit(200).onSnapshot((snapshot) => {
        tableBody.innerHTML = '';
        if (snapshot.empty) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay usuarios registrados aún.</td></tr>';
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const tr = document.createElement('tr');
            
            // Safe date parsing
            const ts = data.timestamp;
            let dateStr = '---';
            if (ts) {
                const jsDate = (typeof ts.toDate === 'function') ? ts.toDate() : new Date(ts);
                if (!isNaN(jsDate.getTime())) dateStr = jsDate.toLocaleDateString();
            }

            tr.innerHTML = `
                <td style="font-weight:700; color:#fff;">${data.name || 'Anonymous'}</td>
                <td>${data.city || ''}, ${data.state || ''} ${data.country || ''}</td>
                <td style="color:var(--accent); font-family:monospace;">${data.email || ''}<br><small>${data.social || ''}</small></td>
                <td style="max-width:300px; font-size:0.8rem; opacity:0.8; line-height:1.2;">
                    <strong>Decision:</strong> ${data.decision_evidencia || '---'}<br>
                    <small><em>Source: ${data.fuente_referencia || '---'}</em></small>
                </td>
                <td>${dateStr}</td>
                <td>
                    <button class="btn-delete" onclick="deleteUser('${doc.id}')" style="background:rgba(255,100,100,0.1); border:1px solid #f44; color:#f44; padding:5px 10px; border-radius:4px; font-size:0.7rem; cursor:pointer;">X</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }, (err) => {
        console.error("[NEOSYS] Admin Snapshot Error:", err);
        tableBody.innerHTML = `<tr><td colspan="6" style="color:#f44; text-align:center;">Error de permisos de Firestore: ${err.message}</td></tr>`;
    });
}

function deleteUser(docId) {
    if (confirm("¿Estás seguro de que quieres eliminar este registro permanentemente?")) {
        db.collection('miembros').doc(docId).delete()
            .then(() => alert("Registro eliminado."))
            .catch(err => alert("Error al eliminar: " + err.message));
    }
}

document.addEventListener('DOMContentLoaded', loadAdminData);
