CREATE TABLE users (
  user_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
	user_created_date TIMESTAMP DEFAULT now() NOT NULL,
  date_modified TIMESTAMP DEFAULT now() NOT NULL
);