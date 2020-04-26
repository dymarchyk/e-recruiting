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
/**
 * @type {Array}
 */
const P = require('../data/Physic_qestions.json')
const E = require('../data/Emotion_questions.json')
const L = require('../data/Lohic_questions.json')
const W = require('../data/Will_questions.json')

const Lie = require('../data/Lie_questions')

class QuestionSeeder {
	async run() {
		try {
			let user = await User.first()
			const data = [P, E, L, W]
			const questions = await Factory.model('App/Models/Question').createMany(4)
			await Promise.all(
				data.map((row, pos) => {
					let currentType
					switch (pos) {
						case 0:
							currentType = Question.QUESTION_TYPES.physics
							break;
						case 1:
							currentType = Question.QUESTION_TYPES.emotion
							break;
						case 2:
							currentType = Question.QUESTION_TYPES.logic
							break;
						case 3:
							currentType = Question.QUESTION_TYPES.will
							break;

					}
					return row.map((col, index) => {
						return col.map(async (cel) => {
							try {
								const question = await Question.create({
									title:       cel,
									type:        currentType,
									answer_type: Question.ANSWER_TYPES.boolean,
									group:       index,
								})
							}
							catch (e) {
								console.log(e)
							}

						})
					})
				}).flat(3),
				Array.from(Lie).map(async (row) => {
					try {
						const question = await Question.create({
							title:                   row.question,
							type:                    Question.QUESTION_TYPES.lie_test,
							answer_type:             Question.ANSWER_TYPES.boolean,
							lie_test_correct_answer: row.should_answer,
							group:                   null,
						})
					}
					catch (e) {
						console.log(e.message)
					}
				}),
			)
			for (let question of questions) {
				const answers = await Factory.model('App/Models/Answer').makeMany(5)
				for (let row of answers) {
					await row.question().associate(question)
				}
				await question.user().associate(user)
				await question.save()
			}
			await user.save()
			
			
		}
		catch (e) {
			console.info(e)
		}
	}
}

module.exports = QuestionSeeder
