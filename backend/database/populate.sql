USE knowledge_learning;

-- Création des tables si celle-ci n'existe pas.
CREATE TABLE IF NOT EXISTS users (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, 
    role TEXT DEFAULT "['role-user']",
    is_verified BOOLEAN NOT NULL DEFAULT false,
    verification_token VARCHAR(255) DEFAULT null,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS themes (
    id_themes INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS courses (
    id_courses INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    id_themes INT NOT NULL,
    FOREIGN KEY (id_themes) REFERENCES themes(id_themes)
);

CREATE TABLE IF NOT EXISTS lessons (
    id_lessons INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    video_url VARCHAR(255),
    price DECIMAL(15,2) NOT NULL,
    id_courses INT NOT NULL,
    FOREIGN KEY (id_courses) REFERENCES courses(id_courses)
);

CREATE TABLE IF NOT EXISTS invoices(
    id_invoice INT PRIMARY KEY AUTO_INCREMENT,
    id_user INT NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(id_user) REFERENCES users(id_user)
);

CREATE TABLE IF NOT EXISTS purchases (
    id_purchases INT PRIMARY KEY AUTO_INCREMENT,
    id_user INT NOT NULL,
    id_courses INT,
    id_lessons INT,
    id_invoice INT NOT NULL,
    purchase_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_courses) REFERENCES courses(id_courses),
    FOREIGN KEY (id_lessons) REFERENCES lessons(id_lessons),
    FOREIGN KEY (id_invoice) REFERENCES invoices(id_invoice)
);

CREATE TABLE IF NOT EXISTS certifications (
    id_certifications INT PRIMARY KEY AUTO_INCREMENT,
    id_user INT,
    id_themes INT,
    obtained_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_themes) REFERENCES themes(id_themes)
);

CREATE TABLE IF NOT EXISTS completed_lessons (
    id_user INT NOT NULL,
    id_lessons INT NOT NULL,
    completed_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_user, id_lessons),
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_lessons) REFERENCES lessons(id_lessons)
);

CREATE TABLE IF NOT EXISTS completed_courses (
    id_user INT NOT NULL,
    id_courses INT NOT NULL,
    completed_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_user, id_courses),
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_courses) REFERENCES courses(id_courses)
);

