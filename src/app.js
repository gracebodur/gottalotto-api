require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const guessesRouter = require('./guesses/guesses-router')
const drawingsRouter = require('./drawings/drawings-router')
const weeksRouter = require('./weeks/weeks-router')
const WeeksService = require('./weeks/weeks-service')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')
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
// bent ----
// const getJson = bent('https://data.ny.gov/resource)
// const getDrawing = bent('https://data.ny.gov/resource/d6yy-54nr.json', 'GET', 'json', 200);
// let drawingRes = await getJson('/d6yy-54nr.json')
// got ----
// (async () => {
//     try {
//         const response = await got('https://data.ny.gov/resource/d6yy-54nr.json');
//         console.log('response = ', response.body);
//         //=> '<!doctype html> ...'
//     } catch (error) {
//         console.log(error.response.body);
//         //=> 'Internal server error ...'
//     }
// })()

// cron.schedule("0-14 22 * * 6", () => {



// cron.schedule(" * * * * * ", () => {
//     console.log('cron job has completed. ')

//     const latestDrawing = await fetch('https://data.ny.gov/resource/d6yy-54nr.json')
//         .then(res => res.json())
//         .then(json => {
//             const latestDrawing = json[0]
//             const { draw_date, winning_numbers } = latestDrawing
//             return latestDrawing
//             console.log(draw_date, winning_numbers)
//         });
//     console.log(latestDrawing)
//     // WeeksService.getCurrentWeek(app.get('db'))
//     //     .then(weeks => {
//     //         console.log('all weeks', weeks)
//     //         const week = weeks[weeks.length - 1]
//     //         console.log('current week', week)
//     //         return week.week_id
//     //     })
// })


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