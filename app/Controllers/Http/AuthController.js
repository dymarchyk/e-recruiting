'use strict'
const User = use('App/Models/User')

class AuthController {
	async register({ request, auth, response }) {
		try {
			const user = await User.create(request.only(['password', 'email', 'username']))
			
			await auth.logout()
			await auth.remember('1y').login(user)
			
			response.send(await auth.getUser())
		}
		catch (e) {
			console.log(e)
			response.status(400).json({ message: e.message })
		}
	}
	
	async login({ response, request, auth }) {
		const { email, password } = request.only(['email', 'password'])
		try {
			await auth.logout()
			await auth.remember('1y').attempt(email, password)
			response.send(await auth.getUser())
		}
		catch (e) {
			console.log(e)
			response.status(400).send({
				message: 'Invalid credentials'
			})
		}
	}
	
	async logout({ auth }) {
		try {
			await auth.logout()
			return true
		}
		catch (e) {
			console.log('Error while log out', e)
			return true
		}
	}
	
	async getUserData({ auth, response }) {
		try {
			await auth.check()
			console.log(await auth.getUser(), auth.user)
			return await auth.getUser()
		}
		catch (e) {
			console.log(e)
			response.status(404).json({ message: 'Not found' })
		}
	}
}

module.exports = AuthController
