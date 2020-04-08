BEGIN;

TRUNCATE
  guesses,
  drawings,
  weeks,
  users
  RESTART IDENTITY CASCADE;


INSERT INTO users (user_name, full_name, password)
VALUES
  ('admin', 'Administrator Gary', '$2a$12$rugz4SDjwR.33.UL1fOlQ.qMmpZ5MfRQI6dXJi8w4vj526IFM5eou'),
  ('malek', 'Malek Haj-Hussein', '$2a$12$3D/FNCVfI/RkbY.pw6HmbevZSFBBwxoHoIk/YTRVLQdIh9C0ECgYS'),
  ('grace', 'Grace Bodur', '$2a$12$pOde1szWj5A6dGcODWCUY.KHFKqkMuGuUvRPDBm73FP9xwxxHEUlC');

INSERT INTO weeks (week_start_date)
VALUES
  ("2020-03-07T00:00:00.000"),
  ("2020-03-14T00:00:00.000"),
  ("2020-03-21T00:00:00.000"),
  ("2020-03-28T00:00:00.000"),
  ("2020-04-04T00:00:00.000");

INSERT INTO drawings (week_id, drawing_1, drawing_2, drawing_3, drawing_4, drawing_4, drawing_power_ball, draw_date)
VALUES
  (1, 09, 23, 26, 30, 32, 08, "2020-03-14T00:00:00.000"),
  (2, 02, 23, 40, 59, 69, 13, "2020-03-21T00:00:00.000"), 
  (3, 07, 40, 48, 55, 66, 11, "2020-03-28T00:00:00.000"),
  (4, 08, 31, 39, 40, 43, 04, "2020-04-04T00:00:00.000");

INSERT INTO guesses (user_id, week_id, guess_1, guess_2, guess_3, guess_4, guess_5, power_ball, guess_created_date, message, has_won)
VALUES
  (1, 1, 12, 15, 26, 30, 32, 19, "2020-03-08T00:00:00.000", "Ea eiusmod do Lorem laboris incididunt.", true),
  (2, 1, 25, 23, 20, 35, 30, 11, "2020-03-10T00:00:00.000", "Amet cillum exercitation cupidatat dolor dolore pariatur.", false),
  (3, 1, 01, 09, 22, 42, 44, 15, "2020-03-12T00:00:00.000", "Non est et reprehenderit tempor voluptate elit eiusmod ea incididunt quis aliquip adipisicing tempor.", false),
  
  (2, 2, 04, 17, 23, 33, 44, 06, "2020-03-16T00:00:00.000", "In elit consectetur non excepteur commodo deserunt ea ad incididunt quis.", false),
  (3, 2, 12, 13, 14, 15, 19, 10, "2020-03-18T00:00:00.000", "Labore pariatur aute aliquip nisi pariatur aliquip laboris dolore cillum sunt est ut commodo pariatur.", false),
  (1, 2, 12, 23, 34, 45, 56, 09, "2020-03-20T00:00:00.000", "Duis eu id id consectetur ullamco.", true),

  (1, 3, 11, 25, 09, 20, 25, 10, "2020-03-23T00:00:00.000", "Sit enim consequat amet ipsum.", false),
  (3, 3, 25, 27, 20, 35, 30, 18, "2020-03-25T00:00:00.000", "Dolore eiusmod eu elit non commodo aliqua esse qui veniam consectetur magna quis tempor.", false),
  (2, 3, 01, 11, 21, 44, 68, 26, "2020-03-27T00:00:00.000", "Aliquip est nostrud est excepteur cillum ad.", true),

  (1, 4, 07, 29, 15, 25, 29, 10, "2020-03-23T00:00:00.000", "We miss you A'jahn", true),
  (3, 4, 01, 37, 17, 35, 63, 18, "2020-03-25T00:00:00.000", "Get well soon, Alan", false),
  (2, 4, 09, 30, 50, 44, 68, 26, "2020-03-27T00:00:00.000", "Cody is a badass developer", false),
  
  (1, 5, 06, 07, 09, 20, 26, 02, "2020-04-06T00:00:00.000", "Incididunt do voluptate voluptate ullamco commodo nisi irure Lorem sint elit esse ex nulla duis.", false),
  (3, 5, 25, 27, 20, 35, 30, 18, "2020-04-07T00:00:00.000", "Deserunt aute aliqua occaecat eiusmod laborum ut aliquip officia anim sunt ullamco consectetur.", false);

COMMIT;