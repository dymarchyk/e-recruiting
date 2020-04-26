'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class QuestionnaireSchema extends Schema {
	up() {
		this.create('questionnaires', (table) => {
			table.increments()
			table.timestamps()
			
			table.integer('respond_count').defaultTo(0)
			table.string('order', 4).notNullable().defaultTo('pwle')
			
			table.integer('user_id').unsigned()
			
			table.foreign('user_id').references('id').inTable('users')
			
		})
	}
	
	down() {
		this.drop('questionnaires')
	}
}

module.exports = QuestionnaireSchema
