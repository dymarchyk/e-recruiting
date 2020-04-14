'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ApplicantSchema extends Schema {
	up() {
		this.create('applicants', (table) => {
			table.increments()
			table.timestamps()
			
			table.string('email', 255).notNullable()
			table.string('notes', 255)
			table.float('score').defaultTo(0)
			
			table.integer('questionnaire_id').unsigned()
			
			table.json('answers')
		})
	}
	
	down() {
		this.drop('applicants')
	}
}

module.exports = ApplicantSchema
