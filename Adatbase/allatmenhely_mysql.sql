-- Állatmenhely – MySQL séma + kezdőadatok
-- Importálás: phpMyAdmin → Importálás, vagy: mysql -u root < allatmenhely_mysql.sql

CREATE DATABASE IF NOT EXISTS `allatmenhely`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `allatmenhely`;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- users (dolgozók és adminok)
-- ============================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nev` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `jelszo` varchar(255) NOT NULL,
  `telefonszam` varchar(20) DEFAULT NULL,
  `lakhely` varchar(255) DEFAULT NULL,
  `jogosultsag` enum('admin','dolgozo') NOT NULL DEFAULT 'dolgozo',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- personal_access_tokens (Laravel Sanctum – a bejelentkezéshez kötelező)
-- ============================================================
DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- allatok
-- ============================================================
DROP TABLE IF EXISTS `allatok`;
CREATE TABLE `allatok` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nev` varchar(255) NOT NULL,
  `faj` varchar(100) NOT NULL,
  `fajta` varchar(255) DEFAULT NULL,
  `nem` enum('him','nosteny') NOT NULL,
  `szuletesi_datum` date DEFAULT NULL,
  `suly_kg` decimal(8,2) DEFAULT NULL,
  `magassag_cm` int DEFAULT NULL,
  `leiras` text DEFAULT NULL,
  `kep` varchar(255) DEFAULT NULL,
  `allapot` enum('orokbefogadhato','kezeles_alatt','orokbefogadva') NOT NULL DEFAULT 'orokbefogadhato',
  `bekerules_datuma` date DEFAULT NULL,
  `chip` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- orvosok
-- ============================================================
DROP TABLE IF EXISTS `orvosok`;
CREATE TABLE `orvosok` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nev` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- vizsgalatok
-- ============================================================
DROP TABLE IF EXISTS `vizsgalatok`;
CREATE TABLE `vizsgalatok` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `allat_id` bigint unsigned NOT NULL,
  `orvos_id` bigint unsigned DEFAULT NULL,
  `orvosi_ido` date NOT NULL,
  `betegseg` varchar(255) DEFAULT NULL,
  `oltas` varchar(255) DEFAULT NULL,
  `megjegyzes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vizsgalatok_allat_id_foreign` (`allat_id`),
  KEY `vizsgalatok_orvos_id_foreign` (`orvos_id`),
  CONSTRAINT `vizsgalatok_allat_id_foreign` FOREIGN KEY (`allat_id`) REFERENCES `allatok` (`id`) ON DELETE CASCADE,
  CONSTRAINT `vizsgalatok_orvos_id_foreign` FOREIGN KEY (`orvos_id`) REFERENCES `orvosok` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- foglalasok (látogatási időpontok)
-- ============================================================
DROP TABLE IF EXISTS `foglalasok`;
CREATE TABLE `foglalasok` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `latogato_nev` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefonszam` varchar(20) NOT NULL,
  `allat_id` bigint unsigned NOT NULL,
  `datum` date NOT NULL,
  `idopont` time NOT NULL,
  `statusz` enum('fuggoben','elfogadva','elutasitva') NOT NULL DEFAULT 'fuggoben',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `foglalasok_allat_id_foreign` (`allat_id`),
  CONSTRAINT `foglalasok_allat_id_foreign` FOREIGN KEY (`allat_id`) REFERENCES `allatok` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- orokbefogadasok
