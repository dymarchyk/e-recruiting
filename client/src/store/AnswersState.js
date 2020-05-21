import {
	observable,
	action
}                              from 'mobx'
import QuestionnaireRepository from '../repositories/QuestionnaireRepository'

class AnswersState {
	repository = QuestionnaireRepository
	@observable data = null
	
	@observable filtering = false
	@observable filtered = false
	
	@observable lastAnswers = []
	
	@observable page = 1
	@observable lastPage = 0
	@observable total = 0
	
	@action
	async getAnswers(page = 1) {
		try {
			const res = await this.repository.withAnswers(page)
			this.data = Array.isArray(this.data) && page > 1
				? [...this.data, ...res.data]
				: res.data
			this.lastAnswers = res.data.slice(-3)
			this.page = res.page
			this.lastPage = res.lastPage
			this.total = res.total
			return null
		}
		catch (e) {
			console.log(e)
			return null
		}
	}
	
	@action
	async search(query = '') {
		try {
			this.filtering = true
			if (query.trim().length === 0) {
				await this.getAnswers(1)
				this.filtered = false
				this.filtering = false
				return
			}
			const res = await this.repository.withAnswers(1, query.trim())
			
			this.page = res.page
			this.lastPage = res.lastPage
			this.total = res.total
			this.data = res.data
			this.filtering = false
			this.filtered = true
		}
		catch (e) {
			return null
		}
		
	}
	
}

export default new AnswersState()