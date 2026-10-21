// Dolgozók API hívások
let usersCache = [];

async function fetchUsers() {
    try {
        const data = await apiCall('/users');
        return data.adatok;
    } catch (error) {
        console.error('Hiba a dolgozók lekérésekor:', error);
        return [];
    }
}

async function createUser(userData) {
    try {
        const data = await apiCall('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        return data;
    } catch (error) {
        console.error('Hiba a dolgozó létrehozásakor:', error);
        throw error;
    }
}

async function updateUser(id, userData) {
    try {
        const data = await apiCall(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
        return data;
    } catch (error) {
        console.error('Hiba a dolgozó frissítésekor:', error);
        throw error;
    }
}

async function deleteUser(id) {
    try {
        const data = await apiCall(`/users/${id}`, {
            method: 'DELETE',
        });
        return data;
    } catch (error) {
        console.error('Hiba a dolgozó törlésekor:', error);
        throw error;
    }
}

// Dolgozók megjelenítése az admin felületen
async function renderUsers() {
    const tbody = document.querySelector('#employees tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6">Betöltés...</td></tr>';

    try {
        const users = await fetchUsers();
        usersCache = users;

        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Nincsenek dolgozók.</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr data-user-id="${user.id}">
                <td>${escapeHtml(user.nev)}</td>
                <td>${escapeHtml(user.email)}</td>
                <td>${escapeHtml(user.telefonszam || '-')}</td>
                <td>#${user.id}</td>
                <td>
                    <span class="status ${user.jogosultsag === 'admin' ? 'active' : 'pending'}">
                        ${user.jogosultsag === 'admin' ? 'Admin' : 'Dolgozó'}
                    </span>
                </td>
                <td>
                    <button class="btn_small btn_blue" onclick="editUserById(${user.id})">Szerkesztés</button>
                    <button class="btn_small btn_red" onclick="deleteUserById(${user.id})">Törlés</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6">Hiba történt a betöltés során.</td></tr>';
    }
}

// Dolgozó törlése
async function deleteUserById(id) {
    if (!confirm('Biztosan törlöd ezt a dolgozót?')) return;

    try {
        await deleteUser(id);
        renderUsers();
    } catch (error) {
        alert('Hiba történt a törlés során: ' + error.message);
    }
}

// Dolgozó szerkesztése
function editUserById(id) {
    const user = usersCache.find(u => u.id === id);
    if (user) openUserModal(user);
}

// Dolgozó hozzáadása / szerkesztése modal (backend API-val)
function openUserModal(user = null) {
    const isEdit = !!user;
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal_overlay';

    modalOverlay.innerHTML = `
        <div class="modal_content">
            <h3>👥 ${isEdit ? escapeHtml(user.nev) + ' szerkesztése' : 'Új dolgozó hozzáadása'}</h3>
            <form id="edit_user_form">
                <div class="modal_form_group"><label>Név</label><input type="text" id="u_nev" value="${isEdit ? escapeHtml(user.nev) : ''}" required></div>
                <div class="modal_form_group"><label>E-mail cím</label><input type="email" id="u_email" value="${isEdit ? escapeHtml(user.email) : ''}" required></div>
                <div class="modal_form_group"><label>Telefonszám</label><input type="text" id="u_tel" value="${isEdit ? escapeHtml(user.telefonszam || '') : ''}"></div>
                <div class="modal_form_group"><label>Lakhely</label><input type="text" id="u_lakhely" value="${isEdit ? escapeHtml(user.lakhely || '') : ''}"></div>
                <div class="modal_form_group"><label>Jogosultság</label><select id="u_jog"><option value="dolgozo" ${!user || user.jogosultsag === 'dolgozo' ? 'selected' : ''}>Dolgozó</option><option value="admin" ${user && user.jogosultsag === 'admin' ? 'selected' : ''}>Admin</option></select></div>
                <div class="modal_form_group"><label>Jelszó${isEdit ? ' (csak ha módosítani szeretnéd)' : ''}</label><input type="password" id="u_jelszo" ${isEdit ? '' : 'required'} minlength="6" placeholder="Min. 6 karakter"></div>
                <div class="modal_actions">
                    <button type="button" class="btn_small btn_red" id="close_user_modal">Mégse</button>
                    <button type="submit" class="btn_small btn_green">Mentés</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modalOverlay);
    document.getElementById('close_user_modal').addEventListener('click', () => modalOverlay.remove());

    document.getElementById('edit_user_form').addEventListener('submit', async (ev) => {
        ev.preventDefault();

        const userData = {
            nev: document.getElementById('u_nev').value,
            email: document.getElementById('u_email').value,
            telefonszam: document.getElementById('u_tel').value || null,
            lakhely: document.getElementById('u_lakhely').value || null,
            jogosultsag: document.getElementById('u_jog').value,
        };

        const jelszo = document.getElementById('u_jelszo').value;
        if (!isEdit || jelszo) {
            userData.jelszo = jelszo;
        }

        try {
            if (isEdit) {
                await updateUser(user.id, userData);
            } else {
                await createUser(userData);
            }
            modalOverlay.remove();
            renderUsers();
        } catch (error) {
            alert('Hiba történt a mentés során: ' + error.message);
        }
    });
}

// Admin felület betöltésekor
document.addEventListener('DOMContentLoaded', () => {
    const employeesSection = document.getElementById('employees');
    if (employeesSection) {
        renderUsers();
    }

    // "+ Új dolgozó" gomb az admin felületen
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn_new_employee')) {
            openUserModal(null);
        }
    });
});
