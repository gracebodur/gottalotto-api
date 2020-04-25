const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe(`users Endpoints`, function () {
	let db

	const { testWeeks, testGuesses, testDrawings, testUsers } = helpers.makeFixtures()

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


	describe(`POST /api/users/`, () => {
		it('responds with 201', () => {
			return supertest(app)
				.post('/api/users/')
				.send(testUsers[0])
				.expect(201)
		})
	})
})
