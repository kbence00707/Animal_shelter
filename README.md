# Állatmenhely

A meglévő HTML frontend Laravel 12 / Blade szerkezetben.

## Indítás

```powershell
composer install
Copy-Item .env.example .env
php artisan key:generate
php artisan serve
```

A `.env` másolását és a kulcsgenerálást csak az első indításkor kell elvégezni. Megnyitás: <http://localhost:8000>.

XAMPP/Apache használatakor a webhely gyökere a projekt `public` könyvtára legyen.

## Felépítés

- `routes/web.php`: főoldal (`/`), bejelentkezés (`/login`), vezetőségi (`/admin`) és dolgozói (`/worker`) bemutató.
- `resources/views`: Blade oldalak, közös elrendezés és résznézetek.
- `public/css/style.css`: az eredeti stílusok, a témák színei CSS-változókkal.
- `public/js/script.js`: a meglévő frontend működése.
- `public/js/theme.js`: témaváltás, rendszerbeállítás követése és a választás megjegyzése a böngészőben.
- `public/pictures`: az eredeti képek.
