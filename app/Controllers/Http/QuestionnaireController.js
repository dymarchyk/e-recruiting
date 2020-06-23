'use strict'
const Questionnaire = use('App/Models/Questionnaire')
const Applicant = use('App/Models/Applicant')
const Question = use('App/Models/Question')
const Answer = use('App/Models/Answer')
const { groupBy, chunk, omit, pickBy, pick } = require('lodash')
const faker = require('faker')

class QuestionnaireController {
	
	async index({ auth, response, request }) {
		try {
			const params = request.get()
			let page = +params.page || 1
			const q = params.q || ''
			return await Questionnaire
				.query()
				.where('user_id', auth.user.id)
				.with('applicants')
				.with('questions')
				.where('title', 'like', `%${ q }%`)
				.orderBy('created_at', 'desc')
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
			const q = params.q || ''
			const questionnaires = Questionnaire
				.query()
				.where('user_id', auth.user.id)
				.where('respond_count', '>', 0)
				.with('questions')
				.with('applicants', query => {
					query.orderBy('created_at', 'desc')
					q.includes('@') && query.where('email', 'like', `%${ q.replace('@', '') }%`)
					return query
				})
			if (!q.includes('@')) {
				questionnaires.where('title', 'like', `%${ q }%`)
			}
			return await questionnaires
				.orderBy('created_at', 'desc')
				.paginate(page, 5)
			
		}
		catch (e) {
			console.log(e)
			response.status(404).json({ message: 'Not found' })
		}
	}
	
	async create({ request, auth, response }) {
		try {
			const user = await auth.getUser()
			const { title, questions: questions_raw, order } = request.only(['questions', 'title', 'order'])
			
			const questionnaire = await Questionnaire.create({
				title,
				order
			})
			
			for (let row of questions_raw) {
				const question = await Question.create({
					title:       row.title,
					answer_type: row.type,
					type:        Question.QUESTION_TYPES.hard_skill
				})
				if (row.type === Question.ANSWER_TYPES.text) {
					await Answer.create({
						user_answer: row.correct_text_answer,
						question_id: question.id,
					})
				}
				else {
					await Answer.createMany(row.answers.map(col => ({
						content:     col.text,
						user_answer: row.correct_text_answer,
						isCorrect:   col.isCorrect,
						question_id: question.id,
					})))
				}
				
				await question.user().associate(user)
				await questionnaire.questions().attach(question.id)
				await question.save()
			}
			
			await questionnaire.user().associate(user)
			
			return await Questionnaire.query().where('id', questionnaire.id).with('questions').with('questions.answers').first()
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
			types.slice(0, 2)
				 .forEach(type => {
					 questions[1].push(faker.helpers.shuffle(groups[type][1]))
					 questions[1].push(faker.helpers.shuffle(groups[type][2]))
				 })
			//put l3 l4 e3 e4
			types.slice(2, 4)
				 .forEach(type => {
					 questions[2].push(faker.helpers.shuffle(groups[type][3]))
					 questions[2].push(faker.helpers.shuffle(groups[type][4]))
				 })
			questions.unshift([res.toJSON().questions])
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
			let hard_skills_score = 0
			
			const [group1, group2, group3, group4] = questionnaire.order.split('')
			
			const [stage0, stage1, stage2] = chunk(Object.entries(data.answers.other).map(r => [
				r[0],
				r[1].filter(Boolean).length
			]), 4).map(row => Object.fromEntries(row.sort((a, b) => b[1] - a[1])))
			
			
			if (stage0) {
				const keys = Object.keys(stage0)
				
				if ([group1, group2].includes(keys[0].replace('0', '')) || [
					group1,
					group2
				].includes(keys[1].replace('0', ''))) {
					console.log('stage 1 done ok')
					for (let val of Object.values(stage0)) {
						score += val
					}
				}
			}
			if (stage1) {
				if (stage1[group1 + 1] > stage1[group1 + 2] && stage1[group2 + 2] > stage1[group2 + 1]) {
					console.log('stage 2 done ok')
					for (let val of Object.values(stage1)) {
						score += val
					}
				}
			}
			if (stage2) {
				if (stage2[group3 + 4] > stage2[group3 + 3] && stage2[group4 + 3] > stage2[group4 + 4]) {
					console.log('stage 3 done ok')
					for (let val of Object.values(stage2)) {
						score += val
					}
				}
			}
			
			data.answers.lie_test.forEach(row => {
				if (row.answer !== row.lie_test_correct_answer) {
					lie_score++
				}
			})
			
			for (let answer of data.answers.hard_skill) {
				let currentQuestion = await questionnaire.questions().where('id', +answer.question_id).with('answers').first()
				currentQuestion = currentQuestion.toJSON()
				answer.question = currentQuestion
				if (currentQuestion.answer_type === Question.ANSWER_TYPES.text) {
					let currentAnswer = currentQuestion.answers[0]
					if (answer.answers.length >= 1 && currentAnswer.user_answer.toLowerCase().includes(answer.answers[0])) {
						hard_skills_score += 1
						console.log('correct text answer')
					}
				}
				else if (currentQuestion.answer_type === Question.ANSWER_TYPES.single) {
					let currentAnswer = currentQuestion.answers.find(e => e.isCorrect)
					if (answer.answers.length === 1 && +answer.answers[0] === currentAnswer.id) {
						hard_skills_score += 1
						console.log('correct single answer')
					}
				}
				else if (currentQuestion.answer_type === Question.ANSWER_TYPES.multi) {
					const correctIds = currentQuestion.answers.map(row => row.isCorrect
						? row.id
						: null).filter(Boolean)
					const res = answer.answers.length === correctIds.length &&
								correctIds.every(row => answer.answers.includes(row))
					
					if (res) {
						hard_skills_score += 1
						console.log('correct multi answer')
					}
				}
			}
			
			const applicant = await Applicant.create({
				email:   data.email,
				answers: JSON.stringify(data.answers)
			})
			await questionnaire.applicants().save(applicant)
			applicant.score = score
			applicant.lie_score = lie_score
			applicant.hard_skills_score = hard_skills_score
			await applicant.save()
			await questionnaire.save()
			response.send(questionnaire)
		}
		catch (e) {
			console.log(e)
			response.status(400).json({ message: 'Error while solving questionnaire.' })
		}
	}
}

module.exports = QuestionnaireController