-- ============================================================
DROP TABLE IF EXISTS `orokbefogadasok`;
CREATE TABLE `orokbefogadasok` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `allat_id` bigint unsigned NOT NULL,
  `latogato_nev` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefonszam` varchar(20) NOT NULL,
  `fogadas_datum` date NOT NULL,
  `statusz` enum('fuggoben','elfogadva','elutasitva') NOT NULL DEFAULT 'fuggoben',
  `megjegyzes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orokbefogadasok_allat_id_foreign` (`allat_id`),
  CONSTRAINT `orokbefogadasok_allat_id_foreign` FOREIGN KEY (`allat_id`) REFERENCES `allatok` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- Kezdőadatok
-- ============================================================

-- Dolgozók (jelszavak: admin123 / dolgozo123)
INSERT INTO `users` (`nev`, `email`, `jelszo`, `telefonszam`, `lakhely`, `jogosultsag`, `created_at`, `updated_at`) VALUES
('Adminisztrátor', 'admin@menhely.hu', '$2y$10$N/50.9IEG1L1RHsFEp4ryupZfbGHg95yASTdh5vE5cO1Fybg8hGjG', '+36 30 123 4567', '9342 Mihályi, Korona utca 1.', 'admin', NOW(), NOW()),
('Kiss János', 'janos@menhely.hu', '$2y$10$gI2hpG66jhDAuJnc9KOcM.PWM1eeopRQ99IGHEzHRlVE9OicKh9Hm', '+36 30 999 8888', '9342 Mihályi, Fő utca 5.', 'dolgozo', NOW(), NOW()),
('Nagy Éva', 'eva@menhely.hu', '$2y$10$gI2hpG66jhDAuJnc9KOcM.PWM1eeopRQ99IGHEzHRlVE9OicKh9Hm', '+36 30 555 1234', '9342 Mihályi, Dózsa utca 8.', 'dolgozo', NOW(), NOW());

-- Állatok
INSERT INTO `allatok` (`id`, `nev`, `faj`, `fajta`, `nem`, `szuletesi_datum`, `suly_kg`, `magassag_cm`, `leiras`, `kep`, `allapot`, `bekerules_datuma`, `chip`, `created_at`, `updated_at`) VALUES
(1, 'Bodri', 'kutya', 'keverék', 'him', '2022-05-10', 18.50, 50, 'Barátságos, szereti a gyerekeket.', 'dog.jpg', 'orokbefogadhato', '2026-03-01', 1, NOW(), NOW()),
(2, 'Cirmi', 'macska', 'európai rövidszőrű', 'nosteny', '2024-08-15', 3.80, 25, 'Bújós, dorombolós cica.', 'cat.jpg', 'orokbefogadhato', '2026-06-20', 0, NOW(), NOW()),
(3, 'Rex', 'kutya', 'német juhász', 'him', '2021-03-20', 35.00, 62, 'Aktív, sok mozgásra van szüksége.', 'dog2.jpg', 'orokbefogadhato', '2026-07-10', 1, NOW(), NOW()),
(4, 'Cica', 'macska', 'perzsa', 'nosteny', '2023-11-05', 4.20, 26, 'Nyugodt, szereti a pihenést.', 'cat2.jpg', 'kezeles_alatt', '2026-09-15', 1, NOW(), NOW()),
(5, 'Nyuszi', 'kutya', 'tacskó', 'nosteny', '2024-02-10', 5.50, 30, 'Aranyos, csendes kutyus.', 'kutya.jpg', 'orokbefogadhato', '2026-08-01', 1, NOW(), NOW()),
(6, 'Morzsa', 'macska', 'maine coon', 'him', '2023-06-20', 7.50, 30, 'Nagytestű, barátságos cica.', 'cat.jpg', 'orokbefogadhato', '2026-05-15', 1, NOW(), NOW()),
(7, 'Bubi', 'kutya', 'golden retriever', 'him', '2022-11-30', 32.00, 58, 'Játékos, nagyon kedves kutyus.', 'dog.jpg', 'orokbefogadhato', '2026-04-10', 1, NOW(), NOW()),
(8, 'Sziam', 'macska', 'sziámi', 'nosteny', '2023-03-15', 3.50, 25, 'Élénk, beszédes cica.', 'cat2.jpg', 'orokbefogadhato', '2026-07-25', 1, NOW(), NOW()),
(9, 'Buksi', 'kutya', 'boxer', 'him', '2021-09-05', 28.00, 57, 'Energikus, jó őrzőkutya.', 'dog2.jpg', 'orokbefogadhato', '2026-02-20', 1, NOW(), NOW()),
(10, 'Cirmos', 'macska', 'brit rövidszőrű', 'him', '2024-01-10', 5.00, 28, 'Nyugodt, könnyen kezelhető cica.', 'cat.jpg', 'orokbefogadhato', '2026-09-01', 0, NOW(), NOW()),
(11, 'Bogi', 'nyúl', 'törpenyúl', 'nosteny', '2025-04-01', 1.20, 20, 'Szobatiszta, kedves nyuszi.', 'rabbit.png', 'orokbefogadhato', '2026-08-20', 0, NOW(), NOW()),
(12, 'Rodney', 'tengerimalac', 'rövidszőrű', 'him', '2024-12-05', 0.90, 15, 'Csendes, könnyen tartható kiskedvenc.', 'tengeri_malac.jpg', 'orokbefogadhato', '2026-09-10', 0, NOW(), NOW()),
(13, 'Tési', 'teknős', 'mocsári teknős', 'him', '2015-06-01', 1.80, 12, 'Már gazdihoz került, sokat pihen.', '1792515353_teknős.jpg', 'orokbefogadva', '2026-01-15', 0, NOW(), NOW());

-- Orvosok
INSERT INTO `orvosok` (`id`, `nev`, `created_at`, `updated_at`) VALUES
(1, 'Dr. Kovács Péter', NOW(), NOW()),
(2, 'Dr. Szabó László', NOW(), NOW()),
(3, 'Dr. Fekete Andrea', NOW(), NOW());

-- Vizsgálatok
INSERT INTO `vizsgalatok` (`allat_id`, `orvos_id`, `orvosi_ido`, `betegseg`, `oltas`, `megjegyzes`, `created_at`, `updated_at`) VALUES
(1, 1, '2026-03-05', NULL, 'Kombinált oltás', 'Éves kötelező oltás megadva.', NOW(), NOW()),
(4, 2, '2026-09-18', 'Felső légúti gyulladás', NULL, 'Gyógyszeres kezelés folyamatban, kontroll 2 hét múlva.', NOW(), NOW()),
(3, 3, '2026-07-12', NULL, 'Veszettség elleni oltás', NULL, NOW(), NOW()),
(13, 1, '2026-01-20', NULL, NULL, 'Általános állapotfelmérés bekerüléskor.', NOW(), NOW());

-- Foglalások
INSERT INTO `foglalasok` (`latogato_nev`, `email`, `telefonszam`, `allat_id`, `datum`, `idopont`, `statusz`, `created_at`, `updated_at`) VALUES
('Tóth Mariann', 'toth.mariann@email.hu', '+36 30 111 2233', 1, CURDATE() + INTERVAL 3 DAY, '10:00:00', 'fuggoben', NOW(), NOW()),
('Horváth Gábor', 'horvath.gabor@email.hu', '+36 70 444 5566', 3, CURDATE() + INTERVAL 5 DAY, '14:30:00', 'fuggoben', NOW(), NOW()),
('Kovács Réka', 'kovacs.reka@email.hu', '+36 20 777 8899', 2, CURDATE() - INTERVAL 10 DAY, '09:00:00', 'elfogadva', NOW(), NOW());

-- Örökbefogadások
INSERT INTO `orokbefogadasok` (`allat_id`, `latogato_nev`, `email`, `telefonszam`, `fogadas_datum`, `statusz`, `megjegyzes`, `created_at`, `updated_at`) VALUES
(5, 'Balogh Tamás', 'balogh.tamas@email.hu', '+36 30 222 3344', CURDATE() + INTERVAL 7 DAY, 'fuggoben', 'Kertes házban lakunk, korábban is volt tacskónk.', NOW(), NOW()),
(13, 'Farkas Judit', 'farkas.judit@email.hu', '+36 20 888 9900', '2026-02-01', 'elfogadva', 'Teraszos lakás, a teknős kitalált helye.', NOW(), NOW());
