import { observable, action }  from 'mobx'
import QuestionnaireRepository from '../repositories/QuestionnaireRepository'

class QuestionnaireState {
	repository = QuestionnaireRepository
	
	@observable data = null
	
	@observable filtered = false
	@observable filtering = false
	
	@observable page = 1
	@observable total = 20
	@observable perPage = 0
	@observable last = 0
	
	@action
	async getAll(page = 1) {
		try {
			console.log(page, 'page')
			const res = await this.repository.getAll(page)
			this.data = Array.isArray(this.data) && page > 1 ? [...this.data, ...res.data] : res.data
			this.total = res.total
			this.perPage = res.perPage
			this.page = res.page
			this.last = res.lastPage
			return null
		}
		catch (e) {
			return null
		}
	}
	
	@action
	async search(query = '') {
		this.filtering = true
		try {
			if (query.trim().length === 0) {
				await this.getAll(1)
				this.filtered = false
				this.filtering = false
				return
			}
			const res = await this.repository.getAll(1, query.trim())
			
			this.total = res.total
			this.perPage = res.perPage
			this.page = res.page
			this.last = res.lastPage
			this.data = res.data
			this.filtering = false
			this.filtered = true
		}
		catch (e) {
			this.filtering = false
		}
	}
	
	
}

export default new QuestionnaireState()