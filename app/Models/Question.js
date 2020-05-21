'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Question extends Model {
	static QUESTION_TYPES = {
		lie_test:   'lie_test',
		hard_skill: 'hard_skill',
		will:       'w',
		physics:    'p',
		emotion:    'e',
		logic:      'l'
	}
	static ANSWER_TYPES = {
		text:    'text',
		multi:   'multi',
		single:  'single',
		boolean: 'boolean'
	}
	
	
	static get hidden() {
		return ['pivot']
	}
	
	static boot() {
		super.boot()
	}
	
	getLieTestCorrectAnswer(v) {
		return v === null ? null : Boolean(v)
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
}

module.exports = Question
