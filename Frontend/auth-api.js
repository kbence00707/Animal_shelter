// Hitelesítés API hívások
async function login(email, password) {
    try {
        const data = await apiCall('/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                jelszo: password,
            }),
        });

        setToken(data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Átirányítás a jogosultság alapján
        if (data.user.jogosultsag === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'worker.html';
        }

        return data;
    } catch (error) {
        console.error('Hiba a bejelentkezéskor:', error);
        throw error;
    }
}

async function logout() {
    try {
        await apiCall('/logout', {
            method: 'POST',
        });
    } catch (error) {
        console.error('Hiba a kijelentkezéskor:', error);
    } finally {
        removeToken();
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
}

async function getCurrentUser() {
    try {
        const data = await apiCall('/me');
        return data.user;
    } catch (error) {
        console.error('Hiba a felhasználó lekérésekor:', error);
        return null;
    }
}

function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function isLoggedIn() {
    return !!getToken();
}

function isAdmin() {
    const user = getUser();
    return user && user.jogosultsag === 'admin';
}

// Login űrlap kezelése
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login_form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('login_email').value;
            const password = document.getElementById('login_password').value;

            try {
                await login(email, password);
            } catch (error) {
                const message = document.getElementById('login_message');
                if (message) {
                    message.textContent = error.message || 'Hiba történt a bejelentkezés során.';
                    message.style.color = 'red';
                } else {
                    alert(error.message || 'Hiba történt a bejelentkezés során.');
                }
            }
        });
    }

    // Logout gombok kezelése
    const logoutLinks = document.querySelectorAll('.logout');
    logoutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });

    // Védett oldalak ellenőrzése
    const protectedPages = ['admin.html', 'worker.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage) && !isLoggedIn()) {
        window.location.href = 'login.html';
    }

    // Admin felület csak admin jogosultsággal érhető el
    if (currentPage === 'admin.html' && isLoggedIn() && !isAdmin()) {
        window.location.href = 'worker.html';
    }

    // Nem admin felhasználóknál az admin_only elemek rejtése
    if (isLoggedIn() && !isAdmin()) {
        document.querySelectorAll('.admin_only').forEach(el => {
            el.style.display = 'none';
        });
    }

    // Bejelentkezett felhasználót ne lássa a login űrlapot
    if (currentPage === 'login.html' && isLoggedIn()) {
        window.location.href = isAdmin() ? 'admin.html' : 'worker.html';
    }

    // Felhasználó nevének megjelenítése
    const userNameElement = document.getElementById('user_name');
    if (userNameElement) {
        const user = getUser();
        if (user) {
            userNameElement.textContent = `Bejelentkezve: ${user.nev}`;
        }
    }
});
