const DrawingsService = {
	getAllDrawings(db) {
		return db
			.from('drawings')
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