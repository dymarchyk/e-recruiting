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
			
			table.json('correct_answer')
			table.text('user_answer', 'longtext')
			
			table.text('title', 'longtext')
			table.string('type', 255).notNullable().defaultTo(Question.QUESTION_TYPES.lie_test)
			table.string('answer_type', 255).notNullable().defaultTo(Question.ANSWER_TYPES.single)
			
			
			table.float('weight').defaultTo(0)
			
			table.foreign('user_id').references('id').on('users').onDelete('cascade')
			
		})
	}
	
	down() {
		this.drop('questions')
	}
}

module.exports = QuestionSchema
