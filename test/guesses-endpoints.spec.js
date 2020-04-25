const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe(`Guesses Endpoints`, function () {
    let db


    const {
        testWeeks,
        testDrawings,
        testGuesses,
        testUsers,
    } = helpers.makeFixtures()



    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /api/guesses`, () => {
        context(`Given no guesses`, () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/guesses')
                    .expect(200, [])
            })
        })

        context('Given there are guesses in the database', () => {
            beforeEach('insert guesses', () => {
                helpers.seedLottoTables(
                    db,
                    testUsers,
                    testWeeks,
                    testDrawings,
                    testGuesses
                )
            })

            it('responds with 200 and all of the guesses', () => {
                const expectedGuesses = testGuesses.map(guess =>
                    helpers.makeGuessesArray(
                        testUsers,
                        1,
                        guess
                    )
                )
                return supertest(app)
                    .get('/api/guesses')
                    .expect(200)
            })
        })
    })

    describe(`POST /api/guesses`, () => {
        beforeEach('insert guesses', () =>
            helpers.seedLottoTables(
                db,
                testUsers,
                testWeeks,
                testDrawings,
                testGuesses
            )
        )

        it(`creates guesses, responding with 201 and the new guesses`, function () {
            const testGuess = testGuesses[0]
            const testUser = testUsers[0]
            const newGuesses = {
                user_id: 1,
                week_id: 1,
                guess_1: 1,
                guess_2: 2,
                guess_3: 3,
                guess_4: 4,
                guess_5: 5,
                power_ball: 6,
                message: 'New Guess'
            }
            return supertest(app)
                .post('/api/guesses')
                .send(newGuesses)
                .expect(201)
        })

        const requiredFields = ['user_id', 'week_id', 'guess_1', 'guess_2', 'guess_3', 'guess_4', 'guess_5', 'power_ball', 'message']

        requiredFields.forEach(field => {
            const newGuesses = {
                user_id: 1,
                week_id: 1,
                guess_1: 1,
                guess_2: 2,
                guess_3: 3,
                guess_4: 4,
                guess_5: 5,
                power_ball: 6,
                message: 'New Guess'
            }
            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newGuesses[field]
                return supertest(app)
                    .post('/api/guesses')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send(newGuesses)
                    .expect(400, {
                        error: `Missing '${field}' in request body`
                    })
            })
        })


    })
})
