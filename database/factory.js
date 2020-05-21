'use strict'

/*
 |--------------------------------------------------------------------------
 | Factory
 |--------------------------------------------------------------------------
 |
 | Factories are used to define blueprints for database tables or Lucid
 | models. Later you can use these blueprints to seed your database
 | with dummy data.
 |
 */

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Question = use('App/Models/Question')
const Hash = use('Hash')

Factory.blueprint('App/Models/User', (faker) => {
	
	return {
		username: faker.username(),
		email:    'admin@erecruiting.com',
		password: '123456'
	}
})

Factory.blueprint('App/Models/Question', faker => {
	return {
		title:       faker.word(3),
		type:        Question.QUESTION_TYPES.hard_skill,
		answer_type: faker.shuffle([Question.ANSWER_TYPES.multi, Question.ANSWER_TYPES.single, Question.ANSWER_TYPES.text])[0],
	}
})

Factory.blueprint('App/Models/Answer', faker => {
	return {
		content: faker.word(),
	}
})

Factory.blueprint('App/Models/Applicant', faker => {
	return {
		email: faker.email()
	}
})

Factory.blueprint('App/Models/Questionnaire', faker => {
	return {
		title: faker.word(10)
	}
})