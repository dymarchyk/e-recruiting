'use strict'

/*
 |--------------------------------------------------------------------------
 | QuestionnaireSeeder
 |--------------------------------------------------------------------------
 |
 | Make use of the Factory instance to seed database with dummy data or
 | make use of Lucid models directly.
 |
 */

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')
const Question = use('App/Models/Question')
const Applicant = use('App/Models/Applicant')
const { shuffle } = require('lodash')

class QuestionnaireSeeder {
	async run() {
		try {
			const user = await User.first()
			const applicant = await Applicant.first()
			
			const questions = await Question.ids()
			
			const questionnaire = await Factory.model('App/Models/Questionnaire').make()
			
			await questionnaire.user().associate(user)
			await questionnaire.applicants().save(applicant)
			
			await questionnaire.questions().attach(questions)
			
			await questionnaire.save()
		}
		catch (e) {
			console.warn(e)
		}
	}
}

module.exports = QuestionnaireSeeder
