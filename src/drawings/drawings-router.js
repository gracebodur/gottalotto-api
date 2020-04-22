const DrawingsService = require('./drawings-service')
const express = require("express");
const jsonBodyParser = express.json();

const drawingsRouter = express.Router();

drawingsRouter
	.route('/')
	.get((req, res, next) => {
		DrawingsService.getAllDrawings(req.app.get('db'))
			.then(drawings => {
				res.json(drawings)
			})
			.catch(next)
	})
	.post(jsonBodyParser, (req, res, next) => {
		const { week_id, drawing_1, drawing_2, drawing_3, drawing_4, drawing_5, drawing_power_ball, draw_date } = req.body
		const newDrawing = {
			week_id,
			drawing_1,
			drawing_2,
			drawing_3,
			drawing_4,
			drawing_5,
			drawing_power_ball,
			draw_date,
		}
		for (const [key, value] of Object.entries(newDrawing))
			if (value == null)
				return res.status(400).json({
					error: `Missing '${key}' in request body`
				});
		DrawingsService.insertDrawing(req.app.get("db"), newDrawing)
			.then(drawing => {
				res
					.status(201)
					.json(drawing);
			})
			.catch(next);
	})

drawingsRouter
	.route('/:week_id')
	.get((req, res, next) => {
		DrawingsService.getDrawingsByWeekId(
			req.app.get('db'),
			req.params.week_id
		)
			.then(drawing => {
				res.json(drawing);
			})
			.catch(next)
	})

module.exports = drawingsRouter

