// Orvosok API hívások
async function fetchVets() {
    try {
        const data = await apiCall('/orvosok');
        return data.adatok;
    } catch (error) {
        console.error('Hiba az orvosok lekérésekor:', error);
        return [];
    }
}

async function createVet(vetData) {
    try {
        const data = await apiCall('/orvosok', {
            method: 'POST',
            body: JSON.stringify(vetData),
        });
        return data;
    } catch (error) {
        console.error('Hiba az orvos létrehozásakor:', error);
        throw error;
    }
}

async function updateVet(id, vetData) {
    try {
        const data = await apiCall(`/orvosok/${id}`, {
            method: 'PUT',
            body: JSON.stringify(vetData),
        });
        return data;
    } catch (error) {
        console.error('Hiba az orvos frissítésekor:', error);
        throw error;
    }
}

async function deleteVet(id) {
    try {
        const data = await apiCall(`/orvosok/${id}`, {
            method: 'DELETE',
        });
        return data;
    } catch (error) {
        console.error('Hiba az orvos törlésekor:', error);
        throw error;
    }
}

// Orvosok megjelenítése az admin felületen
async function renderVets() {
    const tbody = document.querySelector('#vets tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="4">Betöltés...</td></tr>';

    try {
        const vets = await fetchVets();

        if (vets.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">Nincsenek orvosok.</td></tr>';
            return;
        }

        tbody.innerHTML = vets.map(vet => `
            <tr>
                <td>#${vet.id}</td>
                <td>${escapeHtml(vet.nev)}</td>
                <td>${new Date(vet.created_at).toLocaleDateString('hu-HU')}</td>
                <td>
                    ${isAdmin() ? `
                        <button class="btn_small btn_blue" onclick="editVet(${vet.id})">Szerkesztés</button>
                        <button class="btn_small btn_red" onclick="deleteVetById(${vet.id})">Törlés</button>
                    ` : '-'}
                </td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="4">Hiba történt a betöltés során.</td></tr>';
    }
}

// Orvos törlése
async function deleteVetById(id) {
    if (!confirm('Biztosan törlöd ezt az orvost?')) return;

    try {
        await deleteVet(id);
        renderVets();
    } catch (error) {
        alert('Hiba történt a törlés során: ' + error.message);
    }
}

// Orvos szerkesztése
function editVet(id) {
    const vets = fetchVets().then(vets => {
        const vet = vets.find(v => v.id === id);
        if (!vet) return;

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal_overlay';

        modalOverlay.innerHTML = `
            <div class="modal_content">
                <h3>👨‍⚕️ ${escapeHtml(vet.nev)} szerkesztése</h3>
                <form id="edit_vet_form">
                    <div class="modal_form_group">
                        <label>Név</label>
                        <input type="text" id="v_nev" value="${escapeHtml(vet.nev)}" required>
                    </div>
                    <div class="modal_actions">
                        <button type="button" class="btn_small btn_red" id="close_vet_modal">Mégse</button>
                        <button type="submit" class="btn_small btn_green">Mentés</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modalOverlay);
        document.getElementById('close_vet_modal').addEventListener('click', () => modalOverlay.remove());

        document.getElementById('edit_vet_form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const n_nev = document.getElementById('v_nev').value;

            try {
                await updateVet(id, { nev: n_nev });
                modalOverlay.remove();
                renderVets();
            } catch (error) {
                alert('Hiba történt a mentés során: ' + error.message);
            }
        });
    });
}

// Új orvos hozzáadása
function openNewVetModal() {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal_overlay';

    modalOverlay.innerHTML = `
        <div class="modal_content">
            <h3>👨‍⚕️ Új orvos hozzáadása</h3>
            <form id="new_vet_form">
                <div class="modal_form_group">
                    <label>Név</label>
                    <input type="text" id="v_nev" required>
                </div>
                <div class="modal_actions">
                    <button type="button" class="btn_small btn_red" id="close_vet_modal">Mégse</button>
                    <button type="submit" class="btn_small btn_green">Mentés</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modalOverlay);
    document.getElementById('close_vet_modal').addEventListener('click', () => modalOverlay.remove());

    document.getElementById('new_vet_form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const n_nev = document.getElementById('v_nev').value;

        try {
            await createVet({ nev: n_nev });
            modalOverlay.remove();
            renderVets();
        } catch (error) {
            alert('Hiba történt a mentés során: ' + error.message);
        }
    });
}

// Admin felület betöltésekor
document.addEventListener('DOMContentLoaded', () => {
    const vetsSection = document.getElementById('vets');
    if (vetsSection) {
        renderVets();
    }
});
