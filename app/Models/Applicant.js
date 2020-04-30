'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Applicant extends Model {
	getAnswers(data) {
		return JSON.parse(data)
	}
	
	questionnaire() {
		return this.hasOne('App/Models/Questionnaire')
	}
}

module.exports = Applicant
