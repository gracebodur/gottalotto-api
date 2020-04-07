BEGIN;

TRUNCATE
  guesses,
  drawings,
  weeks,
  users,
  schemaversion;


INSERT INTO users (user_name, full_name, password)
VALUES
  ('admin', 'Administrator Gary', '$2a$12$rugz4SDjwR.33.UL1fOlQ.qMmpZ5MfRQI6dXJi8w4vj526IFM5eou'),
  ('malek', 'Malek Haj-Hussein', '$2a$12$3D/FNCVfI/RkbY.pw6HmbevZSFBBwxoHoIk/YTRVLQdIh9C0ECgYS'),
  ('grace', 'Grace Bodur', '$2a$12$pOde1szWj5A6dGcODWCUY.KHFKqkMuGuUvRPDBm73FP9xwxxHEUlC');

COMMIT;