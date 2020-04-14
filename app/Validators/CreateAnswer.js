'use strict'

class CreateAnswer {
	get rules() {
		return {
			'question_id':              'required|number|exists:questions,id',
			'data.answers.*.content':   'required|string',
			'data.answers.*.isCorrect': 'boolean'
		}
	}
	
	async fails(errorMessages) {
		return this.ctx.response.status(400).send(errorMessages)
	}
}

module.exports = CreateAnswer
