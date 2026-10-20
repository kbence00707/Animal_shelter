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

async function renderAnimals() {
    const track = document.getElementById('animals_grid');
    if (!track) return;

    track.innerHTML = 'Állatok betöltése…';

    const animals = await fetchAnimals();
    allatokCache = animals;

    if (animals.length === 0) {
        track.innerHTML = '<p class="no-animals">Jelenleg nincs gazdira váró állat.</p>';
        return;
    }

    track.innerHTML = animals.map(animal => {
        const birthDate = new Date(animal.szuletesi_datum);
        const age = Math.floor((new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
        const kepUrl = animal.kep ? `${PICTURES_BASE_URL}/${animal.kep}` : 'pictures/dog.jpg';
        const kategoria = { kutya: 'dogs', macska: 'cats' }[(animal.faj || '').toLowerCase()] || 'other';

        return `
            <div class="animal_card" data-name="${animal.nev}" data-species="${animal.faj}" data-category="${kategoria}" data-birth="${birthDate.getTime()}">
                <img src="${kepUrl}" alt="${animal.nev}" onerror="this.src='pictures/dog.jpg'">
                <div class="animal_info">
                    <h3>${animal.nev}</h3>
                    <p class="animal_breed">${animal.fajta || animal.faj}</p>
                    <p class="animal_age">${age} éves • ${animal.nem === 'him' ? 'Hím' : 'Nőstény'}</p>
                    <p class="animal_description">${animal.leiras || 'Nincs leírás.'}</p>
                    <button class="button adopt_btn" onclick="openAdoptionModalById(${animal.id})">Örökbefogadom</button>
                </div>
            </div>
        `;
    }).join('');

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
            <div class="animal_card adopted_card" data-name="${animal.nev}">
                <img src="${kepUrl}" alt="${animal.nev}" onerror="this.src='pictures/dog.jpg'">
                <div class="animal_info">
                    <h3>${animal.nev}</h3>
                    <p class="animal_breed">${animal.fajta || animal.faj}</p>
                    <p class="animal_age">${age} éves • ${animal.nem === 'him' ? 'Hím' : 'Nőstény'}</p>
                    <span class="status adopt_badge">Már gazdis</span>
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
                <td>${animal.nev}</td>
                <td>${animal.faj}</td>
                <td>${animal.fajta || '-'}</td>
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
                        <button class="btn_small btn_blue">Szerkesztés</button>
                        <button class="btn_small btn_red" onclick="deleteAnimalById(${animal.id})">Törlés</button>
                    ` : '-'}
                </td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="10">Hiba történt a betöltés során.</td></tr>';
    }
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
});
