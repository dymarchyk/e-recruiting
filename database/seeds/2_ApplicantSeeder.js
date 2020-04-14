'use strict'

/*
 |--------------------------------------------------------------------------
 | ApplicantSeeder
 |--------------------------------------------------------------------------
 |
 | Make use of the Factory instance to seed database with dummy data or
 | make use of Lucid models directly.
 |
 */

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class ApplicantSeeder {
	async run() {
		await Factory.model('App/Models/Applicant').create(1)
	}
}

module.exports = ApplicantSeeder
