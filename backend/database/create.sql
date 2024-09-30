-- Table répondant au schéma suivant :
-- users = (id_user, password, is_verified, username, email, role, verification_token, created_at, modified_at);
-- themes = (id_themes, name);
-- courses = (id_courses, title, description, price, #id_themes;
-- lessons = (id_lessons, title, content, video_url, price, #id_courses);
-- purchases = (#id_user, #id_courses, #id_lessons, id_purchases, purchase_date);
-- certifications = (#id_user, #id_themes, id_certifications, obtained_date);
-- completed_lessons = (#id_user, #id_lessons, completed_date);
-- completed_courses = (#id_user, #id_courses, completed_date);


-- Création des tables
CREATE TABLE users (
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

CREATE TABLE themes (
    id_themes INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE courses (
    id_courses INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    id_themes INT NOT NULL,
    FOREIGN KEY (id_themes) REFERENCES themes(id_themes)
);

CREATE TABLE lessons (
    id_lessons INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    video_url VARCHAR(255),
    price DECIMAL(15,2) NOT NULL,
    id_courses INT NOT NULL,
    FOREIGN KEY (id_courses) REFERENCES courses(id_courses)
);

CREATE TABLE purchases (
    id_purchases INT PRIMARY KEY AUTO_INCREMENT,
    id_user INT NOT NULL,
    id_courses INT,
    id_lessons INT,
    id_invoice INT,
    purchase_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_courses) REFERENCES courses(id_courses),
    FOREIGN KEY (id_lessons) REFERENCES lessons(id_lessons),
    FOREIGN KEY (id_invoice) REFERENCES invoices(id_invoice)
);

CREATE TABLE invoices(
    id_invoice INT PRIMARY KEY AUTO_INCREMENT,
    id_user INT NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(id_user) REFERENCES users(id_user)
);

CREATE TABLE certifications (
    id_certifications INT PRIMARY KEY AUTO_INCREMENT,
    id_user INT,
    id_themes INT,
    obtained_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_themes) REFERENCES themes(id_themes)
);

CREATE TABLE completed_lessons (
    id_user INT NOT NULL,
    id_lessons INT NOT NULL,
    completed_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_user, id_lessons),
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_lessons) REFERENCES lessons(id_lessons)
);

CREATE TABLE completed_courses (
    id_user INT NOT NULL,
    id_courses INT NOT NULL,
    completed_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_user, id_courses),
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_courses) REFERENCES courses(id_courses)
);