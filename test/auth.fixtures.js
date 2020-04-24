const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


function makeUsersArray() {
	return [
		{
			user_id: 1,
			user_name: 'test1',
			full_name: 'test ing',
			password: '$2y$12$jOGhCuhmLPBzB5jpmSfetO0Ik0LZxHuSM3NrjKL5hhzPG32twwJGK',
			user_created_date: '2020-03-07 00:00:000',
			date_modified: '2020-03-07 00:00:000'
		},
		{
			user_id: 2,
			user_name: 'test2',
			full_name: 'test ing',
			password: '$2y$12$TSx.cVRA8XBBsP9/D8yKyuJ1aLB7bKgCKsRHk1ITVytAnTpkesbSi',
			user_created_date: '2020-03-07 00:00:000',
			date_modified: '2020-03-07 00:00:000'
		},
		{
			user_id: 3,
			user_name: 'test3',
			full_name: 'test ing',
			password: '$2y$12$tlNORMoOifFwPbh8bdXrFOYqBFiw0iY69uLmKTZYZr/T8n9XDk/VK',
			user_created_date: '2020-03-07 00:00:000',
			date_modified: '2020-03-07 00:00:000'
		}
	]
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
	const token = jwt.sign({ user_id: user.user_id }, secret, {
		subject: user.user_name,
		algorithm: 'HS256',
	})
	return `Bearer ${token}`
}

function seedUsers(db, users) {
	const preppedUsers = users.map(user => ({
		...user,
		password: bcrypt.hashSync(user.password, 1)
	}))
	return db.into('users').insert(preppedUsers)
		.then(() =>
			// update the auto sequence to stay in sync
			db.raw(
				`SELECT setval('users_user_id_seq', ?)`,
				[users[users.length - 1].user_id],
			)
		)
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



module.exports = {
	makeUsersArray,
	makeAuthHeader,
	seedUsers,
	cleanTables
}