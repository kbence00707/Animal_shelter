// Állatok API hívások
let allatokCache = [];

async function fetchAnimals(status = 'orokbefogadhato') {
    try {
        const data = await apiCall(`/allatok?status=${status}`);
        return data.adatok;
    } catch (error) {
        console.error('Hiba az állatok lekérésekor:', error);
        return [];
    }
}

async function fetchAllAnimals() {
    try {
        const data = await apiCall('/allatok/all');
        return data.adatok;
    } catch (error) {
        console.error('Hiba az összes állat lekérésekor:', error);
        return [];
    }
}

async function createAnimal(animalData) {
    try {
        const data = await apiCall('/allatok', {
            method: 'POST',
            body: JSON.stringify(animalData),
        });
        return data;
    } catch (error) {
        console.error('Hiba az állat létrehozásakor:', error);
        throw error;
    }
}

async function updateAnimal(id, animalData) {
    try {
        const data = await apiCall(`/allatok/${id}`, {
            method: 'PUT',
            body: JSON.stringify(animalData),
        });
        return data;
    } catch (error) {
        console.error('Hiba az állat frissítésekor:', error);
        throw error;
    }
}

async function uploadAnimalKep(id, file) {
    const formData = new FormData();
    formData.append('kep', file);

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/allatok/${id}/kep`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        let message = error.hiba || error.uzenet || error.message || 'Hiba történt a kép feltöltésekor.';
        if (error.errors) {
            const details = Object.values(error.errors).flat().join(' ');
            if (details) message = details;
        }
        throw new Error(message);
    }

    return response.json();
}

async function deleteAnimalById(id) {
    if (!confirm('Biztosan törlöd ezt az állatot?')) return;

    try {
        await apiCall(`/allatok/${id}`, {
            method: 'DELETE',
        });
        renderAnimalsAdmin();
    } catch (error) {
        alert('Hiba történt a törlés során: ' + error.message);
    }
}

function editAnimal(id) {
    const animal = allatokCache.find(a => a.id === id);
    if (animal) openAnimalModal(animal);
}

function animalCardHtml(animal) {
    const birthDate = animal.szuletesi_datum ? new Date(animal.szuletesi_datum) : null;
    const age = birthDate
        ? Math.floor((new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000))
        : null;
    const kepUrl = animal.kep ? `${PICTURES_BASE_URL}/${animal.kep}` : 'pictures/dog.jpg';
    const kategoria = { kutya: 'dogs', macska: 'cats' }[(animal.faj || '').toLowerCase()] || 'other';

    return `
        <div class="animal_card" data-name="${escapeHtml(animal.nev)}" data-species="${escapeHtml(animal.faj)}" data-category="${kategoria}" data-birth="${birthDate ? birthDate.getTime() : 0}">
            <img src="${kepUrl}" alt="${escapeHtml(animal.nev)}" onerror="this.src='pictures/dog.jpg'">
            <div class="animal_info">
                <h3>${escapeHtml(animal.nev)}</h3>
                <p class="animal_breed">${escapeHtml(animal.fajta || animal.faj)}</p>
                <p class="animal_age">${age !== null ? age + ' éves' : 'Ismeretlen kor'} • ${animal.nem === 'him' ? 'Hím' : 'Nőstény'}</p>
                <p class="animal_description">${escapeHtml(animal.leiras || 'Nincs leírás.')}</p>
                <button class="button adopt_btn" onclick="openAdoptionModalById(${animal.id})">Örökbefogadom</button>
            </div>
        </div>
    `;
}

// Szűrés és rendezés az adaton (nem a DOM-on), így nem törheti össze a kártyákat
function applyAnimalFilters() {
    const track = document.getElementById('animals_grid');
    if (!track) return;

    const searchTerm = (document.querySelector('.search')?.value || '').toLowerCase();
    const type = document.getElementById('typefilter')?.value || 'all';
    const sortType = document.getElementById('sortfilter')?.value || '';

    let list = allatokCache.filter(animal => {
        const kategoria = { kutya: 'dogs', macska: 'cats' }[(animal.faj || '').toLowerCase()] || 'other';
        const matchesSearch = (animal.nev || '').toLowerCase().includes(searchTerm);
        const matchesType = type === 'all' || kategoria === type;
        return matchesSearch && matchesType;
    });

    list.sort((a, b) => {
        const birthA = a.szuletesi_datum ? new Date(a.szuletesi_datum).getTime() : 0;
        const birthB = b.szuletesi_datum ? new Date(b.szuletesi_datum).getTime() : 0;
        if (sortType === 'birth_asc') return birthB - birthA;
        if (sortType === 'birth_desc') return birthA - birthB;
        if (sortType === 'name_asc') return (a.nev || '').localeCompare(b.nev || '', 'hu');
        if (sortType === 'name_desc') return (b.nev || '').localeCompare(a.nev || '', 'hu');
        if (sortType === 'species') return (a.faj || '').localeCompare(b.faj || '', 'hu');
        return 0;
    });

    if (list.length === 0) {
        track.innerHTML = allatokCache.length === 0
            ? '<p class="no-animals">Jelenleg nincs gazdira váró állat.</p>'
            : '<p class="no-animals">Nincs a szűrésnek megfelelő állat.</p>';
        return;
    }

    track.innerHTML = list.map(animalCardHtml).join('');
}

async function renderAnimals() {
    const track = document.getElementById('animals_grid');
    if (!track) return;

    track.innerHTML = 'Állatok betöltése…';

    const animals = await fetchAnimals();
    allatokCache = animals;

    const retryBtn = document.getElementById('animals_retry');
    if (retryBtn) retryBtn.hidden = animals.length > 0;

    applyAnimalFilters();

    // Állatok feltöltése a foglalás űrlapba
    populateAnimalSelect(animals);
}

// Örökbefogadott állatok megjelenítése a főoldalon
async function renderAdoptedAnimals() {
    const grid = document.getElementById('adopted_grid');
    if (!grid) return;

    grid.innerHTML = 'Állatok betöltése…';

    const animals = await fetchAnimals('orokbefogadva');

    if (animals.length === 0) {
        grid.innerHTML = '<p class="no-animals">Még nincs örökbefogadott állat.</p>';
        return;
    }

    grid.innerHTML = animals.map(animal => {
        const birthDate = new Date(animal.szuletesi_datum);
        const age = Math.floor((new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
        const kepUrl = animal.kep ? `${PICTURES_BASE_URL}/${animal.kep}` : 'pictures/dog.jpg';

        return `
            <div class="animal_card adopted_card" data-name="${escapeHtml(animal.nev)}">
                <img src="${kepUrl}" alt="${escapeHtml(animal.nev)}" onerror="this.src='pictures/dog.jpg'">
                <div class="animal_info">
                    <h3>${escapeHtml(animal.nev)}</h3>
                    <p class="animal_breed">${escapeHtml(animal.fajta || animal.faj)}</p>
                    <p class="animal_age">${age} éves • ${animal.nem === 'him' ? 'Hím' : 'Nőstény'}</p>
                    <span class="status adopted adopt_badge">Már gazdis</span>
                </div>
            </div>
        `;
    }).join('');
}

// Állatok megjelenítése az admin és dolgozói felületen
async function renderAnimalsAdmin() {
    const tbody = document.querySelector('#animals tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="10">Betöltés...</td></tr>';

    try {
        const animals = await fetchAllAnimals();
        allatokCache = animals;

        if (animals.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10">Nincsenek állatok.</td></tr>';
            return;
        }

        tbody.innerHTML = animals.map(animal => `
            <tr data-id="${animal.id}">
                <td>#${animal.id}</td>
                <td>${escapeHtml(animal.nev)}</td>
                <td>${escapeHtml(animal.faj)}</td>
                <td>${escapeHtml(animal.fajta || '-')}</td>
                <td>${animal.szuletesi_datum || '-'}</td>
                <td>${animal.suly_kg || '-'}</td>
                <td>${animal.magassag_cm || '-'}</td>
                <td>${animal.chip ? 'Igen' : 'Nem'}</td>
                <td>
                    <span class="status ${getStatusClass(animal.allapot)}">
                        ${getStatusText(animal.allapot)}
                    </span>
                </td>
                <td>
                    ${isAdmin() ? `
                        <button class="btn_small btn_blue" onclick="editAnimal(${animal.id})">Szerkesztés</button>
                        <button class="btn_small btn_red" onclick="deleteAnimalById(${animal.id})">Törlés</button>
                    ` : '-'}
                </td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="10">Hiba történt a betöltés során.</td></tr>';
    }
}

