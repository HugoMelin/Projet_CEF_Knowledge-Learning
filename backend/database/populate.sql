-- Création des tables si celle-ci n'existe pas.
CREATE TABLE IF NOT EXISTS users (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, 
    role TEXT DEFAULT "['role-user']",
    is_verified BOOLEAN NOT NULL DEFAULT false,
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

CREATE TABLE IF NOT EXISTS purchases (
    id_purchases INT PRIMARY KEY AUTO_INCREMENT,
    id_user INT NOT NULL,
    id_courses INT,
    id_lessons INT,
    purchase_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_courses) REFERENCES courses(id_courses),
    FOREIGN KEY (id_lessons) REFERENCES lessons(id_lessons)
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
INSERT INTO users (username, email, password, is_verified) VALUES
('JohnDoe', 'john.doe@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true),
('JaneSmith', 'jane.smith@email.com', '$2y$10$hP3FUK8.6M3/dRx8Wz1tHeTQSk.4WAW0tL3fuYcHtPHPFRFfwE8Uy', true),
('MikeJohnson', 'mike.johnson@email.com', '$2y$10$wK1LjbN6rJ.bfA5E1ZNwN.Q5r2fJKbFZYOHqT5ZyV1oPNv/Kcztja', true),
('EmilyBrown', 'emily.brown@email.com', '$2y$10$CwxzqhZG9rWzJ5tFYq9Zn.4J0.6rGBMzFe5VUUwj5FwBUxQNqTqbC', true),
('DavidLee', 'david.lee@email.com', '$2y$10$5SA4Y9tu9Iq5vW6J5UO3h.xR0QdKG3ww1jjuuRwC7dFb1MKGBwugu', true),
('SarahWilson', 'sarah.wilson@email.com', '$2y$10$gH1.E3MlZ7kY1rnGbwxRjOJwl1xLUOZ9Qm4e9C5hKvZF.8.UC.0em', true),
('ChrisThomas', 'chris.thomas@email.com', '$2y$10$hhGBtLJ7bKhLKs1nUmgQZe1gRVWVVDnS4hyujGJGSVZgYoIjb4S2m', true),
('LisaAnderson', 'lisa.anderson@email.com', '$2y$10$3Rl0OyIzxFkP.Zj0yTz6gu5qlKKuTdtX.Mh.gFnPExVssrN1Ym7Aq', true),
('RobertTaylor', 'robert.taylor@email.com', '$2y$10$xKOZH1YMcpDFNLXLZOq5/.1cXVGxs4sFHBNZB9R.qYslykhJY.Hs2', true),
('JenniferClark', 'jennifer.clark@email.com', '$2y$10$0KZ7BVNfvlTtAjK5UC9Xs.xVbKT5jNk3bJLHNZ0j1sBOVZxHoD7wy', true),
('KevinMoore', 'kevin.moore@email.com', '$2y$10$IHv.ZK9qXZlVkGO3e8XVIemAMqn8Lc.5X5LZvYZ1X3.Q4ZJX5ZXZK', true),
('AmandaWhite', 'amanda.white@email.com', '$2y$10$NqL9ZJlVkGO3e8XVIemAMqn8Lc.5X5LZvYZ1X3.Q4ZJX5ZXZK', true),
('BrianHarris', 'brian.harris@email.com', '$2y$10$5SA4Y9tu9Iq5vW6J5UO3h.xR0QdKG3ww1jjuuRwC7dFb1MKGBwugu', true),
('MelissaMartin', 'melissa.martin@email.com', '$2y$10$gH1.E3MlZ7kY1rnGbwxRjOJwl1xLUOZ9Qm4e9C5hKvZF.8.UC.0em', true),
('JasonThompson', 'jason.thompson@email.com', '$2y$10$hhGBtLJ7bKhLKs1nUmgQZe1gRVWVVDnS4hyujGJGSVZgYoIjb4S2m', true),
('NicoleGarcia', 'nicole.garcia@email.com', '$2y$10$3Rl0OyIzxFkP.Zj0yTz6gu5qlKKuTdtX.Mh.gFnPExVssrN1Ym7Aq', true),
('AndrewRobinson', 'andrew.robinson@email.com', '$2y$10$xKOZH1YMcpDFNLXLZOq5/.1cXVGxs4sFHBNZB9R.qYslykhJY.Hs2', true),
('StephanieLewis', 'stephanie.lewis@email.com', '$2y$10$0KZ7BVNfvlTtAjK5UC9Xs.xVbKT5jNk3bJLHNZ0j1sBOVZxHoD7wy', true),
('DanielWalker', 'daniel.walker@email.com', '$2y$10$IHv.ZK9qXZlVkGO3e8XVIemAMqn8Lc.5X5LZvYZ1X3.Q4ZJX5ZXZK', true),
('RachelHall', 'rachel.hall@email.com', '$2y$10$NqL9ZJlVkGO3e8XVIemAMqn8Lc.5X5LZvYZ1X3.Q4ZJX5ZXZK', false);

INSERT INTO themes (name) VALUES
('Web Development'),
('Data Science'),
('Mobile App Development'),
('Cloud Computing'),
('Artificial Intelligence');

INSERT INTO courses (title, description, price, id_themes) VALUES
('HTML & CSS Fundamentals', 'Learn the basics of web development', 49.99, 1),
('JavaScript Essentials', 'Master JavaScript programming', 69.99, 1),
('Python for Data Science', 'Explore data analysis with Python', 79.99, 2),
('Machine Learning Basics', 'Introduction to machine learning algorithms', 89.99, 2),
('iOS App Development', 'Build iOS apps with Swift', 99.99, 3),
('Android Development with Kotlin', 'Create Android apps using Kotlin', 89.99, 3),
('AWS Fundamentals', 'Get started with Amazon Web Services', 79.99, 4),
('Azure Essentials', 'Learn the basics of Microsoft Azure', 69.99, 4),
('Deep Learning with TensorFlow', 'Advanced AI techniques using TensorFlow', 109.99, 5),
('Natural Language Processing', 'Process and analyze human language', 99.99, 5);

INSERT INTO lessons (title, content, video_url, price, id_courses) VALUES
('Introduction to HTML', 'Learn the basics of HTML structure', 'https://example.com/html-intro', 19.99, 1),
('CSS Styling', 'Style your web pages with CSS', 'https://example.com/css-styling', 19.99, 1),
('JavaScript Basics', 'Get started with JavaScript programming', 'https://example.com/js-basics', 24.99, 2),
('DOM Manipulation', 'Learn to interact with the Document Object Model', 'https://example.com/dom-manipulation', 24.99, 2),
('Python Basics', 'Introduction to Python programming', 'https://example.com/python-basics', 29.99, 3),
('Data Analysis with Pandas', 'Analyze data using Pandas library', 'https://example.com/pandas-analysis', 29.99, 3),
('Supervised Learning', 'Understanding supervised machine learning', 'https://example.com/supervised-learning', 34.99, 4),
('Unsupervised Learning', 'Explore unsupervised learning techniques', 'https://example.com/unsupervised-learning', 34.99, 4),
('Swift Programming', 'Learn Swift programming language', 'https://example.com/swift-programming', 39.99, 5),
('iOS UI Design', 'Design user interfaces for iOS apps', 'https://example.com/ios-ui-design', 39.99, 5),
('Kotlin Basics', 'Get started with Kotlin programming', 'https://example.com/kotlin-basics', 34.99, 6),
('Android Layout Design', 'Create layouts for Android apps', 'https://example.com/android-layout', 34.99, 6),
('AWS EC2 Instances', 'Learn about EC2 compute instances', 'https://example.com/aws-ec2', 29.99, 7),
('AWS S3 Storage', 'Understand S3 object storage', 'https://example.com/aws-s3', 29.99, 7),
('Azure Virtual Machines', 'Create and manage Azure VMs', 'https://example.com/azure-vm', 24.99, 8),
('Azure Blob Storage', 'Work with Azure Blob Storage', 'https://example.com/azure-blob', 24.99, 8),
('Neural Networks', 'Understanding neural network architectures', 'https://example.com/neural-networks', 44.99, 9),
('TensorFlow Basics', 'Get started with TensorFlow', 'https://example.com/tensorflow-basics', 44.99, 9),
('Text Classification', 'Implement text classification models', 'https://example.com/text-classification', 39.99, 10),
('Sentiment Analysis', 'Analyze sentiment in text data', 'https://example.com/sentiment-analysis', 39.99, 10);

INSERT INTO purchases (id_user, id_courses, purchase_date) VALUES
(1, 1, '2024-08-15 10:30:00'),
(2, 3, '2024-08-16 14:45:00'),
(4, 2, '2024-08-17 09:15:00'),
(6, 5, '2024-08-18 11:00:00'),
(8, 4, '2024-08-19 16:30:00'),
(10, 7, '2024-08-20 13:45:00'),
(12, 6, '2024-08-21 10:00:00'),
(14, 9, '2024-08-22 15:15:00'),
(16, 8, '2024-08-23 12:30:00'),
(18, 10, '2024-08-24 14:00:00');

INSERT INTO certifications (id_user, id_themes, obtained_date) VALUES
(1, 1, '2024-09-01 11:30:00'),
(2, 2, '2024-09-02 10:45:00'),
(4, 1, '2024-09-03 14:15:00'),
(6, 3, '2024-09-04 16:00:00'),
(8, 2, '2024-09-05 09:30:00');

INSERT INTO completed_lessons (id_user, id_lessons, completed_date) VALUES
(1, 1, '2024-08-25 10:00:00'),
(1, 2, '2024-08-26 11:30:00'),
(2, 5, '2024-08-27 14:45:00'),
(2, 6, '2024-08-28 16:15:00'),
(4, 3, '2024-08-29 09:30:00'),
(4, 4, '2024-08-30 11:00:00'),
(6, 9, '2024-08-31 13:45:00'),
(6, 10, '2024-09-01 15:30:00'),
(8, 7, '2024-09-02 10:15:00'),
(8, 8, '2024-09-03 12:00:00');

INSERT INTO completed_courses (id_user, id_courses, completed_date) VALUES
(1, 1, '2024-09-05 17:00:00'),
(2, 3, '2024-09-06 18:30:00'),
(4, 2, '2024-09-07 16:45:00'),
(6, 5, '2024-09-08 19:15:00'),
(8, 4, '2024-09-09 17:30:00');