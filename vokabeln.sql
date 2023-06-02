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
    id           INT AUTO_INCREMENT PRIMARY KEY,
    word         VARCHAR(100),
    description  VARCHAR(256)
);

CREATE TABLE german
(
    id           INT AUTO_INCREMENT PRIMARY KEY,
    word         VARCHAR(100),
    description  VARCHAR(256)
);

CREATE TABLE english_german
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    created_at DATE,
    created_by INT,
    english_id INT,
    german_id  INT,
    wordclass ENUM('verb', 'noun', 'adjective')
);

CREATE TABLE user_pool
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT,
    added_at    DATE,
    english_id  INT,
    german_id   INT,
    description VARCHAR(256)
);

CREATE TABLE tested
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
VALUES (NULL, 'walk', NULL),
       (NULL, 'go', NULL),
       (NULL, 'run', NULL),
       (NULL, 'eat', NULL),
       (NULL, 'meal', NULL),
       (NULL, 'sleep', NULL),
       (NULL, 'drink', NULL);

INSERT INTO german
VALUES (NULL, 'laufen', NULL),
       (NULL, 'gehen', NULL),
       (NULL, 'rennen', NULL),
       (NULL, 'essen', NULL),
       (NULL, 'das Essen', NULL),
       (NULL, 'schlafen', NULL),
       (NULL, 'der Schlaf', NULL),
       (NULL, 'trinken', NULL),
       (NULL, 'das Getränk', NULL);

INSERT INTO english_german VALUES
                               (NULL, '1.3.22', 1, 1, 1, 1),
                               (NULL, '1.3.22', 1, 1, 2, 1),
                               (NULL, '1.3.22', 1, 2, 1, 1),
                               (NULL, '1.3.22', 1, 2, 2, 1),
                               (NULL, '1.3.22', 1, 3, 1, 1),
                               (NULL, '18.3.22', 1, 3, 3, 1),
                               (NULL, '18.3.22', 2, 4, 4, 1),
                               (NULL, '18.3.22', 2, 5, 5, 2),
                               (NULL, '21.3.22', 2, 6, 6, 1),
                               (NULL, '21.3.22', 1, 6, 7, 2),
                               (NULL, '21.3.22', 3, 7, 8, 1),
                               (NULL, '21.3.22', 3, 7, 9, 2);


INSERT INTO user_pool
VALUES (NULL, 2, '2022-03-03', 1, NULL, NULL),
       (NULL, 3, '2022-03-04', NULL, 3, 'schnell zu Fuß'),
       (NULL, 1, '2022-03-18', 4, NULL, 'to feed oneself'),
       (NULL, 3, '2022-03-19', 1, NULL, 'move by feet'),
       (NULL, 2, '2022-03-22', NULL, 7, 'Ruhephase'),
       (NULL, 1, '2022-03-22', 7, NULL, 'quench thirst'),
       (NULL, 1, '2022-03-27', NULL, 9, NULL),
       (NULL, 2, '2022-04-08', NULL, 2, NULL),
       (NULL, 3, '2022-04-08', NULL, 5, 'Nahrung');

INSERT INTO tested
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

ALTER TABLE tested
    ADD FOREIGN KEY (user_id) REFERENCES user (id),
    ADD FOREIGN KEY (english_id) REFERENCES english (id),
    ADD FOREIGN KEY (german_id) REFERENCES german (id);
