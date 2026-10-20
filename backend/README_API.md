# Állatmenhely Backend API

Laravel alapú backend API az állatmenhely rendszerhez MySQL adatbázissal.

## Telepítés

### 1. Függőségek telepítése

```bash
cd backend
composer install
```

### 2. Adatbázis konfiguráció

Másold a `.env.example` fájlt `.env` névre:

```bash
cp .env.example .env
```

Konfiguráld az adatbázis kapcsolatot a `.env` fájlban:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=animal_shelter
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Alkalmazás kulcs generálása

```bash
php artisan key:generate
```

### 4. Adatbázis importálása

A teljes adatbázis (séma + kezdőadatok) a repóban lévő SQL fájlból tölthető be:

```bash
mysql -u root < "../Adatbase/allatmenhely (1).sql"
```

Vagy phpMyAdminban: **Importálás** → `Adatbase/allatmenhely (1).sql` kiválasztása → **Indítás**.

A dump létrehozza az `animal_shelter` adatbázist az összes táblával és a jelenlegi adatokkal (felhasználók, állatok, orvosok stb.). A `migrations` tábla is benne van, ezért `php artisan migrate` futtatása nem szükséges.

### 6. Szerver indítása

```bash
php artisan serve
```

A szerver elérhető: http://localhost:8000

## API Endpoints

### Publikus (hitelesítés nélkül)

- `POST /api/login` - Bejelentkezés
  - Body: `{ "email": "string", "jelszo": "string" }`
  - Válasz: `{ "token": "string", "user": {...} }`

- `GET /api/allatok?status=orokbefogadhato` - Gazdira váró állatok listázása
  - Query param: `status` (orokbefogadhato|kezeles_alatt|orokbefogadva)
  - Query param: `faj` (kutya|macska|egyéb)

- `POST /api/foglalasok` - Új foglalás létrehozása
  - Body: `{ "latogato_nev": "string", "email": "string", "telefonszam": "string", "allat_id": "number", "datum": "date", "idopont": "time" }`

- `POST /api/orokbefogadasok` - Örökbefogadás kezdeményezése
  - Body: `{ "allat_id": "number", "latogato_nev": "string", "email": "string", "telefonszam": "string", "fogadas_datum": "date", "megjegyzes": "string" }`

### Hitelesített (token szükséges)

Header: `Authorization: Bearer {token}`

- `POST /api/logout` - Kijelentkezés
- `GET /api/me` - Jelenlegi felhasználó adatai

- `GET /api/foglalasok` - Foglalások listázása
- `GET /api/foglalasok/{id}` - Egy foglalás részletei
- `PUT /api/foglalasok/{id}` - Foglalás módosítása
- `DELETE /api/foglalasok/{id}` - Foglalás törlése

- `GET /api/orokbefogadasok` - Örökbefogadások listázása
- `GET /api/orokbefogadasok/{id}` - Egy örökbefogadás részletei
- `PUT /api/orokbefogadasok/{id}` - Örökbefogadás státusz módosítása
- `DELETE /api/orokbefogadasok/{id}` - Örökbefogadás törlése
- `GET /api/orokbefogadasok/allat/{allatId}` - Egy állat örökbefogadási előzményei

### Admin/Dolgozó (hitelesített + jogosultság)

- `GET /api/allatok/all` - Összes állat listázása (bejelentkezett munkatársaknak)
- `POST /api/allatok` - Új állat hozzáadása
- `PUT /api/allatok/{id}` - Állat módosítása
- `DELETE /api/allatok/{id}` - Állat törlése
- `POST /api/allatok/{id}/kep` - Kép feltöltése (multipart/form-data)

- `GET /api/users` - Dolgozók listázása (admin only)
- `POST /api/users` - Új dolgozó hozzáadása (admin only)
- `GET /api/users/{id}` - Egy dolgozó részletei (admin only)
- `PUT /api/users/{id}` - Dolgozó módosítása (admin only)
- `DELETE /api/users/{id}` - Dolgozó törlése (admin only)

