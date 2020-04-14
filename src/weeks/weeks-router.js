const WeeksService = require('./weeks-service')
const path = require("path");
const express = require("express");
const jsonBodyParser = express.json();
const xss = require("xss");
const { requireAuth } = require("../middleware/jwt-auth");

const weeksRouter = express.Router();

weeksRouter
	.route('/')
	// .all(requireAuth)
	.post(jsonBodyParser, (req, res, next) => {
		const { week_start_date } = req.body
		const newWeek = { week_start_date }

		WeeksService.insertWeek(req.app.get("db"), newWeek)
			.then(week => {
				res
					.status(201)
					.json(week);
			})
			.catch(next);
	})

weeksRouter
	.route('/currentweek')
	.get((req, res, next) => {
		WeeksService.getCurrentWeek(req.app.get('db'))
			.then(weeks => {
				const week = weeks[weeks.length - 1]
				res.json(week)
			})
			.catch(next)
	})

module.exports = weeksRouter