const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeGuessesArray, makeWinnersArray } = require('../test/guesses.fixtures')

describe(`Guesses Endpoints`, function() {
    let db
   
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('guesses').truncate())

    afterEach('cleanup', () => db('guesses').truncate())

    describe(`GET /api/guesses`, () => {
        context(`Given no guesses`, () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/guesses')
                    .expect(200, [])
            })
        })

        context('Given there are guesses in the database', () => {
            const testGuesses = makeGuessesArray()

            beforeEach('insert guesses', () => {
                return db
                    .into('guesses')
                    .insert(testGuesses)
            })

            it('responds with 200 and all of the guesses', () => {
                return supertest(app)
                .get('/api/guesses')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200, testGuesses)
            })
        })
    })

    describe(`GET /api/guesses/winners`, () => {
        context(`Given no winners`, () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/guesses/winners')
                    .expect(200, [])
            })
        })

        context('Given there are winners in the database', () => {
            const testWinners = makeWinnersArray()

            beforeEach('insert winners', () => {
                return db
                    .into('guesses')
                    .insert(testWinners)
            })

            it('responds with 200 and all of the winners', () => {
                return supertest(app)
                .get('/api/guesses/winners')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200, testWinners)
            })
        })
    })


    describe(`POST /api/guesses`, () => {
        it(`creates guesses, responding with 201 and the new guesses`,  function() {
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
            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
            .send(newGuesses)
            .expect(201)
            .expect(res => {
                expect(res.body.guess_1).to.eql(newGuesses.guess_1)
                expect(res.body.guess_2).to.eql(newGuesses.guess_2)
                expect(res.body.guess_3).to.eql(newGuesses.guess_3)
                expect(res.body.guess_4).to.eql(newGuesses.guess_4)
                expect(res.body.guess_5).to.eql(newGuesses.guess_5)
                expect(res.body.power_ball).to.eql(newGuesses.power_ball)
                expect(res.body.message).to.eql(newGuesses.message)
                expect(res.body).to.have.property('user_id')
                expect(res.body).to.have.property('week_id')
                expect(res.headers.location).to.eql(`/api/guesses/${res.body.guess_id}`)
            })
            .then(res => 
            supertest(app)
                .get(`/api/guesses/${res.body.guesses_id}`)
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(res.body)
            )
        })
        
        const requiredFields = ['user_id', 'week_id', 'guess_1', 'guess_2', 'guess_3', 'guess_4', 'guess_5', 'power_ball', 'message' ]

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

        context(`Given an XSS attack guesses`, () => {
            const maliciousGuesses = {
                user_id: 911,
                week_id: 1,
                guess_1: 1,
                guess_2: 2,
                guess_3: 3,
                guess_4: 4,
                guess_5: 5,
                power_ball: 6,
                message: 'Naughty naughty very naughty <script>alert("xss");</script>Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.'
            }
       
            beforeEach('insert malicious message', () => {
              return db
                .into('guesses')
                .insert([ maliciousGuesses ])
            })
       
            it('removes XSS attack content', () => {
              return supertest(app)
                .get(`/api/guesses/${maliciousGuesses.user_id}`)
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200)
                .expect(res => {
                  expect(res.body.message).to.eql(
                    'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
                    )
                })
            })
        })
    })
})

    
    

    