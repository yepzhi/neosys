/* ═══════════════════════════════════════════
   NEOSYS AEON — Admin Logic v5.0.1 FINAL
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
            const jsDate = (data.timestamp && typeof data.timestamp.toDate === 'function') ? data.timestamp.toDate() : new Date(data.timestamp);
            const dateStr = !isNaN(jsDate.getTime()) ? jsDate.toLocaleDateString() : 'N/A';

            tr.innerHTML = `
                <td>${data.name || data.nombre || 'Anonymous'}</td>
                <td>${data.email || ''}</td>
                <td>${data.city || data.ciudad || ''}, ${data.country || data.pais || ''}</td>
                <td>${data.tipo_fuente || ''}</td>
                <td>${dateStr}</td>
                <td>
                    <button class="btn btn-delete" onclick="deleteUser('${doc.id}')" style="background:#f44; color:#fff; border:none; padding:5px 10px; cursor:pointer; border-radius:4px;">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
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
