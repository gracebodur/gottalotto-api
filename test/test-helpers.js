const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
	return [
		{
			user_id: 1,
			user_name: 'test-user-1',
			full_name: 'Test user 1',
			password: 'password',
			user_created_date: '2020-03-08 00:00:000',
			date_modified: '2020-03-09 00:00:000'
		},
		{
			user_id: 2,
			user_name: 'test-user-2',
			full_name: 'Test user 2',
			password: 'password',
			user_created_date: '2020-03-08 00:00:000',
			date_modified: '2020-03-09 00:00:000'
		},
		{
			user_id: 3,
			user_name: 'test-user-3',
			full_name: 'Test user 3',
			password: 'password',
			user_created_date: '2020-03-08 00:00:000',
			date_modified: '2020-03-09 00:00:000'
		},
		{
			user_id: 4,
			user_name: 'test-user-4',
			full_name: 'Test user 4',
			password: 'password',
			user_created_date: '2020-03-08 00:00:000',
			date_modified: '2020-03-09 00:00:000'
		},
	]
}

function makeGuessesArray(users, weeks) {
	return [
		{
			guess_id: 1,
			user_id: users[0].user_id,
			week_id: weeks[0].week_id,
			guess_1: 1,
			guess_2: 2,
			guess_3: 3,
			guess_4: 4,
			guess_5: 5,
			power_ball: 6,
			guess_date_created: '2020-03-09 00:00:000',
			message: 'First message test',
			has_won: false
		},
		{
			guess_id: 2,
			user_id: users[1].user_id,
			week_id: weeks[1].week_id,
			guess_1: 2,
			guess_2: 3,
			guess_3: 4,
			guess_4: 5,
			guess_5: 6,
			power_ball: 7,
			guess_date_created: '2020-03-09 00:00:000',
			message: 'Second message test',
			has_won: false
		},
		{
			guess_id: 3,
			user_id: users[2].user_id,
			week_id: weeks[2].week_id,
			guess_1: 8,
			guess_2: 9,
			guess_3: 10,
			guess_4: 11,
			guess_5: 12,
			power_ball: 13,
			guess_date_created: '2020-03-09 00:00:000',
			message: 'Third message test',
			has_won: false
		},
		{
			guess_id: 4,
			user_id: users[3].user_id,
			week_id: weeks[3].week_id,
			guess_1: 14,
			guess_2: 15,
			guess_3: 16,
			guess_4: 17,
			guess_5: 18,
			power_ball: 19,
			guess_date_created: '2020-03-09 00:00:000',
			message: 'Foufth message test',
			has_won: false
		},
	]
}

function makeDrawingsArray(users, weeks) {
	week_id, drawing_1, drawing_2, drawing_3, drawing_4, drawing_5, drawing_power_ball, draw_date
	return [
		{
			review_id: 1,
			rating: 2,
			text: 'First test review!',
			project_id: projects[0].project_id,
			user_id: users[0].user_id,
			date_created: '2029-01-22T16:28:32.615Z',
		},
		{
			review_id: 2,
			rating: 3,
			text: 'Second test review!',
			project_id: projects[0].project_id,
			user_id: users[1].user_id,
			date_created: '2029-01-22T16:28:32.615Z',
		},
		{
			review_id: 3,
			rating: 4,
			text: 'Third test review!',
			project_id: projects[0].project_id,
			user_id: users[2].user_id,
			date_created: '2029-01-22T16:28:32.615Z',
		},
		{
			review_id: 4,
			rating: 5,
			text: 'Fourth test review!',
			project_id: projects[0].project_id,
			user_id: users[3].user_id,
			date_created: '2029-01-22T16:28:32.615Z',
		},
		{
			review_id: 5,
			rating: 1,
			text: 'Fifth test review!',
			project_id: projects[projects.length - 1].project_id,
			user_id: users[0].user_id,
			date_created: '2029-01-22T16:28:32.615Z',
		},
		{
			review_id: 6,
			rating: 2,
			text: 'Sixth test review!',
			project_id: projects[projects.length - 1].project_id,
			user_id: users[2].user_id,
			date_created: '2029-01-22T16:28:32.615Z',
		},
		{
			review_id: 7,
			rating: 5,
			text: 'Seventh test review!',
			project_id: projects[projects.length - 1].project_id,
			user_id: users[0].user_id,
			date_created: '2029-01-22T16:28:32.615Z',
		},
	];
}

