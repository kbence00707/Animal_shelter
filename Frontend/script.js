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
// A bejelentkezés kezelését az auth-api.js végzi a backend API-n keresztül.

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
    // A keresés/szűrés/rendezés az animals-api.js applyAnimalFilters() függvényében van.
});

function showTab(tabId, btn) {
    document.querySelectorAll('.tab_content').forEach(tab => tab.classList.remove('active_tab'));
    document.querySelectorAll('.nav_btn').forEach(b => b.classList.remove('active'));
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) selectedTab.classList.add('active_tab');
    if (btn) btn.classList.add('active');
}


// Az állat/dolgozó modálok és a foglalás/örökbefogadás műveletek az
// *-api.js fájlokban vannak megvalósítva a backend API-n keresztül.
