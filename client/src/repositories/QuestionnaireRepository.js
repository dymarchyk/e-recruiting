import Request from '../services/Request'

class QuestionnaireRepository {
	getAll(page = 1) {
		return Request.send({
			url:    `questionnaire/index?page=${ page }`,
			method: 'get'
		})
	}
	
	withAnswers(page) {
		return Request.send({
			url:    `questionnaire/completed?page=${ page }`,
			method: 'get'
		})
	}
	
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


export default new QuestionnaireRepository()