function makeExpectedProject(users, project, reviews = []) {
	const user = users
		.find(user => user.user_id === project.user_id)

	const projectReviews = reviews
		.filter(review => review.project_id === project.project_id)

	const number_of_reviews = projectReviews.length
	const average_review_rating = calculateAverageReviewRating(projectReviews)

	return {
		project_id: project.project_id,
		schoolname: project.schoolname,
		city: project.city,
		state: project.state,
		fulfillmenttrailer: project.fulfillmenttrailer,
		teachername: project.teachername,
		imageurl: project.imageurl,
		fundurl: project.fundurl,
		date_created: project.date_created,
		number_of_reviews,
		average_review_rating,
		user: {
			user_id: user.user_id,
			user_name: user.user_name,
			full_name: user.full_name,
			date_created: user.date_created,
		},
	}
}

function makeMaliciousProject(user) {
	const maliciousProject = {
		project_id: 911,
		schoolname: 'Naughty naughty very naughty <script>alert("xss");</script>',
		city: 'Naughty naughty very naughty <script>alert("xss");</script>',
		state: 'Naughty naughty very naughty <script>alert("xss");</script>',
		fulfillmenttrailer: 'Naughty naughty very naughty <script>alert("xss");</script>',
		teachername: 'Naughty naughty very naughty <script>alert("xss");</script>',
		imageurl: 'http://placehold.it/500x500',
		fundurl: 'https://url.to.file.which/does-not.exist',
		user_id: user.user_id,
		date_created: new Date().toISOString(),
	}
	const expectedProject = {
		...makeExpectedProject([user], maliciousProject),
		fulfillmenttrailer: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
		fundurl: 'https://url.to.file.which/does-not.exist',
	}
	return {
		maliciousProject,
		expectedProject,
	}
}

function makeProjectsFixtures() {
	const testUsers = makeUsersArray()
	const testProjects = makeProjectsArray(testUsers)
	const testReviews = makeReviewsArray(testUsers, testProjects)
	return { testUsers, testProjects, testReviews }
}

function cleanTables(db) {
	return db.raw(
		`TRUNCATE
      projects,
      users,
      reviews
      RESTART IDENTITY CASCADE`
	)
}

function seedUsers(db, users) {
	const preppedUsers = users.map(user => ({
		...user,
		password: bcrypt.hashSync(user.password, 1)
	}))
	return db.into('users').insert(preppedUsers)
		.then(() =>
			// update the auto sequence to stay in sync
			db.raw(
				`SELECT setval('users_user_id_seq', ?)`,
				[users[users.length - 1].user_id],
			)
		)
}

function seedProjectsTables(db, users, projects, reviews = []) {
	return seedUsers(db, users)
		.then(() =>
			db
				.into('projects')
				.insert(projects)
		)
		.then(() =>
			reviews.length && db.into('reviews').insert(reviews)
		)
}

function seedMaliciousProject(db, user, project) {
	return db
		.into('users')
		.insert([user])
		.then(() =>
			db
				.into('projects')
				.insert([project])
		)
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
	const token = jwt.sign({ user_id: user.user_id }, secret, {
		subject: user.user_name,
		algorithm: 'HS256',
	})
	return `Bearer ${token}`
}

module.exports = {
	makeUsersArray,
	makeProjectsArray,
	makeExpectedProject,
	makeExpectedProjectReviews,
	makeMaliciousProject,
	makeReviewsArray,

	makeProjectsFixtures,
	cleanTables,
	seedProjectsTables,
	seedMaliciousProject,
	makeAuthHeader,
	seedUsers
}
