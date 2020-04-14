import Request from '../services/Request'

export default class QuestionnaireRepository {
	
	getById = (id) => {
		return Request.send({
			url:    'questionnaire/show/' + id,
			method: 'get'
		})
	}
	
	complete = (data, id) => {
		return Request.send({
			url:    'questionnaire/complete/' + id,
			method: 'post',
			data
		})
	}
}