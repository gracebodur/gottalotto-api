const WeeksService = {
	insertWeek(db, newWeek) {
		return db
			.insert(newWeek)
			.into("weeks")
			.returning("*")
			.then(([week]) => week)
			.then(week => (db, week.week_id));
	},
}

module.exports = WeeksService