'use strict'
const User = use('App/Models/User')
const { omit } = require('lodash')

class UserController {
	
	async getUser({ auth, response }) {
		try {
			response.send(await auth.user)
		}
		catch (e) {
			response.unauthorized('Not authorized')
		}
	}
	
	async updateUser({ request, response, auth }) {
		try {
			const data = request.all()
			const user = await User.findByOrFail('id', auth.user.id)
			user.merge(omit(data, ['isAdmin']))
			await user.save()
			response.send(user)
		}
		catch (e) {
			console.log(e)
			response.status(404).send({ message: 'User not found' })
		}
	}
}

module.exports = UserController
