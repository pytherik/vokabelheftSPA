
#info USER_POOL_ENGLISH
SELECT DISTINCT(e.id) AS word_id, e.word, wordclass, created_by, u.name as author_name, e.created_at
FROM english e
         JOIN english_german eg ON e.id = eg.english_id
         JOIN user u ON u.id = eg.created_by
WHERE eg.created_by = :userId
UNION ALL
SELECT DISTINCT(e2.id), e2.word, wordclass, created_by, u2.name , added_at
FROM english e2
         JOIN english_german eg2 ON e2.id = eg2.english_id
         JOIN user_pool up2 ON e2.id = up2.english_id
         JOIN user u2 ON u2.id = eg2.created_by
WHERE up2.user_id = :userId
ORDER BY created_at DESC;


#info  ALL_USERS_POOL_ENGLISH
SELECT distinct(e.id) AS word_id, e.word, wordclass, created_by, u.name as author_name, e.created_at
FROM english e
         JOIN english_german eg ON e.id = eg.english_id
         JOIN user u ON u.id = eg.created_by
ORDER BY e.created_at DESC;

#info USER_POOL_GERMAN
SELECT DISTINCT(g.id) AS word_id, g.word, wordclass, created_by, u.name as author_name, g.created_at
FROM german g
         JOIN english_german eg ON g.id = eg.german_id
         JOIN user u ON u.id = eg.created_by
WHERE eg.created_by = :userId
UNION ALL
SELECT DISTINCT(g2.id), g2.word, wordclass, created_by, u2.name as author_name, added_at
FROM german g2
         JOIN english_german eg2 ON g2.id = eg2.german_id
         JOIN user_pool up2 ON g2.id = up2.german_id
         JOIN user u2 ON u2.id = eg2.created_by
WHERE up2.user_id = :userId
ORDER BY created_at DESC;

#info  ALL_USERS_POOL_GERMAN
SELECT distinct(g.id) AS word_id, g.word, wordclass, created_by, u.name as author_name, g.created_at
FROM german g
         JOIN english_german eg ON g.id = eg.german_id
         JOIN user u ON u.id = eg.created_by
ORDER BY g.created_at DESC;



const GET_ENGLISH_TRANSLATIONS = "
SELECT e.word FROM english e
    JOIN english_german eg ON e.id = eg.english_id
    JOIN german g ON eg.german_id = g.id
WHERE g.id = :id";

const GET_GERMAN_TRANSLATIONS = "
SELECT g.word FROM german g
    JOIN english_german eg ON g.id = eg.german_id
    JOIN english e ON eg.english_id = e.id
WHERE e.id = :id";
