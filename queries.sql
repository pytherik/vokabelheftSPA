#info alles von user german
SELECT DISTINCT(g.word), g.id, u.name, u.id, created_at, wordclass
FROM german g
         JOIN english_german eg ON g.id = eg.german_id
         JOIN user u ON u.id = eg.created_by
         JOIN user_pool up on g.id = up.german_id
WHERE eg.created_by = 3 OR (up.user_id = 3 AND up.german_id IS NOT NULL)
ORDER BY created_at DESC ;

#info alles von user english
SELECT DISTINCT(e.word), e.id, u.name, u.id, created_at, created_by, added_at, wordclass
FROM english e
         JOIN english_german eg ON e.id = eg.english_id
         JOIN user u ON u.id = eg.created_by
         JOIN user_pool up on e.id = up.english_id
WHERE eg.created_by = 3 OR (up.user_id = 3 AND up.english_id IS NOT NULL)
ORDER BY created_at DESC ;
