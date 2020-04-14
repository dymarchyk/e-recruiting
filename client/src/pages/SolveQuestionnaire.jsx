import React, { Component, Fragment } from 'react'
import Checkbox                       from '../components/Checkbox'
import Input                          from '../components/Input'
import QuestionnaireRepository        from '../repositories/QuestionnaireRepository'

class SolveQuestionnaire extends Component {
	state = {
		questionnaire: null,
		loaded:        false,
		answers:       {},
		email:         '',
		currentStep:   0,
		result:        null,
		sending:       false
	}
	repository = new QuestionnaireRepository()
	
	componentDidMount() {
		const { match: { params: { id } } } = this.props
		this.repository.getById(id)
			.then(data => this.setState({ questionnaire: data, loaded: true }))
			.catch(() => this.setState({ loaded: true }))
	}
	
	completeQuestionnaire = async () => {
		const { email, answers, questionnaire } = this.state
		const data = {
			email,
			answers: Object.keys(answers).map(row => ({
				answers:     answers[row],
				question_id: row
			}))
		}
		this.setState({
			sending: true
		})
		try {
			const res = await this.repository.complete(data, questionnaire.id)
			this.setState({
				result:  res,
				sending: false
			});
		}
		catch (e) {
			window.toast.error(e.message)
			this.setState({
				sending: false
			});
			alert(e.message)
		}
	}
	
	renderAnswers = (question) => {
		const { answers } = this.state
		const isSingleAnswer = question.answer_type === 'single'
		const isText = question.answer_type === 'text'
		let userAnswers = answers[question.id] ?? []
		
		if (isText) {
			return <Input
				caption='Введите Ваш ответ'
				value={ userAnswers[0] ?? '' }
				onChange={ e => {
					userAnswers[0] = e.target.value
					this.setState({
						answers: { ...answers, [question.id]: [...userAnswers] }
					})
				} }
			/>
		}
		return (
			<ul
				key={ question.id }
				className='list'
			>
				{
					question.answers.map(row => {
						return (
							<li key={ row.id }>
								<Checkbox
									onChange={ () => {
										if (isSingleAnswer) {
											userAnswers = [row.id]
										}
										else {
											if (userAnswers.includes(row.id)) {
												userAnswers = userAnswers.filter(r => +r !== +row.id)
											}
											else {
												userAnswers = userAnswers.concat(row.id)
											}
										}
										this.setState({
											answers: { ...answers, [question.id]: [...userAnswers] }
										});
									} }
									isSelected={ userAnswers?.includes(row.id) }
									type={ isSingleAnswer ? 'radio' : 'checkbox' }
									text={ row.content }
								/>
							</li>
						)
					})
				}
			</ul>
		)
	}
	
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevState.currentStep !== this.state.currentStep) {window.scrollTo(0, 0)}
	}
	
	render() {
		const { email, currentStep, questionnaire, loaded, result } = this.state
		if (!questionnaire && loaded) return <div
			style={ {
				minHeight:      '80vh',
				height:         '100%',
				display:        'flex',
				alignItems:     'center',
				justifyContent: 'center'
			} }
		>
			<h1 className='h1 text-center'>Данная анкета не найдена.</h1>
		</div>
		return (
			<div className='questionnaire-content'>
				<div className='questionnaire-content-question'>
					<img
						className='logo'
						src={ require('../images/logo-inverted.png') }
						alt=''
					/>
					
					{
						currentStep > 0 && currentStep < questionnaire?.questions?.length + 1 &&
						<h1 className='h1'>
							{ questionnaire.questions[currentStep - 1].title }
						</h1>
					}
				
				</div>
				<div className='questionnaire-content-answer'>
					{
						currentStep === 0 &&
						<Input
							onKeyUp={ e => e.keyCode === 13 && this.setState({ currentStep: currentStep + 1 }) }
							type='email'
							required
							value={ email }
							onChange={ e => this.setState({ email: e.target.value }) }
							postScript='Введите текст и нажмите Enter'
							caption='Email'
						/>
					}
					{
						currentStep > 0 && currentStep < questionnaire?.questions?.length + 1 &&
						this.renderAnswers(questionnaire.questions[currentStep - 1])
					}
					
					{/*<div className='image-answer'>*/ }
					{/*	<img*/ }
					{/*		src={require('../images/No.png')}*/ }
					{/*		alt='No'*/ }
					{/*	/>*/ }
					{/*	<img*/ }
					{/*		src={require('../images/Yes.png')}*/ }
					{/*		alt='Yes'*/ }
					{/*	/>*/ }
					{/*</div>*/ }
					
					{
						currentStep > 0 && currentStep < questionnaire?.questions?.length + 1 &&
						<div className='buttons'>
							<button
								onClick={ () => this.setState({ currentStep: currentStep - 1 }) }
								className='btn btn-outline-primary'
							>Назад
							</button>
							<button
								onClick={ () => this.setState({ currentStep: currentStep + 1 }) }
								className='btn btn-primary'
							>Дальше
							</button>
						</div>
					}
					{
						currentStep >= questionnaire?.questions?.length + 1 &&
						<Fragment>
							<p
								style={ { margin: '0 auto 50px', fontSize: 26 } }
								className='text-center'
							>Спасибо { email } за участие в опросе.</p>
							
							{
								result &&
								<Fragment>
									<p
										style={ { margin: '0 auto 20px', fontSize: 20 } }
										className='text-center'
									>Ваши результаты:</p>
									<ul className='list result-table'>
										<li><span>Результат:</span> <span>{ result.score } баллов</span></li>
										<li><span>Правильные ответы:</span> <span>{ result.counts.correct }</span></li>
										<li><span>Неправильные ответы:</span> <span>{ result.counts.wrong }</span></li>
									</ul>
								</Fragment>
							}
							{
								!result &&
								<button
									onClick={ this.completeQuestionnaire }
									style={ { margin: '0 auto' } }
									className='btn btn-primary'
								>
									{
										this.state.sending
											? 'Обработка...'
											: 'Отправить ответы'
									}
								</button>
								
							}
						
						</Fragment>
						
					}
				</div>
			</div>
		);
	}
}

export default SolveQuestionnaire;