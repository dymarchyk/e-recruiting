import { observable }          from 'mobx'
import QuestionnaireRepository from '../repositories/QuestionnaireRepository'

class AnswersState {
	repository = QuestionnaireRepository
	@observable data = null
	
	@observable page = 1
	@observable lastPage = 0
	@observable total = 0
	
	async getAnswers(page = 1) {
		try {
			const res = await this.repository.withAnswers(page)
			this.data = Array.isArray(this.data) ? [...this.data, ...res.data] : res.data
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
}

export default new AnswersState()