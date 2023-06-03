# info USER_POOL_ENGLISH
SELECT DISTINCT(e.id) AS word_id, e.word, wordclass, created_by, u.name as author_name,e.created_at
FROM english e
         JOIN english_german eg ON e.id = eg.english_id
         JOIN user u ON u.id = eg.created_by
WHERE eg.created_by = 1
UNION ALL
SELECT DISTINCT(e2.id), e2.word, wordclass, created_by, u2.name as author_name, added_at
FROM english e2
         JOIN english_german eg2 ON e2.id = eg2.english_id
         JOIN user_pool up2 ON e2.id = up2.english_id
         JOIN user u2 ON u2.id = eg2.created_by
WHERE up2.user_id = 1
ORDER BY created_at DESC;



# info USER_POOL_GERMAN
SELECT DISTINCT(g.id) AS word_id, g.word, wordclass, created_by, u.name as author_name,g.created_at
FROM german g
         JOIN english_german eg ON g.id = eg.german_id
         JOIN user u ON u.id = eg.created_by
WHERE eg.created_by = 1
UNION ALL
SELECT DISTINCT(g2.id), g2.word, wordclass, created_by, u2.name as author_name, added_at
FROM german g2
         JOIN english_german eg2 ON g2.id = eg2.german_id
         JOIN user_pool up2 ON g2.id = up2.german_id
         JOIN user u2 ON u2.id = eg2.created_by
WHERE up2.user_id = 1
ORDER BY created_at DESC;

# info ALL_USERS_POOL_GERMAN
SELECT DISTINCT(g.id) AS word_id, g.word, wordclass, created_by, u.name as author_name,created_at
FROM german g
         JOIN english_german eg ON g.id = eg.german_id
         JOIN user u ON u.id = eg.created_by
UNION ALL
SELECT DISTINCT(g2.id), g2.word, wordclass, created_by, u2.name as author_name, added_at
FROM german g2
         JOIN english_german eg2 ON g2.id = eg2.german_id
         JOIN user_pool up2 ON g2.id = up2.german_id
         JOIN user u2 ON u2.id = eg2.created_by
ORDER BY created_at DESC;