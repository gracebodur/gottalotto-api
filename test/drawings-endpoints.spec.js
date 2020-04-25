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

	describe(`GET /api/drawings`, () => {
		context(`Given no drawings`, () => {
			it('responds with 200 and an empty list', () => {
				return supertest(app)
					.get('/api/drawings')
					.expect(200, [])
			})
		})

		context('Given there are drawings in the database', () => {
			beforeEach('insert drawings', () => {
				helpers.seedLottoTables(
					db,
					testUsers,
					testWeeks,
					testDrawings,
					testGuesses
				)
			})

			it('responds with 200 and all of the drawings', () => {
				const expectedDrawings =
					helpers.makeDrawingsArray(
						testWeeks
					)

				return supertest(app)
					.get('/api/drawings')
					.expect(200)
			})
		})
	})

	describe(`POST /api/drawings`, () => {
		beforeEach('insert drawings', () =>
			helpers.seedLottoTables(
				db,
				testUsers,
				testWeeks,
				testDrawings,
				testGuesses
			)
		)

		it(`creates drawings, responding with 201 and the new drawings`, function () {
			const newDrawings = {
				week_id: 1,
				drawing_1: 2,
				drawing_2: 1,
				drawing_3: 3,
				drawing_4: 4,
				drawing_5: 5,
				drawing_power_ball: 6,
				draw_date: '2020-03-21 00:00:000'
			}
			return supertest(app)
				.post('/api/drawings')
				.send(newDrawings)
				.expect(201)
		})
	})
})
