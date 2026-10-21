// API konfiguráció
const API_BASE_URL = 'http://localhost:8000/api';
const PICTURES_BASE_URL = API_BASE_URL.replace('/api', '') + '/pictures';

// Token kezelése
function getToken() {
    return localStorage.getItem('auth_token');
}

function setToken(token) {
    localStorage.setItem('auth_token', token);
}

function removeToken() {
    localStorage.removeItem('auth_token');
}

// API hívás segédfüggvény
async function apiCall(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        let message = error.hiba || error.uzenet || error.message || 'Hiba történt a kérés során.';
        if (error.errors) {
            const details = Object.values(error.errors).flat().join(' ');
            if (details) message = details;
        }
        throw new Error(message);
    }

    return response.json();
}

// HTML-escape segédfüggvény a felhasználói adatok biztonságos megjelenítéséhez
function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Állapot kezelés segédfüggvények
function getStatusClass(status) {
    switch (status) {
        case 'elfogadva': return 'active';
        case 'elutasitva': return 'rejected';
        case 'orokbefogadhato': return 'active';
        case 'orokbefogadva': return 'adopted';
        default: return 'pending';
    }
}

function getStatusText(status) {
    switch (status) {
        case 'elfogadva': return 'Elfogadva';
        case 'elutasitva': return 'Elutasítva';
        case 'orokbefogadhato': return 'Gazdira vár';
        case 'orokbefogadva': return 'Örökbefogadva';
        case 'kezeles_alatt': return 'Kezelés alatt';
        case 'fuggoben': return 'Függőben';
        default: return status;
    }
}
