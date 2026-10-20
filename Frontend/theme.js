// Sötét/világos téma kezelése
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
}

function updateThemeToggle() {
    const toggle = document.getElementById('theme_toggle');
    if (!toggle) return;
    const dark = document.documentElement.classList.contains('dark');
    toggle.textContent = toggle.classList.contains('nav_btn')
        ? (dark ? '☀️ Világos mód' : '🌙 Sötét mód')
        : (dark ? '☀️' : '🌙');
    toggle.title = dark ? 'Világos mód' : 'Sötét mód';
    toggle.setAttribute('aria-label', toggle.title);
}

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('theme_toggle');
    if (!toggle) return;
    updateThemeToggle();
    toggle.addEventListener('click', () => {
        const dark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        updateThemeToggle();
    });
});
