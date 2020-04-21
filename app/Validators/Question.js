'use strict'
const Model = use('App/Models/Question')

class Question {
	get rules() {
		return {
			'title':       'required|string',
			'type':        `required|in:${ Object.values(Model.QUESTION_TYPES).join(',') }`,
			'answer_type': `required|in:${ Object.values(Model.ANSWER_TYPES).join(',') }`,
		}
	}
	
	async fails(errorMessages) {
		return this.ctx.response.status(400).send(errorMessages)
	}
}

module.exports = Question
