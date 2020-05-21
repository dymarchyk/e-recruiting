'use strict'
const Question = use('App/Models/Question')
class QuestionnaireComplete {
	get rules() {
		return {
			email:                                                           'required|email',
			answers:                                                         'required',
			[`answers.${ Question.QUESTION_TYPES.hard_skill }`]:             'array',
			[`answers.${ Question.QUESTION_TYPES.hard_skill }.question_id`]: 'exists:questions,id',
			[`answers.${ Question.QUESTION_TYPES.lie_test }`]:               'required',
			[`answers.${ Question.QUESTION_TYPES.lie_test }.*.id`]:          'required|exists:questions,id',
			[`answers.${ Question.QUESTION_TYPES.lie_test }.*.answer`]:      'required',
		}
	}
	
	async fails(errorMessages) {
		return this.ctx.response.status(400).send(errorMessages)
	}
}

module.exports = QuestionnaireComplete
