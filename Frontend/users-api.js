// Dolgozók API hívások
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

        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Nincsenek dolgozók.</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr data-user-id="${user.id}" data-lakhely="${user.lakhely || ''}">
                <td>${user.nev}</td>
                <td>${user.email}</td>
                <td>${user.telefonszam || '-'}</td>
                <td>#${user.id}</td>
                <td>
                    <span class="status ${user.jogosultsag === 'admin' ? 'active' : 'pending'}">
                        ${user.jogosultsag === 'admin' ? 'Admin' : 'Dolgozó'}
                    </span>
                </td>
                <td>
                    <button class="btn_small btn_blue">Szerkesztés</button>
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
function editUser(id) {
    const tbody = document.querySelector('#employees tbody');
    const row = Array.from(tbody.querySelectorAll('tr')).find(r => r.dataset.userId == id);

    if (row) {
        openEmployeeModal(row, tbody);
    }
}

// Admin felület betöltésekor
document.addEventListener('DOMContentLoaded', () => {
    const employeesSection = document.getElementById('employees');
    if (employeesSection) {
        renderUsers();
    }
});
