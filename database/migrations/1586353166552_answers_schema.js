'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AnswersSchema extends Schema {
	up() {
		this.create('answers', (table) => {
			table.increments()
			table.timestamps()
			
			table.integer('question_id').unsigned().references('id').inTable('questions').onDelete('cascade')
			
			table.text('content', 'longtext').notNullable()
			table.string('value', 50).notNullable()
		})
	}
	
	down() {
		this.drop('answers')
	}
}

module.exports = AnswersSchema
