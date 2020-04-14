'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Questionnaire extends Model {
	user() {
		return this.belongsTo('App/Models/User')
	}
	
	applicants() {
		return this.hasMany('App/Models/Applicant')
	}
	
	questions() {
		return this.belongsToMany('App/Models/Question').pivotTable('questionnaire_question')
	}
	
}

module.exports = Questionnaire
