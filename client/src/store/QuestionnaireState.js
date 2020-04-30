import { observable }          from 'mobx'
import QuestionnaireRepository from '../repositories/QuestionnaireRepository'

class QuestionnaireState {
	repository = QuestionnaireRepository
	
	@observable data = null
	
	@observable page = 1
	@observable total = 20
	@observable perPage = 0
	@observable last = 0
	
	async getAll(page) {
		try {
			if (page >= this.last) return
			const res = await this.repository.getAll(page)
			this.data = Array.isArray(this.data) ? [...this.data, ...res.data] : res.data
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
	
}

export default new QuestionnaireState()