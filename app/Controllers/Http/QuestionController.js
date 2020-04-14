'use strict'
const Question = use('App/Models/Question')
const Applicant = use('App/Models/Applicant')
const Questionnaire = use('App/Models/Questionnaire')
const User = use('App/Models/User')

class QuestionController {
	
	async index({ auth }) {
		return await Question.query().where('user_id', +auth.user.id).with('answers').fetch()
	}
	
	async create({ request, auth, response }) {
		const data = request.only(['title', 'type', 'answer_type', 'weight'])
		
		try {
			const question = await Question.create(data)
			const user = await auth.getUser()
			await question.user().associate(user)
			await question.reload()
			return question
		}
		catch (e) {
			console.log(e)
			response.status(400).json({ message: e.message })
		}
	}
	
	async edit({ request, response, params }) {
		try {
			const data = request.only(['title', 'type', 'answer_type', 'weight'])
			const question = await Question.find(+params.id)
			
			question.merge(data)
			
			await question.save()
			await question.reload()
			return question
		}
		catch (e) {
			console.log(e)
			response.status(400).json({ message: e.message })
		}
	}
	
	async delete({ response, params }) {
		try {
			const question = await Question.find(+params.id)
			if (question) {
				await question.delete()
				return { message: 'Question deleted' }
			}
			return { message: 'Question not found' }
		}
		catch (e) {
			console.log(e)
			response.send({ message: e.message })
		}
	}
	
}

module.exports = QuestionController
