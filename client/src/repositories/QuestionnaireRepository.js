import Request from '../services/Request'

class QuestionnaireRepository {
	getAll(page = 1, query) {
		const params = new URLSearchParams()
		params.append('page', page.toString())
		query && params.append('q', query.toString().trim())
		return Request.send({
			url:    `questionnaire/index?${ params.toString() }`,
			method: 'get'
		})
	}
	
	withAnswers(page = 1, query = null) {
		const params = new URLSearchParams()
		params.append('page', page.toString())
		query && params.append('q', query.toString().trim())
		return Request.send({
			url:    `questionnaire/completed?${ params.toString() } `,
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