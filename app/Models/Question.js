'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Question extends Model {
	static QUESTION_TYPES = {
		'lie_test':   'lie_test',
		'hard_skill': 'hard_skill'
	}
	static ANSWER_TYPES = {
		text:   'text',
		multi:  'multi',
		single: 'single'
	}
	
	static get hidden() {
		return ['pivot']
	}
	
	static boot() {
		super.boot()
		
		this.addHook('afterFetch', (questions) => {
			questions.forEach((question) => {
				question.correct_answer = question.correct_answer ? JSON.parse(question.correct_answer) : []
			})
		})
		this.addHook('afterFind', (question) => {
			question.correct_answer = question.correct_answer ? JSON.parse(question.correct_answer) : []
		})
		this.addHook('afterCreate', (question) => {
			question.correct_answer = question.correct_answer ? JSON.parse(question.correct_answer) : []
		})
		
		this.addHook('beforeSave', (question) => {
			question.correct_answer = JSON.stringify(question.correct_answer)
		})
	}
	
	getCorrectAnswer(correct_answer) {
		return correct_answer ? JSON.parse(correct_answer) : []
	}
	
	user() {
		return this.belongsTo('App/Models/User')
	}
	
	answers() {
		return this.hasMany('App/Models/Answer')
	}
	
	// correct_answer(){
	// 	return this.hasMany('App/Models/Answer')
	// }
	
	// questionnaire() {
	// 	return this.belongsTo('App/Models/Questionnaire')
	// }
	
}

module.exports = Question
