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
    fetch('https://data.ny.gov/resource/d6yy-54nr.json')
        .then(res => res.json())
        .then(json => createPostDrawing(json[0]))
}
const createPostDrawing = (latestDrawing) => {
    console.log(latestDrawing)
    const { draw_date, winning_numbers } = latestDrawing
    // fetch(`${config.API_ENDPOINT}/weeks/currentweek`)

    WeeksService.getCurrentWeek(app.get('db'))
        // .then(res => console.log(res))
        .then(weeks => postDrawing(weeks[weeks.length - 1].week_id, winning_numbers, draw_date))
}
const postDrawing = (week_id, winning_numbers, draw_date) => {
    // parse out winning_numbers into drawing_1 through drawing_5 and power_ball
    const numStrArr = winning_numbers.split(' ')
    console.log(numStrArr)
    const drawing_1 = parseInt(numStrArr[0])
    const drawing_2 = parseInt(numStrArr[1])
    const drawing_3 = parseInt(numStrArr[2])
    const drawing_4 = parseInt(numStrArr[3])
    const drawing_5 = parseInt(numStrArr[4])
    const drawing_power_ball = parseInt(numStrArr[5])
    console.log('drawing 1', drawing_1)
    console.log('drawing 2', drawing_2)
    console.log('drawing 3', drawing_3)
    console.log('drawing 4', drawing_4)
    console.log('drawing 5', drawing_5)
    console.log('drawing 6', drawing_power_ball)

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
            console.log('Latest Drawing: ', drawing)
            getGuesses(drawing)
        })
}

const getGuesses = (drawing) => {
    GuessesService.getGuessesByWeekId(app.get('db'), drawing.week_id)
        .then(res => console.log('Last weeks guesses:', res))
}

// createPostDrawing()
cron.schedule(" * * * * * ", () => {
    console.log('cron job has completed. ')

    getLatestDrawing()

})
// WeeksService.getCurrentWeek(app.get('db'))
//     .then(weeks => {
//         console.log('all weeks', weeks)
//         const week = weeks[weeks.length - 1]
//         console.log('current week', week)
//         return week.week_id
//     })



app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app