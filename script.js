const nameInput = document.getElementById('visitor_name');
if (nameInput) {
    nameInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s\-]/g, '');
    });
}

const emailInput = document.getElementById('visitor_email');
if (emailInput) {
    emailInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-Z0-9@\.\-_\+]/g, '');
    });
}

const phoneInput = document.getElementById('visitor_phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9\+\-\s]/g, '');
    });
}

const loginForm = document.getElementById('login_form');
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const email = document.getElementById('login_email').value;
        const password = document.getElementById('login_password').value; 
        
        if (email.includes('admin')) {
            alert('Sikeres bejelentkezés! Üdvözöljük a Vezetőségi felületen, ' + email);
        } else {
            alert('Sikeres bejelentkezés! Üdvözöljük a Dolgozói felületen, ' + email);
        }
    });
}