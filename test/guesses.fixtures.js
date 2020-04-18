function makeGuessesArray() {
    return [
        {
            guess_id:   1,
            user_id:    1,
            week_id:    1,
            guess_1:    1,
            guess_2:    2,
            guess_3:    3,
            guess_4:    4,
            guess_5:    5,
            power_ball: 6,
            message:    'First guess test',
            has_won:    false,
            guess_created_date: '2020-03-07 00:00:000'
        },
        {
            guess_id:   2,
            user_id:    2,
            week_id:    2,
            guess_1:    7,
            guess_2:    8,
            guess_3:    9,
            guess_4:    10,
            guess_5:    11,
            power_ball: 12,
            message:    'Second guess test',
            has_won:    false,
            guess_created_date: '2020-03-07 00:00:000'
        },
        {
            guess_id:   3,
            user_id:    3,
            week_id:    3,
            guess_1:    13,
            guess_2:    14,
            guess_3:    15,
            guess_4:    16,
            guess_5:    17,
            power_ball: 18,
            message:    'Third guess test',
            has_won:    false,
            guess_created_date: '2020-03-07 00:00:000'
        }
    ]
}

function makeWinnersArray() {
    return [
        {
            guess_id:   1,
            user_id:    1,
            week_id:    1,
            guess_1:    1,
            guess_2:    2,
            guess_3:    3,
            guess_4:    4,
            guess_5:    5,
            power_ball: 6,
            message:    'First winner test',
            has_won:    true,
            guess_created_date: '2020-03-07 00:00:000'
        },
        {
            guess_id:   2,
            user_id:    2,
            week_id:    2,
            guess_1:    7,
            guess_2:    8,
            guess_3:    9,
            guess_4:    10,
            guess_5:    11,
            power_ball: 12,
            message:    'Second winner test',
            has_won:    true,
            guess_created_date: '2020-03-07 00:00:000'
        },
        {
            guess_id:   3,
            user_id:    3,
            week_id:    3,
            guess_1:    13,
            guess_2:    14,
            guess_3:    15,
            guess_4:    16,
            guess_5:    17,
            power_ball: 18,
            message:    'Third winner test',
            has_won:    true,
            guess_created_date: '2020-03-07 00:00:000'
        }
    ]
}


module.exports = { 
    makeGuessesArray,
    makeWinnersArray 
}