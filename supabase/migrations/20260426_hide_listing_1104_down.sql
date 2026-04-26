-- down: restore listing 1104 visibility

UPDATE listings
SET status = 'active'
WHERE id = 1104;