- `GET /api/vizsgalatok` - Vizsgálatok listázása
- `GET /api/vizsgalatok/{id}` - Egy vizsgálat részletei
- `POST /api/vizsgalatok` - Új vizsgálat hozzáadása
- `PUT /api/vizsgalatok/{id}` - Vizsgálat módosítása
- `DELETE /api/vizsgalatok/{id}` - Vizsgálat törlése
- `GET /api/vizsgalatok/allat/{allatId}` - Egy állat összes vizsgálata

- `GET /api/orvosok` - Orvosok listázása
- `POST /api/orvosok` - Új orvos hozzáadása
- `GET /api/orvosok/{id}` - Egy orvos részletei
- `PUT /api/orvosok/{id}` - Orvos módosítása
- `DELETE /api/orvosok/{id}` - Orvos törlése

## Teszt Felhasználók

A seed adatok után a következő felhasználók állnak rendelkezésre:

### Admin
- Email: `admin@menhely.hu`
- Jelszó: `admin123`
- Jogosultság: admin

### Dolgozók
- Email: `janos@menhely.hu` / Jelszó: `dolgozo123`
- Email: `eva@menhely.hu` / Jelszó: `dolgozo123`
- Jogosultság: dolgozo

## Frontend Integráció

A Frontend mappában lévő statikus HTML fájlok a következő API fájlokat használják:

- `api-config.js` - API konfiguráció és segédfüggvények
- `animals-api.js` - Állatok API hívások
- `bookings-api.js` - Foglalások API hívások
- `auth-api.js` - Hitelesítés API hívások
- `users-api.js` - Dolgozók API hívások
- `adoptions-api.js` - Örökbefogadások API hívások
- `vets-api.js` - Orvosok API hívások
- `exams-api.js` - Vizsgálatok API hívások

A Frontend mappát bármilyen HTTP szerverrel futtathatod:

```bash
cd Frontend
python3 -m http.server 3000
```

Vagy egyszerűen megnyithatod a fájlokat a böngészőben.

## Adatbázis Séma

### users (dolgozók)
- id, nev, email, jelszo (bcrypt hash), telefonszam, lakhely, jogosultsag (admin/dolgozo)

### allatok
- id, nev, faj, fajta, nem (him/nosteny), szuletesi_datum, suly_kg, magassag_cm, leiras, kep, allapot (orokbefogadhato/kezeles_alatt/orokbefogadva), bekerules_datuma, chip

### foglalasok
- id, latogato_nev, email, telefonszam, allat_id, datum, idopont, statusz (fuggoben/elfogadva/elutasitva)

### orokbefogadasok
- id, allat_id, latogato_nev, email, telefonszam, fogadas_datum, statusz (fuggoben/elfogadva/elutasitva), megjegyzes

### vizsgalatok
- id, allat_id, orvos_id, orvosi_ido, betegseg, oltas, megjegyzes

### orvosok
- id, nev

## Fontos Funkciók

### Örökbefogadás Automatikus Frissítés
Ha egy örökbefogadás státusza "elfogadva"-ra változik, az állat allapot mezője automatikusan "orokbefogadva"-ra frissül.

### Képkezelés
A képek a `public/pictures` mappában vannak tárolva. Kép feltöltés a `/api/allatok/{id}/kep` endpointon keresztül.

### Jogosultságok
- Admin: Minden művelet elérhető, beleértve a dolgozók kezelését
- Dolgozó: CRUD műveletek állatokon, foglalásokon, örökbefogadásokon, vizsgálatokon és orvosokon; a dolgozók kezelése (listázás, létrehozás, módosítás, törlés) admin-only

## Hibaelhárítás

### Adatbázis kapcsolat hiba
Ellenőrizd a `.env` fájlban az adatbázis beállításokat, és hogy a MySQL szerver fut-e.

### Adatbázis újratöltése
Ha az adatbázist alaphelyzetbe akarod állítani, importáld újra az SQL dumpot:

```bash
mysql -u root < "../Adatbase/allatmenhely (1).sql"
```

### CORS hiba
Ha a Frontend más porton fut, ellenőrizd a `bootstrap/app.php` Sanctum konfigurációját.

## License

Copyright © 2026 Állatmenhely Mihályi. Minden jog fenntartva.
