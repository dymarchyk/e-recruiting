'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Answer extends Model {
	getIsCorrect(v) {
		return Boolean(v)
	}
	
	question() {
		return this.belongsTo('App/Models/Question')
	}
}

module.exports = Answer
