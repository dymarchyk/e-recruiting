import { set }                 from 'lodash';
import {
	observable,
	action
}                              from 'mobx'
import { ANSWER_TYPES }        from '../constants/questions'
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
	
	@observable title = ''
	
	@observable addingQuestion = false
	
	@observable addingPersonality = false
	
	@observable hardSkills = []
	
	@observable editingTitle = false
	
	@observable questionnaireType = 'wpel'
	
	@observable creating = false
	
	@action
	async getAll(page = 1) {
		try {
			const res = await this.repository.getAll(page)
			this.data = Array.isArray(this.data) && page > 1
				? [...this.data, ...res.data]
				: res.data
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
	
	@action
	addHardSkill = () => {
		this.hardSkills.forEach(e => e.isEditing = false)
		return this.hardSkills.push({
			id:                  Date.now() + Math.random(),
			isEditing:           true,
			type:                ANSWER_TYPES.text,
			title:               '',
			correct_text_answer: '',
			answers:             [
				{
					text:      '',
					isCorrect: false
				}
			]
		})
	}
	
	@action
	changeValue = (index, ...path) => event => {
		set(this.hardSkills, `[${ index }].${ path.join('.') }`, event?.target?.value ?? event)
		if (path.includes('type')) {
			if (event?.target?.value ?? event === ANSWER_TYPES.text) {
				this.hardSkills[index].answers = []
			}
			else {
				this.hardSkills[index].correct_text_answer = ''
				this.hardSkills[index].answers.forEach(e => e.isCorrect = false)
			}
			
		}
	}
	
	@action
	addAnswerToQuestion = (questionIndex) => {
		this.hardSkills[questionIndex].answers.push({
			text:      '',
			isCorrect: false
		})
	}
	
	@action
	removeAnswerFromQuestion = (questionIndex, answerIndex) => {
		this.hardSkills[questionIndex].answers = this.hardSkills[questionIndex].answers.filter((_, i) => i !== answerIndex)
	}
	
	@action
	changeCorrectAnswer = (questionIndex, answerIndex) => {
		const question = this.hardSkills[questionIndex]
		
		if (question.type === ANSWER_TYPES.single) {
			question.answers = question.answers.map((row, index) => {
				row.isCorrect = index === answerIndex
				return row
			})
		}
		else {
			question.answers[answerIndex].isCorrect = !question.answers[answerIndex].isCorrect
		}
		this.hardSkills[questionIndex] = question
	}
	
	@action
	deleteQuestion = (index) => {
		this.hardSkills = this.hardSkills.filter((_, id) => id !== index)
	}
	
	@action.bound
	async createQuestionnaire() {
		let hasErrors = false
		const toastOptions = { autoClose: 10000 }
		if (!this.title) {
			hasErrors = true
			window.toast.error('Enter title for this questionnaire.', toastOptions)
		}
		
		if (this.hardSkills.length === 0) {
			hasErrors = true
			window.toast.error('Create question for this questionnaire.', toastOptions)
		}
		
		this.hardSkills.forEach((row, rowId) => {
			
			if (!row.title) {
				hasErrors = true
				window.toast.error(`Question ${ rowId + 1 } has no title.`, toastOptions)
			}
			if (row.type === ANSWER_TYPES.text && !row.correct_text_answer) {
				hasErrors = true
				window.toast.error(`Question "${ row.title || rowId + 1 }" has no answer.`, toastOptions)
			}
			
			if ([ANSWER_TYPES.single, ANSWER_TYPES.multi].includes(row.type)) {
				if (row.answers.length === 0) {
					hasErrors = true
					window.toast.error(`Question "${ row.title || rowId + 1 }" has no answers.`, toastOptions)
				}
				
				row.answers.forEach((col, colId) => {
					if (!col.text) {
						hasErrors = true
						window.toast.error(`Answer in "${ row.title || rowId + 1 }" answer ${ colId + 1 } has no content.`, toastOptions)
					}
				})
				if (row.answers.every(col => !col.isCorrect)) {
					hasErrors = true
					window.toast.error(`Answer in "${ row.title || rowId + 1 }" has no correct answer(s).`, toastOptions)
				}
			}
		})
		
		if (hasErrors) return
		this.creating = true
		try {
			const res = await this.repository.create({
				title:     this.title,
				order:     this.questionnaireType.split('')
							   .reverse()
							   .join(''),
				questions: this.hardSkills
			})
			this.data = (Array.isArray(this.data)
				? [res, ...this.data]
				: [res])
			this.creating = false
			window.toast.success(`New questionnaire "${ this.title }" was created.`)
			this.title = ''
			this.hardSkills = []
			this.addingPersonality = false
			this.addingQuestion = false
			this.questionnaireType = 'lepw'
		}
		catch (e) {
			this.creating = false
			window.toast.warn('Error while creating new questionnaire. Check your input and try again.')
		}
	}
}

export default new QuestionnaireState()