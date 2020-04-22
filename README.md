# GottaLotto-API

Author: [Malek Adair](https://github.com/malekadair) and [Marie Grace Bodur](https://github.com/gracebodur)

Live app: [GottaLotto](https://malekandgrace-gottalotto.now.sh/)

## 1. What the project does

The project allows you to create guesses for the upcoming PowerBall Drawing each Saturday. The app will take all guesses from the previous week and compare them to find out which guess was closest. Once the winning guess is found, it will display in a Winners List on the homepage for all to see their Username, Guess, and their "Message to the World".

If not logged in, the main page displays a welcome section which explains the app and prompts you to create an account and subit a guess.

If not logged in, you are given an option to either create an acocunt, or login to a previously created account. We have routes for both forms (login/register).

Once logged in, the main page displayes previous winning drawings and the "Message to the World" associated with it.

The Guess route will take you to a form to submit your guess for the the upcoming drawing. This controlled form includes 6 input values and a message textarea for the user to include their "Message to the World"

After successfully submitting a guess, you will be redirected to the Guess List route which displays your guess as well as all other guesses for the upcoming drawing.

# SERVER

### Heroku : https://gentle-coast-37502.herokuapp.com/api

### Two databases:

1.  gottalotto
2.  gottalotto-test

#### The database has four tables:

1. users
2. weeks
3. drawings
4. guesses

### Endpoints

#### Guesses endpoints

    • /api/guesses
        •route(/)
            GET All Guesses
            POST New Guess
        •route(/winners)
            GET All Winners
        •route(/winner/:guessId)
            PATCH Winning Guess by Guess Id
        •route(/:weekId)
            GET All Guesses by Week Id

#### Drawings endpoints

     • /api/drawings
        •route(/)
            GET All Drawings
            POST New Drawing
        •route(/:weekId)
            GET Drawing by Week Id

#### Weeks endpoints

    • /api/weeks
        •route(/)
            POST New Week
        •route(/currentweek)
            GET Current Week Id

#### Users endpoints

    • /api/users
        •route(/)
            POST New User

#### Auth endpoints

    • /api/auth
        •route(/login)
            POST Login

#### Fetch latest drawing

```
const getLatestDrawing = () => {
    // gets full list of power ball drawings
    // passes the most recent drawing into next function
    fetch('https://data.ny.gov/resource/d6yy-54nr.json')
        .then(res => res.json())
        .then(json => createPostDrawing(json[0]))
}
```

#### Cron-Job findWinner() func - This function takes in drawingData as an object, and guessList as an array of objects. It then prepares the data and loops through each guess to find the closest guess to the drawing.

```
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
```

## 2. How to run the project

• The entry file is ./src/server.js

## 3. Where to find pieces of configuration or important code

• Migrations configuration is in ./postgrator-config.js
• uses PostgreSQL

## Setting Up

- Install dependencies: `npm install`
- Create development and test databases: `createdb gottalotto`, `createdb gottalotto-test`
- Create database user: `createuser [username]`
- Grant privileges to new user in `psql`:
  - `GRANT ALL PRIVILEGES ON DATABASE gottalotto TO gottalotto`
  - `GRANT ALL PRIVILEGES ON DATABASE "gottalotto-test" TO gottalotto-test`
- Prepare environment file: `cp example.env .env`
- Replace values in `.env` with your custom values.
- Bootstrap development database: `npm run migrate`
- Bootstrap test database: `npm run migrate:test`

### Configuring Postgres

For tests involving time to run properly, your Postgres database must be configured to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   - OS X, Homebrew: `/usr/local/var/postgres/postgresql.conf`
2. Uncomment the `timezone` line and set it to `UTC` as follows:

```

# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default' # Select the set of available time zone

```

## Sample Data

- To seed the database for development: `psql -U [user] -d gottalotto -a -f seeds/seed.gottalotto_tables.sql`
- To clear seed data: `psql -U [user] -d gottalotto -a -f seeds/trunc.gottalotto_tables.sql`

## Scripts

- Start application for development: `npm run dev`
- Run tests: `npm test`
