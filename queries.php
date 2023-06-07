<?php

//info all distinct english words from user pool of user
// plus words created by user from global pool
const USER_POOL_ENGLISH = "
SELECT DISTINCT(e.id) as word_id,
               up.id,
               e.word, 
               wordclass, 
               created_by, 
               u.name as author_name, 
               up.created_at
FROM english e
         JOIN english_german eg ON e.id = eg.english_id
         JOIN user_pool up ON e.id = up.english_id
         JOIN user u ON u.id = eg.created_by
WHERE up.user_id = :userId
ORDER BY up.created_at DESC;
";

//info all distinct english words from all users
const ALL_USERS_POOL_ENGLISH = "
SELECT distinct(e.id) AS word_id,
               (SELECT DISTINCT eg.id FROM english_german eg WHERE e.id=eg.id) AS id,
               e.word,
               wordclass,
               created_by,
               u.name as author_name,
               e.created_at
FROM english e
         JOIN english_german eg ON e.id = eg.english_id
         JOIN user u ON u.id = eg.created_by
ORDER BY e.created_at DESC";

//info all german words from user pool of user
const USER_POOL_GERMAN = "
SELECT DISTINCT(g.id) as word_id,
               up.id,
               g.word, 
               wordclass, 
               created_by, 
               u.name as author_name, 
               up.created_at
FROM german g
         JOIN english_german eg ON g.id = eg.german_id
         JOIN user_pool up ON g.id = up.german_id
         JOIN user u ON u.id = eg.created_by
WHERE up.user_id = :userId
ORDER BY up.created_at DESC";


//info all distinct german words from all users
const ALL_USERS_POOL_GERMAN = "
SELECT  distinct(g.id) AS word_id,
                eg.id,
                g.word, 
                wordclass, 
                created_by, 
                u.name as author_name, 
                g.created_at
FROM german g
         JOIN english_german eg ON g.id = eg.german_id
         JOIN user u ON u.id = eg.created_by
ORDER BY g.created_at DESC";

//info translations aggregation for class German
const GET_ENGLISH_TRANSLATIONS = "
SELECT e.word FROM english e
    JOIN english_german eg ON e.id = eg.english_id
    JOIN german g ON eg.german_id = g.id
WHERE g.id = :id";

//info translations aggregation for class English
const GET_GERMAN_TRANSLATIONS = "
SELECT g.word FROM german g
    JOIN english_german eg ON g.id = eg.german_id
    JOIN english e ON eg.english_id = e.id
WHERE e.id = :id";
