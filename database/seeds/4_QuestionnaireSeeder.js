'use strict'

/*
 |--------------------------------------------------------------------------
 | 4QuestionnaireSeeder
 |--------------------------------------------------------------------------
 |
 | Make use of the Factory instance to seed database with dummy data or
 | make use of Lucid models directly.
 |
 */

const { groupBy } = require('lodash')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Question = use('App/Models/Question')
const User = use('App/Models/User')

class QuestionnaireSeeder {
	async run() {
		const hardSkills = await Question.query().where('type', Question.QUESTION_TYPES.hard_skill).fetch()
		const questionnaire = await Factory.model('App/Models/Questionnaire').create();
		await questionnaire.questions().saveMany(hardSkills.rows)
		await questionnaire.user().associate(await User.first())
		await questionnaire.save()
	}
}

module.exports = QuestionnaireSeeder
