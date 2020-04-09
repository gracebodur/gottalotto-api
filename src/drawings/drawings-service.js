const DrawingsService = {
	getAllDrawings(db) {
		return db
			.from('drawings')
		// .leftJoin('weeks',
		// 	'weeks.week_id', 'drawings.week_id'
		// )
		// .groupBy('drawings.week_id', 'weeks.week_id')
	},

	getDrawingsByWeekId(db, week_id) {
		return DrawingsService.getAllDrawings(db)
			.where('drawings.week_id', week_id)
	},

	getById(db, week_id) {
		return DrawingsService.getAllDrawings(db)
			.where("drawings.week_id", week_id)
			.first();
	},
	insertDrawing(db, newDrawing) {
		return db
			.insert(newDrawing)
			.into("drawings")
			.returning("*")
			.then(([drawing]) => drawing)
			.then(drawing => DrawingsService.getById(db, drawing.week_id));
	},
}

module.exports = DrawingsService