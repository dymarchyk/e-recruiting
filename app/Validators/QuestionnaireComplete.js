'use strict'

class QuestionnaireComplete {
	get rules() {
		return {
			email:                   'required|email',
			answers:                 'required|array',
			'answers.*.answers':     'required|array',
			'answers.*.question_id': 'required|exists:questions,id'
		}
	}
	
	async fails(errorMessages) {
		return this.ctx.response.status(400).send(errorMessages)
	}
}

module.exports = QuestionnaireComplete
