'use strict'
const Questionnaire = use('App/Models/Questionnaire')
const Applicant = use('App/Models/Applicant')
const Question = use('App/Models/Question')

class QuestionnaireController {
	
	async index({ auth, response }) {
		try {
			return await Questionnaire.query().where('user_id', auth.user.id).with('applicants').with('questions').fetch()
		}
		catch (e) {
			console.log(e)
			response.status(400).json({ message: e.message })
		}
	}
	
	async create({ request, auth, response }) {
		try {
			const user = await auth.getUser()
			const data = request.only(['question_id'])
			
			const questionnaire = await Questionnaire.create()
			await questionnaire.user().associate(user)
			await questionnaire.questions().attach(data.question_id)
			await questionnaire.reload()
			
			return await Questionnaire.query().where('id', questionnaire.id).with('questions').fetch()
		}
		catch (e) {
			console.log(e)
			response.status(400).json({ message: e.message })
		}
	}
	
	async edit({ request, params }) {
		try {
			const questionnaire = await Questionnaire.find(+params.id)
			if (!questionnaire) return { message: `Questionnaire ${ params.id } not found.` }
			
			const data = request.only(['question_id'])
			await questionnaire.questions().attach(data.question_id)
			await questionnaire.reload()
			
			return await Questionnaire.query().where('id', questionnaire.id).with('questions').fetch()
		}
		catch (e) {
		
		}
	}
	
	async delete({ params, response }) {
		try {
			const q = await Questionnaire.find(+params.id)
			if (q) {
				await q.questions().detach()
				await q.user().dissociate()
			}
			return { message: 'Questionnaire not found' }
		}
		catch (e) {
			console.log(e)
			response.status(404).json({ message: e.message })
		}
	}
	
	async show({ params, response }) {
		try {
			return await Questionnaire.query().where('id', +params.id).with('questions').with('questions.answers').first()
		}
		catch (e) {
			response.status(404).json({ message: 'Not found' })
		}
	}
	
	async complete({ request, params, response }) {
		try {
			const data = request.only(['email', 'answers'])
			let questionnaire = await Questionnaire.query().where('id', +params.id).with('questions').with('applicants').first()
			
			if (!questionnaire) {
				response.status(404).json({ message: 'Questionnaire not found.' })
			}
			if (!data.email || !data.answers) {
				response.status(400).json({ message: 'Provide email and answers.' })
			}
			questionnaire.respond_count++
			let score = 0
			let counts = { correct: 0, wrong: 0 }
			const applicant = await Applicant.create({ email: data.email, answers: JSON.stringify(data.answers) })
			await questionnaire.applicants().save(applicant)
			const c = await questionnaire.questions().fetch().then(c => c.toJSON())
			
			
			if (data.answers.length !== c.length) {
				applicant.save()
				questionnaire.save()
				response.status(400).json({ message: 'failed' })
				return
			}
			
			for (let answer of data.answers) {
				let currentQuestion = await questionnaire.questions().where('id', +answer.question_id).first()
				
				if (currentQuestion.answer_type === Question.ANSWER_TYPES.text) {
					if (answer.answers.length >= 1 && currentQuestion.user_answer === answer.answers[0]) {
						score += currentQuestion.weight
						counts.correct++
						console.log('correct text answer')
					}
					else {
						counts.wrong++
					}
				}
				else if (currentQuestion.answer_type === Question.ANSWER_TYPES.single) {
					if (answer.answers.length >= 1 && +answer.answers[0] === currentQuestion.correct_answer[0]) {
						score += currentQuestion.weight
						counts.correct++
						console.log('correct single answer')
					}
					else {
						counts.wrong++
					}
					
				}
				else if (currentQuestion.answer_type === Question.ANSWER_TYPES.multi) {
					const res = answer.answers.length === currentQuestion.correct_answer.length &&
								currentQuestion.correct_answer.every(row => answer.answers.map(r => +r).includes(row.id))
					if (res) {
						score += currentQuestion.weight
						counts.correct++
						console.log('correct multi answer')
					}
					else {
						counts.wrong++
					}
					
				}
			}
			
			applicant.score = score
			await applicant.save()
			await questionnaire.save()
			return {
				questionnaire: await Questionnaire.query().where('id', questionnaire.id).with('questions').first(),
				applicant,
				score,
				counts
			}
		}
		catch (e) {
			console.log(e)
			return { message: e.message }
		}
	}
}

module.exports = QuestionnaireController
