'use strict'
const Questionnaire = use('App/Models/Questionnaire')
const Applicant = use('App/Models/Applicant')
const Question = use('App/Models/Question')
const { groupBy, chunk, omit, pickBy } = require('lodash')
const faker = require('faker')

class QuestionnaireController {
	
	async index({ auth, response, request }) {
		try {
			const params = request.get()
			let page = +params.page || 1
			return await Questionnaire
				.query()
				.where('user_id', auth.user.id)
				.with('applicants')
				.with('questions')
				.paginate(page)
		}
		catch (e) {
			console.log(e)
			response.status(400).json({ message: e.message })
		}
	}
	
	async getWithAnswers({ auth, response, request }) {
		try {
			const params = request.get()
			let page = +params.page || 1
			const quest = await Questionnaire.query().where('user_id', auth.user.id).with('questions').fetch()
			
			const applicants = quest.rows.length > 0 && await Applicant.query().whereIn('questionnaire_id', [quest.rows.map(e => e.id)]).fetch()
			
			
			if (quest.rows.length > 0 && applicants.rows.length > 0) {
				return {
					data: quest.rows.map(r => ({
						...r.toJSON(),
						applicants: applicants.rows.filter(e => e.questionnaire_id === r.id)
					}))
				}
			}
			return { data: [] }
			
		}
		catch (e) {
			console.log(e)
			response.status(404).json({ message: 'Not found' })
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
			const res = await Questionnaire.query().where('id', +params.id).with('questions').with('questions.answers').first()
			let allQuestions = await Question.query().whereIn('type', [
				Question.QUESTION_TYPES.lie_test,
				Question.QUESTION_TYPES.logic,
				Question.QUESTION_TYPES.physics,
				Question.QUESTION_TYPES.will,
				Question.QUESTION_TYPES.emotion,
			]).fetch()
			let lies = allQuestions.toJSON().filter(e => e.type === Question.QUESTION_TYPES.lie_test)
			const types = res.order.split('')
			const questions = [
				[],
				[],
				[],
				[res.toJSON().questions]
			]
			const groups = omit(groupBy(allQuestions.toJSON(), v => v.type), [Question.QUESTION_TYPES.lie_test])
			
			// split all questions by types (p,w,l,e) and order each type by group (0...4)
			Object.keys(groups).forEach((group) => {
				if (group !== Question.QUESTION_TYPES.lie_test) {
					groups[group] = groupBy(groups[group], e => e.group)
				}
			})
			//example for p w l e
			//put p0 w0 l0 e0
			types.forEach(type => {
				lies = faker.helpers.shuffle(lies)
				questions[0].push(
					faker.helpers.shuffle(
						[...groups[type][0], lies.pop(), lies.pop()]
					)
				)
			})
			//put p1 p2 w1 w2
			types.slice(0, 2).forEach(type => {
				questions[1].push(faker.helpers.shuffle(groups[type][1]))
				questions[1].push(faker.helpers.shuffle(groups[type][2]))
			})
			//put l3 l4 e3 e4
			types.slice(2, 4).forEach(type => {
				questions[2].push(faker.helpers.shuffle(groups[type][3]))
				questions[2].push(faker.helpers.shuffle(groups[type][4]))
			})
			
			return {
				...res.toJSON(),
				questions
			}
		}
		catch (e) {
			console.log(e)
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
			let lie_score = 0
			const applicant = await Applicant.create({ email: data.email, answers: JSON.stringify(data.answers) })
			await questionnaire.applicants().save(applicant)
			
			Object.entries(data.answers.other).forEach(([k, v]) => {
				score += v.filter(Boolean).length
			})
			data.answers.lie_test.forEach(row => {
				if (row.answer !== row.lie_test_correct_answer) {
					lie_score++
				}
			})
			/*for (let answer of data.answers.other) {
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
			 }*/
			
			applicant.score = score
			applicant.lie_score = lie_score
			await applicant.save()
			await questionnaire.save()
		}
		catch (e) {
			console.log(e)
			return { message: e.message }
		}
	}
}

module.exports = QuestionnaireController
