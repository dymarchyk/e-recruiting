'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AnswersSchema extends Schema {
	up() {
		this.create('answers', (table) => {
			table.increments()
			table.timestamps()
			
			table.integer('question_id').unsigned().references('id').inTable('questions').onDelete('cascade')
			
			table.text('content', 'longtext').defaultTo('')
			table.boolean('isCorrect').defaultTo(false)
			table.text('user_answer', 'longtext').defaultTo('')
		})
	}
	
	down() {
		this.drop('answers')
	}
}

module.exports = AnswersSchema