-- Insertion des données test.
INSERT INTO users (username, email, password, is_verified, role) VALUES
('JohnDoe', 'john.doe@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true, '[\'role-user\']'),
('JaneSmith', 'jane.smith@email.com', '$2y$10$hP3FUK8.6M3/dRx8Wz1tHeTQSk.4WAW0tL3fuYcHtPHPFRFfwE8Uy', true, '[\'role-user\']'),
('MikeJohnson', 'mike.johnson@email.com', '$2y$10$wK1LjbN6rJ.bfA5E1ZNwN.Q5r2fJKbFZYOHqT5ZyV1oPNv/Kcztja', true, '[\'role-user\']'),
('EmilyBrown', 'emily.brown@email.com', '$2y$10$CwxzqhZG9rWzJ5tFYq9Zn.4J0.6rGBMzFe5VUUwj5FwBUxQNqTqbC', true, '[\'role-user\',\'role-admin\']'),
('DavidLee', 'david.lee@email.com', '$2y$10$5SA4Y9tu9Iq5vW6J5UO3h.xR0QdKG3ww1jjuuRwC7dFb1MKGBwugu', true, '[\'role-user\']'),
('SarahWilson', 'sarah.wilson@email.com', '$2y$10$gH1.E3MlZ7kY1rnGbwxRjOJwl1xLUOZ9Qm4e9C5hKvZF.8.UC.0em', true, '[\'role-user\']'),
('ChrisThomas', 'chris.thomas@email.com', '$2y$10$hhGBtLJ7bKhLKs1nUmgQZe1gRVWVVDnS4hyujGJGSVZgYoIjb4S2m', true, '[\'role-user\']'),
('LisaAnderson', 'lisa.anderson@email.com', '$2y$10$3Rl0OyIzxFkP.Zj0yTz6gu5qlKKuTdtX.Mh.gFnPExVssrN1Ym7Aq', true, '[\'role-user\']'),
('RobertTaylor', 'robert.taylor@email.com', '$2y$10$xKOZH1YMcpDFNLXLZOq5/.1cXVGxs4sFHBNZB9R.qYslykhJY.Hs2', true, '[\'role-user\']'),
('JenniferClark', 'jennifer.clark@email.com', '$2y$10$0KZ7BVNfvlTtAjK5UC9Xs.xVbKT5jNk3bJLHNZ0j1sBOVZxHoD7wy', true, '[\'role-user\']'),
('KevinMoore', 'kevin.moore@email.com', '$2y$10$IHv.ZK9qXZlVkGO3e8XVIemAMqn8Lc.5X5LZvYZ1X3.Q4ZJX5ZXZK', true, '[\'role-user\',\'role-admin\']'),
('AmandaWhite', 'amanda.white@email.com', '$2y$10$NqL9ZJlVkGO3e8XVIemAMqn8Lc.5X5LZvYZ1X3.Q4ZJX5ZXZK', true, '[\'role-user\']'),
('BrianHarris', 'brian.harris@email.com', '$2y$10$5SA4Y9tu9Iq5vW6J5UO3h.xR0QdKG3ww1jjuuRwC7dFb1MKGBwugu', false, '[\'role-user\']'),
('MelissaMartin', 'melissa.martin@email.com', '$2y$10$gH1.E3MlZ7kY1rnGbwxRjOJwl1xLUOZ9Qm4e9C5hKvZF.8.UC.0em', true, '[\'role-user\']'),
('JasonThompson', 'jason.thompson@email.com', '$2y$10$hhGBtLJ7bKhLKs1nUmgQZe1gRVWVVDnS4hyujGJGSVZgYoIjb4S2m', true, '[\'role-user\']'),
('NicoleGarcia', 'nicole.garcia@email.com', '$2y$10$3Rl0OyIzxFkP.Zj0yTz6gu5qlKKuTdtX.Mh.gFnPExVssrN1Ym7Aq', true, '[\'role-user\']'),
('AndrewRobinson', 'andrew.robinson@email.com', '$2y$10$xKOZH1YMcpDFNLXLZOq5/.1cXVGxs4sFHBNZB9R.qYslykhJY.Hs2', true, '[\'role-user\']'),
('StephanieLewis', 'stephanie.lewis@email.com', '$2y$10$0KZ7BVNfvlTtAjK5UC9Xs.xVbKT5jNk3bJLHNZ0j1sBOVZxHoD7wy', true, '[\'role-user\']'),
('DanielWalker', 'daniel.walker@email.com', '$2y$10$IHv.ZK9qXZlVkGO3e8XVIemAMqn8Lc.5X5LZvYZ1X3.Q4ZJX5ZXZK', true, '[\'role-user\']'),
('RachelHall', 'rachel.hall@email.com', '$2y$10$NqL9ZJlVkGO3e8XVIemAMqn8Lc.5X5LZvYZ1X3.Q4ZJX5ZXZK', false, '[\'role-user\']'),
('User', 'user@mail.fr', '$2b$10$AUOtOb2qCRi65DTJWiTtz.S6QabewFvbj26WuGErWk/bEnd7SBMuu', true, '[\'role-user\']'),
('Admin', 'admin@mail.fr', '$2b$10$Kz2ioKV20F2xgOFyemBaz.DiR.RPJTR2BDcleZrWH7WiflmBsf8K.', true, '[\'role-user\',\'role-admin\']');

INSERT INTO themes (name) VALUES
('Cuisine'),
('Informatique'),
('Jardinage'),
('Musique');

INSERT INTO courses (title, description, price, id_themes) VALUES
('Cursus d’initiation à la guitare', 'Découvrez les bases de la guitare avec notre cursus d\'initiation : accords, techniques et chansons pour débutants, dans une ambiance conviviale !', 50.00, 1),
('Cursus d’initiation au piano', 'Initiez-vous au piano avec notre cursus : apprenez les notes, les accords et jouez vos morceaux préférés dans une atmosphère chaleureuse !', 50.00, 1),
('Cursus d’initiation au développement web', 'Plongez dans le monde du développement web : HTML, CSS, JavaScript et plus. Créez vos premiers sites et applications en quelques semaines !', 60.00, 2),
('Cursus d’initiation au jardinage', 'Découvrez les secrets du jardinage : semis, entretien des plantes et récolte. Transformez votre espace en un havre de verdure et de beauté !', 30.00, 3),
('Cursus d’initiation à la cuisine', 'Apprenez les bases de la cuisine : techniques, recettes savoureuses et astuces pratiques pour régaler vos proches et éveiller vos papilles !', 44.00, 4),
('Cursus d’initiation à l’art du dressage culinaire', 'Maîtrisez l\'art du dressage culinaire : techniques, astuces et créativité pour sublimer vos plats et impressionner vos convives à chaque repas !', 48.00, 4);

INSERT INTO lessons (title, content, video_url, price, id_courses) VALUES
('Découverte de l’instrument', 'Plongez dans l\'univers de la guitare : apprenez les bases, explorez les styles et laissez-vous emporter par la magie de cet instrument emblématique !', 'https://www.youtube.com/watch?v=pYQtMPcHIHw&pp=ygUZRMOpY291dmVydGUgZGUgbGEgZ3VpdGFyZQ%3D%3D', 26.00, 1),
('Les accords et les gammes', 'Maîtrisez les fondamentaux : explorez accords et gammes pour enrichir votre jeu. La clé pour composer, improviser et jouer avec aisance !', 'https://www.youtube.com/watch?v=lPdsKa5m710&pp=ygUmbGVzIGFjY29yZCBldCBsZXMgZ2FtbWVzIGRlIGxhIGd1aXRhcmU%3D', 26.00, 1),
('Découverte de l’instrument', 'Initiez-vous au piano : explorez les touches, les mélodies et développez votre sens musical dans une ambiance créative et inspirante !', 'https://www.youtube.com/watch?v=flX_99NbxKg&pp=ygUVZMOpY291dmVydGUgZHUgcGlhbm8g', 26.00, 2),
('Les langages Html et CSS', 'HTML structure le contenu web, CSS le style. Ensemble, ils créent des sites attractifs et fonctionnels. Maîtrisez ces langages pour donner vie à vos idées en ligne !', 'https://www.youtube.com/watch?v=hIEZ8xpdBts&pp=ygUQbGFuZ2FnZSBodG1sIGNzcw%3D%3D', 32.00, 3),
('Dynamiser votre site avec Javascript', 'Insufflez vie à votre site web : animations fluides, interactions utilisateur et contenu dynamique. JavaScript transforme votre page statique en expérience interactive captivante !', 'https://www.youtube.com/watch?v=CNs9ZEeRVpw&pp=ygUkRHluYW1pc2VyIHZvdHJlIHNpdGUgYXZlYyBKYXZhc2NyaXB0', 32.00, 3),
('Les outils du jardinier', 'Découvrez les essentiels du jardinage : sécateurs, pelles, râteaux et plus. Équipez-vous pour cultiver, entretenir et embellir votre jardin avec passion !', 'https://www.youtube.com/watch?v=D1_o8wt4Yxw&pp=ygUXTGVzIG91dGlscyBkdSBqYXJkaW5pZXI%3D', 16.00, 4),
('Jardiner avec la lune', 'Découvrez l\'art de jardiner avec la lune : semez, plantez et récoltez en harmonie avec les cycles lunaires pour des résultats optimaux et naturels !', 'https://www.youtube.com/watch?v=fs4ludIhcJQ&pp=ygUVSmFyZGluZXIgYXZlYyBsYSBsdW5l', 16.00, 4),
('Les modes de cuisson', 'Explorez les différents modes de cuisson : à la vapeur, rôtie, grillée ou mijotée. Apprenez à sublimer vos plats et à varier les saveurs !', 'https://www.youtube.com/watch?v=4L_PUwUbKhs&pp=ygUUTGVzIG1vZGVzIGRlIGN1aXNzb24%3D', 23.00, 5),
('Les saveurs', 'Découvrez l\'univers des saveurs : sucré, salé, acide, amer et umami. Apprenez à les marier pour créer des plats équilibrés et savoureux !', 'https://www.youtube.com/watch?v=Fs4nZ-JeOb4&pp=ygULTGVzIHNhdmV1cnM%3D', 23.00, 5),
('Mettre en œuvre le style dans l’assiette', 'Apprenez à sublimer vos plats avec élégance : techniques de présentation, choix des couleurs et harmonie des textures pour un festin visuel !', 'https://www.youtube.com/watch?v=YkkIu9RGetY&pp=ygUrTWV0dHJlIGVuIMWTdXZyZSBsZSBzdHlsZSBkYW5zIGzigJlhc3NpZXR0ZQ%3D%3D', 26.00, 6),
('Harmoniser un repas à quatre plats', 'Maîtrisez l\'art de l\'harmonie culinaire : associez saveurs, textures et couleurs pour créer un repas à quatre plats qui ravira vos convives !', 'https://www.youtube.com/watch?v=TXHerK_q5H0&pp=ygUjSGFybW9uaXNlciB1biByZXBhcyDDoCBxdWF0cmUgcGxhdHM%3D', 26.00, 6);

INSERT INTO invoices (id_user, price, created_at, modified_at) VALUES
(1, 45.00, '2024-08-15 10:30:00', '2024-08-15 10:30:00'),
(2, 24.95, '2024-08-16 14:45:00', '2024-08-16 14:45:00'),
(4, 45.00, '2024-08-17 09:15:00', '2024-08-17 09:15:00'),
(6, 24.95, '2024-08-18 11:00:00', '2024-08-18 11:00:00'),
(8, 45.00, '2024-08-19 16:30:00', '2024-08-19 16:30:00'),
(10, 24.95, '2024-08-20 13:45:00', '2024-08-20 13:45:00'),
(12, 45.00, '2024-08-21 10:00:00', '2024-08-21 10:00:00'),
(14, 24.95, '2024-08-22 15:15:00', '2024-08-22 15:15:00'),
(16, 45.00, '2024-08-23 12:30:00', '2024-08-23 12:30:00'),
(18, 24.95, '2024-08-24 14:00:00', '2024-08-24 14:00:00'),
(21, 109.00, '2024-10-07 23:12:11', '2024-10-07 23:12:11');

INSERT INTO purchases (id_user, id_courses, id_lessons, id_invoice, purchase_date) VALUES
(1, 1, NULL, 1, '2024-08-15 10:30:00'),
(2, NULL, 3, 2, '2024-08-16 14:45:00'),
(4, 2, NULL, 3, '2024-08-17 09:15:00'),
(6, NULL, 5, 4, '2024-08-18 11:00:00'),
(8, 4, NULL, 5, '2024-08-19 16:30:00'),
(10, NULL, 1, 6, '2024-08-20 13:45:00'),
(12, 6, NULL, 7, '2024-08-21 10:00:00'),
(14, NULL, 2, 8, '2024-08-22 15:15:00'),
(16, 4, NULL, 9, '2024-08-23 12:30:00'),
(18, NULL, 6, 10, '2024-08-24 14:00:00'),
(21, 3, NULL, 11, '2024-10-07 23:12:11'),
(21, NULL, 11, 11, '2024-10-07 23:12:11'),
(21, NULL, 8, 11, '2024-10-07 23:12:11');

INSERT INTO certifications (id_user, id_themes, obtained_date) VALUES
(1, 1, '2024-09-01 11:30:00'),
(2, 2, '2024-09-02 10:45:00'),
(4, 1, '2024-09-03 14:15:00'),
(6, 3, '2024-09-04 16:00:00'),
(8, 2, '2024-09-05 09:30:00'),
(21, 2, '2024-10-07 23:12:51');

INSERT INTO `completed_lessons` (`id_user`, `id_lessons`, `completed_date`) VALUES
(1, 1, '2024-08-25 10:00:00'),
(1, 2, '2024-08-26 11:30:00'),
(2, 5, '2024-08-27 14:45:00'),
(2, 6, '2024-08-28 16:15:00'),
(4, 3, '2024-08-29 09:30:00'),
(4, 4, '2024-08-30 11:00:00'),
(6, 9, '2024-08-31 13:45:00'),
(6, 10, '2024-09-01 15:30:00'),
(8, 7, '2024-09-02 10:15:00'),
(8, 8, '2024-09-03 12:00:00'),
(21, 4, '2024-10-07 23:12:49'),
(21, 5, '2024-10-07 23:12:51');

INSERT INTO `completed_courses` (`id_user`, `id_courses`, `completed_date`) VALUES
(1, 1, '2024-09-05 17:00:00'),
(2, 3, '2024-09-06 18:30:00'),
(4, 2, '2024-09-07 16:45:00'),
(6, 5, '2024-09-08 19:15:00'),
(8, 4, '2024-09-09 17:30:00'),
(21, 3, '2024-10-07 23:12:51');