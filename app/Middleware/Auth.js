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
		try	{
			await auth.check()
			if (!auth.user) {
				return response.status(403).send({ message: 'Not Authorized' })
				// return null
			}
		} catch (e){
			return response.status(403).send({ message: 'Not Authorized' })
		}
		await next()
	}
}

module.exports = Auth
