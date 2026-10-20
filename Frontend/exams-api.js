// Vizsgálatok API hívások
async function fetchExams() {
    try {
        const data = await apiCall('/vizsgalatok');
        return data.adatok;
    } catch (error) {
        console.error('Hiba a vizsgálatok lekérésekor:', error);
        return [];
    }
}

async function fetchExamsByAnimal(animalId) {
    try {
        const data = await apiCall(`/vizsgalatok/allat/${animalId}`);
        return data.adatok;
    } catch (error) {
        console.error('Hiba az állat vizsgálatainak lekérésekor:', error);
        return [];
    }
}

async function createExam(examData) {
    try {
        const data = await apiCall('/vizsgalatok', {
            method: 'POST',
            body: JSON.stringify(examData),
        });
        return data;
    } catch (error) {
        console.error('Hiba a vizsgálat létrehozásakor:', error);
        throw error;
    }
}

async function updateExam(id, examData) {
    try {
        const data = await apiCall(`/vizsgalatok/${id}`, {
            method: 'PUT',
            body: JSON.stringify(examData),
        });
        return data;
    } catch (error) {
        console.error('Hiba a vizsgálat frissítésekor:', error);
        throw error;
    }
}

async function deleteExam(id) {
    try {
        const data = await apiCall(`/vizsgalatok/${id}`, {
            method: 'DELETE',
        });
        return data;
    } catch (error) {
        console.error('Hiba a vizsgálat törlésekor:', error);
        throw error;
    }
}

// Vizsgálatok megjelenítése az admin felületen
async function renderExams() {
    const tbody = document.querySelector('#exams tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7">Betöltés...</td></tr>';

    try {
        const exams = await fetchExams();

        if (exams.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Nincsenek vizsgálatok.</td></tr>';
            return;
        }

        tbody.innerHTML = exams.map(exam => `
            <tr>
                <td>#${exam.id}</td>
                <td>${exam.allat ? exam.allat.nev : 'Ismeretlen'}</td>
                <td>${exam.orvos ? exam.orvos.nev : 'Ismeretlen'}</td>
                <td>${exam.orvosi_ido}</td>
                <td>${exam.betegseg || '-'}</td>
                <td>${exam.oltas || '-'}</td>
                <td>
                    ${isAdmin() ? `
                        <button class="btn_small btn_blue" onclick="editExam(${exam.id})">Szerkesztés</button>
                        <button class="btn_small btn_red" onclick="deleteExamById(${exam.id})">Törlés</button>
                    ` : '-'}
                </td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="7">Hiba történt a betöltés során.</td></tr>';
    }
}

// Vizsgálat törlése
async function deleteExamById(id) {
    if (!confirm('Biztosan törlöd ezt a vizsgálatot?')) return;

    try {
        await deleteExam(id);
        renderExams();
    } catch (error) {
        alert('Hiba történt a törlés során: ' + error.message);
    }
}

// Vizsgálat szerkesztése
function editExam(id) {
    const exams = fetchExams().then(exams => {
        const exam = exams.find(e => e.id === id);
        if (!exam) return;

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal_overlay';

        modalOverlay.innerHTML = `
            <div class="modal_content">
                <h3>🏥 Vizsgálat szerkesztése</h3>
                <form id="edit_exam_form">
                    <div class="modal_form_group">
                        <label>Betegség</label>
                        <input type="text" id="e_betegseg" value="${exam.betegseg || ''}">
                    </div>
                    <div class="modal_form_group">
                        <label>Oltás</label>
                        <input type="text" id="e_oltas" value="${exam.oltas || ''}">
                    </div>
                    <div class="modal_form_group">
                        <label>Megjegyzés</label>
                        <textarea id="e_megjegyzes" rows="3">${exam.megjegyzes || ''}</textarea>
                    </div>
                    <div class="modal_actions">
                        <button type="button" class="btn_small btn_red" id="close_exam_modal">Mégse</button>
                        <button type="submit" class="btn_small btn_green">Mentés</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modalOverlay);
        document.getElementById('close_exam_modal').addEventListener('click', () => modalOverlay.remove());

        document.getElementById('edit_exam_form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const e_betegseg = document.getElementById('e_betegseg').value;
            const e_oltas = document.getElementById('e_oltas').value;
            const e_megjegyzes = document.getElementById('e_megjegyzes').value;

            try {
                await updateExam(id, {
                    betegseg: e_betegseg,
                    oltas: e_oltas,
                    megjegyzes: e_megjegyzes
                });
                modalOverlay.remove();
                renderExams();
            } catch (error) {
                alert('Hiba történt a mentés során: ' + error.message);
            }
        });
    });
}

// Új vizsgálat hozzáadása
function openNewExamModal() {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal_overlay';

    modalOverlay.innerHTML = `
        <div class="modal_content">
            <h3>🏥 Új vizsgálat hozzáadása</h3>
            <form id="new_exam_form">
                <div class="modal_form_group">
                    <label>Állat</label>
                    <select id="e_allat_id" required>
                        <option value="">Válassz állatot</option>
                    </select>
                </div>
                <div class="modal_form_group">
                    <label>Orvos</label>
                    <select id="e_orvos_id" required>
                        <option value="">Válassz orvost</option>
                    </select>
                </div>
                <div class="modal_form_group">
                    <label>Dátum</label>
                    <input type="date" id="e_datum" required>
                </div>
                <div class="modal_form_group">
                    <label>Betegség</label>
                    <input type="text" id="e_betegseg">
                </div>
                <div class="modal_form_group">
                    <label>Oltás</label>
                    <input type="text" id="e_oltas">
                </div>
                <div class="modal_form_group">
                    <label>Megjegyzés</label>
                    <textarea id="e_megjegyzes" rows="3"></textarea>
                </div>
                <div class="modal_actions">
                    <button type="button" class="btn_small btn_red" id="close_exam_modal">Mégse</button>
                    <button type="submit" class="btn_small btn_green">Mentés</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modalOverlay);
    document.getElementById('close_exam_modal').addEventListener('click', () => modalOverlay.remove());

    // Állatok és orvosok betöltése a select mezőkbe
    fetchAllAnimals().then(animals => {
        const select = document.getElementById('e_allat_id');
        animals.forEach(animal => {
            const option = document.createElement('option');
            option.value = animal.id;
            option.textContent = animal.nev;
            select.appendChild(option);
        });
    });

    fetchVets().then(vets => {
        const select = document.getElementById('e_orvos_id');
        vets.forEach(vet => {
            const option = document.createElement('option');
            option.value = vet.id;
            option.textContent = vet.nev;
            select.appendChild(option);
        });
    });

    document.getElementById('new_exam_form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const e_allat_id = document.getElementById('e_allat_id').value;
        const e_orvos_id = document.getElementById('e_orvos_id').value;
        const e_datum = document.getElementById('e_datum').value;
        const e_betegseg = document.getElementById('e_betegseg').value;
        const e_oltas = document.getElementById('e_oltas').value;
        const e_megjegyzes = document.getElementById('e_megjegyzes').value;

        try {
            await createExam({
                allat_id: e_allat_id,
                orvos_id: e_orvos_id,
                orvosi_ido: e_datum,
                betegseg: e_betegseg,
                oltas: e_oltas,
                megjegyzes: e_megjegyzes
            });
            modalOverlay.remove();
            renderExams();
        } catch (error) {
            alert('Hiba történt a mentés során: ' + error.message);
        }
    });
}

// Admin felület betöltésekor
document.addEventListener('DOMContentLoaded', () => {
    const examsSection = document.getElementById('exams');
    if (examsSection) {
        renderExams();
    }
});
