// Foglalások API hívások
async function createBooking(bookingData) {
    try {
        const data = await apiCall('/foglalasok', {
            method: 'POST',
            body: JSON.stringify(bookingData),
        });
        return data;
    } catch (error) {
        console.error('Hiba a foglalás létrehozásakor:', error);
        throw error;
    }
}

async function fetchBookings() {
    try {
        const data = await apiCall('/foglalasok');
        return data.adatok;
    } catch (error) {
        console.error('Hiba a foglalások lekérésekor:', error);
        return [];
    }
}

async function updateBooking(id, bookingData) {
    try {
        const data = await apiCall(`/foglalasok/${id}`, {
            method: 'PUT',
            body: JSON.stringify(bookingData),
        });
        return data;
    } catch (error) {
        console.error('Hiba a foglalás frissítésekor:', error);
        throw error;
    }
}

async function deleteBooking(id) {
    try {
        const data = await apiCall(`/foglalasok/${id}`, {
            method: 'DELETE',
        });
        return data;
    } catch (error) {
        console.error('Hiba a foglalás törlésekor:', error);
        throw error;
    }
}

// Foglalások megjelenítése az admin felületen
async function renderBookings() {
    const tbody = document.querySelector('#appointments tbody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="8">Betöltés...</td></tr>';

    try {
        const bookings = await fetchBookings();

        if (bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">Nincsenek foglalások.</td></tr>';
            return;
        }

        tbody.innerHTML = bookings.map(booking => `
            <tr>
                <td>${escapeHtml(booking.latogato_nev)}</td>
                <td>${escapeHtml(booking.email)}</td>
                <td>${escapeHtml(booking.telefonszam)}</td>
                <td>${booking.allat ? escapeHtml(booking.allat.nev) : 'Ismeretlen'}</td>
                <td>${booking.datum}</td>
                <td>${booking.idopont ? booking.idopont.substring(0, 5) : '-'}</td>
                <td>
                    <span class="status ${getStatusClass(booking.statusz)}">
                        ${getStatusText(booking.statusz)}
                    </span>
                </td>
                <td>
                    ${isLoggedIn() ? `
                        <button class="btn_small btn_green" onclick="acceptBooking(${booking.id})">Elfogadás</button>
                        <button class="btn_small btn_red" onclick="rejectBooking(${booking.id})">Elutasítás</button>
                    ` : '-'}
                </td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="8">Hiba történt a betöltés során.</td></tr>';
    }
}

// Foglalás elfogadása
async function acceptBooking(id) {
    if (!confirm('Biztosan elfogadod ezt a foglalást?')) return;

    try {
        await updateBooking(id, { statusz: 'elfogadva' });
        renderBookings();
    } catch (error) {
        alert('Hiba történt: ' + error.message);
    }
}

// Foglalás elutasítása
async function rejectBooking(id) {
    if (!confirm('Biztosan elutasítod ezt a foglalást?')) return;

    try {
        await updateBooking(id, { statusz: 'elutasitva' });
        renderBookings();
    } catch (error) {
        alert('Hiba történt: ' + error.message);
    }
}

// Admin felület betöltésekor
document.addEventListener('DOMContentLoaded', () => {
    const appointmentsSection = document.getElementById('appointments');
    if (appointmentsSection) {
        renderBookings();
    }
});

// Foglalás űrlap kezelése
document.addEventListener('DOMContentLoaded', () => {
    // Múltbéli dátum letiltása
    const bookingDate = document.getElementById('booking_date');
    if (bookingDate) {
        const now = new Date();
        bookingDate.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        bookingDate.addEventListener('invalid', () => {
            bookingDate.setCustomValidity(
                bookingDate.value === '' || bookingDate.value >= bookingDate.min
                    ? 'Válassz dátumot!'
                    : 'A foglalás dátuma nem lehet múltbéli.'
            );
        });
        bookingDate.addEventListener('input', () => bookingDate.setCustomValidity(''));
    }

    const bookingForm = document.getElementById('booking');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const timeSelect = document.getElementById('booking_time');
            const bookingData = {
                latogato_nev: document.getElementById('visitor_name').value,
                email: document.getElementById('visitor_email').value,
                telefonszam: document.getElementById('visitor_phone').value,
                allat_id: document.getElementById('animalselect').value,
                datum: document.getElementById('booking_date').value,
                idopont: timeSelect ? timeSelect.value : '10:00',
            };

            try {
                await createBooking(bookingData);
                const message = document.getElementById('booking_message');
                message.textContent = 'Foglalás sikeresen elküldve! Hamarosan felvesszük Önnel a kapcsolatot.';
                message.style.color = 'green';
                bookingForm.reset();
            } catch (error) {
                const message = document.getElementById('booking_message');
                message.textContent = error.message || 'Hiba történt a foglalás során.';
                message.style.color = 'red';
            }
        });
    }
});
