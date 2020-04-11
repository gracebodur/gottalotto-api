const DrawingsService = require('./drawings-service')
const path = require("path");
const express = require("express");
const jsonBodyParser = express.json();
const xss = require("xss");
const { requireAuth } = require("../middleware/jwt-auth");

const drawingsRouter = express.Router();

drawingsRouter
	.route('/')
	// .all(requireAuth)
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
	// .all(requireAuth)
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

// drawingsRouter
// 	.route('/winner/:drawing_id')
// 	.patch(jsonBodyParser, (req, res, next) => {
// 		DrawingsService.updateWinningdrawing(
// 			req.app.get('db'),
// 			req.params.drawing_id
// 		)
// 			.then(numRowsAffected => {
// 				res.status(204).end()
// 			})
// 			.catch(next)
// 	})

module.exports = drawingsRouter

