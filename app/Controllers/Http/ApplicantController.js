'use strict'
const Applicant = use('App/Models/Applicant')
const Questionnaire = use('App/Models/Questionnaire')

class ApplicantController {
	async show({ params, response }) {
		try {
			const applicant = await Applicant.query().where('id', +params.id).first()
			const questionnaire = await Questionnaire.find(applicant.questionnaire_id)
			const questions = await questionnaire.questions().fetch()
			response.send(applicant
				? {
					...applicant.toJSON(),
					questionnaire: {
						...questionnaire
							.toJSON(),
						questions: questions.toJSON()
					}
				}
				: null)
		}
		catch (e) {
			console.log(e)
			response.status(404).json({ message: 'Not found' })
		}
	}
}

module.exports = ApplicantController
