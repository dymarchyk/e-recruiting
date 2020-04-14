'use strict'

class UpdateUser {
	get rules() {
		return {
			email:    'email',
			password: 'string',
			username: 'string',
		}
	}
	
	get sanitizationRules() {
		return {
			email: 'normalize_email',
		}
	}
	
	async fails(errorMessages) {
		return this.ctx.response.status(400).send(errorMessages)
	}
}

module.exports = UpdateUser
