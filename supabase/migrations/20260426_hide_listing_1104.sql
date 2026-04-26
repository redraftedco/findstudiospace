-- up: hide listing 1104 from public pages
-- Down: 20260426_hide_listing_1104_down.sql

UPDATE listings
SET status = 'inactive'
WHERE id = 1104;
