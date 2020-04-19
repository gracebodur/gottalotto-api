require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const guessesRouter = require('./guesses/guesses-router')
const GuessesService = require('./guesses/guesses-service')
const drawingsRouter = require('./drawings/drawings-router')
const DrawingsService = require('./drawings/drawings-service')
const weeksRouter = require('./weeks/weeks-router')
const WeeksService = require('./weeks/weeks-service')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')
const config = require('./config')


const cron = require('node-cron')
const fetch = require('node-fetch')

const app = express()

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common'
app.use(morgan(morganOption))

app.use(helmet())
app.use(cors())

app.use('/api/guesses', guessesRouter)
app.use('/api/drawings', drawingsRouter)
app.use('/api/weeks', weeksRouter)
app.use('/api/users', usersRouter)
app.use("/api/auth", authRouter);

const getLatestDrawing = () => {
    // gets full list of power ball drawings
    // passes the most recent drawing into next function
    fetch('https://data.ny.gov/resource/d6yy-54nr.json')
        .then(res => res.json())
        .then(json => createPostDrawing(json[0]))
}
const createPostDrawing = (latestDrawing) => {
    // deconstructs latestDrawing
    // gets current week 
    // passes all of that data into next function to post drawing to our db

    const { draw_date, winning_numbers } = latestDrawing
    // fetch(`${config.API_ENDPOINT}/weeks/currentweek`)

    WeeksService.getCurrentWeek(app.get('db'))
        .then(weeks => postDrawing(weeks[weeks.length - 1].week_id, winning_numbers, draw_date))
}
const postDrawing = (week_id, winning_numbers, draw_date) => {
    // parse out winning_numbers into drawing_1 through drawing_5 and power_ball
    // constructs newDrawing variable and posts it to our drawings table
    const numStrArr = winning_numbers.split(' ')
    const drawing_1 = parseInt(numStrArr[0])
    const drawing_2 = parseInt(numStrArr[1])
    const drawing_3 = parseInt(numStrArr[2])
    const drawing_4 = parseInt(numStrArr[3])
    const drawing_5 = parseInt(numStrArr[4])
    const drawing_power_ball = parseInt(numStrArr[5])

    const newDrawing = {
        week_id,
        drawing_1,
        drawing_2,
        drawing_3,
        drawing_4,
        drawing_5,
        drawing_power_ball,
        draw_date,
    }

    DrawingsService.insertDrawing(app.get('db'), newDrawing)
        .then(drawing => {
            getGuesses(drawing)
        })
}

const getGuesses = (drawing) => {
    // finds current week_id and passes it along with the latest drawing into next function
    GuessesService.getGuessesByWeekId(app.get('db'), drawing.week_id)
        .then(guesses => createWeek(drawing, guesses))
}

const createWeek = (drawing, guesses) => {
    //creates new week in weeks table
    //basically increments to next the next week for entire program
    const newWeek = { week_start_date: null }

    WeeksService.insertWeek(app.get('db'), newWeek)
        .then(week => console.log('week stuff', week))
    findWinner(drawing, guesses)
}

const findWinner = (drawingData, guessList) => {
    // compares all guesses against the latest drawing to find a winner.
    // takes in drawingData as obj, and guessList as array of objs
    const { drawing_1, drawing_2, drawing_3, drawing_4, drawing_5, drawing_power_ball } = drawingData
    const drawing = [
        drawing_1,
        drawing_2,
        drawing_3,
        drawing_4,
        drawing_5,
        drawing_power_ball
    ]

    //loop through array of objects of each guess from previous week
    let highestNumCorrect = 0
    let lowestScore = 0
    let highestNumCorrectGuessId = null
    for (let i = 0; i < guessList.length; i++) {
        const guessItem = guessList[i]
        // set value of current guessItem
        // destructure guessed numbers from each guessItem
        const { guess_1, guess_2, guess_3, guess_4, guess_5, power_ball, guess_id } = guessItem
        const guess_power_ball = power_ball

        // create guess array excluding powerball ( to make sorting guessed numbers possible )
        let guess = [
            guess_1,
            guess_2,
            guess_3,
            guess_4,
            guess_5,
            // guess_power_ball 
        ]
        // sort each guess
        guess.sort((a, b) => a - b).push(guess_power_ball)



        let dSet = new Set(drawing)
        let gSet = new Set(guess)

        let correctGuesses = [...new Set(guess.filter(guessNum => dSet.has(guessNum)))]

        let incorrectGuesses = guess.filter(guessNum => !dSet.has(guessNum))
        let incorrectDrawings = drawing.filter(drawingNum => !gSet.has(drawingNum))

        let numCorrect = correctGuesses.length

        if (numCorrect >= highestNumCorrect) {
            let score = 0
            for (let j = 0; j < incorrectGuesses.length; j++) {
                score += Math.abs(incorrectDrawings[j] - incorrectGuesses[j])
            }

            if (numCorrect == highestNumCorrect && score < lowestScore) {
                lowestScore = score
                highestNumCorrectGuessId = guess_id
            } else if (numCorrect > highestNumCorrect) {
                highestNumCorrect = numCorrect
                lowestScore = score
                highestNumCorrectGuessId = guess_id
            }
        } else {
            // don't do a damn thing
        }

    }

    fetch(`${config.API_ENDPOINT}/guesses/winner/${highestNumCorrectGuessId}`, {
        method: 'PATCH'
    })
}


cron.schedule(" 15 11 * * 7 ", () => {
    getLatestDrawing()
})


app.use(function errorHandler(error, req, res, next) {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app