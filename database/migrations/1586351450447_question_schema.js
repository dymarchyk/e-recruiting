'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Question = use('App/Models/Question')

class QuestionSchema extends Schema {
	up() {
		this.create('questions', (table) => {
			table.increments()
			table.timestamps()
			
			table.integer('user_id').unsigned()
			
			table.string('title', 255)
			table.string('type', 255).notNullable()
			table.string('answer_type', 255).notNullable().defaultTo(Question.ANSWER_TYPES.boolean)
			
			table.integer('group').defaultTo(null)
			table.bool('lie_test_correct_answer').defaultTo(null)
			
			table.foreign('user_id').references('id').on('users').onDelete('cascade')
			
		})
	}
	
	down() {
		this.drop('questions')
	}
}

module.exports = QuestionSchema
