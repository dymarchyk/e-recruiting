'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */

/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Auth {
	/**
	 * @param {object} ctx
	 * @param {Request} ctx.request
	 * @param {Function} next
	 */
	async handle({ request, auth, response }, next) {
		// call next to advance the request
		if (!auth.user) {
			return response.status(403).send({ message: 'Not Authorized' })
			// return null
		}
		await next()
	}
}

module.exports = Auth
