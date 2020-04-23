const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
	.route('/')
	.post(jsonBodyParser, (req, res, next) => {
		const { full_name, user_name, password } = req.body
		for (const field of ['full_name', 'user_name', 'password'])
			if (!req.body[field])
				return res.status(400).json({
					error: `Missing '${field}' in request body`
				})
		const fullNameError = UsersService.validateFullName(full_name)
		const usernameError = UsersService.validateUsername(user_name)
		const passwordError = UsersService.validatePassword(password)

		if (fullNameError)
			return res.status(400).json({ error: fullNameError })
		if (usernameError)
			return res.status(400).json({ error: usernameError })
		if (passwordError)
			return res.status(400).json({ error: passwordError })
		UsersService.hasUserWithUserName(
			req.app.get('db'),
			user_name
		)
			.then(hasUserWithUserName => {
				if (hasUserWithUserName)
					return res.status(400).json({ error: `Username already taken` })

				return UsersService.hashPassword(password)
					.then(hashedPassword => {
						const newUser = {
							full_name,
							user_name,
							password: hashedPassword,
							user_created_date: 'now()',
						}

						return UsersService.insertUser(
							req.app.get('db'),
							newUser
						)
							.then(user => {
								res
									.status(201)
									.location(path.posix.join(req.originalUrl, `/${user.user_id}`))
									.json(UsersService.serializeUser(user))
							})
					})
			})
			.catch(next)
	})

module.exports = usersRouter