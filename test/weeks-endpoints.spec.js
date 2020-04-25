const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe(`Weeks Endpoints`, function () {
	let db

	const { testUsers, testGuesses, testDrawings, testWeeks } = helpers.makeFixtures()

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

	describe(`GET /api/weeks/currentweek`, () => {
		context(`Given no weeks`, () => {
			it('responds with 200 and an empty list', () => {
				return supertest(app)
					.get('/api/weeks/currentweek')
					.expect(200, '')
			})
		})
		context('Given there are weeks in the database', () => {
			beforeEach('insert weeks', () => {
				helpers.seedLottoTables(
					db,
					testUsers,
					testWeeks,
					testDrawings,
					testGuesses
				)
			})

			it('responds with 200', () => {
				return supertest(app)
					.get('/api/weeks/currentweek')
					.expect(200)
			})
		})
	})
	describe(`POST /api/weeks/`, () => {
		context(`Post new week`, () => {
			beforeEach('insert weeks', () => {
				helpers.seedLottoTables(
					db,
					testUsers,
					testWeeks,
					testDrawings,
					testGuesses
				)
			})
			const newWeek = { week_id: 4, week_start_date: '2020-04-11 00:00:000' }
			it('responds with 200', () => {
				return supertest(app)
					.post('/api/weeks/')
					.send(newWeek)
					.expect(201)
			})
		})
	})
})
