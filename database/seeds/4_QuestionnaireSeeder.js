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
const Applicant = use('App/Models/Applicant')
const User = use('App/Models/User')

class QuestionnaireSeeder {
	async run() {
		const lieQuest = await Question.query().where('type', Question.QUESTION_TYPES.lie_test).fetch()
		const regQuest = await Question.query().whereIn('type', [
			Question.QUESTION_TYPES.logic,
			Question.QUESTION_TYPES.will,
			Question.QUESTION_TYPES.physics,
			Question.QUESTION_TYPES.emotion
		]).fetch()
		const groups = groupBy(regQuest.rows, v => v.group)
		const applicant = await Applicant.first()
		const questionnaire = await Factory.model('App/Models/Questionnaire').make();
		
		// await applicant.questionnaire().save(questionnaire)
		await questionnaire.user().associate(await User.first())
		await questionnaire.applicants().save(applicant)
		let counter = 0;
		for (let group in groups) {
			await questionnaire.questions().saveMany(groups[group])
			await questionnaire.questions().saveMany(lieQuest.rows.slice(counter, counter + 2))
			counter += 2
		}
		await questionnaire.save()
	}
}

module.exports = QuestionnaireSeeder
