// Örökbefogadások API hívások
async function fetchAdoptions() {
    try {
        const data = await apiCall('/orokbefogadasok');
        return data.adatok;
    } catch (error) {
        console.error('Hiba az örökbefogadások lekérésekor:', error);
        return [];
    }
}

async function createAdoption(adoptionData) {
    try {
        const data = await apiCall('/orokbefogadasok', {
            method: 'POST',
            body: JSON.stringify(adoptionData),
        });
        return data;
    } catch (error) {
        console.error('Hiba az örökbefogadás létrehozásakor:', error);
        throw error;
    }
}

async function updateAdoption(id, adoptionData) {
    try {
        const data = await apiCall(`/orokbefogadasok/${id}`, {
            method: 'PUT',
            body: JSON.stringify(adoptionData),
        });
        return data;
    } catch (error) {
        console.error('Hiba az örökbefogadás frissítésekor:', error);
        throw error;
    }
}

async function deleteAdoption(id) {
    try {
        const data = await apiCall(`/orokbefogadasok/${id}`, {
            method: 'DELETE',
        });
        return data;
    } catch (error) {
        console.error('Hiba az örökbefogadás törlésekor:', error);
        throw error;
    }
}

// Örökbefogadás űrlap (modal) a főoldalon
function openAdoptionModalById(allatId) {
    const animal = allatokCache.find(a => a.id === allatId);
    if (animal) openAdoptionModal(animal);
}

function openAdoptionModal(animal) {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal_overlay';

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    modalOverlay.innerHTML = `
        <div class="modal_content">
            <h3>🏠 ${escapeHtml(animal.nev)} örökbefogadása</h3>
            <form id="adoption_form">
                <div class="modal_form_group">
                    <label>Név</label>
                    <input type="text" id="a_nev" required>
                </div>
                <div class="modal_form_group">
                    <label>E-mail cím</label>
                    <input type="email" id="a_email" required>
                </div>
                <div class="modal_form_group">
                    <label>Telefonszám</label>
                    <input type="tel" id="a_tel" required>
                </div>
                <div class="modal_form_group">
                    <label>Örökbefogadás tervezett dátuma</label>
                    <input type="date" id="a_datum" min="${today}" value="${today}" required>
                </div>
                <div class="modal_form_group">
                    <label>Megjegyzés (opcionális)</label>
                    <textarea id="a_megjegyzes" rows="3" placeholder="Pl. lakókörnyezet, korábbi állattartási tapasztalat..."></textarea>
                </div>
                <p id="adoption_message" class="message"></p>
                <div class="modal_actions">
                    <button type="button" class="btn_small btn_red" id="close_adoption_modal">Mégse</button>
                    <button type="submit" class="btn_small btn_green">Örökbefogadás elküldése</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modalOverlay);
    document.getElementById('close_adoption_modal').addEventListener('click', () => modalOverlay.remove());

    const dateInput = document.getElementById('a_datum');
    dateInput.addEventListener('invalid', () => {
        dateInput.setCustomValidity(
            dateInput.value === '' || dateInput.value >= dateInput.min
                ? 'Válassz dátumot!'
                : 'Az örökbefogadás dátuma nem lehet múltbéli.'
        );
    });
    dateInput.addEventListener('input', () => dateInput.setCustomValidity(''));

    document.getElementById('adoption_form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = document.getElementById('adoption_message');

        try {
            await createAdoption({
                allat_id: animal.id,
                latogato_nev: document.getElementById('a_nev').value,
                email: document.getElementById('a_email').value,
                telefonszam: document.getElementById('a_tel').value,
                fogadas_datum: document.getElementById('a_datum').value,
                megjegyzes: document.getElementById('a_megjegyzes').value || null,
            });
            message.textContent = 'Örökbefogadási kérelem sikeresen elküldve! Munkatársaink hamarosan felveszik Önnel a kapcsolatot.';
            message.style.color = 'green';
            setTimeout(() => modalOverlay.remove(), 2500);
        } catch (error) {
            message.textContent = error.message || 'Hiba történt az örökbefogadás során.';
            message.style.color = 'red';
        }
    });
}

// Örökbefogadások megjelenítése az admin felületen
async function renderAdoptions() {
    const tbody = document.querySelector('#adoptions tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="8">Betöltés...</td></tr>';

    try {
        const adoptions = await fetchAdoptions();

        if (adoptions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">Nincsenek örökbefogadások.</td></tr>';
            return;
        }

        tbody.innerHTML = adoptions.map(adoption => `
            <tr>
                <td>#${adoption.id}</td>
                <td>${escapeHtml(adoption.latogato_nev)}</td>
                <td>${escapeHtml(adoption.email || '-')}</td>
                <td>${escapeHtml(adoption.telefonszam || '-')}</td>
                <td>${adoption.allat ? escapeHtml(adoption.allat.nev) : 'Ismeretlen'}</td>
                <td>${adoption.fogadas_datum}</td>
                <td>
                    <span class="status ${getStatusClass(adoption.statusz)}">
                        ${getStatusText(adoption.statusz)}
                    </span>
                </td>
                <td>
                    ${isLoggedIn() ? `
                        <button class="btn_small btn_green" onclick="acceptAdoption(${adoption.id})">Elfogadás</button>
                        <button class="btn_small btn_red" onclick="rejectAdoption(${adoption.id})">Elutasítás</button>
                    ` : '-'}
                </td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="8">Hiba történt a betöltés során.</td></tr>';
    }
}

// Örökbefogadás elfogadása
async function acceptAdoption(id) {
    if (!confirm('Biztosan elfogadod ezt az örökbefogadást? Az állat státusza örökbefogadva lesz.')) return;

    try {
        await updateAdoption(id, { statusz: 'elfogadva' });
        renderAdoptions();
    } catch (error) {
        alert('Hiba történt: ' + error.message);
    }
}

// Örökbefogadás elutasítása
async function rejectAdoption(id) {
    if (!confirm('Biztosan elutasítod ezt az örökbefogadást?')) return;

    try {
        await updateAdoption(id, { statusz: 'elutasitva' });
        renderAdoptions();
    } catch (error) {
        alert('Hiba történt: ' + error.message);
    }
}

// Admin felület betöltésekor
document.addEventListener('DOMContentLoaded', () => {
    const adoptionsSection = document.getElementById('adoptions');
    if (adoptionsSection) {
        renderAdoptions();
    }
});
