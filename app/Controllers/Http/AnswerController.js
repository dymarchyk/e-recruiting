'use strict'
const Answer = use('App/Models/Answer')
const Question = use('App/Models/Question')
const { omit } = require('lodash')

class AnswerController {
	async index({ auth, response }) {
		try {
			const questions = await Question.query().where('user_id', auth.user.id).with('answers').fetch()
			
			return questions.toJSON().map(r => r.answers).flat()
		}
		catch (e) {
			console.log(e)
			response.status(404).json({ message: `${ auth.user.email } not found any answers.` })
		}
	}
	
	async create({ request, response }) {
		try {
			const data = request.only(['answers', 'question_id'])
			
			const question = await Question.find(+data.question_id)
			
			for (let row of data.answers) {
				const value = Math.ceil(Date.now() + Math.random() * 1000) + ''
				const answer = await Answer.create({
					...omit(row, ['isCorrect', 'value']),
					value
				})
				await question.answers().save(answer)
				if (row.isCorrect) {
					question.correct_answer.push(answer)
				}
			}
			await question.save()
			await question.reload()
			return await Answer.query().where('question_id', question.id).fetch()
		}
		catch (e) {
			console.log(e)
			response.status(400).json({ message: e.message })
		}
	}
	
	
}

module.exports = AnswerController
