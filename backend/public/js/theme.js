(() => {
    const root = document.documentElement;
    const preference = window.matchMedia('(prefers-color-scheme: dark)');
    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem('theme');
    } catch {
        // Tárolás nélkül is működik a témaváltás.
    }

    function applyTheme(theme) {
        root.dataset.theme = theme;
        const dark = theme === 'dark';

        document.querySelectorAll('[data-theme-toggle]').forEach(button => {
            button.setAttribute('aria-pressed', String(dark));
            button.setAttribute('aria-label', dark ? 'Világos módra váltás' : 'Sötét módra váltás');
            button.querySelector('[data-theme-label]').textContent = dark ? 'Világos mód' : 'Sötét mód';
        });
    }

    if (savedTheme !== 'light' && savedTheme !== 'dark') savedTheme = null;
    applyTheme(savedTheme ?? (preference.matches ? 'dark' : 'light'));

    document.addEventListener('DOMContentLoaded', () => {
        applyTheme(root.dataset.theme);

        document.querySelectorAll('[data-theme-toggle]').forEach(button => {
            button.addEventListener('click', () => {
                savedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
                applyTheme(savedTheme);

                try {
                    localStorage.setItem('theme', savedTheme);
                } catch {
                    // Az aktuális oldalon így is megmarad a választás.
                }
            });
        });
    });

    preference.addEventListener('change', event => {
        if (!savedTheme) applyTheme(event.matches ? 'dark' : 'light');
    });
})();
