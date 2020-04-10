const GuessesService = require('./guesses-service')
const path = require("path");
const express = require("express");
const jsonBodyParser = express.json();
const xss = require("xss");
const { requireAuth } = require("../middleware/jwt-auth");

const guessesRouter = express.Router();

const serializeGuess = guess => ({
	guess_id: guess.guess_id,
	user_id: guess.user_id,
	week_id: guess.week_id,
	guess_1: xss(guess.guess_1),
	guess_2: xss(guess.guess_2),
	guess_3: xss(guess.guess_3),
	guess_4: xss(guess.guess_4),
	guess_5: xss(guess.guess_5),
	power_ball: xss(guess.power_ball),
	guess_created_date: guess.guess_created_date,
	message: xss(guess.message),
	has_won: guess.has_won,
	user_name: guess.user_name,
	password: guess.password,
	user_created_date: guess.user_created_date,
	date_modified: guess.date_modified,
	week_start_date: guess.week_start_date
});



guessesRouter
	.route('/')
	// .all(requireAuth)
	.get((req, res, next) => {
		GuessesService.getAllGuesses(req.app.get('db'))
			.then(guesses => {
				res.json(guesses.map(serializeGuess))
			})
			.catch(next)
	})
	.post(jsonBodyParser, (req, res, next) => {
		const { user_id, week_id, guess_1, guess_2, guess_3, guess_4, guess_5, power_ball, message } = req.body
		const newGuess = {
			user_id,
			week_id,
			guess_1,
			guess_2,
			guess_3,
			guess_4,
			guess_5,
			power_ball,
			message
		}
		for (const [key, value] of Object.entries(newGuess))
			if (value == null)
				return res.status(400).json({
					error: `Missing '${key}' in request body`
				});
		GuessesService.insertGuess(req.app.get("db"), newGuess)
			.then(guess => {
				res
					.status(201)
					// .location(path.posix.join(req.originalUrl, `/${guess.guess_id}`))
					.json(guess);
			})
			.catch(next);
	})
guessesRouter
	.route('/winners')
	// .all(requireAuth)
	.get((req, res, next) => {
		GuessesService.getAllWinners(
			req.app.get('db')
		)
			.then(winners => {
				res.json(winners)
			})
			.catch(next)
	})

guessesRouter
	.route('/winner/:guess_id')
	.patch(jsonBodyParser, (req, res, next) => {
		GuessesService.updateWinningGuess(
			req.app.get('db'),
			req.params.guess_id
		)
			.then(numRowsAffected => {
				res.status(204).end()
			})
			.catch(next)
	})

guessesRouter
	.route('/:week_id')
	// .all(requireAuth)
	.get((req, res, next) => {
		GuessesService.getGuessesByWeekId(
			req.app.get('db'),
			req.params.week_id
		)
			.then(guesses => {
				res.json(guesses.map(serializeGuess));
			})
			.catch(next)
	})

module.exports = guessesRouter

