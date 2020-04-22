const GuessesService = {
	getAllGuesses(db) {
		return db
			.from('guesses')
			.select('*')
			.leftJoin('users',
				'guesses.user_id', 'users.user_id'
			)
			.leftJoin('weeks',
				'weeks.week_id', 'guesses.week_id'
			)
			.groupBy('guesses.guess_id', 'users.user_id', 'weeks.week_id')
	},

	getGuessesByWeekId(db, week_id) {
		return GuessesService.getAllGuesses(db)
			.where('weeks.week_id', week_id)
	},
	getById(db, guess_id) {
		return GuessesService.getAllGuesses(db)
			.where("guesses.guess_id", guess_id)
			.first();
	},

	insertGuess(db, newGuess) {
		return db
			.insert(newGuess)
			.into("guesses")
			.returning("*")
			.then(([guess]) => guess)
			.then(guess => GuessesService.getById(db, guess.guess_id));
	},
	getAllWinners(db) {
		return GuessesService.getAllGuesses(db)
			.where('has_won', true)
	},
	updateWinningGuess(db, guess_id) {
		return GuessesService.getById(db, guess_id)
			.update('has_won', true)
	},
}

module.exports = GuessesService
