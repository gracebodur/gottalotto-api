CREATE TABLE drawings (
	week_id INTEGER
    REFERENCES weeks(week_id) ON DELETE CASCADE NOT NULL,
	drawing_1 SMALLINT NOT NULL,
	drawing_2 SMALLINT NOT NULL,
	drawing_3 SMALLINT NOT NULL,
	drawing_4 SMALLINT NOT NULL,
	drawing_5 SMALLINT NOT NULL,
	drawing_power_ball SMALLINT NOT NULL,
  date_drawn TIMESTAMP DEFAULT now() NOT NULL
);