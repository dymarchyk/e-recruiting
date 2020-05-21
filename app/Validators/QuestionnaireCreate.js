'use strict'

class QuestionnaireCreate {
	get rules() {
		return {
			'title':                           'required|string',
			'order':                           'required|min:4,max:4',
			'questions':                       'required|array',
			'questions.*.title':               'required|string',
			'questions.*.type':                'required|string',
			'questions.*.correct_text_answer': 'string',
			'questions.*.answers':             'array',
			'questions.*.answers.*.text':      'string',
			'questions.*.answers.*.isCorrect': 'boolean',
			
			
		}
	}
	
	async fails(errorMessages) {
		return this.ctx.response.status(400).send(errorMessages)
	}
}

module.exports = QuestionnaireCreate
