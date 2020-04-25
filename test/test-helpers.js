const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


function makeUsersArray() {
	return [
		{
			user_id: 1,
			user_name: 'testuser1',
			full_name: 'test ing',
			password: 'Password1!',
			user_created_date: '2020-03-07 00:00:000',
			date_modified: '2020-03-07 00:00:000'
		},
		{
			user_id: 2,
			user_name: 'testuser2',
			full_name: 'test ing',
			password: 'Password1!',
			user_created_date: '2020-03-07 00:00:000',
			date_modified: '2020-03-07 00:00:000'
		},
		{
			user_id: 3,
			user_name: 'testuser3',
			full_name: 'test ing',
			password: 'Password1!',
			user_created_date: '2020-03-07 00:00:000',
			date_modified: '2020-03-07 00:00:000'
		}
	]
}

function makeWeeksArray() {
	return [
		{
			week_id: 1,
			week_start_date: '2020-03-21 00:00:000'
		},
		{
			week_id: 2,
			week_start_date: '2020-03-28 00:00:000'
		},
		{
			week_id: 3,
			week_start_date: '2020-04-04 00:00:000'
		},
	]
}

function makeDrawingsArray(weeks) {
	return [
		{
			week_id: weeks[0].week_id,
			drawing_1: 09,
			drawing_2: 23,
			drawing_3: 26,
			drawing_4: 30,
			drawing_5: 32,
			drawing_power_ball: 08,
			draw_date: '2020-03-21 00:00:000'
		},
		{
			week_id: weeks[1].week_id,
			drawing_1: 02,
			drawing_2: 23,
			drawing_3: 40,
			drawing_4: 59,
			drawing_5: 69,
			drawing_power_ball: 13,
			draw_date: '2020-03-21 00:00:000'
		}
	]
}

function makeGuessesArray(users, weeks) {
	return [
		{
			guess_id: 1,
			user_id: 1,
			week_id: 1,
			guess_1: 1,
			guess_2: 2,
			guess_3: 3,
			guess_4: 4,
			guess_5: 5,
			power_ball: 6,
			message: 'First guess test',
			has_won: false,
			guess_created_date: '2020-03-07 00:00:000'
		},
		{
			guess_id: 2,
			user_id: 2,
			week_id: 2,
			guess_1: 7,
			guess_2: 8,
			guess_3: 9,
			guess_4: 10,
			guess_5: 11,
			power_ball: 12,
			message: 'Second guess test',
			has_won: false,
			guess_created_date: '2020-03-07 00:00:000'
		},
		{
			guess_id: 3,
			user_id: 3,
			week_id: 3,
			guess_1: 13,
			guess_2: 14,
			guess_3: 15,
			guess_4: 16,
			guess_5: 17,
			power_ball: 18,
			message: 'Third guess test',
			has_won: false,
			guess_created_date: '2020-03-07 00:00:000'
		}
	];
}


function makeExpectedGuesses(users, week_id, guesses) {
	const expectedGuesses = guesses.filter(guess => guess.week_id == week_id)

	return expectedGuesses.map(guess => {
		const guessUser = users.find(user => user.user_id == guess.user_id)
		return {
			guess_id: guess.guess_id,
			user_id: guessUser.user_id,
			week_id: week_id,
			guess_1: guess.guess_1,
			guess_2: guess.guess_2,
			guess_3: guess.guess_3,
			guess_4: guess.guess_4,
			guess_5: guess.guess_5,
			power_ball: guess.power_ball,
			message: guess.message,
			has_won: guess.has_won,
			guess_created_date: guess.guess_created_date
		}
	})
}


function makeFixtures() {
	const testUsers = makeUsersArray()
	const testWeeks = makeWeeksArray()
	const testDrawings = makeDrawingsArray(testWeeks)
	const testGuesses = makeGuessesArray(testUsers, testWeeks)

	return { testUsers, testWeeks, testDrawings, testGuesses }
}

function cleanTables(db) {
	return db.raw(
		`TRUNCATE
		guesses,
		drawings,
		weeks,
		users
		RESTART IDENTITY CASCADE`
	)
}

function seedLottoTables(db, users, weeks, drawings, guesses) {
	return db
		.into('users')
		.insert(users)
		.then(() =>
			db
				.into('weeks')
				.insert(weeks)
				.then(() =>
					db
						.into('drawings')
						.insert(drawings)
				)

		)
}



module.exports = {
	makeUsersArray,
	makeWeeksArray,
	makeDrawingsArray,
	makeGuessesArray,
	makeExpectedDrawings,
	makeExpectedGuesses,
	makeFixtures,
	cleanTables,
	seedLottoTables,
}