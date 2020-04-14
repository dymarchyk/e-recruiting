'use strict'

/*
 |--------------------------------------------------------------------------
 | QuestionSeeder
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

class QuestionSeeder {
	async run() {
		try {
			let user = await User.first()
			
			for (let i = 0; i < 5; i++) {
				const question = await Factory.model('App/Models/Question').make()
				const answers = await Factory.model('App/Models/Answer').makeMany(3)
				
				let step = 0
				for (let answer of answers) {
					await question.answers().save(answer)
					if (question.answer_type === Question.ANSWER_TYPES.single && step === 3) {
						question.correct_answer = question.correct_answer.concat(answer)
					}
					else if (question.answer_type === Question.ANSWER_TYPES.multi && [1, 2, 5].includes(step)) {
						question.correct_answer = question.correct_answer.concat(answer)
					}
					else if (question.answer_type === Question.ANSWER_TYPES.text) {
						question.user_answer = answer.content
					}
					step++
				}
				
				await user.questions().save(question)
				await question.save()
			}
		}
		catch (e) {
			console.info(e)
		}
	}
}

module.exports = QuestionSeeder
