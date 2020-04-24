function makeGuessesArray() {
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
    ]
}

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


function makeWinnersArray() {
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
            message: 'First winner test',
            has_won: true,
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
            message: 'Second winner test',
            has_won: true,
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
            message: 'Third winner test',
            has_won: true,
            guess_created_date: '2020-03-07 00:00:000'
        }
    ]
}

function seedGuesses(db, guesses) {
    const preppedGuesses = guesses.map(guess => ({
        ...guess,
    }))
    return db.into('guesses').insert(preppedGuesses)
        .then(() =>
            // update the auto sequence to stay in sync
            db.raw(
                `SELECT setval('users_user_id_seq', ?)`,
                [users[users.length - 1].user_id],
            )
        )
}

function seedGuessesTables(db, users, guesses, weeks = []) {
    return seedUsers(db, users)
        .then(() =>
            db
                .into('guesses')
                .insert(guesses)
        )
        .then(() =>
            weeks.length && db.into('weeks').insert(weeks)
        )
}


function makeGuessesFixtures() {
    const testUsers = makeUsersArray()
    const testGuesses = makeGuessesArray(testUsers)
    return { testUsers, testGuesses }
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
    makeGuessesArray,
    makeWinnersArray,
    makeGuessesFixtures,
    seedGuessesTables,
    cleanTables,
    seedGuesses
}