const nameInput = document.getElementById('visitor_name');
if (nameInput) {
    nameInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s\-]/g, '');
    });
}

const phoneInput = document.getElementById('visitor_phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let val = this.value.replace(/\D/g, '');
        if (val.length === 0) { this.value = ''; return; }
        if (val.startsWith('06')) val = '36' + val.substring(2);
        else if (!val.startsWith('36') && val.length > 0) val = '36' + val;
        let x = val.match(/(\d{0,2})(\d{0,2})(\d{0,3})(\d{0,4})/);
        let res = '';
        if (x[1]) res += '+' + x[1];
        if (x[2]) res += ' ' + x[2];
        if (x[3]) res += ' ' + x[3];
        if (x[4]) res += ' ' + x[4];
        this.value = res;
    });
}

const emailInput = document.getElementById('visitor_email');
if (emailInput) {
    emailInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-Z0-9@\.\-_\+]/g, '');
    });
}
const loginForm = document.getElementById('login_form');
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const email = document.getElementById('login_email').value;
        if (email.includes('admin')) window.location.href = 'admin.html';
        else window.location.href = 'worker.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('animals_grid');
    const btnPrev = document.getElementById('slider_prev');
    const btnNext = document.getElementById('slider_next');

    if (track && btnPrev && btnNext) {
        btnPrev.addEventListener('click', () => {
            const firstCard = track.querySelector('.animal_card');
            if (firstCard) {
                const cardWidth = firstCard.offsetWidth + 25; 
                track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            }
        });
        btnNext.addEventListener('click', () => {
            const firstCard = track.querySelector('.animal_card');
            if (firstCard) {
                const cardWidth = firstCard.offsetWidth + 25;
                track.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        });
    }
    const searchInput = document.querySelector('.search');
    const typeFilter = document.getElementById('typefilter');
    const sortFilter = document.getElementById('sortfilter');
    
    if (track && searchInput && typeFilter && sortFilter) {
        const cards = Array.from(track.getElementsByClassName('animal_card'));
        function filterAndSort() {
            const searchTerm = searchInput.value.toLowerCase();
            const type = typeFilter.value;
            const sortType = sortFilter.value;

            let filteredCards = cards.filter(card => {
                const name = card.dataset.name.toLowerCase();
                const species = card.dataset.species;
                const matchesSearch = name.includes(searchTerm);
                const matchesType = (type === 'all' || species === type);
                return matchesSearch && matchesType;
            });

            filteredCards.sort((a, b) => {
                if (sortType === 'birth_asc') return parseInt(b.dataset.birth) - parseInt(a.dataset.birth); 
                else if (sortType === 'birth_desc') return parseInt(a.dataset.birth) - parseInt(b.dataset.birth); 
                else if (sortType === 'name_asc') return a.dataset.name.localeCompare(b.dataset.name);
                else if (sortType === 'name_desc') return b.dataset.name.localeCompare(a.dataset.name);
                else if (sortType === 'species') return a.dataset.species.localeCompare(b.dataset.species);
                return 0; 
            });

            track.innerHTML = '';
            filteredCards.forEach(card => track.appendChild(card));
        }

        searchInput.addEventListener('input', filterAndSort);
        typeFilter.addEventListener('change', filterAndSort);
        sortFilter.addEventListener('change', filterAndSort);
    }
});

function showTab(tabId) {
    document.querySelectorAll('.tab_content').forEach(tab => tab.classList.remove('active_tab'));
    document.querySelectorAll('.nav_btn').forEach(btn => btn.classList.remove('active'));
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) selectedTab.classList.add('active_tab');
    const e = window.event;
    if (e && e.currentTarget) e.currentTarget.classList.add('active');
}

