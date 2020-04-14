'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuestionnaireQuestionSchema extends Schema {
	up() {
		this.create('questionnaire_question', (table) => {
			table.integer('question_id').unsigned().index('question_id')
			table.integer('questionnaire_id').unsigned().index('questionnaire_id')
			
			table.foreign('question_id').references('questions.id').onDelete('cascade').onUpdate('cascade')
			table.foreign('questionnaire_id').references('questionnaires.id').onDelete('cascade').onUpdate('cascade')
		})
	}
	
	down() {
		this.drop('questionnaire_question')
	}
}

module.exports = QuestionnaireQuestionSchema
