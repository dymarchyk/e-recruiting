'use strict'

class QuestionnaireCreate {
	get rules() {
		return {
			'question_id':   'required|array',
			'question_id.*': 'required|exists:questions,id',
			'title':         'required'
		}
	}
	
	async fails(errorMessages) {
		return this.ctx.response.status(400).send(errorMessages)
	}
}

module.exports = QuestionnaireCreate