function openAnimalModal(row, tbody) {
    const isEdit = !!row;
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal_overlay';

    const nev = isEdit ? row.cells[1].innerText : '';
    const faj = isEdit ? row.cells[2].innerText : '';
    const fajta = isEdit ? row.cells[3].innerText : '';
    const nem = isEdit ? row.dataset.nem : 'him';
    const szul = isEdit ? row.cells[4].innerText : '';
    const suly = isEdit ? row.cells[5].innerText : '';
    const magassag = isEdit ? row.cells[6].innerText : '';
    const chip = isEdit ? (row.cells[7].innerText === 'Igen') : true;
    const allapotVal = isEdit ? (row.dataset.allapot || 'orokbefogadhato') : 'orokbefogadhato';
    const leiras = isEdit ? row.dataset.leiras : '';

    modalOverlay.innerHTML = `
        <div class="modal_content">
            <h3>🐾 ${isEdit ? nev + ' szerkesztése' : 'Új állat hozzáadása'}</h3>
            <form id="edit_form">
                <div class="modal_form_group"><label>Név</label><input type="text" id="m_nev" value="${nev}" required></div>
                <div class="modal_form_group"><label>Faj</label><input type="text" id="m_faj" value="${faj}" required></div>
                <div class="modal_form_group"><label>Fajta</label><input type="text" id="m_fajta" value="${fajta}"></div>
                <div class="modal_form_group"><label>Nem</label><select id="m_nem"><option value="him" ${nem==='him'?'selected':''}>Hím</option><option value="nosteny" ${nem==='nosteny'?'selected':''}>Nőstény</option></select></div>
                <div class="modal_form_group"><label>Születési dátum</label><input type="date" id="m_szul" value="${szul}"></div>
                <div style="display: flex; gap: 15px;">
                    <div class="modal_form_group" style="flex:1;"><label>Súly (kg)</label><input type="number" step="0.1" id="m_suly" value="${suly}"></div>
                    <div class="modal_form_group" style="flex:1;"><label>Magasság (cm)</label><input type="number" id="m_magassag" value="${magassag}"></div>
                </div>
                <div class="modal_form_group"><label>Mikrochip (Van?)</label><input type="checkbox" id="m_chip" ${chip ? 'checked' : ''}></div>
                <div class="modal_form_group"><label>Állapot</label><select id="m_allapot"><option value="orokbefogadhato" ${allapotVal==='orokbefogadhato'?'selected':''}>Örökbefogadható</option><option value="kezeles_alatt" ${allapotVal==='kezeles_alatt'?'selected':''}>Kezelés alatt</option></select></div>
                <div class="modal_form_group"><label>Leírás</label><textarea id="m_leiras" rows="3">${leiras}</textarea></div>
                <div class="modal_actions">
                    <button type="button" class="btn_small btn_red" id="close_modal">Mégse</button>
                    <button type="submit" class="btn_small btn_green">Mentés</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modalOverlay);
    document.getElementById('close_modal').addEventListener('click', () => modalOverlay.remove());

    document.getElementById('edit_form').addEventListener('submit', (ev) => {
        ev.preventDefault();
        const n_nev = document.getElementById('m_nev').value;
        const n_faj = document.getElementById('m_faj').value;
        const n_fajta = document.getElementById('m_fajta').value;
        const n_nem = document.getElementById('m_nem').value;
        const n_szul = document.getElementById('m_szul').value;
        const n_suly = document.getElementById('m_suly').value;
        const n_magassag = document.getElementById('m_magassag').value;
        const n_chip = document.getElementById('m_chip').checked ? 'Igen' : 'Nem';
        const n_allapot = document.getElementById('m_allapot').value;
        const allapotSzoveg = n_allapot === 'orokbefogadhato' ? 'Gazdira vár' : 'Kezelés alatt';
        const statusClass = n_allapot === 'orokbefogadhato' ? 'status active' : 'status pending';
        const n_leiras = document.getElementById('m_leiras').value;

        if (isEdit) {
            row.cells[1].innerText = n_nev;
            row.cells[2].innerText = n_faj;
            row.cells[3].innerText = n_fajta;
            row.cells[4].innerText = n_szul;
            row.cells[5].innerText = n_suly;
            row.cells[6].innerText = n_magassag;
            row.cells[7].innerText = n_chip;
            row.cells[8].innerHTML = `<span class="${statusClass}">${allapotSzoveg}</span>`;
            row.dataset.nem = n_nem;
            row.dataset.allapot = n_allapot;
            row.dataset.leiras = n_leiras;
        } else {
            const idNum = Math.floor(Math.random() * 900) + 100;
            const tr = document.createElement('tr');
            tr.dataset.nem = n_nem;
            tr.dataset.allapot = n_allapot;
            tr.dataset.leiras = n_leiras;
            tr.innerHTML = `
                <td>#${idNum}</td>
                <td>${n_nev}</td>
                <td>${n_faj}</td>
                <td>${n_fajta}</td>
                <td>${n_szul}</td>
                <td>${n_suly}</td>
                <td>${n_magassag}</td>
                <td>${n_chip}</td>
                <td><span class="${statusClass}">${allapotSzoveg}</span></td>
                <td><button class="btn_small btn_blue">Szerkesztés</button></td>
            `;
            tbody.appendChild(tr);
        }
        modalOverlay.remove();
    });
}

function openEmployeeModal(row, tbody) {
    const isEdit = !!row;
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal_overlay';

    const nev = isEdit ? row.cells[0].innerText : '';
    const email = isEdit ? row.cells[1].innerText : '';
    const tel = isEdit ? row.cells[2].innerText : '';
    const lakhely = isEdit ? row.cells[3].innerText : '';
    const jog = isEdit ? row.cells[4].innerText : 'Dolgozó';

    modalOverlay.innerHTML = `
        <div class="modal_content">
            <h3>👥 ${isEdit ? nev + ' szerkesztése' : 'Új dolgozó hozzáadása'}</h3>
            <form id="edit_form">
                <div class="modal_form_group"><label>Név</label><input type="text" id="m_nev" value="${nev}" required></div>
                <div class="modal_form_group"><label>E-mail cím</label><input type="email" id="m_email" value="${email}" required></div>
                <div class="modal_form_group"><label>Telefonszám</label><input type="text" id="m_tel" value="${tel}"></div>
                <div class="modal_form_group"><label>Lakhely</label><input type="text" id="m_lakhely" value="${lakhely}"></div>
                <div class="modal_form_group"><label>Jogosultság</label><select id="m_jog"><option value="Dolgozó" ${jog==='Dolgozó'?'selected':''}>Dolgozó</option><option value="Vezetőség" ${jog==='Vezetőség'?'selected':''}>Vezetőség</option></select></div>
                <div class="modal_actions">
                    <button type="button" class="btn_small btn_red" id="close_modal">Mégse</button>
                    <button type="submit" class="btn_small btn_green">Mentés</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modalOverlay);
    document.getElementById('close_modal').addEventListener('click', () => modalOverlay.remove());

    document.getElementById('edit_form').addEventListener('submit', (ev) => {
        ev.preventDefault();
        const n_nev = document.getElementById('m_nev').value;
        const n_email = document.getElementById('m_email').value;
        const n_tel = document.getElementById('m_tel').value;
        const n_lakhely = document.getElementById('m_lakhely').value;
        const n_jog = document.getElementById('m_jog').value;

        if (isEdit) {
            row.cells[0].innerText = n_nev;
            row.cells[1].innerText = n_email;
            row.cells[2].innerText = n_tel;
            row.cells[3].innerText = n_lakhely;
            row.cells[4].innerText = n_jog;
        } else {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${n_nev}</td>
                <td>${n_email}</td>
                <td>${n_tel}</td>
                <td>${n_lakhely}</td>
                <td>${n_jog}</td>
                <td>
                    <button class="btn_small btn_blue">Szerkesztés</button>
                    <button class="btn_small btn_red">Törlés</button>
                </td>
            `;
            tbody.appendChild(tr);
        }
        modalOverlay.remove();
    });
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn_new_animal')) {
        const tbody = e.target.closest('section').querySelector('tbody');
        openAnimalModal(null, tbody);
    }
    if (e.target.classList.contains('btn_new_employee')) {
        const tbody = e.target.closest('section').querySelector('tbody');
        openEmployeeModal(null, tbody);
    }
    if (e.target.classList.contains('btn_blue')) {
        const row = e.target.closest('tr');
        const sectionId = row.closest('section').id;
        if (sectionId === 'animals') openAnimalModal(row, null);
        if (sectionId === 'employees') openEmployeeModal(row, null);
    }
    if (e.target.classList.contains('btn_green') && !e.target.closest('#edit_form')) {
        if (confirm('Biztosan elfogadod ezt az időpontot?')) {
            const row = e.target.closest('tr');
            const statusBadge = row.querySelector('.status');
            if (statusBadge) {
                statusBadge.textContent = 'Elfogadva';
                statusBadge.className = 'status active';
            }
            e.target.closest('td').innerHTML = '<span style="color: #999; font-style: italic;">Kezelve</span>';
        }
    }
    if (e.target.classList.contains('btn_red') && !e.target.closest('#edit_form')) {
        const row = e.target.closest('tr');
        if (e.target.innerText === 'Törlés') {
            if (confirm('Biztosan véglegesen törlöd ezt a rekordot?')) row.remove();
        } else {
            if (confirm('Biztosan elutasítod ezt az időpontot?')) {
                const statusBadge = row.querySelector('.status');
                if (statusBadge) {
                    statusBadge.textContent = 'Elutasítva';
                    statusBadge.className = 'status rejected';
                }
                e.target.closest('td').innerHTML = '<span style="color: #999; font-style: italic;">Kezelve</span>';
            }
        }
    }
});