// Állat hozzáadása / szerkesztése modal (backend API-val)
function openAnimalModal(animal = null) {
    const isEdit = !!animal;
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal_overlay';

    const allapotOpt = (value, label) =>
        `<option value="${value}" ${animal && animal.allapot === value ? 'selected' : ''}>${label}</option>`;

    modalOverlay.innerHTML = `
        <div class="modal_content">
            <h3>🐾 ${isEdit ? escapeHtml(animal.nev) + ' szerkesztése' : 'Új állat hozzáadása'}</h3>
            <form id="edit_form">
                <div class="modal_form_group"><label>Név</label><input type="text" id="m_nev" value="${isEdit ? escapeHtml(animal.nev) : ''}" required></div>
                <div style="display: flex; gap: 15px;">
                    <div class="modal_form_group" style="flex:1;"><label>Faj</label><input type="text" id="m_faj" value="${isEdit ? escapeHtml(animal.faj) : ''}" placeholder="pl. kutya, macska" required></div>
                    <div class="modal_form_group" style="flex:1;"><label>Fajta</label><input type="text" id="m_fajta" value="${isEdit ? escapeHtml(animal.fajta || '') : ''}"></div>
                </div>
                <div class="modal_form_group"><label>Nem</label><select id="m_nem"><option value="him" ${!animal || animal.nem === 'him' ? 'selected' : ''}>Hím</option><option value="nosteny" ${animal && animal.nem === 'nosteny' ? 'selected' : ''}>Nőstény</option></select></div>
                <div style="display: flex; gap: 15px;">
                    <div class="modal_form_group" style="flex:1;"><label>Születési dátum</label><input type="date" id="m_szul" value="${isEdit && animal.szuletesi_datum ? animal.szuletesi_datum : ''}"></div>
                    <div class="modal_form_group" style="flex:1;"><label>Bekerülés dátuma</label><input type="date" id="m_bekerules" value="${isEdit && animal.bekerules_datuma ? animal.bekerules_datuma : ''}"></div>
                </div>
                <div style="display: flex; gap: 15px;">
                    <div class="modal_form_group" style="flex:1;"><label>Súly (kg)</label><input type="number" step="0.1" min="0" id="m_suly" value="${isEdit && animal.suly_kg !== null ? animal.suly_kg : ''}"></div>
                    <div class="modal_form_group" style="flex:1;"><label>Magasság (cm)</label><input type="number" min="0" id="m_magassag" value="${isEdit && animal.magassag_cm !== null ? animal.magassag_cm : ''}"></div>
                </div>
                <div class="modal_form_group"><label>Mikrochip (Van?)</label><input type="checkbox" id="m_chip" ${!animal || animal.chip ? 'checked' : ''}></div>
                <div class="modal_form_group"><label>Állapot</label><select id="m_allapot">${allapotOpt('orokbefogadhato', 'Örökbefogadható')}${allapotOpt('kezeles_alatt', 'Kezelés alatt')}${allapotOpt('orokbefogadva', 'Örökbefogadva')}</select></div>
                <div class="modal_form_group"><label>Kép feltöltése (opcionális)</label><input type="file" id="m_kep" accept="image/jpeg,image/png,image/gif">${isEdit && animal.kep ? `<p class="modal_hint">Jelenlegi kép: ${escapeHtml(animal.kep)}</p>` : ''}</div>
                <div class="modal_form_group"><label>Leírás</label><textarea id="m_leiras" rows="3">${isEdit ? escapeHtml(animal.leiras || '') : ''}</textarea></div>
                <div class="modal_actions">
                    <button type="button" class="btn_small btn_red" id="close_modal">Mégse</button>
                    <button type="submit" class="btn_small btn_green">Mentés</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modalOverlay);
    document.getElementById('close_modal').addEventListener('click', () => modalOverlay.remove());

    document.getElementById('edit_form').addEventListener('submit', async (ev) => {
        ev.preventDefault();

        const animalData = {
            nev: document.getElementById('m_nev').value,
            faj: document.getElementById('m_faj').value,
            fajta: document.getElementById('m_fajta').value || null,
            nem: document.getElementById('m_nem').value,
            szuletesi_datum: document.getElementById('m_szul').value || null,
            bekerules_datuma: document.getElementById('m_bekerules').value || null,
            suly_kg: document.getElementById('m_suly').value || null,
            magassag_cm: document.getElementById('m_magassag').value || null,
            chip: document.getElementById('m_chip').checked,
            allapot: document.getElementById('m_allapot').value,
            leiras: document.getElementById('m_leiras').value || null,
        };

        const kepFile = document.getElementById('m_kep').files[0];

        try {
            let allatId;
            if (isEdit) {
                await updateAnimal(animal.id, animalData);
                allatId = animal.id;
            } else {
                const result = await createAnimal(animalData);
                allatId = result.adatok.id;
            }

            if (kepFile) {
                await uploadAnimalKep(allatId, kepFile);
            }

            modalOverlay.remove();
            renderAnimalsAdmin();
        } catch (error) {
            alert('Hiba történt a mentés során: ' + error.message);
        }
    });
}

function populateAnimalSelect(animals) {
    const select = document.getElementById('animalselect');
    if (!select) return;

    select.innerHTML = '<option value="">Válassz állatot</option>';
    animals.forEach(animal => {
        const option = document.createElement('option');
        option.value = animal.id;
        option.textContent = `${animal.nev} (${animal.faj})`;
        select.appendChild(option);
    });
}

// Oldal betöltésekor
document.addEventListener('DOMContentLoaded', () => {
    renderAnimals();
    renderAdoptedAnimals();

    const animalsSection = document.getElementById('animals');
    if (animalsSection) {
        renderAnimalsAdmin();
    }

    // Keresés / szűrés / rendezés a főoldalon
    const searchInput = document.querySelector('.search');
    const typeFilter = document.getElementById('typefilter');
    const sortFilter = document.getElementById('sortfilter');
    if (searchInput) searchInput.addEventListener('input', applyAnimalFilters);
    if (typeFilter) typeFilter.addEventListener('change', applyAnimalFilters);
    if (sortFilter) sortFilter.addEventListener('change', applyAnimalFilters);

    // Újrapróbálás gomb sikertelen betöltés után
    const retryBtn = document.getElementById('animals_retry');
    if (retryBtn) retryBtn.addEventListener('click', renderAnimals);

    // "+ Új állat" gomb a felületeken
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn_new_animal')) {
            openAnimalModal(null);
        }
    });
});
