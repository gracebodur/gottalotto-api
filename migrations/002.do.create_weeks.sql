CREATE TABLE weeks (
  week_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
	week_start_date TIMESTAMP DEFAULT now()
);