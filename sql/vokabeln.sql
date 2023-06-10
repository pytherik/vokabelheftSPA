DROP DATABASE IF EXISTS vokabelheft;
CREATE DATABASE vokabelheft;
USE vokabelheft;

CREATE TABLE user
(
    id            INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(50),
    password      VARCHAR(150),
    registered_at DATETIME
);

CREATE TABLE english
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    created_at DATE,
    word       VARCHAR(100)
);

CREATE TABLE german
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    created_at      DATE,
    word            VARCHAR(100)
);

CREATE TABLE english_german
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    created_at DATE,
    created_by INT,
    english_id INT,
    german_id  INT,
    wordclass  ENUM ('verb', 'noun', 'adjective')
);

CREATE TABLE user_pool
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT,
    created_at    DATE,
    english_id  INT,
    german_id   INT,
    description VARCHAR(256)
);

CREATE TABLE statistics
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT,
    tested_at  DATETIME,
    english_id INT,
    german_id  INT,
    is_correct BOOL
);

INSERT INTO user
VALUES (NULL, 'Erik', 'geheim', '2022-03-01'),
       (NULL, 'Hansi', 'secret', '2022-03-01'),
       (NULL, 'Johnny', 'special', '2022-03-01');

INSERT INTO english
VALUES (NULL, '2022-03-01', 'walk'),
       (NULL, '2022-03-01', 'go'),
       (NULL, '2022-03-18', 'run'),
       (NULL, '2022-03-18', 'eat'),
       (NULL, '2022-03-18', 'meal'),
       (NULL, '2022-03-21', 'sleep'),
       (NULL, '2022-03-21', 'sleep'),
       (NULL, '2022-03-21', 'drink'),
       (NULL, '2022-03-21', 'drink');

INSERT INTO german
VALUES (NULL, '2022-03-21', 'laufen'),
       (NULL, '2022-03-01', 'gehen'),
       (NULL, '2022-03-18', 'rennen'),
       (NULL, '2022-03-18', 'essen'),
       (NULL, '2022-03-18', 'das Essen'),
       (NULL, '2022-03-21', 'schlafen'),
       (NULL, '2022-03-21', 'der Schlaf'),
       (NULL, '2022-03-21', 'trinken'),
       (NULL, '2022-03-21', 'das Getränk');

INSERT INTO english_german
VALUES (NULL, '2022-03-01', 1, 1, 1, 1),
       (NULL, '2022-03-01', 1, 1, 2, 1),
       (NULL, '2022-03-01', 1, 2, 1, 1),
       (NULL, '2022-03-01', 1, 2, 2, 1),
       (NULL, '2022-03-01', 1, 3, 1, 1),
       (NULL, '2022-03-01', 1, 3, 3, 1),
       (NULL, '2022-03-18', 2, 4, 4, 1),
       (NULL, '2022-03-18', 2, 5, 5, 2),
       (NULL, '2022-03-18', 2, 6, 6, 1),
       (NULL, '2022-03-18', 1, 7, 7, 2),
       (NULL, '2022-03-21', 3, 8, 8, 1),
       (NULL, '2022-03-21', 3, 9, 9, 2);


INSERT INTO user_pool
VALUES (NULL, 1, '2022-03-01', 1, NULL, NULL),
       (NULL, 1, '2022-03-01', 2, NULL, NULL),
       (NULL, 1, '2022-03-01', 3, NULL, NULL),
       (NULL, 1, '2022-03-01', NULL, 1, NULL),
       (NULL, 1, '2022-03-01', NULL, 2, NULL),
       (NULL, 1, '2022-03-01', NULL, 3, NULL),
       (NULL, 2, '2022-03-18', 1, NULL, NULL),
       (NULL, 2, '2022-03-18', 4, NULL, NULL),
       (NULL, 2, '2022-03-18', 5, NULL, NULL),
       (NULL, 2, '2022-03-18', NULL, 4, NULL),
       (NULL, 2, '2022-03-18', NULL, 5, NULL),
       (NULL, 1, '2022-03-18', NULL, 7, NULL),
       (NULL, 2, '2022-03-18', 7, NULL, NULL),
       (NULL, 3, '2022-03-04', NULL, 3, 'schnell zu Fuß'),
       (NULL, 1, '2022-03-18', 4, NULL, 'to feed oneself'),
       (NULL, 3, '2022-03-19', 1, NULL, 'move by feet'),
       (NULL, 3, '2022-03-19', 8, NULL, NULL),
       (NULL, 3, '2022-03-19', NULL, 8, NULL),
       (NULL, 3, '2022-03-19', 9, NULL, NULL),
       (NULL, 3, '2022-03-19', NULL, 9, NULL),
       (NULL, 2, '2022-03-22', NULL, 7, 'Ruhephase'),
       (NULL, 1, '2022-03-22', 7, NULL, 'quench thirst'),
       (NULL, 1, '2022-03-27', NULL, 9, NULL),
       (NULL, 2, '2022-04-08', NULL, 2, NULL),
       (NULL, 3, '2022-04-08', NULL, 5, 'Nahrung');

INSERT INTO statistics
VALUES (NULL, 1, '2022-04-06 18:52:00', 4, NULL, TRUE),
       (NULL, 1, '2022-04-06 18:52:00', 3, NULL, FALSE),
       (NULL, 1, '2022-04-06 18:52:00', 2, NULL, TRUE),
       (NULL, 1, '2022-04-06 18:52:00', 7, NULL, FALSE),
       (NULL, 1, '2022-04-06 18:52:00', 1, NULL, FALSE),
       (NULL, 2, '2022-04-08 13:26:00', 2, NULL, TRUE),
       (NULL, 2, '2022-04-08 13:26:00', NULL, 7, TRUE),
       (NULL, 2, '2022-04-08 13:26:00', 5, NULL, FALSE),
       (NULL, 2, '2022-04-08 13:26:00', NULL, 4, TRUE),
       (NULL, 2, '2022-04-08 13:26:00', 2, NULL, TRUE),
       (NULL, 3, '2022-04-14 04:33:42', NULL, 4, TRUE),
       (NULL, 3, '2022-04-14 04:33:42', NULL, 8, FALSE),
       (NULL, 3, '2022-04-14 04:33:42', NULL, 3, FALSE),
       (NULL, 3, '2022-04-14 04:33:42', NULL, 1, FALSE),
       (NULL, 3, '2022-04-14 04:33:42', NULL, 5, FALSE);


ALTER TABLE english_german
    ADD FOREIGN KEY (english_id) REFERENCES english (id),
    ADD FOREIGN KEY (german_id) REFERENCES german (id),
    ADD FOREIGN KEY (created_by) REFERENCES user (id);

ALTER TABLE user_pool
    ADD FOREIGN KEY (user_id) REFERENCES user (id),
    ADD FOREIGN KEY (english_id) REFERENCES english (id),
    ADD FOREIGN KEY (german_id) REFERENCES german (id);

ALTER TABLE statistics
    ADD FOREIGN KEY (user_id) REFERENCES user (id),
    ADD FOREIGN KEY (english_id) REFERENCES english (id),
    ADD FOREIGN KEY (german_id) REFERENCES german (id);
