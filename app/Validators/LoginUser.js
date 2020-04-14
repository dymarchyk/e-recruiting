'use strict'

class LoginUser {
	get rules() {
		return {
			email:    'required|email',
			password: 'required',
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

module.exports = LoginUser
