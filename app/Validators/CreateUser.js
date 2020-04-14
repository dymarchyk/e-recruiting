'use strict'

class CreateUser {
	get rules() {
		return {
			email:    'required|email|unique:users,email',
			password: 'required',
			username: 'required',
			isAdmin:  'boolean'
		}
	}
	
	get sanitizationRules() {
		return {
			email:   'normalize_email',
			isAdmin: 'to_boolean'
		}
	}
	
	async fails(errorMessages) {
		return this.ctx.response.status(400).send(errorMessages)
	}
}

module.exports = CreateUser
